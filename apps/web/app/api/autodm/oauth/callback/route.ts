/**
 * AutoDM OAuth — handle the Meta IG Login callback.
 *
 * Flow:
 *   1. Verify state (CSRF)
 *   2. Exchange code → short-lived token
 *   3. Exchange short-lived → long-lived (60-day) token
 *   4. Fetch the IG Business ID + username from /me
 *   5. Encrypt the token, upsert autodm_tenants row
 *   6. Redirect to /autodm/dashboard
 *
 * If anything fails, redirect to /autodm/connect?error=<reason>.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { encryptToken } from '@stackpicks/core/autodm/crypto';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';
import { DEFAULT_PLAN_CAPS, type PlanTier } from '@stackpicks/core/autodm/types';
import { ACTIVE_TENANT_COOKIE, ACTIVE_TENANT_COOKIE_MAX_AGE } from '@stackpicks/core/autodm/active-tenant';
import { verifyState, writeAudit, clientIp } from '@/lib/security';

// Hard ceiling on tenants per StackPicks user, regardless of plan tier.
// Stops a single account spawning unlimited Free-tier IG slots by
// repeatedly connecting/disconnecting. Pro/Agency caps are still enforced
// separately via DEFAULT_PLAN_CAPS.instagram_accounts.
const ABSOLUTE_TENANT_CEILING = 25;

export const runtime = 'nodejs';

const GRAPH_IG = 'https://graph.instagram.com/v22.0';

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function fail(_req: NextRequest, reason: string) {
  // Public origin — req.url is the internal Railway host behind the proxy.
  const u = new URL('/connect', autodmOrigin());
  u.searchParams.set('error', reason);
  return NextResponse.redirect(u);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error_description') || url.searchParams.get('error');
  if (error) return fail(req, `meta_denied:${error.slice(0, 80)}`);
  if (!code || !state) return fail(req, 'missing_code_or_state');

  const appId = process.env.AUTODM_META_APP_ID;
  const appSecret = process.env.AUTODM_META_APP_SECRET;
  if (!appId || !appSecret) return fail(req, 'app_not_configured');

  // Verify state — signed by /oauth/start with a 10-min TTL (security.ts).
  // Falls back to the legacy `userId:nonce:sig` format only for inflight
  // OAuth attempts started before this deploy; that path is removed in the
  // next release once any stale tabs expire.
  let stateUserId: string | null = null;
  const verified = verifyState(state);
  if (verified) {
    stateUserId = verified.split(':')[0] || null;
  } else {
    // Legacy path: userId:nonce:hmac(`userId:nonce`)
    const [u, nonce, sig] = state.split(':');
    if (u && nonce && sig) {
      const expectedSig = sign(`${u}:${nonce}`, appSecret);
      try {
        if (timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))) {
          stateUserId = u;
        }
      } catch { /* fall through */ }
    }
  }
  if (!stateUserId) return fail(req, 'bad_or_expired_state');

  // Bind callback to logged-in user
  const supaRoute = await getSupabaseServer();
  const { data: { user } } = await supaRoute.auth.getUser();
  if (!user || user.id !== stateUserId) return fail(req, 'auth_mismatch');

  const redirectUri = `${autodmOrigin()}/api/autodm/oauth/callback`;

  // 1. code → short-lived Instagram token (Business Login for Instagram).
  //    Exchanged on api.instagram.com via form-encoded POST. Returns the
  //    short-lived token + the Instagram-scoped user_id.
  const shortRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: appId,                 // Instagram app ID
      client_secret: appSecret,         // Instagram app secret
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    }).toString(),
  });
  const shortJson = (await shortRes.json().catch(() => ({}))) as {
    access_token?: string; user_id?: number | string; error_message?: string;
  };
  if (!shortRes.ok || !shortJson.access_token) {
    return fail(req, `code_exchange:${(shortJson.error_message || shortRes.status).toString().slice(0, 60)}`);
  }
  const shortToken = shortJson.access_token;

  // 2. short-lived → long-lived (60 days) on graph.instagram.com.
  const longRes = await fetch(
    `${GRAPH_IG}/access_token?` + new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: appSecret,
      access_token: shortToken,
    }),
  );
  const longJson = (await longRes.json().catch(() => ({}))) as {
    access_token?: string; expires_in?: number; error?: { message?: string };
  };
  const longToken = longJson.access_token ?? shortToken;
  const expiresIn = longJson.expires_in ?? 60 * 24 * 60 * 60;

  // 3. Fetch the Instagram identity. With Instagram Login the account IS the
  //    user — no Facebook Page hop. user_id doubles as the messaging id and
  //    as the id Meta sends in the data-deletion / deauthorize signed_request.
  const meRes = await fetch(
    `${GRAPH_IG}/me?fields=user_id,username&access_token=${encodeURIComponent(longToken)}`,
  );
  const meJson = (await meRes.json().catch(() => ({}))) as {
    user_id?: string | number; username?: string; error?: { message?: string };
  };
  const igBusinessId = (meJson.user_id ?? shortJson.user_id ?? '').toString();
  if (!igBusinessId) {
    return fail(req, `no_ig_account:${meJson.error?.message?.slice(0, 50) || 'no_user_id'}`);
  }
  const igUsername = meJson.username ?? null;
  const metaUserId = igBusinessId;       // same id arrives in deletion signed_request
  // Instagram Login: the user token IS the send token (no page token).
  const pageToken = longToken;

  // 4. Cap check + tenant upsert — encrypts the token at rest.
  const supa = adminClient();

  // Ownership check: if this IG is already linked to ANOTHER user, refuse
  // — the unique constraint on ig_business_id would otherwise let the
  // upsert silently transfer ownership. We bounce with a clear error
  // instead of letting the second user steal the connection.
  const { data: existingOwner } = await supa
    .from('autodm_tenants')
    .select('owner_user_id')
    .eq('ig_business_id', igBusinessId)
    .maybeSingle();
  if (existingOwner && existingOwner.owner_user_id !== user.id) {
    return NextResponse.redirect(new URL('/connect?error=ig_already_connected', autodmOrigin()));
  }

  // Inspect the user's existing tenants. We use the highest plan tier
  // across their owned tenants as the "owner plan" — same human, same
  // subscription. We enforce per-platform Instagram quota.
  const { data: existing } = await supa
    .from('autodm_tenants')
    .select('id, ig_business_id, plan_tier')
    .eq('owner_user_id', user.id);
  const existingTenants = existing ?? [];
  const isReconnect = existingTenants.some((t) => t.ig_business_id === igBusinessId);

  // Owner plan = highest tier they own. Default 'free' if none.
  const tierRank: Record<PlanTier, number> = { free: 0, creator: 1, pro: 2, agency: 3 };
  const ownerPlan: PlanTier = (existingTenants
    .map((t) => (t.plan_tier as PlanTier))
    .sort((a, b) => tierRank[b] - tierRank[a])[0]) ?? 'free';

  // For NEW connects (not reconnect), check Instagram quota for owner plan
  // AND the absolute per-user ceiling that defends against churn-abuse.
  if (!isReconnect) {
    if (existingTenants.length >= ABSOLUTE_TENANT_CEILING) {
      return NextResponse.redirect(new URL(
        `/connect?error=cap_reached&plan=ceiling&allowed=${ABSOLUTE_TENANT_CEILING}`,
        autodmOrigin(),
      ));
    }
    const allowed = DEFAULT_PLAN_CAPS[ownerPlan].instagram_accounts;
    const igCount = existingTenants.length;
    if (igCount >= allowed) {
      return NextResponse.redirect(new URL(
        `/connect?error=cap_reached&plan=${ownerPlan}&allowed=${allowed}`,
        autodmOrigin(),
      ));
    }
  }

  const encryptedToken = encryptToken(pageToken);
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  const warmingEnds = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();
  const caps = DEFAULT_PLAN_CAPS[ownerPlan];

  const { data: upserted, error: upsertErr } = await supa.from('autodm_tenants').upsert({
    owner_user_id: user.id,
    ig_business_id: igBusinessId,
    ig_username: igUsername,
    meta_user_id: metaUserId,
    ig_user_token_encrypted: encryptedToken,
    ig_token_expires_at: expiresAt,
    account_warming_ends_at: warmingEnds,
    plan_tier: ownerPlan,
    hourly_cap: caps.hourly,
    daily_cap: caps.daily,
    is_active: true,
    paused_until: null,
    paused_reason: null,
  }, { onConflict: 'ig_business_id' }).select('id').single();
  if (upsertErr) return fail(req, `tenant_upsert:${upsertErr.message.slice(0, 60)}`);

  // Audit trail — fire-and-forget; never blocks the OAuth redirect.
  void writeAudit({
    userId: user.id,
    action: isReconnect ? 'ig_reconnected' : 'ig_connected',
    targetId: igBusinessId,
    ip: clientIp(req),
    userAgent: req.headers.get('user-agent'),
    meta: { ig_username: igUsername, plan_tier: ownerPlan },
  });

  // 5. Subscribe this IG account's events to OUR webhook.
  //    Without this, Meta never sends events for this tenant.
  //    live_comments is a SEPARATE field from comments — it must be listed
  //    explicitly or Instagram Live comments never reach us. That powers
  //    the "comment on my Live → instant DM" flow.
  //    Failure is non-fatal — the tenant can re-trigger from the dashboard.
  try {
    await fetch(
      `${GRAPH_IG}/${igBusinessId}/subscribed_apps?` + new URLSearchParams({
        subscribed_fields: 'comments,live_comments,messages,mentions',
        access_token: pageToken,
      }),
      { method: 'POST' },
    );
  } catch { /* best-effort */ }

  // 6. Redirect into the dashboard — AI onboarding kicks off on first view.
  // Also set the active-tenant cookie to the just-connected account so the
  // dashboard lands on it (instead of falling back to most-recent which
  // is the SAME row but selected via different path).
  const res = NextResponse.redirect(new URL('/dashboard?connected=1', autodmOrigin()));
  if (upserted?.id) {
    res.cookies.set(ACTIVE_TENANT_COOKIE, upserted.id, {
      maxAge: ACTIVE_TENANT_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: true,
    });
  }
  return res;
}

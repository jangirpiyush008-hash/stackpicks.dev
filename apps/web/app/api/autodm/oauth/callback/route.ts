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

export const runtime = 'nodejs';

const GRAPH = 'https://graph.facebook.com/v22.0';

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

function fail(req: NextRequest, reason: string) {
  const u = new URL('/autodm/connect', req.url);
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

  // Verify state CSRF — format: userId:nonce:sig
  const [stateUserId, nonce, sig] = state.split(':');
  if (!stateUserId || !nonce || !sig) return fail(req, 'bad_state');
  const expectedSig = sign(`${stateUserId}:${nonce}`, appSecret);
  try {
    if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))) {
      return fail(req, 'state_mismatch');
    }
  } catch { return fail(req, 'state_decode'); }

  // Bind callback to logged-in user
  const supaRoute = await getSupabaseServer();
  const { data: { user } } = await supaRoute.auth.getUser();
  if (!user || user.id !== stateUserId) return fail(req, 'auth_mismatch');

  const redirectUri = `${autodmOrigin()}/api/autodm/oauth/callback`;

  // 1. code → short-lived token
  const shortRes = await fetch(
    `${GRAPH}/oauth/access_token?` + new URLSearchParams({
      client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code,
    }),
  );
  const shortJson = (await shortRes.json().catch(() => ({}))) as {
    access_token?: string; error?: { message?: string };
  };
  if (!shortRes.ok || !shortJson.access_token) {
    return fail(req, `code_exchange:${shortJson.error?.message?.slice(0, 60) || shortRes.status}`);
  }
  const shortToken = shortJson.access_token;

  // 2. short-lived → long-lived (60 days)
  const longRes = await fetch(
    `${GRAPH}/oauth/access_token?` + new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: appId, client_secret: appSecret,
      fb_exchange_token: shortToken,
    }),
  );
  const longJson = (await longRes.json().catch(() => ({}))) as {
    access_token?: string; expires_in?: number; error?: { message?: string };
  };
  const longToken = longJson.access_token ?? shortToken;
  const expiresIn = longJson.expires_in ?? 60 * 24 * 60 * 60;

  // 3. Fetch IG business identity
  const meRes = await fetch(`${GRAPH}/me/accounts?access_token=${encodeURIComponent(longToken)}`);
  const meJson = (await meRes.json().catch(() => ({}))) as {
    data?: { id: string; access_token?: string; instagram_business_account?: { id: string } }[];
    error?: { message?: string };
  };
  // Find a page that has a linked IG Business account
  const pageWithIg = (meJson.data ?? []).find((p) => p.instagram_business_account?.id);
  if (!pageWithIg?.instagram_business_account?.id) {
    return fail(req, 'no_ig_business_account');
  }
  const igBusinessId = pageWithIg.instagram_business_account.id;
  // Use the page access token for IG send API
  const pageToken = pageWithIg.access_token || longToken;

  // Fetch IG username for display + self-loop guard
  const igRes = await fetch(`${GRAPH}/${igBusinessId}?fields=username&access_token=${encodeURIComponent(pageToken)}`);
  const igJson = (await igRes.json().catch(() => ({}))) as { username?: string };
  const igUsername = igJson.username ?? null;

  // 4. Upsert tenant — encrypts the token at rest
  const supa = adminClient();
  const encryptedToken = encryptToken(pageToken);
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  const warmingEnds = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

  const { error: upsertErr } = await supa.from('autodm_tenants').upsert({
    owner_user_id: user.id,
    ig_business_id: igBusinessId,
    ig_username: igUsername,
    ig_user_token_encrypted: encryptedToken,
    ig_token_expires_at: expiresAt,
    account_warming_ends_at: warmingEnds,
    is_active: true,
    paused_until: null,
    paused_reason: null,
  }, { onConflict: 'ig_business_id' });
  if (upsertErr) return fail(req, `tenant_upsert:${upsertErr.message.slice(0, 60)}`);

  // 5. Subscribe this IG account's comments to OUR webhook.
  //    Without this, Meta never sends events for this tenant.
  //    Endpoint: POST /{ig-business-id}/subscribed_apps?subscribed_fields=comments
  //    Failure is non-fatal — the tenant can re-trigger from the dashboard.
  try {
    await fetch(
      `${GRAPH}/${igBusinessId}/subscribed_apps?` + new URLSearchParams({
        subscribed_fields: 'comments,messages,mentions',
        access_token: pageToken,
      }),
      { method: 'POST' },
    );
  } catch { /* best-effort */ }

  // 6. Redirect into the dashboard — AI onboarding kicks off on first view
  return NextResponse.redirect(new URL('/autodm/dashboard?connected=1', req.url));
}

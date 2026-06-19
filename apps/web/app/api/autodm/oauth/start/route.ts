/**
 * AutoDM OAuth — kick off Business Login for Instagram.
 *
 * Uses the Instagram-login flow (NOT Facebook login): the creator does not
 * need a linked Facebook Page. Authorization happens on instagram.com with
 * the Instagram app ID, and tokens are exchanged on api.instagram.com /
 * graph.instagram.com in the callback.
 *
 * Scopes:
 *   - instagram_business_basic           (profile + posts read)
 *   - instagram_business_manage_messages (send DMs, reply to comments)
 *   - instagram_business_manage_comments (read + reply to comments)
 *
 * State is a signed CSRF token bound to the current auth.user with a
 * 10-minute TTL — verified on callback by lib/security.verifyState.
 *
 * Rate limit: 10 starts per IP per 5 min. Blocks brute-force OAuth replay
 * attempts and accidental client-side loops.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { getSupabaseServer } from '@/lib/supabase-server';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';
import { rateLimit, clientIp, hashIp, signState } from '@/lib/security';

export const runtime = 'nodejs';

const IG_AUTHZ_URL = 'https://www.instagram.com/oauth/authorize';
const SCOPES = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
];

export async function GET(req: NextRequest) {
  // Rate limit BEFORE touching auth — avoids leaking session timing.
  const ipKey = `oauth-start:${hashIp(clientIp(req)) ?? 'unknown'}`;
  const limited = rateLimit(ipKey, { max: 10, windowMs: 5 * 60 * 1000 });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', retry_after_ms: limited.resetAt - Date.now() },
      { status: 429 },
    );
  }

  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    const next = new URL('/login', autodmOrigin());
    next.searchParams.set('next', '/connect');
    return NextResponse.redirect(next);
  }

  // Email-verification gate — Meta connect requires a real recoverable
  // identity behind the StackPicks account. Unverified email = no IG.
  if (!user.email_confirmed_at) {
    return NextResponse.redirect(new URL('/connect/verify-email', autodmOrigin()));
  }

  const appId = process.env.AUTODM_META_APP_ID;
  const appSecret = process.env.AUTODM_META_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.json({ ok: false, error: 'autodm meta app not configured' }, { status: 500 });
  }

  // Signed state with a 10-min TTL. Payload binds to user id so the
  // callback can verify the same user finished the flow they started.
  // The "appSecret-tail" suffix preserves the legacy verification path
  // (back-compat with /callback's existing parser) — verifyState() also
  // double-checks the freshness.
  const legacyTail = createHmac('sha256', appSecret).update(`${user.id}`).digest('hex').slice(0, 16);
  const state = signState(`${user.id}:${legacyTail}`);

  const redirectUri = `${autodmOrigin()}/api/autodm/oauth/callback`;
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(','),
    state,
    force_reauth: 'true',
  });

  return NextResponse.redirect(`${IG_AUTHZ_URL}?${params.toString()}`);
}

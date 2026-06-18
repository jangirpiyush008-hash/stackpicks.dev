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
 * State is a signed CSRF token bound to the current auth.user. On callback
 * we verify state, exchange code → long-lived token, encrypt + persist as
 * an autodm_tenants row.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, randomBytes } from 'node:crypto';
import { getSupabaseServer } from '@/lib/supabase-server';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';

// Business Login for Instagram authorization endpoint.
const IG_AUTHZ_URL = 'https://www.instagram.com/oauth/authorize';
const SCOPES = [
  'instagram_business_basic',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
];

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export async function GET(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    const next = new URL('/login', req.url);
    next.searchParams.set('next', '/autodm/connect');
    return NextResponse.redirect(next);
  }

  const appId = process.env.AUTODM_META_APP_ID;
  const appSecret = process.env.AUTODM_META_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.json({ ok: false, error: 'autodm meta app not configured' }, { status: 500 });
  }

  // CSRF: nonce + signature bound to user id. Verified on callback.
  const nonce = randomBytes(16).toString('hex');
  const state = `${user.id}:${nonce}:${sign(`${user.id}:${nonce}`, appSecret)}`;

  // MUST match the Valid OAuth Redirect URI whitelisted in the Meta App console.
  const redirectUri = `${autodmOrigin()}/api/autodm/oauth/callback`;
  const params = new URLSearchParams({
    client_id: appId,                 // Instagram app ID
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(','),
    state,
    force_reauth: 'true',   // matches Meta's generated Business Login URL
  });

  return NextResponse.redirect(`${IG_AUTHZ_URL}?${params.toString()}`);
}

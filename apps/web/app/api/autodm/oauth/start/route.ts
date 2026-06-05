/**
 * AutoDM OAuth — kick off the Meta IG Login flow.
 *
 * Redirects the user to Facebook's authorization endpoint with the
 * scopes we need for the auto-DM product:
 *   - instagram_business_basic         (profile + posts read)
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

export const runtime = 'nodejs';

const META_AUTHZ_URL = 'https://www.facebook.com/v22.0/dialog/oauth';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackpicks.dev';
  if (!appId || !appSecret) {
    return NextResponse.json({ ok: false, error: 'autodm meta app not configured' }, { status: 500 });
  }

  // CSRF: nonce + signature bound to user id. Verified on callback.
  const nonce = randomBytes(16).toString('hex');
  const state = `${user.id}:${nonce}:${sign(`${user.id}:${nonce}`, appSecret)}`;

  const redirectUri = `${siteUrl}/api/autodm/oauth/callback`;
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(','),
    state,
  });

  return NextResponse.redirect(`${META_AUTHZ_URL}?${params.toString()}`);
}

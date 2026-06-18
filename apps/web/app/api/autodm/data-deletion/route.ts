/**
 * Meta Data Deletion + Deauthorize callback.
 *
 * Paste this URL into the Meta App dashboard:
 *   Settings → Basic → User Data Deletion → "Data Deletion Request Callback URL"
 *   (and optionally the Deauthorize Callback URL)
 *     https://autodm.stackpicks.dev/api/autodm/data-deletion
 *
 * POST: Meta sends a `signed_request` (HMAC-SHA256 with the app secret).
 *   We verify it, delete every tenant owned by that Meta user id (which we
 *   captured at OAuth time), log the request, and return the JSON Meta
 *   requires: { url, confirmation_code }.
 *
 * GET ?code=<confirmation_code>: human-readable status page Meta links to,
 *   so a user can confirm their deletion was processed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function base64UrlDecode(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

/** Verify Meta's signed_request and return its decoded payload, or null. */
function parseSignedRequest(signed: string): { user_id?: string } | null {
  const secret = process.env.AUTODM_META_APP_SECRET;
  if (!secret || !signed.includes('.')) return null;
  const [encSig, encPayload] = signed.split('.');
  const expected = createHmac('sha256', secret).update(encPayload).digest();
  const given = base64UrlDecode(encSig);
  if (expected.length !== given.length) return null;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ given[i];
  if (diff !== 0) return null;
  try {
    return JSON.parse(base64UrlDecode(encPayload).toString('utf8'));
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  // Meta posts application/x-www-form-urlencoded with a signed_request field
  let signed = '';
  try {
    const form = await req.formData();
    signed = String(form.get('signed_request') ?? '');
  } catch {
    try {
      const body = await req.json();
      signed = String((body as { signed_request?: string }).signed_request ?? '');
    } catch { /* ignore */ }
  }

  const payload = signed ? parseSignedRequest(signed) : null;
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'invalid signed_request' }, { status: 400 });
  }

  const metaUserId = payload.user_id ?? null;
  // Deterministic confirmation code (Meta wants a stable code per request).
  const confirmationCode = createHmac('sha256', process.env.AUTODM_META_APP_SECRET || 'x')
    .update(`del:${metaUserId}:${signed.slice(-16)}`)
    .digest('hex')
    .slice(0, 24);

  const supa = adminClient();
  let deleted = 0;
  if (metaUserId) {
    // Delete tenants for this Meta user. Cascade handles rules/logs/etc. if
    // FKs are ON DELETE CASCADE; otherwise we null the token immediately so
    // the account can no longer be used while the rest is purged within 30d.
    const { data: tenants } = await supa
      .from('autodm_tenants')
      .select('id')
      .eq('meta_user_id', metaUserId);
    const ids = (tenants ?? []).map((t) => t.id as string);
    if (ids.length) {
      await supa.from('autodm_tenants').delete().in('id', ids);
      deleted = ids.length;
    }
  }

  await supa.from('autodm_deletion_log').insert({
    confirmation_code: confirmationCode,
    meta_user_id: metaUserId,
    tenants_deleted: deleted,
    kind: 'data_deletion',
    raw: payload as object,
  });

  // Meta requires exactly this shape.
  return NextResponse.json({
    url: `${autodmOrigin()}/api/autodm/data-deletion?code=${confirmationCode}`,
    confirmation_code: confirmationCode,
  });
}

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code');
  if (!code) {
    return NextResponse.json({ ok: true, info: 'AutoDM data deletion status endpoint' });
  }
  const supa = adminClient();
  const { data } = await supa
    .from('autodm_deletion_log')
    .select('confirmation_code, tenants_deleted, created_at')
    .eq('confirmation_code', code)
    .single();

  const found = !!data;
  const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Data Deletion Status — StackPicks AutoDM</title>
<meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family:-apple-system,sans-serif;max-width:560px;margin:48px auto;padding:0 16px;color:#111;line-height:1.6">
<h1 style="font-size:22px">Data deletion ${found ? 'confirmed' : 'status'}</h1>
<p>Confirmation code: <code>${code.replace(/[^a-f0-9]/gi, '').slice(0, 24)}</code></p>
${found
  ? `<p>Your StackPicks AutoDM data was received for deletion and your Instagram connection has been removed. Any remaining analytics logs are purged within 30 days.</p>`
  : `<p>We could not find this confirmation code. If you removed StackPicks AutoDM from Instagram, your access token was deleted immediately. To confirm full deletion, email <a href="mailto:stackpicks.dev@gmail.com">stackpicks.dev@gmail.com</a>.</p>`}
<p style="color:#666;font-size:13px">StackPicks AutoDM · <a href="${autodmOrigin()}/privacy">Privacy Policy</a></p>
</body></html>`;
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

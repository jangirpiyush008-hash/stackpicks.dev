/**
 * Meta Deauthorize Callback — fires when a user removes StackPicks AutoDM
 * from their Instagram account (Settings → Apps and Websites → Active).
 *
 * Meta sends a signed_request payload:
 *   POST body = { signed_request: "<base64-payload>.<base64-signature>" }
 * where the payload contains { user_id, algorithm, issued_at, expires? }.
 *
 * When we get it we:
 *   1. Verify the HMAC-SHA256 signature against AUTODM_META_APP_SECRET
 *   2. Look up any tenant where ig_user_id matches the user_id
 *   3. Mark the tenant is_active: false
 *   4. Clear the encrypted IG token so we can never send with a
 *      revoked credential (which would tank our rate limits + spam
 *      score at Meta)
 *   5. Insert an opt-out row for every recipient we've ever DM'd on
 *      that tenant — the user revoked access, so any residual sends
 *      would be spam
 *
 * Registered in Meta App Dashboard → Settings → Basic → User Data
 * Deauthorize Callback URL: https://autodm.stackpicks.dev/api/autodm/deauthorize
 *
 * Reference: https://developers.facebook.com/documentation/game/dev-console-app-settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function b64UrlDecode(str: string): Buffer {
  // Base64URL → standard Base64
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  return Buffer.from(pad ? s + '='.repeat(4 - pad) : s, 'base64');
}

interface DeauthPayload {
  user_id?: string;
  algorithm?: string;
  issued_at?: number;
}

function parseSignedRequest(signed: string): DeauthPayload | null {
  const [sigPart, payloadPart] = signed.split('.');
  if (!sigPart || !payloadPart) return null;
  const secret = process.env.AUTODM_META_APP_SECRET;
  if (!secret) return null;
  const providedSig = b64UrlDecode(sigPart);
  const expected = createHmac('sha256', secret).update(payloadPart).digest();
  if (providedSig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(providedSig, expected)) return null;
  } catch { return null; }
  try {
    return JSON.parse(b64UrlDecode(payloadPart).toString('utf-8')) as DeauthPayload;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  const admin = adminClient();

  // Meta posts application/x-www-form-urlencoded with a single
  // `signed_request` field. Accept both form + JSON to be tolerant.
  let signed: string | undefined;
  const ct = (req.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/x-www-form-urlencoded')) {
    const form = await req.formData();
    const s = form.get('signed_request');
    if (typeof s === 'string') signed = s;
  } else {
    try {
      const j = (await req.json()) as { signed_request?: string };
      signed = j.signed_request;
    } catch { /* ignore */ }
  }
  if (!signed) {
    return NextResponse.json({ ok: false, error: 'missing_signed_request' }, { status: 400 });
  }

  const payload = parseSignedRequest(signed);
  if (!payload) {
    return NextResponse.json({ ok: false, error: 'bad_signature' }, { status: 401 });
  }
  const userId = payload.user_id;
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'no_user_id_in_payload' }, { status: 400 });
  }

  // Log the event to the webhook log for audit — Meta expects to see
  // deauth events acknowledged and the response is used as the
  // "confirmation code" recipients can look up if they ask.
  const confirmationCode = `deauth_${userId.slice(0, 8)}_${Date.now().toString(36)}`;

  // Find any tenant this Meta user_id maps to. Meta's user_id here
  // is the IG user identifier, which we store as ig_business_id in
  // some contexts and as an owner-side identifier in others — try both.
  const { data: tenants } = await admin
    .from('autodm_tenants')
    .select('id, ig_business_id')
    .or(`ig_business_id.eq.${userId},ig_user_id.eq.${userId}`)
    .limit(10);

  const affectedIds: string[] = [];
  for (const t of (tenants ?? []) as { id: string; ig_business_id: string }[]) {
    // Mark tenant inactive + clear the encrypted token — no more sends
    // will be attempted against this account.
    await admin.from('autodm_tenants').update({
      is_active: false,
      ig_user_token_encrypted: null,
      paused_reason: `Deauthorized by user at Meta on ${new Date().toISOString()}`,
      paused_until: null,
    }).eq('id', t.id);

    // Move every past recipient to the opt-out list. The user revoked
    // access; we should never re-send to their audience under a
    // future re-connect either without explicit consent.
    const { data: recipients } = await admin
      .from('autodm_dm_log')
      .select('ig_user_id, ig_username')
      .eq('tenant_id', t.id)
      .not('ig_user_id', 'is', null);
    const uniq = new Map<string, string | null>();
    for (const r of (recipients ?? []) as { ig_user_id: string; ig_username: string | null }[]) {
      if (!uniq.has(r.ig_user_id)) uniq.set(r.ig_user_id, r.ig_username);
    }
    if (uniq.size > 0) {
      await admin.from('autodm_opt_outs').upsert(
        Array.from(uniq, ([ig_user_id, ig_username]) => ({
          tenant_id: t.id, ig_user_id, ig_username,
          reason: 'tenant_deauthorized',
        })),
        { onConflict: 'tenant_id,ig_user_id' },
      );
    }
    affectedIds.push(t.id);
  }

  return NextResponse.json({
    url: `https://autodm.stackpicks.dev/autodm/deauth-status?code=${encodeURIComponent(confirmationCode)}`,
    confirmation_code: confirmationCode,
    tenants_deactivated: affectedIds.length,
  });
}

// GET — sanity endpoint for the reviewer / admin to check the callback
// is reachable. Returns nothing sensitive.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'meta_deauthorize_callback',
    method: 'POST with signed_request form field',
  });
}

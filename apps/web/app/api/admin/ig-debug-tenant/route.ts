/**
 * Tenant-specific Meta probe. Reads the encrypted token from
 * autodm_tenants, decrypts on the server, and asks Meta directly for:
 *   - /me  (account_type, username, name)
 *   - /subscribed_apps (which fields this tenant's IG account is subbed to)
 *
 * Critical for diagnosing "webhook never received" — the most common
 * silent failure is a Personal-type IG account (Business / Creator
 * required) or a token that was revoked client-side.
 *
 *   GET /api/admin/ig-debug-tenant?ig_username=bulklootdeals
 *   GET /api/admin/ig-debug-tenant?tenant_id=<uuid>
 *
 * Admin only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { decryptToken } from '@stackpicks/core/autodm/crypto';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH = 'https://graph.instagram.com/v22.0';

export async function GET(req: NextRequest) {
  if (!(await isAdmin()).ok) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(req.url);
  const tenantId = url.searchParams.get('tenant_id');
  const username = url.searchParams.get('ig_username');
  if (!tenantId && !username) {
    return NextResponse.json({ ok: false, error: 'tenant_id or ig_username required' }, { status: 400 });
  }

  const admin = adminClient();
  const q = admin.from('autodm_tenants').select(
    'id, ig_username, ig_business_id, ig_user_token_encrypted, last_webhook_at, webhook_subscribed_at, webhook_subscribe_error, created_at, is_active'
  );
  const { data: row } = tenantId
    ? await q.eq('id', tenantId).single()
    : await q.eq('ig_username', username!).single();
  if (!row) return NextResponse.json({ ok: false, error: 'tenant_not_found' }, { status: 404 });

  const t = row as {
    id: string; ig_username: string | null; ig_business_id: string;
    ig_user_token_encrypted: string | null;
    last_webhook_at: string | null; webhook_subscribed_at: string | null;
    webhook_subscribe_error: string | null; created_at: string; is_active: boolean;
  };

  const out: Record<string, unknown> = {
    tenant: {
      id: t.id, username: t.ig_username, ig_business_id: t.ig_business_id,
      is_active: t.is_active, created_at: t.created_at,
      last_webhook_at: t.last_webhook_at,
      webhook_subscribed_at: t.webhook_subscribed_at,
      webhook_subscribe_error: t.webhook_subscribe_error,
    },
  };

  if (!t.ig_user_token_encrypted) {
    out.error = 'no_token_stored';
    return NextResponse.json({ ok: true, ...out });
  }

  let token: string;
  try { token = decryptToken(t.ig_user_token_encrypted); }
  catch (e) {
    out.error = `token_decrypt: ${(e as Error).message}`;
    return NextResponse.json({ ok: true, ...out });
  }

  // /me — confirms token validity + reveals account_type (Business / Creator / Personal)
  try {
    const r = await fetch(`${GRAPH}/me?fields=id,username,account_type&access_token=${encodeURIComponent(token)}`);
    out.me = { status: r.status, body: await r.json() };
  } catch (e) { out.me_error = (e as Error).message; }

  // /subscribed_apps — confirms whether webhook subscription is in place
  try {
    const r = await fetch(`${GRAPH}/${t.ig_business_id}/subscribed_apps?access_token=${encodeURIComponent(token)}`);
    out.subscribed_apps = { status: r.status, body: await r.json() };
  } catch (e) { out.subscribed_apps_error = (e as Error).message; }

  return NextResponse.json({ ok: true, ...out });
}

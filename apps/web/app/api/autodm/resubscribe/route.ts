/**
 * Re-assert this tenant's Meta webhook subscriptions.
 *
 *   POST /api/autodm/resubscribe
 *
 * Re-runs subscribed_apps with the FULL field set (comments,
 * live_comments, messages, mentions). Two reasons this exists:
 *   1. Tenants connected before live_comments shipped need it added
 *      without a full OAuth reconnect.
 *   2. Meta occasionally drops subscriptions silently; this is the
 *      one-click "fix my connection" lever surfaced on the dashboard
 *      webhook-health banner.
 *
 * Auth: logged-in owner, active-tenant scoped via cookie.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { decryptToken } from '@stackpicks/core/autodm/crypto';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';

export const runtime = 'nodejs';

const GRAPH = 'https://graph.instagram.com/v22.0';
const FIELDS = 'comments,live_comments,messages,mentions';

export async function POST() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant: tlite } = await getActiveTenant(admin, user.id, preferredId);
  if (!tlite) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  const { data: row } = await admin
    .from('autodm_tenants')
    .select('ig_business_id, ig_user_token_encrypted')
    .eq('id', tlite.id)
    .single();
  const t = row as { ig_business_id: string; ig_user_token_encrypted: string | null } | null;
  if (!t?.ig_user_token_encrypted) {
    return NextResponse.json({ ok: false, error: 'no_token — reconnect Instagram' }, { status: 400 });
  }

  let token: string;
  try { token = decryptToken(t.ig_user_token_encrypted); }
  catch { return NextResponse.json({ ok: false, error: 'token_decrypt' }, { status: 500 }); }

  const res = await fetch(
    `${GRAPH}/${t.ig_business_id}/subscribed_apps?` + new URLSearchParams({
      subscribed_fields: FIELDS,
      access_token: token,
    }),
    { method: 'POST' },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return NextResponse.json({ ok: false, error: `meta:${res.status}:${body.slice(0, 160)}` }, { status: 502 });
  }

  return NextResponse.json({ ok: true, subscribed_fields: FIELDS });
}

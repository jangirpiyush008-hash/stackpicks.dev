/**
 * Manual Instagram disconnect for the active tenant.
 *
 *   POST /api/autodm/disconnect
 *
 * Clears the encrypted IG token + business id + sets is_active=false so
 * the webhook receiver stops dispatching DMs to this tenant. Rules and
 * historical dm_log are kept (they're useful when the user reconnects
 * the same IG account later).
 *
 * The tenant row itself is preserved so subscription history, contacts,
 * and analytics remain accessible. Reconnecting re-fills the cleared
 * fields via the OAuth callback.
 *
 * Auth: caller must own the tenant (active tenant cookie scoped to this
 * user). 401 otherwise.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant } = await getActiveTenant(admin, user.id, preferredId);
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  await admin
    .from('autodm_tenants')
    .update({
      ig_user_token_encrypted: null,
      ig_business_id: null,
      is_active: false,
      paused_until: null,
      paused_reason: null,
    })
    .eq('id', tenant.id);

  return NextResponse.json({ ok: true });
}

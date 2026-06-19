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

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';
import { writeAudit, clientIp } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant } = await getActiveTenant(admin, user.id, preferredId);
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  // Capture the IG business id BEFORE clearing it for the audit row.
  const { data: snapshot } = await admin
    .from('autodm_tenants')
    .select('ig_business_id, ig_username')
    .eq('id', tenant.id)
    .single();

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

  void writeAudit({
    userId: user.id,
    action: 'ig_disconnected',
    targetId: (snapshot as { ig_business_id?: string } | null)?.ig_business_id ?? tenant.id,
    ip: clientIp(req),
    userAgent: req.headers.get('user-agent'),
    meta: { ig_username: (snapshot as { ig_username?: string } | null)?.ig_username ?? null },
  });

  return NextResponse.json({ ok: true });
}

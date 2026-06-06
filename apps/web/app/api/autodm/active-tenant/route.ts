/**
 * Switch the active AutoDM tenant for the current user.
 *
 *   POST /api/autodm/active-tenant  body: { tenant_id }
 *
 * Verifies the tenant belongs to the user, then sets the
 * autodm_active_tenant cookie. The dashboard and all other server
 * pages read this on next render.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { ACTIVE_TENANT_COOKIE, ACTIVE_TENANT_COOKIE_MAX_AGE } from '@stackpicks/core/autodm/active-tenant';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  let body: { tenant_id?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }); }
  const tenantId = body.tenant_id;
  if (!tenantId) return NextResponse.json({ ok: false, error: 'tenant_id required' }, { status: 400 });

  const admin = adminClient();
  const { data: tenant } = await admin
    .from('autodm_tenants')
    .select('id')
    .eq('id', tenantId)
    .eq('owner_user_id', user.id)
    .single();
  if (!tenant) return NextResponse.json({ ok: false, error: 'not your tenant' }, { status: 403 });

  const res = NextResponse.json({ ok: true, tenant_id: tenantId });
  res.cookies.set(ACTIVE_TENANT_COOKIE, tenantId, {
    maxAge: ACTIVE_TENANT_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: true,
  });
  return res;
}

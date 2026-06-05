/**
 * Tenant settings — toggle ai_followup_agent + ai_dm_generation flags,
 * pause/resume the bot, etc. Tenant-scoped via auth.uid().
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';

const PATCHABLE_FIELDS = [
  'ai_dm_generation',
  'ai_followup_agent',
  'is_active',
] as const;

export async function PATCH(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });
  const admin = adminClient();

  const body = (await req.json()) as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  for (const f of PATCHABLE_FIELDS) {
    if (f in body) updates[f] = !!body[f];
  }
  if (!Object.keys(updates).length) {
    return NextResponse.json({ ok: false, error: 'no_updates' }, { status: 400 });
  }

  const { data, error } = await admin.from('autodm_tenants')
    .update(updates).eq('owner_user_id', user.id).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, tenant: data });
}

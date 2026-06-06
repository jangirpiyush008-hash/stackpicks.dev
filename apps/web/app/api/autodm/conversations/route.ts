/**
 * AutoDM conversations — list + update status.
 *
 *   GET    /api/autodm/conversations[?status=active|escalated|closed|expired]
 *   PATCH  /api/autodm/conversations?id=<id>  { status: 'closed' | 'creator_escalated' }
 *
 * Tenant-scoped via auth.uid().
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';

type Ctx =
  | { ok: false; error: 'auth' | 'no_tenant' }
  | { ok: true; tenantId: string; admin: ReturnType<typeof adminClient> };

async function getTenantForUser(): Promise<Ctx> {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return { ok: false, error: 'auth' };
  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants').select('id').eq('owner_user_id', user.id).limit(1);
  const tenantId = tenants?.[0]?.id;
  if (!tenantId) return { ok: false, error: 'no_tenant' };
  return { ok: true, tenantId, admin };
}

export async function GET(req: NextRequest) {
  const ctx = await getTenantForUser();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const status = new URL(req.url).searchParams.get('status');

  let q = ctx.admin
    .from('autodm_conversations')
    .select('id, recipient_igsid, recipient_username, initial_rule_id, initial_comment_text, turn_count, last_turn_at, status, full_transcript, created_at')
    .eq('tenant_id', ctx.tenantId)
    .order('last_turn_at', { ascending: false })
    .limit(100);
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // Counts per status — for the inbox tab badges
  const counts: Record<string, number> = { active: 0, creator_escalated: 0, closed: 0, expired: 0 };
  const { data: countsRaw } = await ctx.admin
    .from('autodm_conversations')
    .select('status')
    .eq('tenant_id', ctx.tenantId);
  for (const r of countsRaw ?? []) {
    const s = (r as { status: string }).status;
    counts[s] = (counts[s] || 0) + 1;
  }

  return NextResponse.json({ ok: true, conversations: data, counts });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getTenantForUser();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const body = (await req.json()) as { status?: string };
  const ALLOWED = ['active', 'creator_escalated', 'closed', 'expired'];
  if (!body.status || !ALLOWED.includes(body.status)) {
    return NextResponse.json({ ok: false, error: 'bad status' }, { status: 400 });
  }
  const { data, error } = await ctx.admin
    .from('autodm_conversations')
    .update({ status: body.status })
    .eq('id', id)
    .eq('tenant_id', ctx.tenantId)
    .select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, conversation: data });
}

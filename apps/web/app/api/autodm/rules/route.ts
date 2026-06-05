/**
 * AutoDM rules CRUD — tenant-scoped via auth.uid().
 *
 *   GET   /api/autodm/rules               → list this user's tenant's rules
 *   POST  /api/autodm/rules               → create one
 *   PATCH /api/autodm/rules?id=<rule_id>  → update one
 *   DELETE /api/autodm/rules?id=<rule_id> → delete one
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

export async function GET() {
  const ctx = await getTenantForUser();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const { data, error } = await ctx.admin
    .from('autodm_rules').select('*').eq('tenant_id', ctx.tenantId)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rules: data });
}

export async function POST(req: NextRequest) {
  const ctx = await getTenantForUser();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const payload = {
    tenant_id: ctx.tenantId,
    label:          (body.label as string) || null,
    ig_post_id:     (body.ig_post_id as string) || null,
    keyword:        (body.keyword as string) || '',
    dm_template:    (body.dm_template as string) || '',
    dm_template_variants: Array.isArray(body.dm_template_variants) ? body.dm_template_variants : null,
    cta_url:        (body.cta_url as string) || null,
    cta_label:      (body.cta_label as string) || null,
    comment_reply:  (body.comment_reply as string) || null,
    comment_reply_follower: (body.comment_reply_follower as string) || null,
    follow_nudge:   body.follow_nudge === true,
    daily_cap_per_recipient: (body.daily_cap_per_recipient as number) ?? 1,
    is_active:      body.is_active !== false,
    use_ai_generation: body.use_ai_generation === true,
    ai_personality_hint: (body.ai_personality_hint as string) || null,
  };
  if (!payload.keyword || !payload.dm_template) {
    return NextResponse.json({ ok: false, error: 'keyword + dm_template required' }, { status: 400 });
  }
  const { data, error } = await ctx.admin.from('autodm_rules').insert(payload).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rule: data });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getTenantForUser();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const body = (await req.json()) as Record<string, unknown>;
  // Allowlist updatable fields
  const updates: Record<string, unknown> = {};
  const allowed = [
    'label', 'ig_post_id', 'keyword', 'dm_template', 'dm_template_variants',
    'cta_url', 'cta_label', 'comment_reply', 'comment_reply_follower',
    'follow_nudge', 'daily_cap_per_recipient', 'is_active',
    'use_ai_generation', 'ai_personality_hint',
  ];
  for (const f of allowed) if (f in body) updates[f] = body[f];
  const { data, error } = await ctx.admin.from('autodm_rules')
    .update(updates).eq('id', id).eq('tenant_id', ctx.tenantId).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rule: data });
}

export async function DELETE(req: NextRequest) {
  const ctx = await getTenantForUser();
  if (!ctx.ok) return NextResponse.json({ ok: false, error: ctx.error }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const { error } = await ctx.admin.from('autodm_rules')
    .delete().eq('id', id).eq('tenant_id', ctx.tenantId);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

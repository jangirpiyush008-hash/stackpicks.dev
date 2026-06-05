/**
 * Admin CRUD for ig_dm_rules.
 * Gated via isAdmin() — service role only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const gate = await isAdmin();
  if (!gate.ok) return null;
  return gate;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const supa = adminClient();
  const { data, error } = await supa
    .from('ig_dm_rules')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rules: data });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const payload = {
    label:        (body.label as string)        || null,
    ig_post_id:   (body.ig_post_id as string)   || null,
    keyword:      (body.keyword as string)      || '',
    dm_template:  (body.dm_template as string)  || '',
    cta_url:      (body.cta_url as string)      || null,
    cta_label:    (body.cta_label as string)    || null,
    is_active:    body.is_active !== false,
    daily_cap:    (body.daily_cap as number)    ?? null,
    follow_nudge: body.follow_nudge === true,
  };
  if (!payload.keyword || !payload.dm_template) {
    return NextResponse.json({ ok: false, error: 'keyword + dm_template required' }, { status: 400 });
  }
  const supa = adminClient();
  const { data, error } = await supa.from('ig_dm_rules').insert(payload).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rule: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json()) as { id?: string; patch?: Record<string, unknown> };
  if (!body.id || !body.patch) return NextResponse.json({ ok: false, error: 'id + patch required' }, { status: 400 });
  const supa = adminClient();
  const { data, error } = await supa
    .from('ig_dm_rules')
    .update(body.patch)
    .eq('id', body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, rule: data });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
  const supa = adminClient();
  const { error } = await supa.from('ig_dm_rules').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

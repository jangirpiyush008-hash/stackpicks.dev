import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  const gate = await isAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = (await req.json()) as { is_active?: boolean };

  const update: Record<string, unknown> = {};
  if (typeof body.is_active === 'boolean') update.is_active = body.is_active;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, error: 'nothing to update' }, { status: 400 });
  }

  const admin = adminClient();
  const { error } = await admin.from('coupons').update(update).eq('id', id);

  if (error) {
    console.error('[admin/coupons:patch] error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify({
    type: 'admin_coupon_update', by: gate.email, id, update, ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  const gate = await isAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const { id } = await ctx.params;
  const admin = adminClient();
  const { error } = await admin.from('coupons').delete().eq('id', id);

  if (error) {
    console.error('[admin/coupons:delete] error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify({
    type: 'admin_coupon_delete', by: gate.email, id, ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true });
}

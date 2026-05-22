import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_KINDS = ['percentage', 'fixed_inr', 'fixed_usd', 'free'] as const;

export async function POST(req: NextRequest) {
  const gate = await isAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const body = (await req.json()) as {
    code?: string;
    kind?: string;
    value?: number;
    max_uses?: number | null;
    expires_at?: string | null;
    description?: string | null;
  };

  const code = body.code?.trim().toUpperCase();
  if (!code || code.length < 3) {
    return NextResponse.json({ ok: false, error: 'code must be at least 3 chars' }, { status: 400 });
  }
  if (!body.kind || !VALID_KINDS.includes(body.kind as typeof VALID_KINDS[number])) {
    return NextResponse.json({ ok: false, error: 'invalid kind' }, { status: 400 });
  }

  const admin = adminClient();
  const { error, data } = await admin
    .from('coupons')
    .insert({
      code,
      kind: body.kind,
      value: body.kind === 'free' ? 0 : Number(body.value) || 0,
      max_uses: body.max_uses ?? null,
      expires_at: body.expires_at || null,
      description: body.description ?? null,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, error: 'code already exists' }, { status: 409 });
    }
    console.error('[admin/coupons:create] error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify({
    type: 'admin_coupon_create', by: gate.email, code, kind: body.kind, ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true, coupon: data });
}

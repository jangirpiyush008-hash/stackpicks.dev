import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const gate = await isAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  const { user_id } = (await req.json()) as { user_id?: string };
  if (!user_id) {
    return NextResponse.json({ ok: false, error: 'missing_user_id' }, { status: 400 });
  }

  const admin = adminClient();

  // Soft-revoke: flip every active subscription for this user to 'cancelled'.
  // Keeps the paper trail (payment IDs, dates) for audit + tax purposes.
  const { error } = await admin
    .from('premium_subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', user_id)
    .eq('status', 'active');

  if (error) {
    console.error('[admin/revoke] update failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify({
    type: 'admin_revoke',
    by: gate.email,
    user_id,
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true });
}

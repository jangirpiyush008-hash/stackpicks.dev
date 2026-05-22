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
  const fakeOrderId = `ADMIN-GRANT-${user_id.slice(0, 8)}-${Date.now().toString(36)}`;

  const { error } = await admin.from('premium_subscriptions').upsert(
    {
      user_id,
      razorpay_subscription_id: fakeOrderId,
      razorpay_customer_id: `admin:${gate.email}`,
      plan_id: 'lifetime_admin_grant',
      status: 'active',
      amount_inr: 0,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date('2099-12-31').toISOString(),
    },
    { onConflict: 'razorpay_subscription_id' }
  );

  if (error) {
    console.error('[admin/grant] insert failed:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log(JSON.stringify({
    type: 'admin_grant',
    by: gate.email,
    user_id,
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true });
}

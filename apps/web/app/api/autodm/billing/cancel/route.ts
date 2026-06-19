/**
 * Cancel the tenant's active Razorpay subscription. The webhook will
 * pick up the cancelled state and downgrade the plan_tier to free.
 *
 *   POST /api/autodm/billing/cancel
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { writeAudit, clientIp } from '@/lib/security';

export const runtime = 'nodejs';
const RZP_BASE = 'https://api.razorpay.com/v1';

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ ok: false, error: 'razorpay_not_configured' }, { status: 500 });
  }

  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants').select('id').eq('owner_user_id', user.id).limit(1);
  const tenant = tenants?.[0];
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  // Find active subscription
  const { data: subRow } = await admin
    .from('autodm_subscriptions')
    .select('razorpay_subscription_id, status')
    .eq('tenant_id', tenant.id as string)
    .in('status', ['authenticated', 'active', 'created'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (!subRow) return NextResponse.json({ ok: false, error: 'no_active_subscription' }, { status: 404 });

  // Cancel at cycle end (cancel_at_cycle_end=1 keeps them paid till the period ends)
  const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const res = await fetch(
    `${RZP_BASE}/subscriptions/${subRow.razorpay_subscription_id as string}/cancel`,
    {
      method: 'POST', headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancel_at_cycle_end: 1 }),
    },
  );
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `razorpay:${res.status}` }, { status: 500 });
  }

  void writeAudit({
    userId: user.id,
    action: 'subscription_cancel_requested',
    targetId: subRow.razorpay_subscription_id as string,
    ip: clientIp(req),
    userAgent: req.headers.get('user-agent'),
    meta: { cancel_at_cycle_end: true, tenant_id: tenant.id },
  });

  return NextResponse.json({ ok: true });
}

/**
 * Resume a cancellation-scheduled subscription.
 *
 *   POST /api/autodm/billing/resume
 *
 * Razorpay supports POST /subscriptions/{id}/cancel_scheduled_changes
 * which removes a queued cancellation. After this returns ok, the
 * subscription continues to renew normally.
 *
 * Frontend uses this for the "Keep my plan" button that appears under
 * the amber cancel-scheduled banner.
 */

import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';
const RZP_BASE = 'https://api.razorpay.com/v1';

export async function POST() {
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

  const { data: subRow } = await admin
    .from('autodm_subscriptions')
    .select('razorpay_subscription_id, cancel_at_cycle_end')
    .eq('tenant_id', tenant.id as string)
    .eq('cancel_at_cycle_end', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (!subRow) return NextResponse.json({ ok: false, error: 'no_cancellation_scheduled' }, { status: 404 });

  const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const res = await fetch(
    `${RZP_BASE}/subscriptions/${subRow.razorpay_subscription_id as string}/cancel_scheduled_changes`,
    { method: 'POST', headers: { Authorization: auth } },
  );
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    return NextResponse.json({ ok: false, error: `razorpay:${res.status}:${t.slice(0, 120)}` }, { status: 500 });
  }

  await admin.from('autodm_subscriptions').update({
    cancel_at_cycle_end: false,
    cancelled_at: null,
  }).eq('razorpay_subscription_id', subRow.razorpay_subscription_id as string);

  return NextResponse.json({ ok: true });
}

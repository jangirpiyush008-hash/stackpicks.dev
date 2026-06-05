/**
 * AutoDM billing — start a Razorpay subscription for the current tenant.
 *
 *   POST /api/autodm/billing/subscribe?tier=creator|pro|agency
 *
 * Creates a Razorpay subscription (12 cycles = 1 year, monthly), stores
 * the pending row in autodm_subscriptions, and returns the Razorpay
 * checkout URL. We do NOT change the tenant's plan_tier yet — that
 * happens when the webhook confirms subscription.activated.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { createSubscription } from '@stackpicks/core/razorpay';
import { planIdFor } from '@stackpicks/core/autodm/billing';
import type { PlanTier } from '@stackpicks/core/autodm/types';

export const runtime = 'nodejs';

const SUPPORTED: Exclude<PlanTier, 'free'>[] = ['creator', 'pro', 'agency'];

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const tier = new URL(req.url).searchParams.get('tier') as Exclude<PlanTier, 'free'> | null;
  if (!tier || !SUPPORTED.includes(tier)) {
    return NextResponse.json({ ok: false, error: 'tier required (creator|pro|agency)' }, { status: 400 });
  }

  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants').select('id, plan_tier, ig_username')
    .eq('owner_user_id', user.id).limit(1);
  const tenant = tenants?.[0];
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  let planId: string;
  try { planId = planIdFor(tier); }
  catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }); }

  let sub;
  try {
    sub = await createSubscription({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12,                          // 1 year, monthly
      notes: {
        tenant_id: tenant.id as string,
        ig_username: tenant.ig_username as string ?? '',
        plan_tier: tier,
        product: 'autodm',
      },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: `razorpay:${(e as Error).message.slice(0, 100)}` }, { status: 500 });
  }

  // Stash the pending subscription. Webhook will flip status + activate plan tier.
  await admin.from('autodm_subscriptions').upsert({
    tenant_id: tenant.id,
    razorpay_subscription_id: sub.id,
    razorpay_plan_id: sub.plan_id,
    plan_tier: tier,
    status: sub.status,
  }, { onConflict: 'razorpay_subscription_id' });

  return NextResponse.json({ ok: true, subscription_id: sub.id, checkout_url: sub.short_url });
}

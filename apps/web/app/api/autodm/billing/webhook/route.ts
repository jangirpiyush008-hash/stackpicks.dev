/**
 * Razorpay webhook receiver for AutoDM subscriptions.
 *
 * Events we react to:
 *   subscription.authenticated  → first payment confirmed → activate plan tier
 *   subscription.activated      → recurring active → activate plan tier
 *   subscription.charged        → renewal succeeded → keep tier
 *   subscription.cancelled      → user cancelled → downgrade to free
 *   subscription.completed      → all cycles done → downgrade to free
 *   subscription.paused         → temporarily paused → downgrade to free
 *   subscription.expired        → cycle expired without renewal → downgrade
 *
 * Signature verified via existing core/razorpay.verifyWebhookSignature.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { verifyWebhookSignature } from '@stackpicks/core/razorpay';
import { statusToPlanTier, cycleFromPlanId, type BillingCycle } from '@stackpicks/core/autodm/billing';
import type { PlanTier } from '@stackpicks/core/autodm/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RzpSubPayload {
  event: string;
  payload?: {
    subscription?: {
      entity?: {
        id: string;
        status: string;
        plan_id?: string;
        current_end?: number;
        notes?: Record<string, string>;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-razorpay-signature') || '';
  let sigOk = false;
  // AutoDM webhook uses its own secret (RAZORPAY_WEBHOOK_SECRET_AUTODM)
  // with fallback to the shared legacy RAZORPAY_WEBHOOK_SECRET during
  // migration. Distinct secrets stop cross-product webhook replay.
  try { sigOk = verifyWebhookSignature(raw, sig, 'autodm'); }
  catch { sigOk = false; }
  if (!sigOk) return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 401 });

  let body: RzpSubPayload;
  try { body = JSON.parse(raw) as RzpSubPayload; }
  catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }); }

  const sub = body.payload?.subscription?.entity;
  if (!sub?.id) {
    // Not a subscription event we care about — ack and move on
    return NextResponse.json({ ok: true, ignored: body.event });
  }

  const admin = adminClient();

  // Find the matching autodm_subscriptions row
  const { data: subRow } = await admin
    .from('autodm_subscriptions')
    .select('tenant_id, plan_tier, billing_cycle, currency')
    .eq('razorpay_subscription_id', sub.id)
    .single();
  if (!subRow) {
    // Likely a subscription from a different product (e.g. directory premium)
    return NextResponse.json({ ok: true, ignored: `unknown_sub:${sub.id}` });
  }

  const subscribedTier = (subRow.plan_tier as PlanTier);
  // Defense-in-depth: derive billing cycle from the Razorpay plan_id in the
  // webhook payload, NOT from our own DB column. If the DB column was ever
  // tampered with (RLS bypass, manual edit), the yearly +25% cap bonus still
  // only triggers when the user is actually being charged against a *_YEARLY
  // plan ID registered in our env.
  const dbCycle: BillingCycle = (subRow.billing_cycle as BillingCycle) ?? 'monthly';
  const cycle: BillingCycle = cycleFromPlanId(sub.plan_id, dbCycle);
  if (cycle !== dbCycle) {
    console.warn('[autodm/webhook] billing_cycle mismatch — using plan_id-derived cycle', {
      sub_id: sub.id, plan_id: sub.plan_id, db_cycle: dbCycle, derived_cycle: cycle,
    });
  }
  const { plan_tier, hourly_cap, daily_cap } = statusToPlanTier(sub.status, subscribedTier, cycle);
  const periodEnd = sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null;

  // Update the subscription row
  await admin.from('autodm_subscriptions').update({
    status: sub.status,
    current_period_end: periodEnd,
  }).eq('razorpay_subscription_id', sub.id);

  // Promote / demote the tenant
  await admin.from('autodm_tenants').update({
    plan_tier, hourly_cap, daily_cap,
  }).eq('id', subRow.tenant_id as string);

  return NextResponse.json({ ok: true, event: body.event, tenant: subRow.tenant_id, plan_tier });
}

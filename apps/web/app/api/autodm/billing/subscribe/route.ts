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
import { planIdFor, type BillingCycle, type Currency } from '@stackpicks/core/autodm/billing';
import type { PlanTier } from '@stackpicks/core/autodm/types';
import { clientIp, writeAudit } from '@/lib/security';

export const runtime = 'nodejs';

const SUPPORTED: Exclude<PlanTier, 'free'>[] = ['creator', 'pro', 'agency'];
const CYCLES: BillingCycle[] = ['monthly', 'yearly'];
const CURRENCIES: Currency[] = ['inr', 'usd'];

// IP-geo cross-check — INR plans are for Indian customers only, USD for
// everyone else. Server-side enforcement prevents a non-Indian visitor
// from passing ?currency=inr to grab the cheaper price. Uses ipapi.co
// (same source the client-side useCurrency() hook checks).
async function countryFromIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  try {
    const r = await Promise.race([
      fetch(`https://ipapi.co/${ip}/country/`, { cache: 'no-store' }),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('geo timeout')), 2500)),
    ]);
    if (!r.ok) return null;
    const c = (await r.text()).trim().toUpperCase();
    return c || null;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const tier = sp.get('tier') as Exclude<PlanTier, 'free'> | null;
  if (!tier || !SUPPORTED.includes(tier)) {
    return NextResponse.json({ ok: false, error: 'tier required (creator|pro|agency)' }, { status: 400 });
  }
  const cycleRaw = (sp.get('cycle') ?? 'monthly') as BillingCycle;
  const cycle: BillingCycle = CYCLES.includes(cycleRaw) ? cycleRaw : 'monthly';
  const currencyRaw = (sp.get('currency') ?? 'inr').toLowerCase() as Currency;
  const currency: Currency = CURRENCIES.includes(currencyRaw) ? currencyRaw : 'inr';

  // Geo guard. INR ⇔ India only; USD ⇔ everyone else. Mismatch is
  // rejected with a 400 + audit-log entry so we can spot abuse attempts.
  // Soft-fail on geo lookup error (network blip): proceed with the
  // requested currency, since the Razorpay payment-method check will
  // still block any actual mis-charge.
  const ip = clientIp(req);
  const country = await countryFromIp(ip);
  if (country) {
    const expected: Currency = country === 'IN' ? 'inr' : 'usd';
    if (expected !== currency) {
      void writeAudit({
        userId: user.id,
        action: 'currency_mismatch_blocked',
        ip,
        userAgent: req.headers.get('user-agent'),
        meta: { country, requested_currency: currency, expected_currency: expected, tier, cycle },
      });
      return NextResponse.json(
        { ok: false, error: 'currency_mismatch', detail: `Your region (${country}) is billed in ${expected.toUpperCase()}.` },
        { status: 400 },
      );
    }
  }

  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants').select('id, plan_tier, ig_username')
    .eq('owner_user_id', user.id).limit(1);
  const tenant = tenants?.[0];
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  let planId: string;
  try { planId = planIdFor(tier, cycle, currency); }
  catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }); }

  // total_count: monthly → 12 cycles = 1 year of auto-debits.
  //              yearly  → 5 cycles  = 5 years (Razorpay caps total_count;
  //              5 yearly renewals is effectively forever in practice and
  //              customer can re-subscribe if they make it that far).
  const totalCount = cycle === 'yearly' ? 5 : 12;

  let sub;
  try {
    sub = await createSubscription({
      plan_id: planId,
      customer_notify: 1,
      total_count: totalCount,
      notes: {
        tenant_id: tenant.id as string,
        ig_username: tenant.ig_username as string ?? '',
        plan_tier: tier,
        billing_cycle: cycle,
        currency,
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
    billing_cycle: cycle,
    currency,
    status: sub.status,
  }, { onConflict: 'razorpay_subscription_id' });

  return NextResponse.json({ ok: true, subscription_id: sub.id, checkout_url: sub.short_url });
}

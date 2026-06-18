/**
 * AutoDM billing — Razorpay plan mapping + caps.
 *
 * Plans are created once in Razorpay dashboard and their IDs go in env.
 * Two billing cycles per paid tier: monthly and yearly. Yearly = 10× the
 * monthly price (i.e., 2 months free).
 */

import { DEFAULT_PLAN_CAPS, type PlanTier } from './types';

export type BillingCycle = 'monthly' | 'yearly';

type PaidTier = Exclude<PlanTier, 'free'>;

export const BILLING_PRICES_INR: Record<PaidTier, Record<BillingCycle, number>> = {
  creator: { monthly: 499,   yearly: 4_990  },
  pro:     { monthly: 1_499, yearly: 14_990 },
  agency:  { monthly: 4_999, yearly: 49_990 },
};

/** Razorpay plan IDs come from env so creating the plans in the dashboard
 *  doesn't require a code change. Yearly plans use the *_YEARLY suffix. */
export function planIdFor(tier: PaidTier, cycle: BillingCycle = 'monthly'): string {
  const suffix = cycle === 'yearly' ? '_YEARLY' : '';
  const key = `RAZORPAY_AUTODM_PLAN_${tier.toUpperCase()}${suffix}`;
  const id = process.env[key];
  if (!id) throw new Error(`Missing ${key} env (set the Razorpay plan ID)`);
  return id;
}

/** Yearly subscribers get a +25% throughput bonus on top of their tier's
 *  base caps. This is a real benefit, wired through the webhook → tenant. */
export const YEARLY_CAP_BONUS = 0.25;

export function capsFor(tier: PlanTier, cycle: BillingCycle = 'monthly') {
  const base = DEFAULT_PLAN_CAPS[tier];
  if (tier === 'free' || cycle !== 'yearly') return base;
  return {
    ...base,
    hourly: Math.round(base.hourly * (1 + YEARLY_CAP_BONUS)),
    daily:  Math.round(base.daily  * (1 + YEARLY_CAP_BONUS)),
  };
}

/** Map a Razorpay subscription status to our internal plan_tier transition.
 *  active|authenticated → plan stays at the subscribed tier (yearly gets bonus caps).
 *  cancelled|completed|expired|paused → drop to 'free'. */
export function statusToPlanTier(
  status: string, subscribedTier: PlanTier, cycle: BillingCycle = 'monthly',
): { plan_tier: PlanTier; hourly_cap: number; daily_cap: number } {
  const isLive = ['active', 'authenticated', 'created'].includes(status);
  const tier: PlanTier = isLive ? subscribedTier : 'free';
  // Free fallback never carries the yearly bonus.
  const caps = capsFor(tier, isLive ? cycle : 'monthly');
  return { plan_tier: tier, hourly_cap: caps.hourly, daily_cap: caps.daily };
}

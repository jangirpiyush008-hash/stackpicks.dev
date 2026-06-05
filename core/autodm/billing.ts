/**
 * AutoDM billing — Razorpay plan mapping + caps.
 *
 * Plans are created once in Razorpay dashboard and their IDs go in env.
 * One plan_id per tier per billing cycle (monthly only for v1).
 */

import { DEFAULT_PLAN_CAPS, type PlanTier } from './types';

export const BILLING_PRICES_INR: Record<Exclude<PlanTier, 'free'>, number> = {
  creator: 499,
  pro:     1499,
  agency:  4999,
};

/** Razorpay plan IDs come from env so creating the plans in the dashboard
 *  doesn't require a code change. */
export function planIdFor(tier: Exclude<PlanTier, 'free'>): string {
  const key = `RAZORPAY_AUTODM_PLAN_${tier.toUpperCase()}`;
  const id = process.env[key];
  if (!id) throw new Error(`Missing ${key} env (set the Razorpay plan ID)`);
  return id;
}

export function capsFor(tier: PlanTier) {
  return DEFAULT_PLAN_CAPS[tier];
}

/** Map a Razorpay subscription status to our internal plan_tier transition.
 *  active|authenticated → plan stays at the subscribed tier.
 *  cancelled|completed|expired|paused → drop to 'free'. */
export function statusToPlanTier(
  status: string, subscribedTier: PlanTier,
): { plan_tier: PlanTier; hourly_cap: number; daily_cap: number } {
  const isLive = ['active', 'authenticated', 'created'].includes(status);
  const tier: PlanTier = isLive ? subscribedTier : 'free';
  const caps = capsFor(tier);
  return { plan_tier: tier, hourly_cap: caps.hourly, daily_cap: caps.daily };
}

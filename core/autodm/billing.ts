/**
 * AutoDM billing — Razorpay plan mapping + caps.
 *
 * Plans live in two currencies (INR for India, USD for the rest of the
 * world) × two billing cycles (monthly, yearly) × three paid tiers.
 * Each tier × cycle × currency maps to a Razorpay plan ID via env var.
 *
 * Indian INR plans require an Indian-acceptable payment method (UPI,
 * Indian card, net-banking); USD plans require Razorpay International
 * Payments and a foreign card. That separation gives us natural
 * arbitrage protection — a non-Indian can't grab the INR-priced plan
 * without an Indian payment instrument.
 *
 * Yearly cycle = 10× monthly (2 months free). YEARLY_CAP_BONUS lifts
 * a yearly subscriber's DM caps by +25%, applied at webhook time.
 */

import { DEFAULT_PLAN_CAPS, type PlanTier } from './types';

export type BillingCycle = 'monthly' | 'yearly';
export type Currency = 'inr' | 'usd';

type PaidTier = Exclude<PlanTier, 'free'>;

/** Sticker prices shown on the pricing page. INR are in rupees, USD in
 *  whole dollars. Yearly = 10× monthly (2 months free vs paying month
 *  to month). */
export const BILLING_PRICES: Record<Currency, Record<PaidTier, Record<BillingCycle, number>>> = {
  inr: {
    creator: { monthly: 499,   yearly: 4_990  },
    pro:     { monthly: 1_499, yearly: 14_990 },
    agency:  { monthly: 4_999, yearly: 49_990 },
  },
  usd: {
    creator: { monthly: 15,  yearly: 150 },
    pro:     { monthly: 25,  yearly: 250 },
    agency:  { monthly: 79,  yearly: 790 },
  },
};

/** Legacy alias retained for any callers still importing the old name —
 *  resolves to the INR slice. Prefer BILLING_PRICES directly. */
export const BILLING_PRICES_INR = BILLING_PRICES.inr;

/** Razorpay plan IDs come from env so creating plans in the dashboard
 *  doesn't require a code change. Naming convention:
 *    RAZORPAY_AUTODM_PLAN_{TIER}             — INR monthly
 *    RAZORPAY_AUTODM_PLAN_{TIER}_YEARLY      — INR yearly
 *    RAZORPAY_AUTODM_PLAN_{TIER}_USD         — USD monthly
 *    RAZORPAY_AUTODM_PLAN_{TIER}_USD_YEARLY  — USD yearly
 */
export function planIdFor(
  tier: PaidTier,
  cycle: BillingCycle = 'monthly',
  currency: Currency = 'inr',
): string {
  const tierKey = tier.toUpperCase();
  const currencySuffix = currency === 'usd' ? '_USD' : '';
  const cycleSuffix = cycle === 'yearly' ? '_YEARLY' : '';
  const key = `RAZORPAY_AUTODM_PLAN_${tierKey}${currencySuffix}${cycleSuffix}`;
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
  const caps = capsFor(tier, isLive ? cycle : 'monthly');
  return { plan_tier: tier, hourly_cap: caps.hourly, daily_cap: caps.daily };
}

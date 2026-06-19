/**
 * Razorpay server-side logic.
 * - createOrder: one-time payments (job posts, single-month sponsorships)
 * - createSubscription: recurring (premium tier, monthly sponsor slots)
 * - verifyPaymentSignature: post-checkout verification (NEVER trust client)
 * - verifyWebhookSignature: for webhook handler
 *
 * All amounts in paise (Razorpay native unit).
 */
import crypto from 'node:crypto';

const RZP_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RZP_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const RZP_BASE = 'https://api.razorpay.com/v1';

function authHeader(): string {
  if (!RZP_KEY_ID || !RZP_KEY_SECRET) throw new Error('Missing Razorpay credentials');
  const token = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString('base64');
  return `Basic ${token}`;
}

export interface CreateOrderInput {
  amount: number;            // smallest unit: paise for INR, cents for USD
  currency?: 'INR' | 'USD';  // defaults to INR
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createOrder(input: CreateOrderInput): Promise<RazorpayOrder> {
  if (input.amount < 100) {
    throw new Error('Razorpay minimum amount is 100 (paise or cents)');
  }
  const res = await fetch(`${RZP_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency ?? 'INR',
      receipt: input.receipt,
      notes: input.notes ?? {},
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Razorpay createOrder failed: ${res.status} ${errText}`);
  }

  return (await res.json()) as RazorpayOrder;
}

export interface CreateSubscriptionInput {
  plan_id: string;
  customer_notify: 0 | 1;
  total_count: number; // 12 for one-year, etc.
  notes?: Record<string, string>;
}

export interface RazorpaySubscription {
  id: string;
  status: string;
  plan_id: string;
  short_url: string;
}

export async function createSubscription(
  input: CreateSubscriptionInput
): Promise<RazorpaySubscription> {
  const res = await fetch(`${RZP_BASE}/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: input.plan_id,
      customer_notify: input.customer_notify,
      total_count: input.total_count,
      notes: input.notes ?? {},
    }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay createSubscription failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as RazorpaySubscription;
}

/**
 * Verify payment signature returned by Razorpay checkout.
 * Called server-side after client completes payment.
 */
export function verifyPaymentSignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  if (!RZP_KEY_SECRET) throw new Error('Missing RAZORPAY_KEY_SECRET');
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', RZP_KEY_SECRET)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
}

/**
 * Verify webhook signature. Razorpay sends X-Razorpay-Signature header.
 * Per-product secrets (recommended): pass `which` = 'directory' or 'autodm'
 * to pick RAZORPAY_WEBHOOK_SECRET_DIRECTORY / RAZORPAY_WEBHOOK_SECRET_AUTODM
 * with safe fallback to the legacy shared RAZORPAY_WEBHOOK_SECRET.
 */
type WebhookSecretWhich = 'directory' | 'autodm' | 'shared';

function pickWebhookSecret(which: WebhookSecretWhich): string {
  // Read at call-time, not module-load-time, so env updates after process
  // start are picked up by edge/serverless workers.
  const legacy = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (which === 'directory') {
    const v = process.env.RAZORPAY_WEBHOOK_SECRET_DIRECTORY || legacy;
    if (!v) throw new Error('Missing RAZORPAY_WEBHOOK_SECRET_DIRECTORY (or fallback RAZORPAY_WEBHOOK_SECRET)');
    return v;
  }
  if (which === 'autodm') {
    const v = process.env.RAZORPAY_WEBHOOK_SECRET_AUTODM || legacy;
    if (!v) throw new Error('Missing RAZORPAY_WEBHOOK_SECRET_AUTODM (or fallback RAZORPAY_WEBHOOK_SECRET)');
    return v;
  }
  if (!legacy) throw new Error('Missing RAZORPAY_WEBHOOK_SECRET');
  return legacy;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  which: WebhookSecretWhich = 'shared',
): boolean {
  const secret = pickWebhookSecret(which);
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuf = Buffer.from(expected);
  const sigBuf = Buffer.from(signature);
  // timingSafeEqual throws if lengths differ — any malformed/short signature
  // is just an invalid one, not a server-side misconfiguration.
  if (expectedBuf.length !== sigBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, sigBuf);
}

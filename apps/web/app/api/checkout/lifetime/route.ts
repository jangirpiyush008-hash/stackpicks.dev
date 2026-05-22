import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase-server';
import { createOrder } from '@stackpicks/core/razorpay';
import { PRICING } from '@stackpicks/core/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CheckoutBody {
  currency: 'INR' | 'USD';
  coupon_code?: string;
}

function baseAmount(currency: 'INR' | 'USD'): number {
  return currency === 'INR'
    ? (PRICING.premium_lifetime.amount_inr_paise as number)
    : (PRICING.premium_lifetime.amount_usd_cents as number);
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const currency: 'INR' | 'USD' = body.currency === 'USD' ? 'USD' : 'INR';

  // 1. User must be signed in — we need to attribute the purchase
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'auth_required', message: 'Please sign in before purchasing.' },
      { status: 401 }
    );
  }

  // 1a. Already a lifetime member? Don't charge again — bounce them to dashboard.
  const { data: existing } = await supabase
    .from('premium_subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({
      ok: true,
      already_member: true,
      message: 'You already have lifetime access.',
    });
  }

  // 2. Calculate amount — start with base, then apply coupon if present + valid
  let amount: number = baseAmount(currency);
  let appliedCoupon: { id: string; code: string; discount_amount: number } | null = null;
  let isFree = false;

  const couponCode = body.coupon_code?.trim().toUpperCase();
  if (couponCode) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('id, code, kind, value, max_uses, used_count, expires_at, is_active')
      .ilike('code', couponCode)
      .maybeSingle();

    if (coupon && coupon.is_active) {
      const notExpired = !coupon.expires_at || new Date(coupon.expires_at) > new Date();
      const hasRoom = coupon.max_uses == null || coupon.used_count < coupon.max_uses;
      if (notExpired && hasRoom) {
        let discount = 0;
        if (coupon.kind === 'free') discount = amount;
        else if (coupon.kind === 'percentage') discount = Math.floor((amount * coupon.value) / 100);
        else if (coupon.kind === 'fixed_inr' && currency === 'INR') discount = Math.min(coupon.value, amount);
        else if (coupon.kind === 'fixed_usd' && currency === 'USD') discount = Math.min(coupon.value, amount);

        const final = Math.max(0, amount - discount);
        if (final === 0) isFree = true;
        amount = final;
        appliedCoupon = { id: coupon.id, code: coupon.code, discount_amount: discount };
      }
    }
  }

  // 3. Free coupon path — skip Razorpay entirely, grant access directly
  if (isFree && appliedCoupon) {
    const { error: subErr } = await supabase.from('premium_subscriptions').insert({
      user_id: user.id,
      razorpay_subscription_id: `FREE-${appliedCoupon.code}-${user.id.slice(0, 8)}`,
      plan_id: 'lifetime_free_coupon',
      status: 'active',
      amount_inr: 0,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date('2099-12-31').toISOString(),
    });
    if (subErr && subErr.code !== '23505') {
      console.error('[checkout/lifetime] free grant insert failed:', subErr);
      return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
    }
    await supabase.from('coupon_redemptions').insert({
      coupon_id: appliedCoupon.id,
      user_id: user.id,
      user_email: user.email,
      original_amount_paise: baseAmount(currency),
      discount_amount_paise: appliedCoupon.discount_amount,
      final_amount_paise: 0,
    });
    await supabase.rpc('increment_coupon_uses', { coupon_id: appliedCoupon.id }).then(() => {
      /* if RPC doesn't exist yet, silently no-op */
    });

    return NextResponse.json({
      ok: true,
      free: true,
      message: 'Membership granted — no payment needed.',
    });
  }

  // 4. Paid path — Razorpay minimum amount is 100 paise / 100 cents
  if (amount < 100) {
    return NextResponse.json(
      { ok: false, error: 'invalid_amount', message: 'Amount too low after discount.' },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder({
      amount,
      currency,
      receipt: `life_${user.id.slice(0, 16)}_${Date.now().toString(36)}`,
      notes: {
        user_id: user.id,
        user_email: user.email ?? '',
        purpose: 'lifetime_membership',
        coupon_code: appliedCoupon?.code ?? '',
      },
    });

    console.log(JSON.stringify({
      type: 'order_created',
      order_id: order.id,
      user_id: user.id,
      amount,
      currency,
      coupon: appliedCoupon?.code ?? null,
      ts: new Date().toISOString(),
    }));

    return NextResponse.json({
      ok: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        coupon: appliedCoupon?.code ?? null,
        user_name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || '',
        user_email: user.email ?? '',
      },
    });
  } catch (err) {
    console.error('[checkout/lifetime] Razorpay createOrder error:', err);
    const msg = err instanceof Error ? err.message : 'Order creation failed';
    return NextResponse.json({ ok: false, error: 'razorpay_error', message: msg }, { status: 500 });
  }
}

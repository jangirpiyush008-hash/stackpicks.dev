import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { verifyPaymentSignature } from '@stackpicks/core/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  coupon_code?: string | null;
}

export async function POST(req: NextRequest) {
  let body: VerifyBody;
  try {
    body = (await req.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, coupon_code } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { ok: false, error: 'missing_fields', message: 'Missing required Razorpay fields.' },
      { status: 400 }
    );
  }

  // 1. Verify HMAC signature server-side — never trust the client
  let isValid = false;
  try {
    isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
  } catch (err) {
    console.error('[verify-payment] signature check threw:', err);
    return NextResponse.json({ ok: false, error: 'verification_error' }, { status: 500 });
  }

  if (!isValid) {
    console.warn('[verify-payment] SIGNATURE MISMATCH', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
    return NextResponse.json(
      { ok: false, error: 'invalid_signature', message: 'Payment could not be verified.' },
      { status: 400 }
    );
  }

  // 2. Find the authenticated user
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'auth_required', message: 'Session expired — please sign in again.' },
      { status: 401 }
    );
  }

  // 3. Fetch order from Razorpay to get the confirmed amount (don't trust client)
  let orderAmount = 0;
  let orderCurrency = 'INR';
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keyId && keySecret) {
      const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
        headers: { Authorization: `Basic ${token}` },
      });
      if (orderRes.ok) {
        const order = (await orderRes.json()) as { amount: number; currency: string };
        orderAmount = order.amount;
        orderCurrency = order.currency;
      }
    }
  } catch (err) {
    console.warn('[verify-payment] could not fetch order details:', err);
  }

  // 4. Insert / update premium subscription via SERVICE-ROLE client.
  //    User-context client is blocked by RLS for INSERTs on this table.
  const admin = adminClient();
  const { error: subErr } = await admin
    .from('premium_subscriptions')
    .upsert(
      {
        user_id: user.id,
        razorpay_subscription_id: razorpay_order_id, // one-time payment, use order_id as unique key
        razorpay_customer_id: razorpay_payment_id,
        plan_id: 'lifetime',
        status: 'active',
        amount_inr: orderCurrency === 'INR' ? orderAmount : 0,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date('2099-12-31').toISOString(),
      },
      { onConflict: 'razorpay_subscription_id' }
    );

  if (subErr) {
    console.error('[verify-payment] subscription insert failed:', {
      code: subErr.code,
      message: subErr.message,
      details: subErr.details,
      hint: subErr.hint,
    });
    return NextResponse.json(
      {
        ok: false,
        error: 'db_error',
        message: 'Payment verified but membership grant failed. Email support with the payment ID — we will manually grant access.',
        payment_id: razorpay_payment_id,
      },
      { status: 500 }
    );
  }

  // 5. If a coupon was applied, record the redemption (also via service role)
  if (coupon_code) {
    try {
      const { data: coupon } = await admin
        .from('coupons')
        .select('id, value, kind')
        .ilike('code', coupon_code)
        .maybeSingle();
      if (coupon) {
        await admin.from('coupon_redemptions').insert({
          coupon_id: coupon.id,
          user_id: user.id,
          user_email: user.email,
          original_amount_paise: orderAmount,
          discount_amount_paise: 0,
          final_amount_paise: orderAmount,
          razorpay_payment_id,
        });
      }
    } catch (err) {
      console.warn('[verify-payment] coupon redemption record failed:', err);
    }
  }

  // 6. Log + return success
  console.log(JSON.stringify({
    type: 'payment_verified',
    user_id: user.id,
    user_email: user.email,
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
    amount: orderAmount,
    currency: orderCurrency,
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({
    ok: true,
    message: 'Payment verified — lifetime membership activated.',
    data: {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      amount: orderAmount,
      currency: orderCurrency,
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ValidateRequest {
  code: string;
  currency: 'INR' | 'USD';
}

function priceForCurrency(currency: 'INR' | 'USD') {
  // Mirror /core/constants/index.ts.PRICING.premium_lifetime amounts.
  return currency === 'INR'
    ? { amount: 9900, label: '₹99' }   // paise
    : { amount: 299, label: '$2.99' }; // cents
}

function formatAmount(amount: number, currency: 'INR' | 'USD'): string {
  return currency === 'INR' ? `₹${(amount / 100).toFixed(0)}` : `$${(amount / 100).toFixed(2)}`;
}

export async function POST(req: NextRequest) {
  let body: ValidateRequest;
  try {
    body = (await req.json()) as ValidateRequest;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  const currency: 'INR' | 'USD' = body.currency === 'USD' ? 'USD' : 'INR';

  if (!code || code.length < 3) {
    return NextResponse.json({ ok: false, error: 'invalid_code' }, { status: 400 });
  }

  // If Supabase isn't wired yet, return invalid (don't leak any details).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 });
  }

  try {
    const { adminClient } = await import('@stackpicks/core/db');
    const supabase = adminClient();

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('id, code, kind, value, max_uses, used_count, expires_at, is_active')
      .ilike('code', code)
      .maybeSingle();

    if (error || !coupon) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }
    if (!coupon.is_active) {
      return NextResponse.json({ ok: false, error: 'inactive' }, { status: 404 });
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: 'expired' }, { status: 404 });
    }
    if (coupon.max_uses != null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ ok: false, error: 'exhausted' }, { status: 404 });
    }

    const { amount: baseAmount, label: baseLabel } = priceForCurrency(currency);

    let discount = 0;
    if (coupon.kind === 'free') {
      discount = baseAmount;
    } else if (coupon.kind === 'percentage') {
      discount = Math.floor((baseAmount * coupon.value) / 100);
    } else if (coupon.kind === 'fixed_inr' && currency === 'INR') {
      discount = Math.min(coupon.value, baseAmount);
    } else if (coupon.kind === 'fixed_usd' && currency === 'USD') {
      discount = Math.min(coupon.value, baseAmount);
    } else {
      // currency mismatch — fixed_inr coupon used in USD region or vice versa
      return NextResponse.json({ ok: false, error: 'currency_mismatch' }, { status: 400 });
    }

    const final = Math.max(0, baseAmount - discount);

    return NextResponse.json({
      ok: true,
      data: {
        code: coupon.code,
        kind: coupon.kind,
        currency,
        base_amount: baseAmount,
        base_label: baseLabel,
        discount_amount: discount,
        discount_label: formatAmount(discount, currency),
        final_amount: final,
        final_label: final === 0 ? 'FREE' : formatAmount(final, currency),
        is_free: final === 0,
      },
    });
  } catch (err) {
    console.error('[coupon-validate] failed:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

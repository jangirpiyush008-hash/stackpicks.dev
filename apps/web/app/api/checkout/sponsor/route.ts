import { adminClient } from '@stackpicks/core/db';
import { createOrder } from '@stackpicks/core/razorpay';
import { sponsoredSlotRequestSchema } from '@stackpicks/core/validation';
import { PRICING } from '@stackpicks/core/constants';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sponsoredSlotRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'invalid_input', message: parsed.error.errors[0].message } },
        { status: 400 }
      );
    }

    const supabase = adminClient();
    const userId = req.headers.get('x-user-id'); // set by middleware after auth check
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: { code: 'unauth', message: 'Login required' } },
        { status: 401 }
      );
    }

    const { data: sponsor } = await supabase
      .from('sponsors')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!sponsor) {
      return NextResponse.json(
        { ok: false, error: { code: 'no_sponsor', message: 'Complete sponsor profile first' } },
        { status: 400 }
      );
    }

    // Calculate price
    const pricing =
      parsed.data.placement === 'homepage_featured'
        ? PRICING.sponsor_homepage_featured
        : parsed.data.placement === 'newsletter'
        ? PRICING.sponsor_newsletter
        : PRICING.sponsor_category_top;

    const amount_paise = pricing.amount_inr_paise * parsed.data.months;

    // Insert pending slot
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + parsed.data.months);

    const { data: slot, error: slotErr } = await supabase
      .from('sponsored_slots')
      .insert({
        sponsor_id: sponsor.id,
        placement: parsed.data.placement,
        category_id: parsed.data.category_id ?? null,
        repo_id: parsed.data.repo_id ?? null,
        external_name: parsed.data.external_name ?? null,
        external_url: parsed.data.external_url ?? null,
        external_logo: parsed.data.external_logo ?? null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        amount_inr: amount_paise,
        status: 'pending',
      })
      .select()
      .single();

    if (slotErr || !slot) {
      console.error('Slot insert failed:', slotErr);
      return NextResponse.json(
        { ok: false, error: { code: 'db_error', message: 'Could not create slot' } },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const order = await createOrder({
      amount: amount_paise,
      currency: 'INR',
      receipt: `slot_${slot.id.slice(0, 20)}`,
      notes: {
        purpose: 'sponsored_slot',
        target_id: slot.id,
        sponsor_id: sponsor.id,
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        slot_id: slot.id,
        order_id: order.id,
        amount_paise,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    console.error('Sponsor checkout error:', err);
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}

import { adminClient } from '@stackpicks/core/db';
import { verifyWebhookSignature } from '@stackpicks/core/razorpay';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Razorpay webhook receiver.
 * Configure URL: https://stackpicks.dev/api/webhook/razorpay
 * Events to subscribe: subscription.activated, subscription.charged,
 *   subscription.cancelled, payment.captured, payment.failed.
 *
 * Signature verification is mandatory — never trust the payload otherwise.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature');
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'Missing signature' }, { status: 400 });
  }

  const rawBody = await req.text();

  // Directory webhook uses its own secret (RAZORPAY_WEBHOOK_SECRET_DIRECTORY),
  // falling back to the legacy shared RAZORPAY_WEBHOOK_SECRET while migration
  // is in progress. Once the dedicated secret is set, AutoDM webhook can't
  // be replayed against this endpoint and vice versa.
  // Wrap in try/catch so a missing env var returns a clean 401 rather than 500.
  let sigOk = false;
  try { sigOk = verifyWebhookSignature(rawBody, signature, 'directory'); }
  catch (e) {
    console.error('Razorpay directory webhook secret missing or misconfigured:', e);
    return NextResponse.json({ ok: false, error: 'webhook_misconfigured' }, { status: 401 });
  }
  if (!sigOk) {
    console.error('Razorpay webhook signature mismatch');
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as {
    event: string;
    payload: Record<string, any>;
  };

  const supabase = adminClient();

  try {
    switch (event.event) {
      case 'subscription.activated':
      case 'subscription.charged': {
        const sub = event.payload.subscription.entity;
        await supabase
          .from('premium_subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date(sub.current_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_end * 1000).toISOString(),
          })
          .eq('razorpay_subscription_id', sub.id);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.completed': {
        const sub = event.payload.subscription.entity;
        await supabase
          .from('premium_subscriptions')
          .update({ status: event.event === 'subscription.cancelled' ? 'cancelled' : 'expired' })
          .eq('razorpay_subscription_id', sub.id);
        break;
      }

      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        // For one-time payments (job posts, single-month sponsor): notes.purpose tells us what
        const purpose = payment.notes?.purpose as string | undefined;
        const targetId = payment.notes?.target_id as string | undefined;

        // Defense-in-depth: if the browser-based verify-payment ever fails,
        // this webhook still grants lifetime access using notes.user_id.
        if (purpose === 'lifetime_membership') {
          const userId = payment.notes?.user_id as string | undefined;
          if (userId) {
            const { error: subErr } = await supabase
              .from('premium_subscriptions')
              .upsert(
                {
                  user_id: userId,
                  razorpay_subscription_id: payment.order_id,
                  razorpay_customer_id: payment.id,
                  plan_id: 'lifetime',
                  status: 'active',
                  amount_inr: payment.currency === 'INR' ? payment.amount : 0,
                  current_period_start: new Date().toISOString(),
                  current_period_end: new Date('2099-12-31').toISOString(),
                },
                { onConflict: 'razorpay_subscription_id' }
              );
            if (subErr) {
              console.error('[webhook] lifetime upsert failed:', subErr);
            } else {
              console.log(JSON.stringify({
                type: 'webhook_lifetime_granted',
                user_id: userId,
                order_id: payment.order_id,
                payment_id: payment.id,
                amount: payment.amount,
                currency: payment.currency,
              }));
            }
          } else {
            console.warn('[webhook] lifetime_membership payment with no user_id in notes:', payment.id);
          }
        } else if (purpose === 'sponsored_slot' && targetId) {
          await supabase
            .from('sponsored_slots')
            .update({
              status: 'active',
              razorpay_payment_id: payment.id,
            })
            .eq('id', targetId);
        } else if (purpose === 'job_post' && targetId) {
          await supabase
            .from('job_posts')
            .update({
              is_published: true,
              razorpay_payment_id: payment.id,
            })
            .eq('id', targetId);
        }
        break;
      }

      case 'payment.failed': {
        console.warn('Razorpay payment failed:', event.payload.payment.entity.id);
        break;
      }

      default:
        console.log('Unhandled Razorpay event:', event.event);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Razorpay webhook handler error:', err);
    return NextResponse.json({ ok: false, error: 'Handler failed' }, { status: 500 });
  }
}

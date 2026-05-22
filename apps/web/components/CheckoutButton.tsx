'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, ArrowRight, Check, Sparkles } from 'lucide-react';
import { getSupabaseBrowser } from '../lib/supabase-browser';

// Razorpay's checkout.js is loaded once and exposes window.Razorpay
interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
  close: () => void;
}
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.Razorpay) return resolve();
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay script failed to load'));
    document.head.appendChild(script);
  });
}

interface Props {
  currency: 'INR' | 'USD';
  couponCode?: string | null;
}

export function CheckoutButton({ currency, couponCode }: Props) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'paying' | 'verifying' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Check auth + membership state on mount; listen for changes
  useEffect(() => {
    const supabase = getSupabaseBrowser();

    const sync = async (authed: { id: string } | null) => {
      setSignedIn(!!authed);
      if (!authed) {
        setIsMember(false);
        return;
      }
      // RLS allows the signed-in user to read their own subscription row.
      const { data: sub } = await supabase
        .from('premium_subscriptions')
        .select('id')
        .eq('user_id', authed.id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();
      setIsMember(!!sub);
    };

    supabase.auth.getUser().then(({ data }) => sync(data.user as { id: string } | null));
    const { data: authSub } = supabase.auth.onAuthStateChange((_e, session) => {
      sync((session?.user as { id: string } | null) ?? null);
    });
    return () => authSub.subscription.unsubscribe();
  }, []);

  const startCheckout = async () => {
    setStatus('loading');
    setErrorMsg('');

    // 1. Auth check — must be signed in to attribute the purchase
    if (!signedIn) {
      router.push(`/signup?next=${encodeURIComponent('/pricing')}`);
      return;
    }

    try {
      // 2. Load Razorpay script
      await loadRazorpayScript();

      // 3. Create order on our backend
      const orderRes = await fetch('/api/checkout/lifetime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, coupon_code: couponCode ?? undefined }),
      });
      const orderBody = await orderRes.json();

      if (!orderRes.ok || !orderBody.ok) {
        setErrorMsg(orderBody.message ?? 'Could not start checkout. Try again in a moment.');
        setStatus('error');
        return;
      }

      // 3a. Already a member — server detected an active subscription. Don't re-charge.
      if (orderBody.already_member) {
        setIsMember(true);
        setStatus('done');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1200);
        return;
      }

      // 3b. Free coupon path — no payment needed, membership granted server-side
      if (orderBody.free) {
        setStatus('done');
        setTimeout(() => router.push('/dashboard'), 1200);
        return;
      }

      // 4. Open Razorpay modal with the order_id
      if (!window.Razorpay) {
        setErrorMsg('Razorpay failed to load. Refresh the page and try again.');
        setStatus('error');
        return;
      }

      setStatus('paying');

      const rzp = new window.Razorpay({
        key: orderBody.data.key_id,
        order_id: orderBody.data.order_id,
        amount: orderBody.data.amount,
        currency: orderBody.data.currency,
        name: 'StackPicks',
        description: 'Lifetime membership — full directory access',
        theme: { color: '#c6ff00' },
        prefill: {
          name: orderBody.data.user_name || undefined,
          email: orderBody.data.user_email || undefined,
        },
        notes: { purpose: 'lifetime_membership', coupon: couponCode ?? '' },
        modal: {
          ondismiss: () => {
            setStatus('idle');
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setStatus('verifying');
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                coupon_code: couponCode ?? null,
              }),
            });
            const verifyBody = await verifyRes.json();
            if (!verifyRes.ok || !verifyBody.ok) {
              setErrorMsg(verifyBody.message ?? 'Payment received but verification failed. Email support with payment ID.');
              setStatus('error');
              return;
            }
            setStatus('done');
            setTimeout(() => {
              router.push('/dashboard');
              router.refresh();
            }, 1200);
          } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : 'Verification network error.');
            setStatus('error');
          }
        },
      });

      rzp.on('payment.failed', (response: unknown) => {
        const r = response as { error?: { description?: string } };
        setErrorMsg(r?.error?.description ?? 'Payment failed. Try again or use a different card.');
        setStatus('error');
      });

      rzp.open();
    } catch (err) {
      console.error('[checkout] error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setStatus('error');
    }
  };

  // ---- UI states ----

  // Already a lifetime member — don't show the buy button, route to dashboard instead.
  if (isMember === true) {
    return (
      <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div className="font-bold text-text mb-1">You&apos;re a lifetime member</div>
        <p className="text-xs text-muted mb-3">Full directory + bundles already unlocked.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
        >
          Open dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 mb-2">
          <Check className="w-5 h-5 text-accent" />
        </div>
        <div className="font-bold text-text mb-1">You&apos;re in!</div>
        <p className="text-xs text-muted">Redirecting to your dashboard…</p>
      </div>
    );
  }

  const busy = status === 'loading' || status === 'paying' || status === 'verifying';
  const buttonLabel =
    status === 'loading'   ? 'Starting checkout…' :
    status === 'paying'    ? 'Complete payment in the modal…' :
    status === 'verifying' ? 'Verifying payment…' :
    signedIn === false     ? 'Sign in to checkout' :
                              'Get lifetime access';

  return (
    <>
      <button
        type="button"
        onClick={startCheckout}
        disabled={busy || signedIn === null}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> :
         signedIn === false ? <Lock className="w-4 h-4" /> :
         <ArrowRight className="w-4 h-4" />}
        {buttonLabel}
      </button>

      {errorMsg && (
        <p className="text-xs text-red-400 mt-2 text-center">{errorMsg}</p>
      )}
    </>
  );
}

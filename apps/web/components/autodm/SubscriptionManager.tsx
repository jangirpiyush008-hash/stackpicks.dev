'use client';

/**
 * Subscription manager card — shows the creator's active Razorpay
 * subscription with cancel + change-plan controls.
 *
 * Sourced from the latest row in autodm_subscriptions (passed by the
 * server-rendered dashboard). Server has already filtered for status
 * in ('authenticated','active','created','cancelled').
 *
 * Cancel uses cancel_at_cycle_end=1 — the creator stays on their
 * paid tier until the period ends, then auto-drops to free via webhook.
 *
 * NEVER cancels in-place. The 2-step confirm prevents misclicks since
 * this is destructive (loses the rest of the prepaid month).
 */

import { useState } from 'react';
import { Loader2, CreditCard, AlertTriangle, CheckCircle2, ExternalLink, Calendar } from 'lucide-react';

interface ActiveSubscription {
  id: string;
  razorpay_subscription_id: string;
  plan_tier: 'creator' | 'pro' | 'agency';
  status: string;
  current_end: string | null;   // ISO. Next renewal OR cancellation date if cancel scheduled.
  cancel_at_cycle_end: boolean;
}

const PRICE_INR: Record<string, number> = {
  creator: 499,
  pro: 1499,
  agency: 4999,
};

const RAZORPAY_BILLING_PORTAL = 'https://accounts.razorpay.com/customer/subscriptions';

export function SubscriptionManager({
  subscription,
  currentTier,
}: {
  subscription: ActiveSubscription | null;
  currentTier: string;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmStep, setConfirmStep] = useState<0 | 1>(0);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Free tier — no active sub
  if (!subscription || currentTier === 'free') {
    return (
      <div className="rounded-2xl border border-border bg-bg-card/30 p-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-muted" />
          <h3 className="text-sm font-mono uppercase tracking-widest text-muted">// subscription</h3>
        </div>
        <p className="text-sm text-text mt-2">
          You&apos;re on the <strong className="capitalize">Free</strong> plan.
          Pick a paid tier below to bump caps and unlock LinkedIn + X slots.
        </p>
      </div>
    );
  }

  const cancelScheduled = subscription.cancel_at_cycle_end;
  const isLive = ['active', 'authenticated', 'created'].includes(subscription.status);
  const periodEnd = subscription.current_end
    ? new Date(subscription.current_end).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  async function handleCancel() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/autodm/billing/cancel', { method: 'POST' });
      const j = await res.json();
      if (j.ok) {
        setResult({ ok: true, msg: 'Cancelled. You stay on your current plan until the period ends, then drop to Free automatically.' });
        setConfirmStep(0);
        setTimeout(() => window.location.reload(), 1800);
      } else {
        setResult({ ok: false, msg: j.error || 'Cancel failed. Try the Razorpay portal link below.' });
      }
    } catch (e) {
      setResult({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function handleResume() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/autodm/billing/resume', { method: 'POST' });
      const j = await res.json();
      if (j.ok) {
        setResult({ ok: true, msg: 'Plan resumed. Your subscription will renew normally.' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setResult({ ok: false, msg: j.error || 'Resume failed.' });
      }
    } catch (e) {
      setResult({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`rounded-2xl border ${cancelScheduled ? 'border-amber-500/40 bg-amber-500/5' : 'border-border bg-bg-card/30'} p-5 mb-6`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-muted" />
            <h3 className="text-sm font-mono uppercase tracking-widest text-muted">// subscription</h3>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="text-2xl font-extrabold capitalize">{subscription.plan_tier}</div>
            <div className="text-sm text-muted">₹{PRICE_INR[subscription.plan_tier]}/mo</div>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {isLive && !cancelScheduled && (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Active</span>
                {periodEnd && <span className="text-muted">· renews {periodEnd}</span>}
              </>
            )}
            {cancelScheduled && (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-amber-500 font-semibold">Cancels {periodEnd}</span>
                <span className="text-muted">· drops to Free after</span>
              </>
            )}
            {!isLive && !cancelScheduled && (
              <span className="text-muted">Status: {subscription.status}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={RAZORPAY_BILLING_PORTAL}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text px-3 py-2 rounded-full border border-border"
          >
            Receipts <ExternalLink className="w-3 h-3" />
          </a>
          {!cancelScheduled && isLive && (
            confirmStep === 0 ? (
              <button
                onClick={() => { setConfirmStep(1); setResult(null); }}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-full border border-rose-400/30 hover:border-rose-400/50 transition"
              >
                Cancel plan
              </button>
            ) : (
              <button
                onClick={handleCancel}
                disabled={busy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-bg bg-rose-500 hover:bg-rose-500/90 px-3 py-2 rounded-full disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <AlertTriangle className="w-3 h-3" />}
                Yes, cancel
              </button>
            )
          )}
        </div>
      </div>

      {confirmStep === 1 && !result && !busy && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300">
          <strong>Heads up:</strong> you&apos;ll keep {subscription.plan_tier.toUpperCase()} caps until {periodEnd || 'period end'}, then auto-drop to Free.
          No refund for the current cycle. Click again to confirm, or <button onClick={() => setConfirmStep(0)} className="underline">keep my plan</button>.
        </div>
      )}

      {cancelScheduled && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400 flex items-start gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            Your plan ends on <strong>{periodEnd}</strong>.
            <button
              onClick={handleResume}
              disabled={busy}
              className="ml-2 underline hover:text-amber-300 disabled:opacity-50"
            >
              Keep my plan instead
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className={`mt-3 p-3 rounded-xl text-xs ${result.ok ? 'bg-emerald-500/5 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border border-rose-500/20 text-rose-300'}`}>
          {result.msg}
        </div>
      )}
    </div>
  );
}

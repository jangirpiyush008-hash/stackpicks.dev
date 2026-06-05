'use client';

/**
 * Plan upgrade widget on the AutoDM dashboard. Shows current plan,
 * lets the creator upgrade (POST /api/autodm/billing/subscribe?tier=...)
 * and follow the Razorpay short_url. Webhook flips plan_tier afterward.
 */

import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

type Tier = 'creator' | 'pro' | 'agency';

const TIERS: { id: Tier; label: string; price: string; perks: string[]; highlight?: boolean }[] = [
  {
    id: 'creator', label: 'Creator', price: '₹499/mo',
    perks: ['5,000 DMs/mo', '10 rules', 'No StackPicks branding', 'Daily analytics'],
  },
  {
    id: 'pro', label: 'Pro', price: '₹1,499/mo', highlight: true,
    perks: ['Unlimited DMs + rules', 'Voice-cloned bodies', 'Follow-up agent', 'Spam-shield Pro'],
  },
  {
    id: 'agency', label: 'Agency', price: '₹4,999/mo',
    perks: ['Everything in Pro', 'Multi-account', 'White-label', 'Team seats', 'API access'],
  },
];

export function PlanUpgrade({ currentTier }: { currentTier: string }) {
  const [busy, setBusy] = useState<Tier | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function upgrade(tier: Tier) {
    setBusy(tier);
    try {
      const r = await fetch(`/api/autodm/billing/subscribe?tier=${tier}`, { method: 'POST' });
      const j = (await r.json()) as { ok: boolean; checkout_url?: string; error?: string };
      if (j.ok && j.checkout_url) window.location.href = j.checkout_url;
      else alert(j.error || 'failed to start checkout');
    } finally { setBusy(null); }
  }

  async function cancel() {
    if (!confirm('Cancel at end of current billing cycle?')) return;
    setCancelling(true);
    try {
      const r = await fetch('/api/autodm/billing/cancel', { method: 'POST' });
      const j = (await r.json()) as { ok: boolean; error?: string };
      if (j.ok) alert('Cancelled. You stay on current plan until cycle ends.');
      else alert(j.error || 'failed to cancel');
    } finally { setCancelling(false); }
  }

  const isPaid = currentTier !== 'free';

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Plan</h2>
        {isPaid && (
          <button onClick={cancel} disabled={cancelling}
            className="text-xs text-muted hover:text-rose-400 disabled:opacity-50">
            {cancelling ? 'Cancelling…' : 'Cancel subscription'}
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {TIERS.map((t) => {
          const isCurrent = currentTier === t.id;
          return (
            <div key={t.id}
              className={`rounded-2xl border p-5 ${t.highlight ? 'border-accent bg-accent/5' : 'border-border bg-bg-card/50'} ${isCurrent ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}`}>
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-xs font-mono uppercase tracking-widest text-muted">{t.label}</div>
                {isCurrent && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent text-bg font-semibold">Current</span>}
              </div>
              <div className="text-2xl font-extrabold">{t.price}</div>
              <ul className="mt-3 space-y-1 text-xs">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-accent">✓</span>{p}</li>
                ))}
              </ul>
              <button
                onClick={() => upgrade(t.id)}
                disabled={busy !== null || isCurrent}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md bg-accent text-bg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                  isCurrent ? 'Active' : <>Upgrade <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted mt-3">
        Razorpay subscription · cancel anytime · INR only · GST included where applicable
      </p>
    </div>
  );
}

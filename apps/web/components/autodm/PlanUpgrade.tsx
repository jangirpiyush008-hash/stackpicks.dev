'use client';

/**
 * Plan upgrade widget on the AutoDM dashboard. Shows current plan,
 * lets the creator upgrade and follow the Razorpay short_url. Webhook
 * flips plan_tier afterward.
 *
 * Billing cycle (monthly / yearly) is selectable inline. If the user
 * arrived from the public pricing page via /dashboard?cycle=yearly the
 * toggle defaults to that selection.
 */

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import { BILLING_PRICES, type BillingCycle, type Currency } from '@stackpicks/core/autodm/billing';
import { useCurrency } from './useCurrency';

type Tier = 'creator' | 'pro' | 'agency';

interface TierDef {
  id: Tier;
  label: string;
  accounts: { instagram: number; linkedin: number; x: number };
  perks: string[];
  highlight?: boolean;
}

const TIERS: TierDef[] = [
  {
    id: 'creator', label: 'Creator',
    accounts: { instagram: 1, linkedin: 1, x: 1 },
    perks: ['5,000 DMs/mo', '10 rules', 'No StackPicks branding', 'Daily analytics'],
  },
  {
    id: 'pro', label: 'Pro', highlight: true,
    accounts: { instagram: 3, linkedin: 3, x: 3 },
    perks: ['Unlimited DMs + rules', 'Voice-cloned bodies', 'Follow-up agent', 'Spam-shield Pro'],
  },
  {
    id: 'agency', label: 'Agency',
    accounts: { instagram: 25, linkedin: 25, x: 25 },
    perks: ['Everything in Pro', 'White-label', 'Team seats', 'Priority support'],
  },
];

const fmt = (n: number, cur: Currency) =>
  cur === 'inr' ? `₹${n.toLocaleString('en-IN')}` : `$${n.toLocaleString('en-US')}`;

function priceLabel(tier: Tier, cycle: BillingCycle, cur: Currency) {
  const p = BILLING_PRICES[cur][tier][cycle];
  return cycle === 'yearly' ? `${fmt(p, cur)}/yr` : `${fmt(p, cur)}/mo`;
}

export function PlanUpgrade({ currentTier }: { currentTier: string }) {
  const params = useSearchParams();
  const initialCycle: BillingCycle = params?.get('cycle') === 'yearly' ? 'yearly' : 'monthly';
  const initialCurrencyParam = params?.get('currency');
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const { currency: detected } = useCurrency();
  // URL param wins, else detected currency, else INR fallback.
  const cur: Currency = (() => {
    if (initialCurrencyParam === 'inr' || initialCurrencyParam === 'usd') return initialCurrencyParam;
    if (detected === 'INR') return 'inr';
    if (detected === 'USD') return 'usd';
    return 'inr';
  })();
  const [busy, setBusy] = useState<Tier | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function upgrade(tier: Tier) {
    setBusy(tier);
    try {
      const r = await fetch(`/api/autodm/billing/subscribe?tier=${tier}&cycle=${cycle}&currency=${cur}`, { method: 'POST' });
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

      {/* Monthly / Yearly toggle */}
      <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-bg-card/60 mb-4">
        <button
          type="button"
          onClick={() => setCycle('monthly')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
            cycle === 'monthly' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
          }`}
          aria-pressed={cycle === 'monthly'}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setCycle('yearly')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
            cycle === 'yearly' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
          }`}
          aria-pressed={cycle === 'yearly'}
        >
          Yearly
        </button>
        <span className="ml-2 text-[11px] text-accent font-medium">
          2 months free
        </span>
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
              <div className="text-2xl font-extrabold">{priceLabel(t.id, cycle, cur)}</div>
              {cycle === 'yearly' && (
                <div className="text-[10px] text-accent font-medium mt-0.5">
                  ~{fmt(Math.round(BILLING_PRICES[cur][t.id].yearly / 12), cur)}/mo · 2 months free
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] font-mono">
                <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1 text-center">
                  <div className="text-muted uppercase tracking-wide text-[9px]">IG</div>
                  <div className="font-bold text-sm">{t.accounts.instagram}</div>
                </div>
                <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1 text-center">
                  <div className="text-muted uppercase tracking-wide text-[9px]">LinkedIn</div>
                  <div className="font-bold text-sm">{t.accounts.linkedin}</div>
                </div>
                <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1 text-center">
                  <div className="text-muted uppercase tracking-wide text-[9px]">X</div>
                  <div className="font-bold text-sm">{t.accounts.x}</div>
                </div>
              </div>

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
      <p className="text-[11px] text-muted mt-1">
        Instagram is live today. LinkedIn + X support ships Q3 2026 — quotas listed above stay
        the same when those platforms unlock.
      </p>
    </div>
  );
}

'use client';

/**
 * The 4-card pricing grid on the AutoDM landing page. Server component
 * can't manage selection state or read geo, so this is the client island.
 * - Pro starts as highlighted + pinned "Recommended" badge (editorial).
 * - Clicking a card promotes it to the highlighted spot.
 * - Each card has its own CTA that routes to /dashboard with the right
 *   tier + currency in the URL (Free goes to /signup).
 * - Currency is geo-decided via useCurrency() — Indian visitors see ₹,
 *   everyone else sees $. No visible toggle.
 */

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BILLING_PRICES, type Currency } from '@stackpicks/core/autodm/billing';
import { useCurrency } from './useCurrency';

type TierId = 'free' | 'creator' | 'pro' | 'agency';

interface PlanDef {
  id: TierId;
  tier: string;
  dms: string;
  rules: string;
  accounts: { instagram: number; linkedin: number; x: number };
  feats: string[];
  ctaLabel: string;
}

const PLANS: PlanDef[] = [
  {
    id: 'free', tier: 'Free', dms: '50 DMs/day', rules: '1 rule',
    accounts: { instagram: 1, linkedin: 0, x: 0 },
    feats: ['Email support', 'AI rule drafting', '4h follow-up'],
    ctaLabel: 'Get started free',
  },
  {
    id: 'creator', tier: 'Creator', dms: '200 DMs/day', rules: 'Unlimited rules',
    accounts: { instagram: 1, linkedin: 1, x: 1 },
    feats: ['Brand-free DMs', 'Click tracking + CRM', 'Auto A/B testing'],
    ctaLabel: 'Pick Creator',
  },
  {
    id: 'pro', tier: 'Pro', dms: '1,000 DMs/day', rules: 'Unlimited rules',
    accounts: { instagram: 3, linkedin: 3, x: 3 },
    feats: ['Image-aware DMs', 'Voice cloning', '5-turn AI follow-up', 'Daily AI digest'],
    ctaLabel: 'Pick Pro',
  },
  {
    id: 'agency', tier: 'Agency', dms: '5,000 DMs/day', rules: 'Unlimited rules',
    accounts: { instagram: 25, linkedin: 25, x: 25 },
    feats: ['Everything in Pro', 'Manage many accounts', 'Priority support'],
    ctaLabel: 'Pick Agency',
  },
];

const RECOMMENDED: TierId = 'pro';

function priceFor(id: TierId, cur: Currency): string {
  if (id === 'free') return cur === 'inr' ? '₹0' : '$0';
  const price = BILLING_PRICES[cur][id].monthly;
  return cur === 'inr'
    ? `₹${price.toLocaleString('en-IN')}/mo`
    : `$${price}/mo`;
}

function ctaHrefFor(id: TierId, cur: Currency): string {
  if (id === 'free') return '/signup';
  return `/dashboard?cycle=monthly&tier=${id}&currency=${cur}`;
}

export function HomePlanCards() {
  const [selected, setSelected] = useState<TierId>(RECOMMENDED);
  const { currency } = useCurrency();
  // Default to USD pre-resolution so non-Indian visitors never flash ₹.
  const cur: Currency = currency === 'INR' ? 'inr' : 'usd';

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PLANS.map((p) => {
        const isSelected = selected === p.id;
        const isRecommended = p.id === RECOMMENDED;
        return (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`relative text-left rounded-2xl border p-6 flex flex-col cursor-pointer transition ${
              isSelected
                ? 'border-accent bg-accent/5 shadow-[0_0_60px_-15px_rgba(74,222,128,0.25)]'
                : 'border-border bg-bg-card/50 hover:border-accent/40'
            }`}
          >
            {isRecommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-accent text-bg text-[10px] font-mono uppercase tracking-wider whitespace-nowrap">
                Recommended
              </div>
            )}
            <div className="text-xs font-mono uppercase tracking-widest text-muted">{p.tier}</div>
            <div className="text-3xl font-extrabold mt-2">{priceFor(p.id, cur)}</div>
            <div className="text-sm text-muted mt-3">{p.dms}</div>
            <div className="text-sm text-muted">{p.rules}</div>

            <div className="mt-4 grid grid-cols-3 gap-1 text-[10px] font-mono">
              <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1.5 text-center">
                <div className="text-muted uppercase tracking-wide text-[9px]">IG</div>
                <div className="font-bold text-base">{p.accounts.instagram}</div>
              </div>
              <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1.5 text-center">
                <div className="text-muted uppercase tracking-wide text-[9px]">LinkedIn</div>
                <div className="font-bold text-base">{p.accounts.linkedin}</div>
              </div>
              <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1.5 text-center">
                <div className="text-muted uppercase tracking-wide text-[9px]">X</div>
                <div className="font-bold text-base">{p.accounts.x}</div>
              </div>
            </div>

            <ul className="mt-4 space-y-1 text-sm flex-1">
              {p.feats.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-accent">✓</span>{f}</li>
              ))}
            </ul>

            <Link
              href={ctaHrefFor(p.id, cur)}
              onClick={(e) => e.stopPropagation()}
              className={`mt-5 inline-flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isRecommended
                  ? 'bg-accent text-bg hover:opacity-90'
                  : 'border border-border bg-surface/60 hover:border-accent hover:text-accent'
              }`}
            >
              {p.ctaLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}

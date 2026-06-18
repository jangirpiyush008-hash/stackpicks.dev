'use client';

/**
 * The 4-card pricing grid on the AutoDM landing page. Server component
 * can't manage selection state, so this is the client island. Pro starts
 * selected (matches the "Recommended" badge); clicking any other card
 * promotes it to the highlighted spot.
 *
 * Visual highlight = accent border + tinted background + soft glow. The
 * "Recommended" badge stays pinned to Pro regardless of selection — it's
 * editorial, not user-driven.
 */

import { useState } from 'react';

type TierId = 'free' | 'creator' | 'pro' | 'agency';

interface PlanDef {
  id: TierId;
  tier: string;
  price: string;
  dms: string;
  rules: string;
  accounts: { instagram: number; linkedin: number; x: number };
  feats: string[];
}

const PLANS: PlanDef[] = [
  {
    id: 'free', tier: 'Free', price: '₹0', dms: '100 DMs/mo', rules: '1 rule',
    accounts: { instagram: 1, linkedin: 0, x: 0 },
    feats: ['Email support'],
  },
  {
    id: 'creator', tier: 'Creator', price: '₹499/mo', dms: '5,000 DMs/mo', rules: '10 rules',
    accounts: { instagram: 1, linkedin: 1, x: 1 },
    feats: ['Brand-free DMs', 'Public + private reply', 'Daily analytics'],
  },
  {
    id: 'pro', tier: 'Pro', price: '₹1,499/mo', dms: 'Unlimited', rules: 'Unlimited',
    accounts: { instagram: 3, linkedin: 3, x: 3 },
    feats: ['AI-generated DMs', 'Voice cloning', 'Follow-up agent', 'Spam-shield Pro'],
  },
  {
    id: 'agency', tier: 'Agency', price: '₹4,999/mo', dms: 'Unlimited', rules: 'Unlimited',
    accounts: { instagram: 25, linkedin: 25, x: 25 },
    feats: ['White-label', 'Team seats', 'Priority support', 'Onboarding call'],
  },
];

const RECOMMENDED: TierId = 'pro';

export function HomePlanCards() {
  const [selected, setSelected] = useState<TierId>(RECOMMENDED);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PLANS.map((p) => {
        const isSelected = selected === p.id;
        const isRecommended = p.id === RECOMMENDED;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            aria-pressed={isSelected}
            className={`relative text-left rounded-2xl border p-6 transition cursor-pointer ${
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
            <div className="text-3xl font-extrabold mt-2">{p.price}</div>
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

            <ul className="mt-4 space-y-1 text-sm">
              {p.feats.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-accent">✓</span>{f}</li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}

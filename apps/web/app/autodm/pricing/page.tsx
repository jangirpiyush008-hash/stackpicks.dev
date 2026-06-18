// AutoDM pricing page — public, no login required.
// Lives at autodm.stackpicks.dev/pricing.
//
// Geo-aware: Indian visitors see ₹ prices (Razorpay UPI/Indian card),
// everyone else sees $ prices (Razorpay international card). Detection
// is VPN-aware via ipapi.co; a [$/₹] toggle lets the visitor override
// (persisted to localStorage).
//
// Monthly/Yearly toggle: yearly = 10× monthly (2 months free).
// Yearly subscribers also get +25% DM caps automatically.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Sparkles, MessageSquare, Mail } from 'lucide-react';
import {
  BILLING_PRICES,
  YEARLY_CAP_BONUS,
  type BillingCycle,
  type Currency as PlanCurrency,
} from '@stackpicks/core/autodm/billing';
import { DEFAULT_PLAN_CAPS } from '@stackpicks/core/autodm/types';
import { CONTACT } from '@stackpicks/core/constants';
import { useCurrency } from '@/components/autodm/useCurrency';

const SUPPORT_EMAIL = CONTACT.email;

type TierKey = 'free' | 'creator' | 'pro' | 'agency' | 'enterprise';

interface Tier {
  key: TierKey;
  name: string;
  pitch: string;
  price: (cycle: BillingCycle, cur: PlanCurrency) => { label: string; cadence: string; subline?: string };
  cta: (cycle: BillingCycle, cur: PlanCurrency) => { label: string; href: string; mailto?: boolean };
  highlight?: boolean;
  features: string[];
}

const F = DEFAULT_PLAN_CAPS;

const fmtINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const fmtUSD = (n: number) => `$${n.toLocaleString('en-US')}`;
const fmt = (n: number, cur: PlanCurrency) => (cur === 'inr' ? fmtINR(n) : fmtUSD(n));

function yearlyPerksFor(tier: TierKey): string[] {
  if (!['creator', 'pro', 'agency'].includes(tier)) return [];
  const pct = Math.round(YEARLY_CAP_BONUS * 100);
  return [
    `+${pct}% DM caps (auto-applied)`,
    'Locked launch pricing for life',
    'Early access to LinkedIn + X seats',
  ];
}

const TIERS: Tier[] = [
  {
    key: 'free',
    name: 'Free',
    pitch: 'For testing the waters or hobby creators.',
    price: () => ({ label: 'Free', cadence: 'forever' }),
    cta: () => ({ label: 'Get started free', href: '/signup' }),
    features: [
      `${F.free.daily} DMs/day · ${F.free.hourly} DMs/hour`,
      '1 Instagram account',
      'AI rule drafting in your voice',
      '4-hour follow-up that re-sends your link',
      'Hinglish + multi-language auto-detect',
    ],
  },
  {
    key: 'creator',
    name: 'Creator',
    pitch: 'For solo creators with one active IG account.',
    price: (c, cur) => {
      const p = BILLING_PRICES[cur].creator[c];
      return c === 'yearly'
        ? { label: fmt(p, cur), cadence: 'per year', subline: `~${fmt(Math.round(p / 12), cur)}/mo · 2 months free` }
        : { label: fmt(p, cur), cadence: 'per month' };
    },
    cta: (c, cur) => ({ label: 'Pick Creator', href: `/dashboard?cycle=${c}&tier=creator&currency=${cur}` }),
    features: [
      `${F.creator.daily} DMs/day · ${F.creator.hourly} DMs/hour`,
      '1 Instagram + 1 LinkedIn + 1 X account',
      'Click tracking + lightweight CRM',
      'Auto A/B testing (up to 3 variants)',
      'Email digest of activity',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    pitch: 'For full-time creators running several accounts.',
    highlight: true,
    price: (c, cur) => {
      const p = BILLING_PRICES[cur].pro[c];
      return c === 'yearly'
        ? { label: fmt(p, cur), cadence: 'per year', subline: `~${fmt(Math.round(p / 12), cur)}/mo · 2 months free` }
        : { label: fmt(p, cur), cadence: 'per month' };
    },
    cta: (c, cur) => ({ label: 'Pick Pro', href: `/dashboard?cycle=${c}&tier=pro&currency=${cur}` }),
    features: [
      `${F.pro.daily.toLocaleString('en-IN')} DMs/day · ${F.pro.hourly} DMs/hour`,
      '3 Instagram + 3 LinkedIn + 3 X accounts',
      'Image-aware DMs (AI reads the post)',
      '5-turn conversational follow-up agent',
      'Daily AI digest of hot leads',
      'Spam-shield Pro + webhook health alerts',
    ],
  },
  {
    key: 'agency',
    name: 'Agency',
    pitch: 'For agencies running DMs for many client brands.',
    price: (c, cur) => {
      const p = BILLING_PRICES[cur].agency[c];
      return c === 'yearly'
        ? { label: fmt(p, cur), cadence: 'per year', subline: `~${fmt(Math.round(p / 12), cur)}/mo · 2 months free` }
        : { label: fmt(p, cur), cadence: 'per month' };
    },
    cta: (c, cur) => ({ label: 'Pick Agency', href: `/dashboard?cycle=${c}&tier=agency&currency=${cur}` }),
    features: [
      `${F.agency.daily.toLocaleString('en-IN')} DMs/day · ${F.agency.hourly} DMs/hour`,
      '25 IG + 25 LinkedIn + 25 X accounts',
      'Manage many accounts under one login',
      'Everything in Pro',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    pitch: 'For platforms, networks, and 100+ account operators.',
    price: () => ({ label: 'Custom', cadence: 'annual' }),
    cta: () => ({
      label: 'Talk to us',
      href: `mailto:${SUPPORT_EMAIL}?subject=AutoDM%20Enterprise%20enquiry`,
      mailto: true,
    }),
    features: [
      'Unlimited DM volume (subject to Meta caps)',
      'Unlimited connected accounts',
      'Custom SLA + direct line to the team',
      'Everything in Agency',
    ],
  },
];

export default function AutoDmPricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const { currency, setCurrency, ready } = useCurrency();
  const cur: PlanCurrency = currency === 'INR' ? 'inr' : 'usd';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-10 md:mb-14 relative">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[300px] bg-accent/20 rounded-full blur-[120px]" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Launch pricing — locked for everyone who signs up now</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
          Reply to every Instagram comment.{' '}
          <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Automatically.
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-4 mb-7">
          Start free. Upgrade when you outgrow the cap. Cancel any time — no
          annual lock-in, no setup fees, no surprise charges.
        </p>

        {/* Monthly / Yearly toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-surface/60 backdrop-blur">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              cycle === 'monthly' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
            }`}
            aria-pressed={cycle === 'monthly'}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle('yearly')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              cycle === 'yearly' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
            }`}
            aria-pressed={cycle === 'yearly'}
          >
            Yearly
          </button>
        </div>
        <div className="mt-2 text-[11px] text-accent font-medium">
          Yearly = 2 months free
        </div>

        {/* Currency override — geo defaults but VPN users / Indians on foreign cards can flip */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted">
          <span>Showing prices in</span>
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-md border border-border bg-surface/40">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              disabled={!ready}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                cur === 'usd' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
              }`}
            >
              $ USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              disabled={!ready}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                cur === 'inr' ? 'bg-accent text-bg' : 'text-muted hover:text-text'
              }`}
            >
              ₹ INR
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 mb-10 md:grid-cols-2 lg:grid-cols-3">
        {TIERS.filter((t) => !(cycle === 'yearly' && t.key === 'free')).map((t) => {
          const price = t.price(cycle, cur);
          const cta = t.cta(cycle, cur);
          return (
            <div
              key={t.key}
              className={`relative rounded-2xl border p-6 md:p-7 flex flex-col ${
                t.highlight
                  ? 'border-accent/60 bg-accent/5 shadow-[0_0_60px_-15px_rgba(74,222,128,0.25)]'
                  : 'border-border bg-surface/40'
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-accent text-bg text-[10px] font-mono uppercase tracking-wider">
                  Most popular
                </div>
              )}
              <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
                {t.name}
              </div>
              <h2 className="text-2xl font-bold mb-1 flex items-baseline gap-1.5">
                <span>{price.label}</span>
                <span className="text-xs text-muted font-normal">{price.cadence}</span>
              </h2>
              {price.subline ? (
                <div className="text-[11px] text-accent font-medium mb-2">{price.subline}</div>
              ) : (
                <div className="h-[16px] mb-2" />
              )}
              <p className="text-sm text-muted mb-5 leading-relaxed">{t.pitch}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
                {cycle === 'yearly' && yearlyPerksFor(t.key).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-accent font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              {cta.mailto ? (
                <a
                  href={cta.href}
                  className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    t.highlight
                      ? 'bg-accent text-bg hover:opacity-90'
                      : 'border border-border bg-surface/60 hover:border-accent hover:text-accent'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  {cta.label}
                </a>
              ) : (
                <Link
                  href={cta.href}
                  className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    t.highlight
                      ? 'bg-accent text-bg hover:opacity-90'
                      : 'border border-border bg-surface/60 hover:border-accent hover:text-accent'
                  }`}
                >
                  {cta.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8 mb-10">
        <div className="grid sm:grid-cols-3 gap-5 text-sm">
          <div>
            <div className="text-text font-semibold mb-1">No long-term lock-in</div>
            <div className="text-muted">Cancel from your dashboard any time. The next auto-debit stops immediately.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">7-day refund window</div>
            <div className="text-muted">If AutoDM isn&apos;t working for you in the first 7 days, email us and we refund — no questions.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">Pay in your currency</div>
            <div className="text-muted">{cur === 'inr' ? 'UPI Autopay, Indian card, net-banking via Razorpay. GST invoice on request.' : 'International card via Razorpay. Auto-converted at the live rate at each charge.'}</div>
          </div>
        </div>
      </div>

      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Quick questions
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-text font-semibold mb-1">How much do I actually save on yearly?</div>
            <div className="text-muted">Two months free. Yearly is 10× the monthly price instead of 12×, plus you get +25% DM caps automatically.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">What counts as a DM?</div>
            <div className="text-muted">Every outbound message AutoDM sends in response to a comment counts as one DM. Follow-ups count separately.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">Can I change plans later?</div>
            <div className="text-muted">Yes. Upgrade any time from your dashboard — change takes effect on the next billing cycle. Downgrades apply at the end of your current cycle.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">Do you support LinkedIn and X today?</div>
            <div className="text-muted">Instagram is fully live. LinkedIn and X seats are reserved on paid plans and ship in the next product update.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">Where do I read the refund policy?</div>
            <div className="text-muted">
              Full details on the{' '}
              <Link href="/refund" className="text-accent underline underline-offset-2">refund policy page</Link>.
              For anything else, email <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent underline underline-offset-2">{SUPPORT_EMAIL}</a>.
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-muted">
          Still have questions?{' '}
          <Link href="/contact" className="text-accent underline underline-offset-2">Contact us</Link>
          {' · '}
          <Link href="/terms" className="hover:text-text">Terms</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-text">Privacy</Link>
          {' · '}
          <Link href="/shipping" className="hover:text-text">Service delivery</Link>
        </div>
      </section>
    </div>
  );
}

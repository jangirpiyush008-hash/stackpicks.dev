// AutoDM pricing page — public, no login required.
// Lives at autodm.stackpicks.dev/pricing.
//
// Five tiers: Free, Creator (₹499), Pro (₹1499), Agency (₹4999), Enterprise (contact).
// Numbers + caps come from core/autodm/billing + types so a cap change in code
// auto-reflects here.

import Link from 'next/link';
import { ArrowRight, Check, Sparkles, MessageSquare, Mail } from 'lucide-react';
import { BILLING_PRICES_INR } from '@stackpicks/core/autodm/billing';
import { DEFAULT_PLAN_CAPS } from '@stackpicks/core/autodm/types';
import { CONTACT } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Pricing — StackPicks AutoDM',
  description: 'Instagram comment-to-DM automation. Free to start. Paid plans from ₹499/mo. Cancel anytime, no lock-in.',
};

type Tier = {
  key: 'free' | 'creator' | 'pro' | 'agency' | 'enterprise';
  name: string;
  pitch: string;
  priceLabel: string;
  cadence: string;
  cta: { label: string; href: string };
  highlight?: boolean;
  features: string[];
};

const F = DEFAULT_PLAN_CAPS;

const TIERS: Tier[] = [
  {
    key: 'free',
    name: 'Free',
    pitch: 'For testing the waters or hobby creators.',
    priceLabel: '₹0',
    cadence: 'forever',
    cta: { label: 'Get started free', href: '/signup' },
    features: [
      `${F.free.daily} DMs/day · ${F.free.hourly} DMs/hour`,
      '1 Instagram account',
      'AI rule drafting in your voice',
      '4-hour follow-up that re-sends your link',
      'Spam-shield + account warming',
    ],
  },
  {
    key: 'creator',
    name: 'Creator',
    pitch: 'For solo creators with one active IG account.',
    priceLabel: `₹${BILLING_PRICES_INR.creator}`,
    cadence: 'per month',
    cta: { label: 'Pick Creator', href: '/dashboard' },
    features: [
      `${F.creator.daily} DMs/day · ${F.creator.hourly} DMs/hour`,
      '1 Instagram + 1 LinkedIn + 1 X account',
      'Unlimited rules and follow-ups',
      'Click tracking + lightweight CRM',
      'Email digest of activity',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    pitch: 'For full-time creators running several accounts.',
    priceLabel: `₹${BILLING_PRICES_INR.pro.toLocaleString('en-IN')}`,
    cadence: 'per month',
    highlight: true,
    cta: { label: 'Pick Pro', href: '/dashboard' },
    features: [
      `${F.pro.daily.toLocaleString('en-IN')} DMs/day · ${F.pro.hourly} DMs/hour`,
      '3 Instagram + 3 LinkedIn + 3 X accounts',
      'Priority worker (faster reply latency)',
      'Webhook health alerts',
      'Priority email support',
    ],
  },
  {
    key: 'agency',
    name: 'Agency',
    pitch: 'For agencies running DMs for many client brands.',
    priceLabel: `₹${BILLING_PRICES_INR.agency.toLocaleString('en-IN')}`,
    cadence: 'per month',
    cta: { label: 'Pick Agency', href: '/dashboard' },
    features: [
      `${F.agency.daily.toLocaleString('en-IN')} DMs/day · ${F.agency.hourly} DMs/hour`,
      '25 IG + 25 LinkedIn + 25 X accounts',
      'White-glove onboarding for your clients',
      'Dedicated Slack/WhatsApp channel',
      'Custom rule templates on request',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    pitch: 'For platforms, networks, and 100+ account operators.',
    priceLabel: 'Custom',
    cadence: 'annual',
    cta: { label: 'Talk to us', href: `mailto:${CONTACT.email}?subject=AutoDM%20Enterprise%20enquiry` },
    features: [
      'Unlimited DM volume (subject to Meta caps)',
      'Unlimited connected accounts',
      'Custom SLA + invoiced billing',
      'Single sign-on (SSO) on request',
      'Direct line to the founder',
    ],
  },
];

export default function AutoDmPricingPage() {
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
        <p className="text-base md:text-lg text-muted max-w-2xl mx-auto px-4">
          Start free. Upgrade when you outgrow the cap. Cancel any time — no
          annual lock-in, no setup fees, no surprise charges.
        </p>
      </header>

      <div className="grid gap-5 mb-10 md:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((t) => (
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
            <h2 className="text-2xl font-bold mb-2 flex items-baseline gap-1.5">
              <span>{t.priceLabel}</span>
              <span className="text-xs text-muted font-normal">{t.cadence}</span>
            </h2>
            <p className="text-sm text-muted mb-5 leading-relaxed">{t.pitch}</p>

            <ul className="space-y-2 mb-6 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {t.cta.href.startsWith('mailto:') ? (
              <a
                href={t.cta.href}
                className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  t.highlight
                    ? 'bg-accent text-bg hover:opacity-90'
                    : 'border border-border bg-surface/60 hover:border-accent hover:text-accent'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                {t.cta.label}
              </a>
            ) : (
              <Link
                href={t.cta.href}
                className={`inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  t.highlight
                    ? 'bg-accent text-bg hover:opacity-90'
                    : 'border border-border bg-surface/60 hover:border-accent hover:text-accent'
                }`}
              >
                {t.cta.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Trust strip */}
      <div className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8 mb-10">
        <div className="grid sm:grid-cols-3 gap-5 text-sm">
          <div>
            <div className="text-text font-semibold mb-1">No long-term lock-in</div>
            <div className="text-muted">Cancel from your dashboard any time. Razorpay stops the next auto-debit immediately.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">7-day refund window</div>
            <div className="text-muted">If AutoDM isn&apos;t working for you in the first 7 days, email us and we refund — no questions.</div>
          </div>
          <div>
            <div className="text-text font-semibold mb-1">India-first billing</div>
            <div className="text-muted">UPI Autopay, eMandate, and cards via Razorpay. GST invoice on request.</div>
          </div>
        </div>
      </div>

      {/* FAQs — kept short, link to refund/contact for deep dives */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Quick questions
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-text font-semibold mb-1">What counts as a DM?</div>
            <div className="text-muted">Every outbound message AutoDM sends in response to a comment counts as one DM. Follow-ups count separately. Your daily and hourly caps are above.</div>
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
              For anything else, email <a href={`mailto:${CONTACT.email}`} className="text-accent underline underline-offset-2">{CONTACT.email}</a>.
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

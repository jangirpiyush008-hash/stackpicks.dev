import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { PRICING } from '@stackpicks/core/constants';
import { GeoPricingCard } from '../../components/GeoPricingCard';

export const metadata = {
  title: 'Pricing — lifetime membership for ₹99',
  description: 'StackPicks lifetime membership is ₹99 in India, $2.99 internationally. One-time payment, no renewals — full directory, all stack bundles, weekly analyses.',
};

const INR_DISPLAY = (PRICING.premium_lifetime.amount_inr_paise / 100).toLocaleString('en-IN');
const USD_DISPLAY = (PRICING.premium_lifetime.amount_usd_cents / 100).toFixed(2);

const FEATURES_FREE = [
  '6 sample tool listings per category',
  'Live GitHub preview for any repo',
  'A few open stack bundles to browse',
  'AI-agent setup guide',
  'Sponsored placements clearly labelled',
];

const FEATURES_PREMIUM = [
  'Everything in Free',
  'Full directory unlocked — 100+ curated tool listings',
  'All 13 ready-to-ship stack bundles (SaaS, Mobile, AI agent, scraper, e-commerce, more)',
  'Every "use this if" + "skip if" analyst judgment in full',
  'Weekly long-form analyses (2,000+ words)',
  'Members-only curated collections',
  'Sponsor-free newsletter',
  'Early access to new tool listings & categories',
  'Private members-only Discord',
  'Priority email support from the editorial team',
  'Lifetime — pay once, full access forever',
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-10 md:mb-14 relative">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/20 rounded-full blur-[120px]" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Launch pricing — locked for everyone who pays now</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
          Pay once.{' '}
          <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Use forever.
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted max-w-xl mx-auto px-4">
          No recurring billing, no annual renewals, no &ldquo;your trial ends in 3 days&rdquo;
          emails. One small price, lifetime access to the full directory service.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Free forever</div>
          <h2 className="text-2xl font-bold mb-2">Sample</h2>
          <p className="text-muted text-sm mb-6">A taste — enough to see the curation quality.</p>
          <div className="mb-6">
            <div className="text-4xl font-bold">₹0</div>
            <div className="text-xs text-muted">Always</div>
          </div>
          <Link
            href="/preview"
            className="block text-center px-5 py-2.5 rounded-lg border border-border hover:border-text transition font-medium"
          >
            Browse the sample
          </Link>
          <ul className="mt-6 space-y-2.5">
            {FEATURES_FREE.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium — geo-aware client component */}
        <GeoPricingCard inrDisplay={INR_DISPLAY} usdDisplay={USD_DISPLAY} features={FEATURES_PREMIUM} />
      </div>

      {/* FAQ */}
      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl font-bold mb-6">Honest questions, direct answers</h2>
        <div className="space-y-3">
          <Faq q="Lifetime really means lifetime?">
            Yes — one payment, no renewals, no upsells. &ldquo;Lifetime&rdquo; means as long as
            StackPicks operates. If we ever shut down, we&apos;ll give at least 30 days&apos;
            notice and a data export. See <Link href="/terms" className="text-accent underline underline-offset-2">Terms §5</Link>.
          </Faq>
          <Faq q="Why so cheap?">
            Because we&apos;d rather have 10,000 members at ₹99 than 100 at ₹999. The math works
            once volume hits — and at this price you don&apos;t have to think about whether
            it&apos;s worth it. The directory itself stays free; premium funds the deep editorial
            work.
          </Faq>
          <Faq q="What if I don't like it?">
            Email us within 7 days for a full refund, no questions asked. See <Link href="/refund" className="text-accent underline underline-offset-2">Refund policy</Link>.
          </Faq>
          <Faq q="GST invoice?">
            Yes, with a valid GSTIN on file we generate a tax invoice automatically. Useful if
            you&apos;re expensing it.
          </Faq>
          <Faq q="Is the price going up later?">
            Likely yes, once we have a few thousand premium members and the editorial library is
            bigger. Anyone who buys at launch keeps lifetime access at the launch rate. Founding-member
            rate is locked.
          </Faq>
          <Faq q="Do you do team licences?">
            Not yet. If you have a team that needs 5+ seats, email us — we&apos;ll figure something out.
          </Faq>
        </div>
      </section>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-border bg-surface/40 p-5 open:border-accent/40 transition">
      <summary className="cursor-pointer font-semibold text-text flex items-center justify-between gap-3">
        <span>{q}</span>
        <span className="text-muted text-sm group-open:rotate-45 transition shrink-0">+</span>
      </summary>
      <div className="mt-3 text-sm text-muted leading-relaxed">{children}</div>
    </details>
  );
}

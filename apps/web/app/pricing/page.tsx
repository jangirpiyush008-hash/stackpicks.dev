import Link from 'next/link';
import { Check, Sparkles, IndianRupee, Globe } from 'lucide-react';
import { PRICING } from '@stackpicks/core/constants';

export const metadata = {
  title: 'Pricing — one payment, lifetime access',
  description: 'Premium membership is ₹99 one-time for India, $1.99 for international. Lifetime access. No recurring billing, no surprise renewals.',
};

const INR = (PRICING.premium_lifetime.amount_inr_paise / 100).toLocaleString('en-IN');
const USD = (PRICING.premium_lifetime.amount_usd_cents / 100).toFixed(2);

const FEATURES_FREE = [
  'Full directory of 100+ curated repos',
  'Every category, every curator take',
  '"Use this if" + "Skip if" on every entry',
  'Live GitHub stats refreshed nightly',
  'Sponsored slots labelled clearly',
];

const FEATURES_PREMIUM = [
  'Everything in Free',
  'Weekly long-form deep-dives (2,000+ words each)',
  'Members-only curated collections (the actual stacks we ship with)',
  'Newsletter without sponsor blocks',
  'Early access to new categories and tools',
  'Private members-only Discord',
  'Priority email support',
  'Lifetime — pay once, forever access',
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <header className="text-center mb-14 relative">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/20 rounded-full blur-[120px]" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Launch pricing — locked for everyone who pays now</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
          Pay once.{' '}
          <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Use forever.
          </span>
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto">
          No subscriptions, no annual renewals, no &ldquo;your trial ends in 3 days&rdquo; emails.
          One small price, lifetime access to the deep collections.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {/* Free */}
        <div className="rounded-2xl border border-border bg-surface/40 p-8">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Free forever</div>
          <h2 className="text-2xl font-bold mb-2">The directory</h2>
          <p className="text-muted text-sm mb-6">Everything a casual reader needs.</p>
          <div className="mb-6">
            <div className="text-4xl font-bold">₹0</div>
            <div className="text-xs text-muted">Always</div>
          </div>
          <Link
            href="/preview"
            className="block text-center px-5 py-2.5 rounded-lg border border-border hover:border-text transition font-medium"
          >
            Browse the directory
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

        {/* Premium */}
        <div className="relative rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/10 via-surface/40 to-transparent p-8 shadow-xl shadow-accent/10">
          <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-accent text-bg text-[10px] font-mono uppercase tracking-wider font-bold">
            Lifetime
          </div>
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Premium</div>
          <h2 className="text-2xl font-bold mb-2">The whole stack</h2>
          <p className="text-muted text-sm mb-6">
            Pay once. Get every collection, every deep-dive, forever.
          </p>
          <div className="mb-6 flex items-baseline gap-4">
            <div>
              <div className="flex items-baseline gap-1 text-accent">
                <IndianRupee className="w-7 h-7" />
                <span className="text-5xl font-bold tracking-tighter">{INR}</span>
              </div>
              <div className="text-xs text-muted mt-1">India · UPI / Cards / Netbanking</div>
            </div>
            <div className="text-muted text-sm">or</div>
            <div>
              <div className="flex items-baseline gap-1 text-text">
                <Globe className="w-5 h-5 text-muted" />
                <span className="text-3xl font-bold tracking-tighter">${USD}</span>
              </div>
              <div className="text-xs text-muted mt-1">International · Cards</div>
            </div>
          </div>
          <Link
            href="/contact"
            className="block text-center px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition"
          >
            Get lifetime access
          </Link>
          <p className="text-[11px] text-center text-muted mt-2">
            Razorpay checkout · 7-day full refund · GSTIN invoice on request
          </p>
          <ul className="mt-6 space-y-2.5">
            {FEATURES_PREMIUM.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className={f === 'Everything in Free' ? 'text-muted' : 'text-text'}>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Honest questions, direct answers</h2>
        <div className="space-y-4">
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
            bigger. Anyone who buys at ₹99 keeps lifetime access at ₹99. Founding-member rate is
            locked.
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
      <summary className="cursor-pointer font-semibold text-text flex items-center justify-between">
        <span>{q}</span>
        <span className="text-muted text-sm group-open:rotate-45 transition">+</span>
      </summary>
      <div className="mt-3 text-sm text-muted leading-relaxed">{children}</div>
    </details>
  );
}

import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { GeoPrice } from './GeoPrice';

/**
 * Inline subscription CTA — drop into any SEO/free content page to push
 * readers toward /pricing. Geo-aware (₹99 IN / $2.99 elsewhere via GeoPrice).
 *
 * Variants:
 *  - `compact`: small inline block, fits mid-content (after 3rd list item)
 *  - `full`:    end-of-page block with social proof + bullet benefits
 *
 * Goal: convert SEO traffic to ₹99/$2.99 lifetime sales. Do NOT render when
 *       `isMember` is true — paid members shouldn't see "upgrade" prompts.
 */

interface Props {
  isMember?: boolean;
  variant?: 'compact' | 'full';
  /** Optional override for the headline. Defaults to a conversion-tuned line. */
  headline?: string;
  /** Optional source tag for analytics — appended as ?from=... on /pricing link. */
  source?: string;
}

export function SubscriptionCta({
  isMember = false,
  variant = 'full',
  headline,
  source,
}: Props) {
  if (isMember) return null; // hide from paid members

  const pricingHref = source ? `/pricing?from=${source}` : '/pricing';

  if (variant === 'compact') {
    return (
      <aside
        aria-label="Get lifetime access"
        className="my-6 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/[0.08] via-accent/[0.04] to-transparent p-5 md:p-6"
      >
        <div className="flex items-start gap-3 flex-wrap">
          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="flex-1 min-w-[260px]">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-1">
              Stop reading roundups
            </div>
            <h3 className="text-base md:text-lg font-bold leading-snug mb-1">
              {headline ?? 'Get the full directory — 165+ repos, 89 MCPs, 13 stack bundles'}
            </h3>
            <p className="text-xs md:text-sm text-muted leading-relaxed">
              One payment. Lifetime access. No subscription.
            </p>
          </div>
          <Link
            href={pricingHref}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-accent text-bg font-semibold text-sm hover:opacity-90 transition whitespace-nowrap shadow-[0_8px_24px_-8px_rgba(198,255,0,0.4)]"
          >
            <GeoPrice prefix="Get " suffix=" lifetime" />
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    );
  }

  // Full variant — end-of-page block
  return (
    <aside
      aria-label="Get lifetime access"
      className="my-10 md:my-12 rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-6 md:p-8"
    >
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-3">
        <Sparkles className="w-3 h-3" />
        Stop reading. Start building.
      </div>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 leading-tight">
        {headline ?? 'Get the full StackPicks directory'}
      </h3>
      <p className="text-base text-muted leading-relaxed mb-5 max-w-2xl">
        Lifetime access to <strong className="text-text">165+ curated open-source repos</strong>,{' '}
        <strong className="text-text">89 MCP servers</strong>,{' '}
        <strong className="text-text">13 stack bundles</strong>, and{' '}
        <strong className="text-text">12 skill tracks</strong> — each with an honest "use this if /
        skip if" curator take.
      </p>

      {/* Benefit bullets */}
      <ul className="grid sm:grid-cols-2 gap-2 mb-6 text-sm">
        {[
          'One payment. Lifetime access. No subscription.',
          'Indian pricing — pay in INR via Razorpay (UPI / cards / netbanking).',
          'Honest curator takes — what to ship with, what to skip.',
          'Ready-to-copy stack bundles for SaaS / mobile / AI agents.',
        ].map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className="text-text/85">{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href={pricingHref}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent text-bg font-bold text-sm hover:opacity-90 transition shadow-[0_12px_32px_-8px_rgba(198,255,0,0.5)]"
        >
          <GeoPrice prefix="Get lifetime — " />
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/preview"
          className="inline-flex items-center gap-1.5 h-12 px-5 rounded-full border border-white/15 hover:border-accent/50 text-sm transition"
        >
          Browse 6 free samples
        </Link>
      </div>

      <p className="text-[11px] text-muted mt-4">
        30-day money-back if you don&apos;t ship a single repo from the directory.
      </p>
    </aside>
  );
}

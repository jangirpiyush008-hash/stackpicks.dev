import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

export const FREE_CATEGORY_LIMIT = 3;
export const FREE_TRENDING_LIMIT = 3;
export const FREE_GALLERY_LIMIT = 6;

export function UnlockCTA({
  totalLocked,
  context,
}: {
  totalLocked: number;
  context: 'category' | 'trending' | 'gallery';
}) {
  const label = {
    category: `${totalLocked} more tools in this category · unlock full access`,
    trending: `${totalLocked} more repos · unlock full access`,
    gallery: `${totalLocked} more curated repos · unlock full access`,
  }[context];

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/15 via-surface/40 to-transparent p-6 md:p-8 mt-6">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 bg-accent" />
      <div className="relative text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/15 border border-accent/40 mb-4">
          <Lock className="w-5 h-5 text-accent" />
        </div>
        <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
          {label} · members only
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Unlock with lifetime membership.
        </h3>
        <p className="text-muted leading-relaxed max-w-xl mx-auto mb-6 text-sm md:text-base">
          Pay once. Full directory unlocked forever. No renewals, no surprise charges.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition text-sm md:text-base"
        >
          See pricing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

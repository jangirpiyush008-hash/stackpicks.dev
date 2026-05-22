import Link from 'next/link';
import { Award, ArrowRight, Sparkles } from 'lucide-react';
import { BEST_OF } from '../../lib/best-of';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Best Open-Source Tools — Ranked by Curators (2026)',
  description: 'Curated rankings of the best open-source tools in 2026 — CRM, project management, notes, e-commerce, CMS, analytics, chatbots, password managers, and more. Honest takes, not star counts.',
  path: '/best',
});

export default function BestIndex() {
  const sorted = [...BEST_OF].sort((a, b) => b.monthly_searches - a.monthly_searches);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Best of', path: '/best' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((b) => ({ name: `Best open-source ${b.display_name.toLowerCase()}`, path: `/best/${b.slug}` })),
            'Best open-source tools rankings',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Award className="w-3.5 h-3.5 text-accent" />
            <span>{BEST_OF.length} curated rankings</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Best open-source tools, ranked.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Each ranking is a curator's honest take — not a star-count listicle. Pick the right
            open-source tool for your use case and skip the others.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((b) => (
            <Link
              key={b.slug}
              href={`/best/${b.slug}`}
              className="block p-5 rounded-2xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group"
            >
              <h2 className="text-lg font-bold mb-2">
                Best open-source <span className="text-accent">{b.display_name.toLowerCase()}</span>
              </h2>
              <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">
                {b.intro}
              </p>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted">{b.picks.length} picks ranked</span>
                <span className="inline-flex items-center gap-1 text-accent">
                  Read ranking
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Want the full directory?</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            100+ open-source tools across 22 categories with curator takes, 13 stack bundles, 12
            skill tracks. ₹99 lifetime.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
          >
            See lifetime pricing
          </Link>
        </section>
      </div>
    </>
  );
}

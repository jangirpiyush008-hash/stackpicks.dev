import Link from 'next/link';
import { GitCompare, Sparkles } from 'lucide-react';
import { COMPARISONS } from '../../lib/comparisons';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Open-source comparisons — honest "X vs Y" picks for builders',
  description: 'Side-by-side comparisons of popular open-source dev tools. Shadcn vs Mantine, LangChain vs LlamaIndex, pgvector vs Qdrant, and more. Built for builders who want to pick once and ship.',
  path: '/compare',
});

export default function ComparePage() {
  // Group by category
  const byCategory = COMPARISONS.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {} as Record<string, typeof COMPARISONS>);

  const categories = Object.keys(byCategory).sort();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Compare', path: '/compare' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            COMPARISONS.map((c) => ({
              name: `${c.a_full.split('/')[1]} vs ${c.b_full.split('/')[1]}`,
              path: `/compare/${c.slug}`,
            })),
            'Open-source comparisons',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <GitCompare className="w-3.5 h-3.5 text-accent" />
            <span>{COMPARISONS.length} open-source comparisons</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            "X vs Y" — picked, not pumped.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Honest side-by-side comparisons of popular open-source dev tools. Curator takes,
            specific "use this if" clauses, and the tradeoffs that listicles never mention.
          </p>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
              {cat}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {byCategory[cat].map((c) => {
                const aName = c.a_full.split('/')[1];
                const bName = c.b_full.split('/')[1];
                return (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="block px-5 py-4 rounded-xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group"
                  >
                    <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                      <div className="text-base">
                        <span className="font-bold text-text">{aName}</span>
                        <span className="text-muted mx-2">vs</span>
                        <span className="font-bold text-text">{bName}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {c.one_liner}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">More comparisons coming weekly</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Member request a comparison and we build it. Lifetime members get full directory access
            plus weekly long-form analyses of the most-asked-about tool pairs.
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

import Link from 'next/link';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import { AWESOME } from '../../lib/awesome';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Awesome Lists — Curated Open-Source Picks by Topic',
  description: 'Curated "awesome" lists for React, Python, AI, Node.js, TypeScript, DevOps, and more. Each list is hand-picked with one-liner takes — not auto-generated star-count rankings.',
  path: '/awesome',
});

export default function AwesomeIndex() {
  const sorted = [...AWESOME].sort((a, b) => b.monthly_searches - a.monthly_searches);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Awesome lists', path: '/awesome' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((a) => ({ name: `Awesome ${a.topic}`, path: `/awesome/${a.slug}` })),
            'Awesome open-source lists by topic',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Star className="w-3.5 h-3.5 text-accent" />
            <span>{AWESOME.length} curated awesome lists</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Awesome <span className="text-accent">open-source</span> lists.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Hand-picked open-source libraries organized by topic. Each pick has a one-liner take
            from a working builder — not the usual GitHub-stars listicle.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((a) => {
            const totalRepos = a.sections.reduce((n, s) => n + s.repos.length, 0);
            return (
              <Link
                key={a.slug}
                href={`/awesome/${a.slug}`}
                className="block p-5 rounded-2xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group"
              >
                <h2 className="text-xl font-bold mb-1 group-hover:text-accent transition">
                  Awesome {a.topic}
                </h2>
                <p className="text-xs text-muted mb-3 line-clamp-2">{a.intro}</p>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-muted">{totalRepos} curated picks</span>
                  <span className="inline-flex items-center gap-1 text-accent">
                    Explore
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Want deep curator takes?</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime gets you the full directory with 100-word takes per repo + 13 ready-to-ship
            stack bundles + 12 skill tracks. ₹99 once.
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

import Link from 'next/link';
import { Replace, ArrowRight, Sparkles } from 'lucide-react';
import { ALTERNATIVES } from '../../lib/saas-alternatives';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Open-Source Alternatives — Self-host the SaaS You Use',
  description: 'Curated open-source alternatives to popular SaaS tools. Replace Notion, Figma, Airtable, Slack, Zapier, Discord, ChatGPT, and more with self-hosted open-source picks. Honest takes, license details, top 3 ranked.',
  path: '/alternatives',
});

export default function AlternativesIndex() {
  const sorted = [...ALTERNATIVES].sort((a, b) => b.monthly_searches - a.monthly_searches);
  const byCategory = sorted.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {} as Record<string, typeof sorted>);
  const categories = Object.keys(byCategory);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Alternatives', path: '/alternatives' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((a) => ({
              name: `Open-source alternatives to ${a.saas_name}`,
              path: `/alternatives/${a.slug}`,
            })),
            'Open-source SaaS alternatives',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Replace className="w-3.5 h-3.5 text-accent" />
            <span>{ALTERNATIVES.length} open-source alternatives, curated</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Self-host the SaaS you use.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Stop paying per-user, per-seat, per-row. Each guide below picks the best open-source
            alternative with honest takes — pick one, deploy in 30 minutes, own your data forever.
          </p>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-4">
              {cat}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {byCategory[cat].map((a) => (
                <Link
                  key={a.slug}
                  href={`/alternatives/${a.slug}`}
                  className="block px-5 py-4 rounded-xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group"
                >
                  <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                    <div className="font-bold text-base">
                      Replace <span className="text-accent">{a.saas_name}</span>
                    </div>
                    <span className="text-[10px] text-muted font-mono">
                      {a.picks.length} picks
                    </span>
                  </div>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed mb-3">
                    {a.saas_blurb}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs text-accent group-hover:underline">
                    See open-source picks
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">More alternatives weekly</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Suggest a SaaS to replace — we'll curate open-source alternatives for it. Lifetime
            members get the full directory + 13 ready-to-ship stack bundles.
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

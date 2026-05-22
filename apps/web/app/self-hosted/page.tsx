import Link from 'next/link';
import { Server, ArrowRight, Sparkles } from 'lucide-react';
import { SELF_HOSTED } from '../../lib/keyword-pages';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Self-Hosted Software — Own Your Stack (2026)',
  description: 'Curated self-hosted open-source picks for email, cloud storage, git, notes, chat, analytics, password managers, CMS, and more. Own your data. Skip SaaS fees.',
  path: '/self-hosted',
});

export default function SelfHostedIndex() {
  const sorted = [...SELF_HOSTED].sort((a, b) => b.monthly_searches - a.monthly_searches);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Self-hosted', path: '/self-hosted' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((s) => ({ name: `Self-hosted ${s.display.toLowerCase()}`, path: `/self-hosted/${s.slug}` })),
            'Self-hosted open-source picks',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Server className="w-3.5 h-3.5 text-accent" />
            <span>{SELF_HOSTED.length} self-hosted picks</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Self-host the SaaS you use.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Own your data. Skip subscription fees. Each guide picks the right open-source tool
            to self-host in 30 minutes or less.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((s) => (
            <Link key={s.slug} href={`/self-hosted/${s.slug}`} className="block p-5 rounded-2xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group">
              <h2 className="text-lg font-bold mb-1 group-hover:text-accent transition">
                Self-hosted {s.display.toLowerCase()}
              </h2>
              <p className="text-xs text-muted mb-3 line-clamp-2">{s.intro}</p>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted">{s.picks.length} picks</span>
                <span className="inline-flex items-center gap-1 text-accent">
                  Explore
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Want the full curated directory?</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            100+ tools, 13 ready-to-ship stack bundles, 12 skill tracks. ₹99 lifetime.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition">
            See lifetime pricing
          </Link>
        </section>
      </div>
    </>
  );
}

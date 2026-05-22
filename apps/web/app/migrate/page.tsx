import Link from 'next/link';
import { GitMerge, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { MIGRATIONS } from '../../lib/keyword-pages';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Migration Guides — Step-by-Step from SaaS to Open-Source',
  description: 'Complete migration guides: Firebase → Supabase, Slack → Mattermost, Airtable → NocoDB, Zapier → n8n, Calendly → Cal.com, MongoDB → Postgres, more. Steps, gotchas, time estimates.',
  path: '/migrate',
});

export default function MigrateIndex() {
  const sorted = [...MIGRATIONS].sort((a, b) => b.monthly_searches - a.monthly_searches);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Migration guides', path: '/migrate' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((m) => ({ name: `Migrate from ${m.from} to ${m.to}`, path: `/migrate/${m.slug}` })),
            'Migration guides',
          )),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <GitMerge className="w-3.5 h-3.5 text-accent" />
            <span>{MIGRATIONS.length} migration guides</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Migrate from SaaS to <span className="text-accent">open-source</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Step-by-step guides for moving from common SaaS tools to their open-source equivalents.
            Time estimates, gotchas, and verified migration paths.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((m) => (
            <Link key={m.slug} href={`/migrate/${m.slug}`} className="block p-5 rounded-2xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group">
              <div className="flex items-baseline gap-2 mb-2 text-xl font-bold">
                <span>{m.from}</span>
                <ArrowRight className="w-5 h-5 text-accent" />
                <span className="text-accent">{m.to}</span>
              </div>
              <p className="text-xs text-muted line-clamp-2 mb-3">{m.why}</p>
              <div className="flex items-baseline justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className={`px-2 py-0.5 rounded-full border ${
                  m.difficulty === 'Easy' ? 'border-accent/40 bg-accent/10 text-accent' :
                  m.difficulty === 'Medium' ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300' :
                  'border-red-500/40 bg-red-500/10 text-red-300'
                }`}>
                  {m.difficulty}
                </span>
                <span className="text-muted inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {m.time_estimate}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Suggest a migration guide</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime members can request specific SaaS→OSS migration guides. We add one per week based on requests.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition">
            See pricing
          </Link>
        </section>
      </div>
    </>
  );
}

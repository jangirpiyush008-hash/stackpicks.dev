import Link from 'next/link';
import { Users, ArrowRight, Sparkles } from 'lucide-react';
import { FOR_AUDIENCE } from '../../lib/keyword-pages';
import { buildMeta, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMeta({
  title: 'Open-Source for Every Audience — Startups, Nonprofits, Students, Indie Hackers',
  description: 'Curated open-source tool stacks for specific audiences: startups, nonprofits, indie hackers, students, small businesses. Every tool free or self-hostable.',
  path: '/for',
});

export default function ForIndex() {
  const sorted = [...FOR_AUDIENCE].sort((a, b) => b.monthly_searches - a.monthly_searches);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'For audience', path: '/for' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            sorted.map((a) => ({ name: `Open-source for ${a.audience.toLowerCase()}`, path: `/for/${a.slug}` })),
            'Open-source stacks by audience',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{FOR_AUDIENCE.length} audience stacks</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Open-source for <span className="text-accent">every audience</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            The right open-source stack depends on who you are. Each curated stack below is picked
            for one specific audience.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          {sorted.map((a) => (
            <Link key={a.slug} href={`/for/${a.slug}`} className="block p-5 rounded-2xl border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group">
              <h2 className="text-xl font-bold mb-1 group-hover:text-accent transition">
                For <span className="text-accent">{a.audience.toLowerCase()}</span>
              </h2>
              <p className="text-xs text-muted mb-3 line-clamp-2">{a.intro}</p>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted">{a.picks.length} picks across every category</span>
                <span className="inline-flex items-center gap-1 text-accent">
                  See stack
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold mb-2">Curated stack for everything else</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime: 100+ tools, 13 ready-to-ship bundles, 12 skill tracks. ₹99 once.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition">
            See pricing
          </Link>
        </section>
      </div>
    </>
  );
}

import Link from 'next/link';
import { Github, Star, TrendingUp, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { buildMeta, breadcrumbJsonLd, itemListJsonLd, faqJsonLd } from '@stackpicks/core/seo';
import { adminClient, listRepos } from '@stackpicks/core/db';
import { formatStars } from '@stackpicks/core/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata = buildMeta({
  title: 'Best GitHub Repos — Curated Open-Source Picks (2026)',
  description: 'The best GitHub repos in 2026, hand-curated with honest takes. 100+ open-source projects across UI, AI, databases, scraping, automation. Not auto-generated star-count listicles.',
  path: '/github',
});

export default async function GithubLandingPage() {
  // Top 12 repos by stars (live data)
  const supabase = adminClient();
  let topRepos: Array<{ slug: string; full_name: string; description: string | null; stars: number; language: string | null }> = [];
  try {
    const repos = await listRepos(supabase, { sort: 'stars', limit: 12 });
    topRepos = repos.map((r) => ({
      slug: r.slug,
      full_name: r.full_name,
      description: r.description,
      stars: r.stars,
      language: r.language,
    }));
  } catch { /* gracefully fall back to empty */ }

  // Category quick-links
  const FEATURED_CATEGORIES = [
    { slug: 'ui-components', name: 'UI components', count: 12 },
    { slug: 'ai-tooling', name: 'AI tooling', count: 9 },
    { slug: 'authentication', name: 'Authentication', count: 6 },
    { slug: 'vector-databases', name: 'Vector databases', count: 5 },
    { slug: 'animation', name: 'Animation', count: 6 },
    { slug: 'forms', name: 'Forms', count: 4 },
    { slug: 'state-management', name: 'State management', count: 4 },
    { slug: 'web-scraping', name: 'Web scraping', count: 5 },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'GitHub repos', path: '/github' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: 'What are the best GitHub repos in 2026?', answer: 'The best GitHub repos vary by use case. StackPicks curates 100+ open-source repos across 22 categories with honest "use this if / skip if" takes — picked over star counts.' },
            { question: 'How do I find useful GitHub repos?', answer: 'Use a curated directory like StackPicks instead of GitHub Trending (which shows whatever gets stars today). We pick repos by maintenance velocity, license safety, and production-readiness — not raw stars.' },
            { question: 'What\'s the difference between Awesome lists and StackPicks?', answer: 'Awesome lists are unranked link dumps. StackPicks has curator takes, "skip if" clauses, alternatives, and ready-to-ship stack bundles. Every entry is hand-written.' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            topRepos.map((r) => ({ name: r.full_name, path: `/repo/${r.slug}` })),
            'Top curated GitHub repos',
          )),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Github className="w-3.5 h-3.5 text-accent" />
            <span>100+ curated GitHub repos · refreshed daily</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Best <span className="text-accent">GitHub repos</span>, curated.
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            The 100+ open-source GitHub projects worth your time — picked by builders for builders.
            Not auto-generated star-count listicles. Each has a curator take, pros, cons, and "skip if" clause.
          </p>
        </header>

        {/* Top repos — live data */}
        <section className="mb-14">
          <div className="flex items-baseline gap-3 mb-5">
            <Star className="w-4 h-4 text-accent" />
            <h2 className="text-2xl font-bold">Top {topRepos.length} curated GitHub repos</h2>
            <span className="text-xs text-muted">live · sorted by stars</span>
          </div>
          {topRepos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topRepos.map((r) => (
                <Link key={r.slug} href={`/repo/${r.slug}`} className="block p-4 rounded-lg border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group">
                  <div className="text-[10px] font-mono text-muted/60 mb-1">{r.full_name.split('/')[0]}</div>
                  <h3 className="font-bold mb-2 group-hover:text-accent transition">{r.full_name.split('/')[1]}</h3>
                  {r.description && <p className="text-xs text-muted line-clamp-2 mb-3">{r.description}</p>}
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" />
                      {formatStars(r.stars)}
                    </span>
                    {r.language && <span>{r.language}</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted">Loading…</div>
          )}
        </section>

        {/* Categories */}
        <section className="mb-14">
          <div className="flex items-baseline gap-3 mb-5">
            <BookOpen className="w-4 h-4 text-accent" />
            <h2 className="text-2xl font-bold">Browse GitHub repos by category</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {FEATURED_CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="px-4 py-3 rounded-lg border border-border hover:border-accent transition">
                <div className="font-bold text-sm">{c.name}</div>
                <div className="text-xs text-muted mt-0.5">{c.count} curated repos</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Awesome by language */}
        <section className="mb-14">
          <div className="flex items-baseline gap-3 mb-5">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="text-2xl font-bold">GitHub repos by language</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { slug: 'react', name: 'React' },
              { slug: 'python', name: 'Python' },
              { slug: 'javascript', name: 'JavaScript' },
              { slug: 'typescript', name: 'TypeScript' },
              { slug: 'nodejs', name: 'Node.js' },
              { slug: 'nextjs', name: 'Next.js' },
              { slug: 'ai', name: 'AI / LLM' },
              { slug: 'devops', name: 'DevOps' },
              { slug: 'self-hosted', name: 'Self-hosted' },
            ].map((a) => (
              <Link key={a.slug} href={`/awesome/${a.slug}`} className="px-4 py-3 rounded-lg border border-border hover:border-accent transition group">
                <div className="font-bold text-sm group-hover:text-accent transition">
                  Awesome {a.name}
                </div>
                <div className="text-xs text-muted mt-0.5">Curated GitHub picks</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Use-case driven */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-5">GitHub repos for building <span className="text-accent">specific things</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { slug: 'ship-a-saas', name: 'Build a SaaS' },
              { slug: 'ai-agent', name: 'Build an AI agent' },
              { slug: 'mobile-app', name: 'Build a mobile app' },
              { slug: 'web-scraper', name: 'Build a web scraper' },
              { slug: 'chrome-extension', name: 'Build a Chrome extension' },
              { slug: 'e-commerce', name: 'Build an e-commerce store' },
            ].map((b) => (
              <Link key={b.slug} href={`/build/${b.slug}`} className="px-4 py-3 rounded-lg border border-border hover:border-accent transition">
                <div className="font-bold text-sm">{b.name}</div>
                <div className="text-xs text-muted mt-0.5">Curated stack bundle</div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Get the full GitHub directory</h2>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime: 100+ curated GitHub repos with ~100-word curator takes per repo, 13 ready-to-ship stack bundles, 12 skill tracks. ₹99 once.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition">
            See lifetime pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </>
  );
}

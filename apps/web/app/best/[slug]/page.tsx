import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, Server, Sparkles, ExternalLink, Star } from 'lucide-react';
import { getBestOfBySlug, BEST_OF, getAllBestOfSlugs } from '../../../lib/best-of';
import { buildMeta, breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '@stackpicks/core/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return getAllBestOfSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getBestOfBySlug(slug);
  if (!page) return {};
  const topPick = page.picks[0]?.short_name;
  return buildMeta({
    title: `Best Open-Source ${page.display_name} on GitHub (2026) — ${topPick} & more`,
    description: `Curated ranking of the best open-source GitHub repos for ${page.display_name.toLowerCase()}. ${page.picks.length} picks compared with honest takes, licenses, self-host options, and which to pick.`,
    path: `/best/${slug}`,
  });
}

export default async function BestOfPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getBestOfBySlug(slug);
  if (!page) notFound();

  const related = BEST_OF.filter((b) => b.slug !== slug).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Best of', path: '/best' },
            { name: page.display_name, path: `/best/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `What is the best open-source ${page.display_name.toLowerCase()}?`, answer: `Our top pick is ${page.picks[0].short_name}: ${page.picks[0].one_liner}` },
            { question: `Is ${page.picks[0].short_name} free?`, answer: `Yes — ${page.picks[0].short_name} is open-source under ${page.picks[0].license ?? 'a permissive license'}. You can self-host for free.` },
            { question: `How many open-source ${page.display_name.toLowerCase()} options are there?`, answer: `There are many, but we've curated the ${page.picks.length} best picks based on production-readiness, license safety, maintenance velocity, and community size.` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            page.picks.map((p) => ({
              name: p.short_name,
              path: `https://github.com/${p.full_name}`,
            })),
            `Best open-source ${page.display_name.toLowerCase()}`,
          )),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link
          href="/best"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All best-of guides
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
            {page.category} · open-source ranking
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Best Open-Source <span className="text-accent">{page.display_name}</span> in 2026
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            {page.intro}
          </p>
        </header>

        {/* Top pick spotlight */}
        <section className="mb-12 rounded-2xl border border-accent/40 bg-accent/5 p-5 md:p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            #1 Pick — {page.picks[0].highlight}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{page.picks[0].short_name}</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            {page.picks[0].one_liner}
          </p>
          <a
            href={`https://github.com/${page.picks[0].full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <Github className="w-3.5 h-3.5" />
            github.com/{page.picks[0].full_name}
            <ExternalLink className="w-3 h-3" />
          </a>
        </section>

        {/* Full ranking */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-5">All {page.picks.length} ranked</h2>
          <div className="space-y-4">
            {page.picks.map((pick, i) => (
              <article
                key={pick.full_name}
                className="rounded-2xl border border-border bg-surface/30 p-5"
              >
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className={`text-xl font-bold ${i === 0 ? 'text-accent' : 'text-muted'} font-mono`}>
                    #{i + 1}
                  </span>
                  <h3 className="text-xl font-bold">{pick.short_name}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
                    {pick.highlight}
                  </span>
                  {pick.license && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                      {pick.license}
                    </span>
                  )}
                  {pick.self_hosted && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Server className="w-2.5 h-2.5" />
                      Self-host
                    </span>
                  )}
                  {pick.stars_approx && (
                    <span className="text-[10px] font-mono text-muted inline-flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" />
                      ~{pick.stars_approx >= 1000 ? `${(pick.stars_approx / 1000).toFixed(0)}k` : pick.stars_approx}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text leading-relaxed mb-3">
                  {pick.one_liner}
                </p>
                <a
                  href={`https://github.com/${pick.full_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition font-mono"
                >
                  <Github className="w-3 h-3" />
                  github.com/{pick.full_name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8 mb-10 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Want full curator takes + 13 stack bundles?
          </h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            StackPicks lifetime gives you 100+ curated open-source tools with deep curator takes,
            ready-to-ship stack bundles, and 12 skill tracks. ₹99 one-time.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition"
          >
            See pricing
          </Link>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">More best-of rankings</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/best/${r.slug}`}
                  className="px-4 py-3 rounded-lg border border-border hover:border-accent transition"
                >
                  <div className="font-bold text-sm">Best open-source {r.display_name.toLowerCase()}</div>
                  <div className="text-xs text-muted mt-0.5">{r.picks.length} picks ranked</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, Check, X as XIcon, Server, Sparkles, ExternalLink } from 'lucide-react';
import { getAlternativePageBySlug, ALTERNATIVES, getAllAlternativeSlugs } from '../../../lib/saas-alternatives';
import { buildMeta, breadcrumbJsonLd, faqJsonLd, itemListJsonLd, speakableJsonLd } from '@stackpicks/core/seo';
import { SITE } from '@stackpicks/core/constants';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return getAllAlternativeSlugs().map((saas) => ({ saas }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ saas: string }> }
): Promise<Metadata> {
  const { saas } = await params;
  const page = getAlternativePageBySlug(saas);
  if (!page) return {};
  const topPick = page.picks[0]?.short_name ?? 'open-source picks';
  return buildMeta({
    title: `Best Open-Source ${page.saas_name} Alternatives on GitHub (2026) — ${topPick} & more`,
    description: `Curated open-source GitHub repos that replace ${page.saas_name}. ${page.picks.length} picks ranked with honest takes, self-host options, license details, and which to pick for your team.`,
    path: `/alternatives/${saas}`,
  });
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ saas: string }>;
}) {
  const { saas } = await params;
  const page = getAlternativePageBySlug(saas);
  if (!page) notFound();

  const related = ALTERNATIVES
    .filter((a) => a.category === page.category && a.slug !== page.slug)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Alternatives', path: '/alternatives' },
            { name: page.saas_name, path: `/alternatives/${saas}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `What is the best open-source alternative to ${page.saas_name}?`, answer: `The top open-source alternative to ${page.saas_name} is ${page.picks[0].short_name}: ${page.picks[0].curator_take.slice(0, 200)}` },
            { question: `Can I self-host an alternative to ${page.saas_name}?`, answer: `Yes — ${page.picks.filter((p) => p.self_hosted).map((p) => p.short_name).join(', ')} all support self-hosting. Most ship as Docker containers and run on any VPS.` },
            { question: `Is ${page.picks[0].short_name} free?`, answer: `${page.picks[0].short_name} is open-source under ${page.picks[0].license ?? 'a permissive license'}. You can self-host for free. Many also offer a hosted cloud option with a free tier and paid plans.` },
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
            `Open-source alternatives to ${page.saas_name}`,
          )),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(speakableJsonLd({
            url: `${SITE.url}/alternatives/${saas}`,
            cssSelectors: ['h1', '.quick-answer', '.alt-take'],
          })),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link
          href="/alternatives"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All alternatives
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
            {page.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Best Open-Source Alternatives to <span className="text-accent">{page.saas_name}</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            {page.saas_blurb}
          </p>
        </header>

        {/* TL;DR */}
        <section className="mb-12 rounded-2xl border border-accent/30 bg-accent/5 p-5 md:p-6">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">TL;DR — top pick</div>
          <h2 className="text-2xl font-bold mb-2">{page.picks[0].short_name}</h2>
          <p className="text-sm text-muted leading-relaxed mb-3">
            {page.picks[0].curator_take.split('. ').slice(0, 2).join('. ')}.
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

        {/* All picks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-5">All {page.picks.length} alternatives ranked</h2>
          <div className="space-y-5">
            {page.picks.map((pick, i) => (
              <article
                key={pick.full_name}
                className="rounded-2xl border border-border bg-surface/30 p-5 md:p-6"
              >
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                    #{i + 1}
                  </span>
                  <h3 className="text-xl font-bold">{pick.short_name}</h3>
                  {pick.license && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                      {pick.license}
                    </span>
                  )}
                  {pick.self_hosted && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Server className="w-2.5 h-2.5" />
                      Self-hostable
                    </span>
                  )}
                  {pick.stars_approx && (
                    <span className="text-[10px] font-mono text-muted">
                      ★ ~{pick.stars_approx >= 1000 ? `${(pick.stars_approx / 1000).toFixed(0)}k` : pick.stars_approx}
                    </span>
                  )}
                </div>

                <a
                  href={`https://github.com/${pick.full_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition mb-4 font-mono"
                >
                  <Github className="w-3 h-3" />
                  github.com/{pick.full_name}
                  <ExternalLink className="w-3 h-3" />
                </a>

                <p className="text-sm text-text leading-relaxed mb-5">
                  {pick.curator_take}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <h4 className="font-bold text-xs text-accent mb-1.5 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Pick {pick.short_name} if
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">{pick.use_this_if}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-red-400 mb-1.5 flex items-center gap-1.5">
                      <XIcon className="w-3.5 h-3.5" />
                      Skip if
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">{pick.skip_if}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8 mb-10 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Want the full curated stack?
          </h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            StackPicks members get 100+ open-source tools across 22 categories with curator takes,
            13 stack bundles, and 12 skill tracks. ₹99 lifetime.
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
            <h2 className="text-xl font-bold mb-4">More {page.category} alternatives</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/alternatives/${r.slug}`}
                  className="px-4 py-3 rounded-lg border border-border hover:border-accent transition"
                >
                  <div className="font-bold text-sm">Open-source alternatives to {r.saas_name}</div>
                  <div className="text-xs text-muted mt-0.5">{r.picks.length} picks</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

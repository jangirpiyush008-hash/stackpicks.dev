import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink, Sparkles, Users } from 'lucide-react';
import { getForAudienceBySlug, FOR_AUDIENCE } from '../../../lib/keyword-pages';
import { buildMeta, breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '@stackpicks/core/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return FOR_AUDIENCE.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getForAudienceBySlug(slug);
  if (!page) return {};
  return buildMeta({
    title: `Best Open-Source GitHub Repos for ${page.audience} (2026)`,
    description: `Curated open-source GitHub repos for ${page.audience.toLowerCase()}. ${page.picks.length} picks across every category your team needs — most with free tiers or self-host options.`,
    path: `/for/${slug}`,
  });
}

export default async function ForAudiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getForAudienceBySlug(slug);
  if (!page) notFound();

  const related = FOR_AUDIENCE.filter((a) => a.slug !== slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'For audience', path: '/for' },
            { name: page.audience, path: `/for/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `What open-source tools do ${page.audience.toLowerCase()} use?`, answer: page.intro },
            { question: `Are these tools free for ${page.audience.toLowerCase()}?`, answer: 'Yes — most have generous free tiers or can be self-hosted at zero cost.' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            page.picks.map((p) => ({ name: p.short_name, path: `https://github.com/${p.full_name}` })),
            `Open-source tools for ${page.audience.toLowerCase()}`,
          )),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/for" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          All audience stacks
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent mb-3">
            <Users className="w-3.5 h-3.5" />
            Curated for {page.audience.toLowerCase()}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Open-Source for <span className="text-accent">{page.audience}</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            {page.intro}
          </p>
        </header>

        <section className="space-y-4 mb-12">
          {page.picks.map((pick) => (
            <article key={pick.full_name + pick.category} className="rounded-2xl border border-border bg-surface/30 p-5">
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
                  {pick.category}
                </span>
                <h3 className="text-lg font-bold">{pick.short_name}</h3>
              </div>
              <p className="text-sm text-text leading-relaxed mb-3">{pick.why}</p>
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
        </section>

        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8 mb-10 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">Full curated directory + bundles</h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime gives you 100+ open-source tools with curator takes, 13 stack bundles, and 12 skill tracks. ₹99 once.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition">
            See pricing
          </Link>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Other audience stacks</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/for/${r.slug}`} className="px-4 py-3 rounded-lg border border-border hover:border-accent transition">
                  <div className="font-bold text-sm">Open-source for {r.audience.toLowerCase()}</div>
                  <div className="text-xs text-muted mt-0.5">{r.picks.length} curated picks</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

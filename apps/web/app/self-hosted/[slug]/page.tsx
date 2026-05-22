import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink, Server, Sparkles } from 'lucide-react';
import { getSelfHostedBySlug, SELF_HOSTED } from '../../../lib/keyword-pages';
import { buildMeta, breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '@stackpicks/core/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return SELF_HOSTED.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getSelfHostedBySlug(slug);
  if (!page) return {};
  return buildMeta({
    title: `Best Self-Hosted ${page.display} — Open-Source GitHub Repos (2026)`,
    description: `Curated self-hosted ${page.display.toLowerCase()} from GitHub. ${page.picks.length} open-source picks with one-liner takes, licenses, and which to deploy on your server.`,
    path: `/self-hosted/${slug}`,
  });
}

export default async function SelfHostedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSelfHostedBySlug(slug);
  if (!page) notFound();

  const related = SELF_HOSTED.filter((s) => s.slug !== slug).slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Self-hosted', path: '/self-hosted' },
            { name: page.display, path: `/self-hosted/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `What's the best self-hosted ${page.display.toLowerCase()}?`, answer: `Our top pick is ${page.picks[0].short_name}: ${page.picks[0].one_liner}` },
            { question: `Is self-hosted ${page.display.toLowerCase()} hard to deploy?`, answer: 'Most picks ship as Docker containers and deploy on any VPS in under 30 minutes. Specific options vary in complexity — see each pick\'s notes.' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            page.picks.map((p) => ({ name: p.short_name, path: `https://github.com/${p.full_name}` })),
            `Self-hosted ${page.display.toLowerCase()}`,
          )),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/self-hosted" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          All self-hosted picks
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent mb-3">
            <Server className="w-3.5 h-3.5" />
            Self-host · own your data
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Self-Hosted <span className="text-accent">{page.display}</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            {page.intro}
          </p>
        </header>

        <section className="space-y-4 mb-12">
          {page.picks.map((pick, i) => (
            <article key={pick.full_name} className="rounded-2xl border border-border bg-surface/30 p-5">
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <span className={`text-xl font-bold font-mono ${i === 0 ? 'text-accent' : 'text-muted'}`}>#{i + 1}</span>
                <h3 className="text-xl font-bold">{pick.short_name}</h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full">
                  {pick.highlight}
                </span>
                {pick.license && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                    {pick.license}
                  </span>
                )}
              </div>
              <p className="text-sm text-text leading-relaxed mb-3">{pick.one_liner}</p>
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
          <h3 className="text-xl md:text-2xl font-bold mb-2">Full curator takes available</h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime members get deep curator takes per repo + 13 stack bundles. ₹99 once.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition">
            See pricing
          </Link>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">More self-hosted picks</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/self-hosted/${r.slug}`} className="px-4 py-3 rounded-lg border border-border hover:border-accent transition">
                <div className="font-bold text-sm">Self-hosted {r.display.toLowerCase()}</div>
                <div className="text-xs text-muted mt-0.5">{r.picks.length} picks</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

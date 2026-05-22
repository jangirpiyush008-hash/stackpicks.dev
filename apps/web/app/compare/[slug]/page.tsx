import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, GitFork, Calendar, Check, X as XIcon, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { getSeedByFullName } from '../../../lib/preview-source';
import { getComparisonBySlug, COMPARISONS } from '../../../lib/comparisons';
import { formatStars, timeAgo } from '@stackpicks/core/utils';
import { buildMeta, breadcrumbJsonLd, faqJsonLd } from '@stackpicks/core/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparisonBySlug(slug);
  if (!c) return {};
  const a = getSeedByFullName(c.a_full);
  const b = getSeedByFullName(c.b_full);
  if (!a || !b) return {};
  const aName = a.full_name.split('/')[1];
  const bName = b.full_name.split('/')[1];
  return buildMeta({
    title: `${aName} vs ${bName} — GitHub Repo Comparison (Honest 2026 Take)`,
    description: `${c.one_liner.slice(0, 140)} Side-by-side comparison of ${a.full_name} and ${b.full_name} GitHub repos: curator takes, pros & cons, which to pick.`,
    path: `/compare/${slug}`,
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const a = getSeedByFullName(comparison.a_full);
  const b = getSeedByFullName(comparison.b_full);
  if (!a || !b) notFound();

  const aName = a.full_name.split('/')[1];
  const bName = b.full_name.split('/')[1];

  // Related comparisons in same category
  const related = COMPARISONS
    .filter((c) => c.category === comparison.category && c.slug !== comparison.slug)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Compare', path: '/compare' },
            { name: `${aName} vs ${bName}`, path: `/compare/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `Is ${aName} better than ${bName}?`, answer: comparison.one_liner },
            { question: `Should I use ${aName} or ${bName} in 2026?`, answer: `Use ${aName} if: ${a.use_this_if} Use ${bName} if: ${b.use_this_if}` },
            { question: `What's the main difference between ${aName} and ${bName}?`, answer: comparison.one_liner },
          ])),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All comparisons
        </Link>

        {/* Hero */}
        <header className="mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
            Open-source comparison · {comparison.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-text">{aName}</span>
            <span className="text-muted mx-3">vs</span>
            <span className="text-text">{bName}</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            {comparison.one_liner}
          </p>
        </header>

        {/* Side-by-side cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[a, b].map((repo, i) => {
            const name = repo.full_name.split('/')[1];
            const owner = repo.full_name.split('/')[0];
            return (
              <div
                key={repo.full_name}
                className={`rounded-2xl border p-6 ${i === 0 ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface/40'}`}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                    {i === 0 ? 'Option A' : 'Option B'}
                  </span>
                </div>
                <div className="font-mono text-sm text-muted">{owner}</div>
                <h2 className="text-2xl font-bold mb-3">{name}</h2>
                <a
                  href={`https://github.com/${repo.full_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition mb-4"
                >
                  <ExternalLink className="w-3 h-3" />
                  github.com/{repo.full_name}
                </a>
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {repo.curator_take}
                </p>
                <Link
                  href={`/repo/${repo.full_name.replace('/', '--')}`}
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                >
                  Full review →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Use-this-if / Skip-if comparison */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">Which should you pick?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[a, b].map((repo) => {
              const name = repo.full_name.split('/')[1];
              return (
                <div key={repo.full_name} className="rounded-2xl border border-border bg-surface/40 p-6">
                  <h3 className="font-bold text-lg mb-4">Pick {name} if…</h3>
                  <div className="flex items-start gap-2 mb-4">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-text leading-relaxed">{repo.use_this_if}</p>
                  </div>
                  <h4 className="font-bold text-sm mt-5 mb-2 text-muted">Skip {name} if…</h4>
                  <div className="flex items-start gap-2">
                    <XIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted leading-relaxed">{repo.skip_if}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8 mb-10 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Still picking? Get the full curated stack.
          </h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            StackPicks members get 100+ open-source tools with curator takes,
            13 ready-to-ship stack bundles, and 12 skill tracks. ₹99 lifetime.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition"
          >
            See pricing
          </Link>
        </section>

        {/* Related comparisons */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">More {comparison.category} comparisons</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => {
                const rA = r.a_full.split('/')[1];
                const rB = r.b_full.split('/')[1];
                return (
                  <Link
                    key={r.slug}
                    href={`/compare/${r.slug}`}
                    className="px-4 py-3 rounded-lg border border-border hover:border-accent transition text-sm"
                  >
                    <span className="font-bold">{rA}</span>
                    <span className="text-muted mx-2">vs</span>
                    <span className="font-bold">{rB}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

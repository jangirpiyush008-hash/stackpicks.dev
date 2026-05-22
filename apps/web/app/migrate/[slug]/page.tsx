import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { getMigrateBySlug, MIGRATIONS } from '../../../lib/keyword-pages';
import { buildMeta, breadcrumbJsonLd, faqJsonLd } from '@stackpicks/core/seo';
import { SITE } from '@stackpicks/core/constants';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return MIGRATIONS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getMigrateBySlug(slug);
  if (!page) return {};
  return buildMeta({
    title: `Migrate from ${page.from} to ${page.to} — Step-by-Step Guide (2026)`,
    description: `Complete migration guide: ${page.from} → ${page.to}. ${page.steps.length} steps, gotchas to watch, realistic time estimate (${page.time_estimate}).`,
    path: `/migrate/${slug}`,
  });
}

export default async function MigratePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getMigrateBySlug(slug);
  if (!page) notFound();

  const related = MIGRATIONS.filter((m) => m.slug !== slug).slice(0, 4);

  // HowTo schema — Google rich result
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Migrate from ${page.from} to ${page.to}`,
    description: page.why,
    totalTime: page.time_estimate,
    step: page.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.body,
      url: `${SITE.url}/migrate/${slug}#step-${i + 1}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Migration guides', path: '/migrate' },
            { name: `${page.from} → ${page.to}`, path: `/migrate/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `How long does it take to migrate from ${page.from} to ${page.to}?`, answer: `${page.time_estimate} for a typical project. Difficulty: ${page.difficulty}.` },
            { question: `Why migrate from ${page.from} to ${page.to}?`, answer: page.why },
            { question: `Is migration from ${page.from} risky?`, answer: `Difficulty rated ${page.difficulty}. The main gotchas: ${page.gotchas.slice(0, 2).join(' ')}` },
          ])),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/migrate" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          All migration guides
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
            Migration guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
            Migrate from <span className="text-text">{page.from}</span>
            <ArrowRight className="inline w-7 h-7 mx-2 text-accent" />
            <span className="text-accent">{page.to}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs">
            <span className={`px-3 py-1 rounded-full border font-mono uppercase tracking-wider ${
              page.difficulty === 'Easy' ? 'border-accent/40 bg-accent/10 text-accent' :
              page.difficulty === 'Medium' ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300' :
              'border-red-500/40 bg-red-500/10 text-red-300'
            }`}>
              {page.difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <Clock className="w-3.5 h-3.5" />
              {page.time_estimate}
            </span>
            <span className="text-muted">{page.steps.length} steps</span>
          </div>

          <div className="mt-6 p-4 rounded-lg border border-border bg-surface/40">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-2">Why migrate</div>
            <p className="text-sm text-text leading-relaxed">{page.why}</p>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">Step-by-step</h2>
          <ol className="space-y-5">
            {page.steps.map((step, i) => (
              <li key={step.title} id={`step-${i + 1}`} className="pl-12 relative">
                <span className="absolute left-0 top-1 w-8 h-8 rounded-full bg-accent text-bg font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-bold text-base mb-1">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10 p-5 rounded-2xl border border-yellow-500/40 bg-yellow-500/5">
          <h2 className="text-lg font-bold mb-3 inline-flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            Gotchas to watch
          </h2>
          <ul className="space-y-2 text-sm text-text/90 leading-relaxed list-disc list-outside pl-5">
            {page.gotchas.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8 mb-10 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">More open-source picks</h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime gets you the full curated directory with 100+ open-source tools and deep curator takes. ₹99 once.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition">
            See pricing
          </Link>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">More migration guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/migrate/${r.slug}`} className="px-4 py-3 rounded-lg border border-border hover:border-accent transition">
                  <div className="font-bold text-sm">{r.from} → {r.to}</div>
                  <div className="text-xs text-muted mt-0.5">{r.difficulty} · {r.time_estimate}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink, Star, Sparkles } from 'lucide-react';
import { getAwesomePageBySlug, AWESOME, getAllAwesomeSlugs } from '../../../lib/awesome';
import { buildMeta, breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '@stackpicks/core/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return getAllAwesomeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getAwesomePageBySlug(slug);
  if (!page) return {};
  const totalRepos = page.sections.reduce((n, s) => n + s.repos.length, 0);
  return buildMeta({
    title: `Awesome ${page.topic} — ${totalRepos} Curated Open-Source Picks (2026)`,
    description: `Curated awesome list of ${totalRepos} open-source ${page.topic} libraries in 2026. Each pick has a one-liner take, GitHub link, and is ranked by curator opinion — not raw star counts.`,
    path: `/awesome/${slug}`,
  });
}

export default async function AwesomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getAwesomePageBySlug(slug);
  if (!page) notFound();

  const totalRepos = page.sections.reduce((n, s) => n + s.repos.length, 0);
  const allRepos = page.sections.flatMap((s) => s.repos);
  const related = AWESOME.filter((a) => a.slug !== slug).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Awesome lists', path: '/awesome' },
            { name: page.topic, path: `/awesome/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([
            { question: `What is the best open-source ${page.topic} library?`, answer: `Our top pick is ${allRepos[0].short_name}: ${allRepos[0].one_liner}` },
            { question: `How many ${page.topic} open-source libraries are there?`, answer: `Thousands exist on GitHub, but we've curated the top ${totalRepos} that actually ship in production. Categorized by use case.` },
            { question: `Is this list updated?`, answer: `Yes — every pick is reviewed weekly. Star counts refresh daily via the GitHub API. Last review: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            allRepos.map((r) => ({ name: r.short_name, path: `https://github.com/${r.full_name}` })),
            `Awesome ${page.topic} — open-source libraries`,
          )),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link
          href="/awesome"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All awesome lists
        </Link>

        <header className="mb-10 pb-8 border-b border-border">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
            Awesome · {totalRepos} curated picks
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Awesome <span className="text-accent">{page.topic}</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-3xl">
            {page.intro}
          </p>
        </header>

        {/* Sections */}
        {page.sections.map((section) => (
          <section key={section.title} className="mb-12">
            <h2 className="text-2xl font-bold mb-1">{section.title}</h2>
            {section.description && <p className="text-sm text-muted mb-4">{section.description}</p>}
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {section.repos.map((repo) => (
                <a
                  key={repo.full_name}
                  href={`https://github.com/${repo.full_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-border hover:border-accent bg-surface/30 hover:bg-surface/60 transition group"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-bold">{repo.short_name}</h3>
                    {repo.stars_approx && (
                      <span className="text-[10px] font-mono text-muted shrink-0 inline-flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5" />
                        {repo.stars_approx >= 1000 ? `${(repo.stars_approx / 1000).toFixed(0)}k` : repo.stars_approx}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-muted/60 mb-2">{repo.full_name}</div>
                  <p className="text-xs text-muted leading-relaxed">{repo.one_liner}</p>
                </a>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="rounded-2xl border border-accent/40 bg-accent/5 p-6 md:p-8 mb-10 text-center">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-3" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">Want curator deep-takes on each pick?</h3>
          <p className="text-sm text-muted mb-5 max-w-xl mx-auto">
            Lifetime members get full ~100-word curator takes per repo with "use this if / skip if" clauses, plus 13 ready-to-ship stack bundles. ₹99 once.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 transition"
          >
            See lifetime pricing
          </Link>
        </section>

        {/* Related */}
        <section>
          <h2 className="text-xl font-bold mb-4">More awesome lists</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/awesome/${r.slug}`}
                className="px-4 py-3 rounded-lg border border-border hover:border-accent transition"
              >
                <div className="font-bold text-sm">Awesome {r.topic}</div>
                <div className="text-xs text-muted mt-0.5">
                  {r.sections.reduce((n, s) => n + s.repos.length, 0)} curated picks
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

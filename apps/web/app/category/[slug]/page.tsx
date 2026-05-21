import { adminClient, listRepos, getCategoryBySlug, getActiveSponsoredSlots } from '@stackpicks/core/db';
import { buildMeta, categoryJsonLd } from '@stackpicks/core/seo';
import { formatStars, timeAgo } from '@stackpicks/core/utils';
import { Star, GitFork, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { UnlockCTA, FREE_CATEGORY_LIMIT } from '../../../components/UnlockCTA';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = adminClient();
  const category = await getCategoryBySlug(supabase, slug);
  if (!category) return {};
  return buildMeta({
    title: `Best ${category.name} — Open Source`,
    description:
      category.description ??
      `Top open-source ${category.name.toLowerCase()} libraries, curated with build-or-skip takes.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;
  const supabase = adminClient();

  const category = await getCategoryBySlug(supabase, slug);
  if (!category) notFound();

  const [repos, sponsored] = await Promise.all([
    listRepos(supabase, {
      categorySlug: slug,
      sort: (sort as any) ?? 'trending',
      limit: 48,
    }),
    getActiveSponsoredSlots(supabase, 'category_top', category.id),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd(category)) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
          {category.description && (
            <p className="text-muted mt-2">{category.description}</p>
          )}
        </div>

        {sponsored.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPONSORED</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {sponsored.map((slot) => (
                <a
                  key={slot.id}
                  href={`/go/sponsored/${slot.id}`}
                  className="p-4 rounded border border-accent/30 bg-accent/5 hover:bg-accent/10 transition"
                >
                  <div className="font-bold">{slot.external_name}</div>
                  <div className="text-sm text-muted">{slot.external_url}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 text-sm">
          {['trending', 'stars', 'newest', 'curated'].map((s) => (
            <a
              key={s}
              href={`?sort=${s}`}
              className={`px-3 py-1.5 rounded border transition ${
                (sort ?? 'trending') === s
                  ? 'border-accent text-accent'
                  : 'border-border text-muted hover:text-text'
              }`}
            >
              {s}
            </a>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {repos.slice(0, FREE_CATEGORY_LIMIT).map((repo) => (
            <a
              key={repo.id}
              href={`/repo/${repo.slug}`}
              className="p-5 rounded border border-border hover:border-accent transition"
            >
              <div className="font-mono text-xs text-muted">{repo.owner}</div>
              <div className="font-bold text-lg mb-1">{repo.name}</div>
              <p className="text-sm text-muted line-clamp-2 mb-3">{repo.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  {formatStars(repo.stars)}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" />
                  {formatStars(repo.forks)}
                </span>
                {repo.language && <span>{repo.language}</span>}
                {repo.pushed_at && <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>}
              </div>
            </a>
          ))}
        </div>

        {repos.length > FREE_CATEGORY_LIMIT && (
          <UnlockCTA totalLocked={repos.length - FREE_CATEGORY_LIMIT} context="category" />
        )}

        {repos.length === 0 && (
          <div className="py-20 text-center text-muted">
            No repos in this category yet. The scraper runs daily — check back tomorrow.
          </div>
        )}
      </div>
    </>
  );
}

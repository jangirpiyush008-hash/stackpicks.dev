import { adminClient, getRepoBySlug } from '@stackpicks/core/db';
import { buildMeta, softwareJsonLd } from '@stackpicks/core/seo';
import { formatStars, timeAgo, formatIST } from '@stackpicks/core/utils';
import { Star, GitFork, Eye, AlertCircle, ExternalLink, Check, X } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = adminClient();
  const repo = await getRepoBySlug(supabase, slug);
  if (!repo) return {};
  return buildMeta({
    title: `${repo.full_name}`,
    description: repo.curator_take ?? repo.description ?? `${repo.full_name} on GitHub`,
    path: `/repo/${slug}`,
  });
}

export default async function RepoPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = adminClient();
  const repo = await getRepoBySlug(supabase, slug);
  if (!repo) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd(repo)) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="font-mono text-sm text-muted">{repo.owner}</div>
          <h1 className="text-4xl font-bold tracking-tight mt-1">{repo.name}</h1>
          <p className="text-lg text-muted mt-3">{repo.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              {formatStars(repo.stars)} stars
            </span>
            <span className="flex items-center gap-1.5">
              <GitFork className="w-4 h-4" />
              {formatStars(repo.forks)} forks
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {formatStars(repo.watchers)} watchers
            </span>
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {repo.open_issues} open issues
            </span>
            {repo.language && (
              <span className="px-2 py-0.5 rounded bg-surface border border-border">
                {repo.language}
              </span>
            )}
            {repo.license && (
              <span className="px-2 py-0.5 rounded bg-surface border border-border">
                {repo.license}
              </span>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <a
              href={`/go/repo/${repo.id}`}
              className="px-5 py-2.5 rounded bg-accent text-bg font-semibold inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded border border-border hover:border-text transition inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Visit homepage
              </a>
            )}
          </div>
        </div>

        {/* Curator take (the differentiator) */}
        {repo.curator_take && (
          <div className="mb-8 p-6 rounded border border-accent/30 bg-accent/5">
            <div className="text-xs font-mono text-accent mb-2">EDITOR'S TAKE</div>
            <p className="text-text">{repo.curator_take}</p>
          </div>
        )}

        {(repo.use_this_if || repo.skip_if) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {repo.use_this_if && (
              <div className="p-5 rounded border border-border">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-accent">
                  <Check className="w-4 h-4" />
                  Use this if
                </div>
                <p className="text-sm text-muted">{repo.use_this_if}</p>
              </div>
            )}
            {repo.skip_if && (
              <div className="p-5 rounded border border-border">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-red-400">
                  <X className="w-4 h-4" />
                  Skip if
                </div>
                <p className="text-sm text-muted">{repo.skip_if}</p>
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        {repo.categories.length > 0 && (
          <div className="mb-8">
            <div className="text-sm text-muted mb-2">Categories</div>
            <div className="flex flex-wrap gap-2">
              {repo.categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-3 py-1 rounded border border-border hover:border-accent text-sm transition"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="mb-8">
            <div className="text-sm text-muted mb-2">Topics</div>
            <div className="flex flex-wrap gap-2">
              {repo.topics.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-surface border border-border text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-muted border-t border-border pt-6">
          {repo.github_created_at && (
            <div>Created {formatIST(repo.github_created_at)}</div>
          )}
          {repo.pushed_at && <div>Last push {timeAgo(repo.pushed_at)}</div>}
          <div className="mt-1">Stats refreshed {timeAgo(repo.updated_at)}</div>
        </div>
      </div>
    </>
  );
}

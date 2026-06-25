import { adminClient, getRepoBySlug } from '@stackpicks/core/db';
import { getRepoUpvoteCount } from '@stackpicks/core/db/queries';
import { buildMeta, softwareJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';
import { formatStars, timeAgo, formatIST } from '@stackpicks/core/utils';
import { Star, GitFork, Eye, AlertCircle, ExternalLink, Check, X, Zap, Target, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EmbedBadge } from '../../../components/EmbedBadge';
import { RepoOwnerLink } from '../../../components/RepoOwnerLink';
import { UpvoteButton } from '../../../components/UpvoteButton';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = adminClient();
  const repo = await getRepoBySlug(supabase, slug);
  if (!repo) return {};
  const lang = repo.language ? ` (${repo.language})` : '';
  // Bing + Google reward 140-170 char meta descriptions. Always pad short
  // curator takes with stars + use-case context so we never ship a sub-120
  // char description, which Bing flags as "too short to provide context".
  const take = (repo.curator_take ?? repo.description ?? '').trim();
  const stars = formatStars(repo.stars);
  const suffix = ` Curator take, install guide, alternatives, license details${repo.stars ? ` — ${stars} stars on GitHub.` : '.'}`;
  let description = take.length >= 130 ? take.slice(0, 158).trim() : `${take}${take ? '.' : ''}${suffix}`.trim();
  if (description.length > 170) description = description.slice(0, 167).trim() + '…';
  if (description.length < 130) description = `${repo.full_name} on GitHub${lang}: curator take, install guide, open-source alternatives, and honest "use this if / skip if" clauses. ${stars} GitHub stars.`;
  return buildMeta({
    title: `${repo.full_name} — GitHub repo review${lang} · pros, cons, alternatives`,
    description,
    path: `/repo/${slug}`,
  });
}

export default async function RepoPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = adminClient();
  const repo = await getRepoBySlug(supabase, slug);
  if (!repo) notFound();

  // Real IP-hashed upvote count — feeds the UpvoteButton initial state AND
  // the aggregateRating JSON-LD when the count crosses the threshold.
  const upvoteCount = await getRepoUpvoteCount(supabase, repo.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd(repo, upvoteCount)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Browse', path: '/preview' },
            { name: repo.name, path: `/repo/${slug}` },
          ])),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <RepoOwnerLink owner={repo.owner} size="md" showLabel />
          <h1 className="text-4xl font-bold tracking-tight mt-2">{repo.name}</h1>
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

          <div className="flex flex-wrap items-center gap-3 mt-6">
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
            <UpvoteButton repoId={repo.id} initialCount={upvoteCount} />
          </div>
        </div>

        {/* TL;DR card — quick scan for new visitors */}
        <section
          aria-labelledby="tldr-heading"
          className="mb-8 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-6 md:p-7"
        >
          <h2
            id="tldr-heading"
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-4 inline-flex items-center gap-2"
          >
            <Zap className="w-3 h-3" />
            TL;DR · 30-second scan
          </h2>

          <div className="space-y-4">
            {/* What it is */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                  What it is
                </div>
                <p className="text-text leading-relaxed">
                  <strong className="font-bold">{repo.name}</strong>{repo.language ? ` (${repo.language})` : ''} — {repo.description ?? `${repo.full_name} on GitHub.`}
                </p>
              </div>
            </div>

            {/* What it does for you */}
            {repo.use_this_if && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    What it does for you
                  </div>
                  <p className="text-text leading-relaxed">{repo.use_this_if}</p>
                </div>
              </div>
            )}

            {/* Best for / Categories */}
            {repo.categories.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                    Best for
                  </div>
                  <p className="text-text leading-relaxed">
                    {repo.categories.map((c) => c.name).join(' · ')}
                  </p>
                </div>
              </div>
            )}

            {/* Quick stats inline */}
            <div className="flex items-center gap-4 text-xs text-muted pt-2 border-t border-accent/15">
              <span className="inline-flex items-center gap-1.5">
                <Star className="w-3 h-3 text-accent" />
                <strong className="text-text">{formatStars(repo.stars)}</strong> GitHub stars
              </span>
              {repo.license && (
                <span className="inline-flex items-center gap-1.5">
                  License: <strong className="text-text">{repo.license}</strong>
                </span>
              )}
              {repo.pushed_at && (
                <span>Last updated {timeAgo(repo.pushed_at)}</span>
              )}
            </div>
          </div>
        </section>

        {/* Curator take (the differentiator) */}
        {repo.curator_take && (
          <div className="mb-8 p-6 rounded border border-accent/30 bg-accent/5">
            <div className="text-xs font-mono text-accent mb-2 inline-flex items-center gap-2">
              EDITOR'S DEEP TAKE
            </div>
            <p className="text-text leading-relaxed">{repo.curator_take}</p>
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

        {/* Embed badge — drives backlinks from OSS maintainers */}
        <EmbedBadge slug={slug} repoName={repo.full_name} />

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

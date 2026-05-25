import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  ExternalLink,
  Check,
  X,
  ArrowLeft,
  Github,
  Sparkles,
  Calendar,
  GitBranch,
  Archive,
} from 'lucide-react';
import { fetchGhRepo, fetchGhReadme, langColor } from '../../../../lib/github-preview';
import { getSeedByFullName } from '../../../../lib/preview-source';
import { CATEGORY_BY_SLUG } from '../../../../lib/categories';
import { formatStars, timeAgo, formatIST } from '@stackpicks/core/utils';

export const revalidate = 1800;

interface Props {
  params: Promise<{ owner: string; name: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { owner, name } = await params;
  return {
    title: `${owner}/${name} — Live preview`,
    description: `StackPicks live preview for ${owner}/${name}`,
  };
}

export default async function RepoPreviewPage({ params }: Props) {
  const { owner, name } = await params;
  const repo = await fetchGhRepo(owner, name);
  if (!repo) notFound();

  const seed = getSeedByFullName(`${owner}/${name}`);
  const { content: readmeHtml, truncated } = await fetchGhReadme(owner, name);
  const lc = langColor(repo.language);
  const ageDays = Math.max(
    1,
    Math.floor((Date.now() - new Date(repo.created_at).getTime()) / 86400000)
  );
  const starsPerDay = Math.round(repo.stargazers_count / ageDays);

  // GitHub's social preview image — actual screenshot of the repo card with description.
  const ogImage = `https://opengraph.githubassets.com/1/${repo.owner.login}/${repo.name}`;

  // Best-effort install snippet inferred from primary language.
  const installSnippet = inferInstall(repo);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/preview"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to gallery
      </Link>

      {/* Visual preview banner — GitHub's actual social card image */}
      <div className="mb-6 rounded-2xl border border-border overflow-hidden bg-surface/40">
        <img
          src={ogImage}
          alt={`${repo.full_name} on GitHub — ${repo.description ?? 'open-source project preview'}`}
          width={1200}
          height={600}
          className="w-full h-auto block"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Top card */}
      <div
        className="rounded-2xl border border-border bg-gradient-to-br from-surface to-bg p-7 mb-6 relative overflow-hidden"
        style={{ boxShadow: `inset 0 1px 0 0 ${lc}22` }}
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: lc }} />
        <div className="relative">
          <div className="flex items-start gap-4 mb-5">
            <a
              href={`https://github.com/${repo.owner.login}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              title={`${repo.owner.login} on GitHub — original maintainer`}
              className="shrink-0"
            >
              <img
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                width={56}
                height={56}
                className="rounded-lg border border-border bg-surface hover:border-accent transition"
              />
            </a>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted">
                <span className="text-muted/70 text-xs">Built by</span>
                <a
                  href={`https://github.com/${repo.owner.login}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="font-mono text-text hover:text-accent transition inline-flex items-center gap-1"
                  title={`${repo.owner.login} on GitHub`}
                >
                  {repo.owner.login}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <span className="text-muted/50">/</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
                {repo.name}
              </h1>
              {repo.description && (
                <p className="text-muted mt-2 max-w-2xl">{repo.description}</p>
              )}
            </div>
            {repo.archived && (
              <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Archive className="w-3 h-3" /> Archived
              </span>
            )}
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <Stat icon={<Star className="w-4 h-4" />} label="Stars" value={formatStars(repo.stargazers_count)} accent />
            <Stat icon={<GitFork className="w-4 h-4" />} label="Forks" value={formatStars(repo.forks_count)} />
            <Stat icon={<Eye className="w-4 h-4" />} label="Watchers" value={formatStars(repo.watchers_count)} />
            <Stat icon={<AlertCircle className="w-4 h-4" />} label="Open issues" value={String(repo.open_issues_count)} />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-5">
            {repo.language && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-surface">
                <span className="w-2 h-2 rounded-full" style={{ background: lc }} />
                {repo.language}
              </span>
            )}
            {repo.license && (
              <span className="px-2.5 py-1 rounded-full border border-border bg-surface text-muted">
                {repo.license.spdx_id ?? repo.license.name}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full border border-border bg-surface text-muted inline-flex items-center gap-1.5">
              <GitBranch className="w-3 h-3" /> {repo.default_branch}
            </span>
            <span className="px-2.5 py-1 rounded-full border border-border bg-surface text-muted inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Updated {timeAgo(repo.pushed_at)}
            </span>
            <span className="px-2.5 py-1 rounded-full border border-border bg-surface text-muted">
              ~{starsPerDay.toLocaleString('en-IN')} stars/day lifetime
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-accent text-bg font-semibold inline-flex items-center gap-2 text-sm hover:opacity-90 transition"
            >
              <Github className="w-4 h-4" />
              Open on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-border hover:border-text transition inline-flex items-center gap-2 text-sm"
              >
                Homepage
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Curator take */}
      {seed ? (
        <div className="rounded-2xl border border-accent/40 bg-accent/5 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-wider text-accent">Editor&apos;s take</span>
          </div>
          <p className="text-text leading-relaxed">{seed.curator_take}</p>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-lg bg-bg/40 border border-border">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-accent">
                <Check className="w-4 h-4" /> Use this if
              </div>
              <p className="text-sm text-muted">{seed.use_this_if}</p>
            </div>
            <div className="p-4 rounded-lg bg-bg/40 border border-border">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-red-400">
                <X className="w-4 h-4" /> Skip if
              </div>
              <p className="text-sm text-muted">{seed.skip_if}</p>
            </div>
          </div>
          {seed.category_slugs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {seed.category_slugs.map((slug) => (
                <span
                  key={slug}
                  className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-border/50 text-muted"
                >
                  {CATEGORY_BY_SLUG[slug]?.name ?? slug}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-6 mb-6 text-center">
          <Sparkles className="w-5 h-5 text-muted mx-auto mb-2" />
          <p className="text-sm text-muted">
            No curator take yet — this repo isn&apos;t in the StackPicks directory.
            <br />
            Add it via{' '}
            <span className="font-mono text-accent">/add-repo {repo.full_name}</span> to write one.
          </p>
        </div>
      )}

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="mb-6">
          <div className="text-xs text-muted mb-2 font-mono uppercase tracking-wider">Topics</div>
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-full border border-border bg-surface/60 text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick-install snippet */}
      {installSnippet && (
        <div className="mb-6 rounded-2xl border border-border bg-surface/40 p-5">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
            Quick install
          </div>
          <pre className="px-4 py-3 rounded-lg bg-bg/70 border border-border text-[13px] font-mono leading-relaxed overflow-x-auto text-text whitespace-pre">
{installSnippet}
          </pre>
          <p className="text-[11px] text-muted mt-2">
            Inferred from <span className="font-mono">{repo.language ?? 'package'}</span> · always
            double-check against the official README below.
          </p>
        </div>
      )}

      {/* README — always open, full visual rendering */}
      {readmeHtml && (
        <div className="rounded-2xl border border-border bg-surface/40 p-6 mb-6">
          <div className="text-sm font-semibold mb-4 flex items-center gap-2 pb-3 border-b border-border">
            <Github className="w-4 h-4 text-muted" />
            README — rendered from {repo.full_name}
            {truncated && <span className="text-[10px] font-mono text-muted ml-auto">(truncated)</span>}
          </div>
          <div
            className="prose-preview"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </div>
      )}

      <div className="text-xs text-muted text-center border-t border-border pt-6">
        Live data via GitHub REST API · Cached 30 min · Created {formatIST(repo.created_at)}
      </div>
    </div>
  );
}

/**
 * Best-effort install instructions inferred from the repo's language + name.
 * Conservative: only emits a snippet for high-confidence cases. README is the
 * source of truth and always rendered below.
 */
function inferInstall(repo: { language: string | null; name: string; full_name: string; owner: { login: string }; html_url: string }): string | null {
  const lang = repo.language?.toLowerCase();
  const slug = repo.name.toLowerCase();
  const full = repo.full_name.toLowerCase();

  // Famous package names that map to known registries
  const NPM_HINTS = ['next', 'react', 'vite', 'svelte', 'astro', 'tailwind', 'shadcn', 'radix', 'zod', 'lucia', 'better-auth', 'tanstack', 'zustand', 'jotai', 'tiptap', 'lexical', 'drizzle', 'prisma', 'kysely', 'react-email', 'maizzle', 'recharts', 'echarts', 'd3', 'biome', 'turbo', 'tsx'];
  const PY_HINTS = ['scrapy', 'crawl4ai', 'firecrawl', 'aider'];
  const GO_HINTS = ['colly', 'gocolly'];
  const SELFHOST_HINTS = ['supabase', 'medusa', 'directus', 'strapi', 'payload', 'plausible', 'umami', 'posthog', 'meilisearch', 'typesense', 'pocketbase', 'ollama', 'chroma', 'weaviate', 'milvus'];

  if (SELFHOST_HINTS.some((h) => full.includes(h))) {
    return `# Self-hosted — clone + run with Docker (most projects ship a docker-compose.yml)
git clone ${repo.html_url}
cd ${repo.name}
docker compose up -d

# Or follow the official deploy guide in the README below.`;
  }

  if (lang === 'typescript' || lang === 'javascript' || NPM_HINTS.some((h) => slug.includes(h))) {
    return `# Install via npm / pnpm / bun:
pnpm add ${repo.name}
# or
npm install ${repo.name}`;
  }

  if (lang === 'python' || PY_HINTS.some((h) => slug.includes(h))) {
    return `# Install via pip:
pip install ${repo.name}
# or with uv (recommended):
uv pip install ${repo.name}`;
  }

  if (lang === 'go' || GO_HINTS.some((h) => slug.includes(h))) {
    return `# Install as Go dependency:
go get github.com/${repo.owner.login}/${repo.name}`;
  }

  if (lang === 'rust') {
    return `# Add to Cargo.toml:
cargo add ${repo.name}`;
  }

  // Fallback — at least give git clone
  return `# Clone + explore:
git clone ${repo.html_url}
cd ${repo.name}
# Then read the README below for setup steps.`;
}

function Stat({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        accent ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface/40'
      }`}
    >
      <div className={`flex items-center gap-1.5 text-[11px] mb-1 ${accent ? 'text-accent' : 'text-muted'}`}>
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

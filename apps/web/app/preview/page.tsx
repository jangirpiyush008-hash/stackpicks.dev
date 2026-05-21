import Link from 'next/link';
import {
  Sparkles, ArrowRight, Github, Star, Check, X,
  Rocket, Smartphone, Brain, Globe, LayoutDashboard, Chrome, Workflow,
  Megaphone, Handshake, ShoppingBag, Terminal, PenLine, type LucideIcon,
} from 'lucide-react';
import { SEED_REPOS, ownerOf, nameOf } from '../../lib/preview-source';
import { CATEGORIES, CATEGORY_BY_SLUG } from '../../lib/categories';
import { INTENT_GROUPS, expandQuery } from '../../lib/intent-presets';
import { USE_CASE_BUNDLES } from '../../lib/use-case-bundles';

const BUNDLE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket, smartphone: Smartphone, brain: Brain, globe: Globe,
  'layout-dashboard': LayoutDashboard, chrome: Chrome, workflow: Workflow,
  megaphone: Megaphone, handshake: Handshake, 'shopping-bag': ShoppingBag,
  terminal: Terminal, 'pen-line': PenLine,
};

export const metadata = {
  title: 'Preview — the curated 104',
  description: 'Visual preview of every repo in the StackPicks v1 directory. No login, no DB — pure curator opinion.',
};

type SearchParams = { cat?: string; q?: string };

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { cat, q } = await searchParams;
  const activeCat = cat?.trim().toLowerCase() || null;
  const rawQuery = q?.trim() || null;
  const tokens = rawQuery ? expandQuery(rawQuery) : [];

  const filtered = SEED_REPOS.filter((r) => {
    if (activeCat && !r.category_slugs.includes(activeCat)) return false;
    if (tokens.length === 0) return true;
    const catNames = r.category_slugs
      .map((s) => CATEGORY_BY_SLUG[s]?.name?.toLowerCase() ?? s)
      .join(' ');
    const hay = `${r.full_name} ${r.category_slugs.join(' ')} ${catNames} ${r.curator_take} ${r.use_this_if} ${r.skip_if}`.toLowerCase();
    return tokens.some((t) => hay.includes(t));
  });

  const counts = new Map<string, number>();
  for (const r of SEED_REPOS) for (const c of r.category_slugs) counts.set(c, (counts.get(c) ?? 0) + 1);

  const featured = filtered.filter((r) => r.is_featured).slice(0, 3);
  const featuredSet = new Set(featured.map((r) => r.full_name));
  const rest = filtered.filter((r) => !featuredSet.has(r.full_name));
  const isFiltered = !!(activeCat || rawQuery);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[140px]" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Preview mode — {SEED_REPOS.length} repos, zero database</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-5">
              The open-source stack,
              <br />
              <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                curated by builders.
              </span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
              Tell us what you&apos;re building or what you need. We&apos;ll surface the right repo,
              with an honest take on whether to use it.
            </p>
            <form action="/preview" method="get" className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface/80 backdrop-blur focus-within:border-accent transition shadow-lg shadow-accent/5">
                <Github className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  name="q"
                  defaultValue={rawQuery ?? ''}
                  placeholder="What are you building? 'mobile app', 'auth + payments', 'AI agent', 'shadcn/ui'..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted/60"
                />
                <button className="text-xs font-mono text-muted hover:text-accent transition shrink-0">↵ search</button>
              </div>
              <p className="text-xs text-muted mt-3">
                Or paste a GitHub repo — <span className="font-mono text-accent">owner/repo</span> — to preview it live.
              </p>
            </form>
          </div>

          {/* Intent preset chips */}
          {!isFiltered && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {INTENT_GROUPS.map((group) => (
                <div key={group.title} className="flex flex-wrap items-center gap-2 justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted/70 mr-1">
                    {group.title}
                  </span>
                  {group.items.map((it) => (
                    <Link
                      key={it.label}
                      href={`/preview?q=${encodeURIComponent(it.query)}`}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface/60 hover:border-accent hover:text-accent transition"
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category filter strip */}
      <section className="border-b border-border sticky top-[57px] bg-bg/85 backdrop-blur z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            <Link
              href="/preview"
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition border ${
                !activeCat && !rawQuery
                  ? 'bg-accent text-bg border-accent font-semibold'
                  : 'border-border text-muted hover:border-text hover:text-text'
              }`}
            >
              All <span className="opacity-60 ml-1">{SEED_REPOS.length}</span>
            </Link>
            {CATEGORIES.filter((c) => counts.get(c.slug)).map((c) => {
              const active = activeCat === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/preview?cat=${c.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition border ${
                    active
                      ? 'bg-accent text-bg border-accent font-semibold'
                      : 'border-border text-muted hover:border-text hover:text-text'
                  }`}
                >
                  {c.name}
                  <span className="opacity-60 ml-1">{counts.get(c.slug)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* "What are you building?" bundles strip */}
      {!isFiltered && (
        <section className="border-b border-border bg-bg/30">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold">What are you building today?</h2>
              <Link href="/build" className="text-xs text-muted hover:text-accent transition">
                All {USE_CASE_BUNDLES.length} bundles →
              </Link>
            </div>
            <p className="text-sm text-muted mb-6 max-w-2xl">
              Each bundle is a full stack — UI, auth, DB, payments, the works. Open one, feed it to
              your AI agent, ship the thing. <Link href="/how-to-use" className="text-accent underline underline-offset-2">How it works →</Link>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {USE_CASE_BUNDLES.slice(0, 8).map((b) => {
                const Icon = BUNDLE_ICONS[b.icon] ?? Rocket;
                const repoCount = b.sections.reduce((n, s) => n + s.repos.length, 0);
                return (
                  <Link
                    key={b.slug}
                    href={`/build/${b.slug}`}
                    className="group rounded-xl border border-border bg-surface/40 p-4 hover:border-accent/60 transition relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${b.gradient} opacity-20 group-hover:opacity-35 transition`} />
                    <div className="w-9 h-9 rounded-lg bg-bg/70 backdrop-blur border border-border flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="font-semibold text-sm mb-1 group-hover:text-accent transition">{b.title}</div>
                    <div className="text-[11px] text-muted line-clamp-2 mb-2">{b.pitch}</div>
                    <div className="text-[10px] font-mono text-muted/70">{repoCount} repos</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Active filter pill */}
        {isFiltered && (
          <div className="flex items-center gap-2 mb-5 text-sm">
            <span className="text-muted">Filtered by</span>
            {rawQuery && (
              <span className="px-2.5 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent font-mono text-xs">
                “{rawQuery}”
              </span>
            )}
            {activeCat && (
              <span className="px-2.5 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs">
                {CATEGORY_BY_SLUG[activeCat]?.name ?? activeCat}
              </span>
            )}
            <Link href="/preview" className="text-xs text-muted hover:text-text underline underline-offset-2">
              clear
            </Link>
          </div>
        )}

        {/* Featured row */}
        {featured.length > 0 && !isFiltered && (
          <section className="mb-14">
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="text-xl font-bold">Editor&apos;s picks</h2>
              <span className="text-xs text-muted">— the ones we&apos;d ship with tomorrow</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featured.map((r) => (
                <RepoCard key={r.full_name} repo={r} featured />
              ))}
            </div>
          </section>
        )}

        {/* Result count */}
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl font-bold">
            {rawQuery ? `Matches for "${rawQuery}"` : activeCat ? CATEGORY_BY_SLUG[activeCat]?.name : 'The full list'}
          </h2>
          <span className="text-xs text-muted">{(isFiltered ? filtered : rest).length} repos</span>
        </div>

        {(isFiltered ? filtered : rest).length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <p className="text-muted">
              No curated repo matches that yet. Try a different keyword — or paste an{' '}
              <span className="font-mono text-accent">owner/repo</span> in the top bar to preview any GitHub repo live.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(isFiltered ? filtered : rest).map((r) => (
              <RepoCard key={r.full_name} repo={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RepoCard({ repo, featured = false }: { repo: typeof SEED_REPOS[number]; featured?: boolean }) {
  const owner = ownerOf(repo);
  const name = nameOf(repo);
  return (
    <Link
      href={`/preview/${owner}/${name}`}
      className={`group block rounded-xl border p-5 transition relative overflow-hidden ${
        featured
          ? 'border-accent/40 bg-gradient-to-br from-accent/10 via-surface/40 to-transparent hover:border-accent'
          : 'border-border bg-surface/40 hover:border-text/40'
      }`}
    >
      {featured && (
        <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-accent flex items-center gap-1">
          <Star className="w-3 h-3 fill-accent" /> Pick
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={`https://avatars.githubusercontent.com/${owner}`}
          alt=""
          width={36}
          height={36}
          className="rounded-md border border-border bg-surface"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="font-mono text-[11px] text-muted truncate">{owner}</div>
          <div className="font-bold text-base leading-tight group-hover:text-accent transition truncate">{name}</div>
        </div>
      </div>
      <p className="text-sm text-muted line-clamp-3 mb-4 leading-relaxed">
        {repo.curator_take.length > 200 ? repo.curator_take.slice(0, 200).trimEnd() + '…' : repo.curator_take}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {repo.category_slugs.slice(0, 3).map((slug) => (
          <span
            key={slug}
            className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-border/50 text-muted"
          >
            {CATEGORY_BY_SLUG[slug]?.name ?? slug}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-border/60">
        <div className="flex items-start gap-1.5">
          <Check className="w-3 h-3 text-accent shrink-0 mt-0.5" />
          <span className="text-muted line-clamp-2">{repo.use_this_if}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <X className="w-3 h-3 text-red-400/80 shrink-0 mt-0.5" />
          <span className="text-muted line-clamp-2">{repo.skip_if}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted">
        <span className="font-mono">{repo.full_name}</span>
        <span className="flex items-center gap-1 group-hover:text-accent transition">
          View <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import { Sparkles, ArrowRight, Github, Star, Check, X } from 'lucide-react';
import { SEED_REPOS, ownerOf, nameOf } from '../../lib/preview-source';
import { CATEGORIES, CATEGORY_BY_SLUG } from '../../lib/categories';

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
  const query = q?.trim().toLowerCase() || null;

  const filtered = SEED_REPOS.filter((r) => {
    if (activeCat && !r.category_slugs.includes(activeCat)) return false;
    if (query) {
      const hay = `${r.full_name} ${r.curator_take} ${r.use_this_if} ${r.skip_if}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const counts = new Map<string, number>();
  for (const r of SEED_REPOS) for (const c of r.category_slugs) counts.set(c, (counts.get(c) ?? 0) + 1);

  const featured = filtered.filter((r) => r.is_featured).slice(0, 3);
  const rest = filtered.filter((r) => !r.is_featured || !featured.includes(r));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[140px]" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
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
            Every repo below has been read, used, and given a take. Stop scrolling GitHub trending.
            We tell you what to use, what to skip, and why.
          </p>
          <form action="/preview" method="get" className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface/80 backdrop-blur focus-within:border-accent transition">
              <Github className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={query ?? ''}
                placeholder="Filter the 104 — try 'auth', 'next.js', 'razorpay'..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted/60"
              />
              <button className="text-xs font-mono text-muted hover:text-accent transition">↵</button>
            </div>
            <p className="text-xs text-muted mt-3">
              Or paste any <span className="font-mono text-accent">owner/repo</span> in the top bar
              to preview a repo not in the directory yet.
            </p>
          </form>
        </div>
      </section>

      {/* Category filter strip */}
      <section className="border-b border-border sticky top-[57px] bg-bg/85 backdrop-blur z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <Link
              href="/preview"
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition border ${
                !activeCat
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured row */}
        {featured.length > 0 && !query && !activeCat && (
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
            {query ? `Matches for "${query}"` : activeCat ? CATEGORY_BY_SLUG[activeCat]?.name : 'The full list'}
          </h2>
          <span className="text-xs text-muted">{rest.length} repos</span>
        </div>

        {rest.length === 0 ? (
          <div className="border border-border rounded-lg p-12 text-center">
            <p className="text-muted">No repos match. Try a different filter, or paste an owner/repo in the top bar to preview live.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((r) => (
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

import { redirect } from 'next/navigation';
import { adminClient } from '@stackpicks/core/db';
import { listRepos, listCategories, getActiveSponsoredSlots } from '@stackpicks/core/db';
import { formatStars, timeAgo } from '@stackpicks/core/utils';
import { SITE } from '@stackpicks/core/constants';
import { Star, GitFork, ExternalLink, Sparkles } from 'lucide-react';

export const revalidate = 3600; // ISR: rebuild hourly

export default async function HomePage() {
  // Until Supabase env is wired, send visitors to the static preview gallery.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect('/preview');
  }
  const supabase = adminClient();
  const [trending, categories, sponsored] = await Promise.all([
    listRepos(supabase, { sort: 'trending', limit: 12 }),
    listCategories(supabase),
    getActiveSponsoredSlots(supabase, 'homepage_featured'),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          The open-source stack,
          <br />
          <span className="text-accent">curated by builders.</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
          {SITE.description} Stop scrolling GitHub trending. We tell you what to use,
          what to skip, and why.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/category/ui-components"
            className="px-5 py-2.5 rounded bg-accent text-bg font-semibold"
          >
            Browse all categories
          </a>
          <a
            href="#trending"
            className="px-5 py-2.5 rounded border border-border hover:border-text transition"
          >
            See what's trending
          </a>
        </div>
      </section>

      {/* Sponsored slots */}
      {sponsored.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4 text-sm text-muted">
            <Sparkles className="w-4 h-4" />
            <span>Sponsored</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {sponsored.slice(0, 3).map((slot) => (
              <SponsoredCard key={slot.id} slot={slot} />
            ))}
          </div>
        </section>
      )}

      {/* Categories grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="p-4 rounded border border-border hover:border-accent transition group"
            >
              <div className="font-semibold group-hover:text-accent transition">{cat.name}</div>
              <div className="text-xs text-muted mt-1 line-clamp-2">{cat.description}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section id="trending" className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending this week</h2>
          <a href="/all" className="text-sm text-muted hover:text-text">See all →</a>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {trending.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </section>

      {/* Newsletter capture */}
      <section className="mb-16 p-8 rounded border border-border text-center">
        <h2 className="text-2xl font-bold mb-2">Weekly stack picks, in your inbox</h2>
        <p className="text-muted mb-6">One email Sunday morning. New tools, the take, no fluff.</p>
        <form action="/api/newsletter" method="post" className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            required
            placeholder="you@startup.com"
            className="flex-1 px-4 py-2 rounded bg-surface border border-border focus:border-accent outline-none"
          />
          <input type="hidden" name="source" value="homepage" />
          <button className="px-5 py-2 rounded bg-accent text-bg font-semibold">Subscribe</button>
        </form>
      </section>
    </div>
  );
}

function RepoCard({ repo }: { repo: Awaited<ReturnType<typeof listRepos>>[number] }) {
  return (
    <a
      href={`/repo/${repo.slug}`}
      className="block p-5 rounded border border-border hover:border-accent transition"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-mono text-xs text-muted">{repo.owner}</div>
          <div className="font-bold text-lg">{repo.name}</div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted" />
      </div>
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
  );
}

function SponsoredCard({ slot }: { slot: Awaited<ReturnType<typeof getActiveSponsoredSlots>>[number] }) {
  return (
    <a
      href={`/go/sponsored/${slot.id}`}
      className="block p-5 rounded border border-accent/30 bg-accent/5 hover:bg-accent/10 transition"
    >
      <div className="text-xs text-accent mb-2">SPONSORED</div>
      <div className="font-bold text-lg mb-1">{slot.external_name}</div>
      <p className="text-sm text-muted line-clamp-2">{slot.external_url}</p>
    </a>
  );
}

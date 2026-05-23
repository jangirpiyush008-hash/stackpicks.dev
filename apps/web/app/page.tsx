import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminClient } from '@stackpicks/core/db';
import { listRepos, listCategories, getActiveSponsoredSlots } from '@stackpicks/core/db';
import { formatStars, timeAgo } from '@stackpicks/core/utils';
import { SITE } from '@stackpicks/core/constants';
import {
  Star, GitFork, ExternalLink, Sparkles,
  Rocket, Smartphone, Brain, Globe, LayoutDashboard, Chrome, Workflow,
  Megaphone, Handshake, ShoppingBag, Terminal, PenLine, type LucideIcon,
} from 'lucide-react';
import { USE_CASE_BUNDLES } from '../lib/use-case-bundles';
import { UnlockCTA, FREE_TRENDING_LIMIT } from '../components/UnlockCTA';
import { Testimonials } from '../components/Testimonials';
import { VisualPreviews } from '../components/VisualPreviews';
import { HeroSearchBar } from '../components/HeroSearchBar';
import { RepoOwnerLink } from '../components/RepoOwnerLink';

const BUNDLE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket, smartphone: Smartphone, brain: Brain, globe: Globe,
  'layout-dashboard': LayoutDashboard, chrome: Chrome, workflow: Workflow,
  megaphone: Megaphone, handshake: Handshake, 'shopping-bag': ShoppingBag,
  terminal: Terminal, 'pen-line': PenLine,
};

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
      {/* Hero — centered search bar is the focal point */}
      <section className="relative pt-16 md:pt-20 pb-12 md:pb-16 text-center">
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/20 rounded-full blur-[140px]" />
          <div className="absolute top-32 right-10 w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[140px]" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-5">
          The open-source stack,
          <br />
          <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            curated by builders.
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted max-w-2xl mx-auto mb-8 px-2">
          Stop scrolling GitHub trending. Tell us what you&apos;re building — we surface the
          right repo with an honest take.
        </p>
        <HeroSearchBar />
      </section>

      {/* "What are you building?" bundles strip */}
      <section className="pb-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-bold">What are you building today?</h2>
          <Link href="/build" className="text-xs text-muted hover:text-accent transition">
            All {USE_CASE_BUNDLES.length} bundles →
          </Link>
        </div>
        <p className="text-sm text-muted mb-6 max-w-2xl">
          Each bundle is a full stack — UI, auth, DB, payments, the works. Open one, feed it to
          your AI agent, ship the thing.{' '}
          <Link href="/how-to-use" className="text-accent underline underline-offset-2">How it works →</Link>
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
          <a href="/pricing" className="text-sm text-muted hover:text-accent transition">Unlock all →</a>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {trending.slice(0, FREE_TRENDING_LIMIT).map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
        {trending.length > FREE_TRENDING_LIMIT && (
          <UnlockCTA totalLocked={trending.length - FREE_TRENDING_LIMIT} context="trending" />
        )}
      </section>

      {/* Visual previews — live GitHub social cards */}
      <VisualPreviews />

      {/* Testimonials */}
      <Testimonials />

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
        <div className="min-w-0">
          <RepoOwnerLink owner={repo.owner} size="xs" />
          <div className="font-bold text-lg mt-0.5 truncate">{repo.name}</div>
        </div>
        <ExternalLink className="w-4 h-4 text-muted shrink-0" />
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

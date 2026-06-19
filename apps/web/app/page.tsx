import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminClient } from '@stackpicks/core/db';
import { listRepos, listCategories, getActiveSponsoredSlots } from '@stackpicks/core/db';
import { formatStars, timeAgo } from '@stackpicks/core/utils';
import { SITE } from '@stackpicks/core/constants';
import {
  Star, GitFork, ExternalLink, Sparkles, ArrowUpRight,
  Rocket, Smartphone, Brain, Globe, LayoutDashboard, Chrome, Workflow,
  Megaphone, Handshake, ShoppingBag, Terminal, PenLine,
  LayoutGrid, Palette, Star as StarIcon, Lock, Database,
  CreditCard, Bot, FileCheck, ListTree, GitBranch, FlaskConical,
  PackageOpen, BarChart3, Mail, FileText, Search as SearchIcon,
  LineChart, FileCode2, AppWindow, type LucideIcon,
} from 'lucide-react';
import { USE_CASE_BUNDLES } from '../lib/use-case-bundles';
import { UnlockCTA, FREE_TRENDING_LIMIT } from '../components/UnlockCTA';
import { Testimonials } from '../components/Testimonials';
import { VisualPreviews } from '../components/VisualPreviews';
import { HeroSearchBar } from '../components/HeroSearchBar';
import { RepoOwnerLink } from '../components/RepoOwnerLink';
import { isConnectLaunched } from '../lib/connect-roadmap';

const BUNDLE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket, smartphone: Smartphone, brain: Brain, globe: Globe,
  'layout-dashboard': LayoutDashboard, chrome: Chrome, workflow: Workflow,
  megaphone: Megaphone, handshake: Handshake, 'shopping-bag': ShoppingBag,
  terminal: Terminal, 'pen-line': PenLine,
};

// Map category.icon strings (from supabase seed) → Lucide icons. Fallback is Package.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'layout-grid': LayoutGrid, palette: Palette, sparkles: Sparkles, star: StarIcon,
  lock: Lock, database: Database, 'credit-card': CreditCard, bot: Bot,
  smartphone: Smartphone, 'file-check': FileCheck, 'list-tree': ListTree,
  'git-branch': GitBranch, 'flask-conical': FlaskConical, 'package-open': PackageOpen,
  rocket: Rocket, 'bar-chart-3': BarChart3, mail: Mail, 'file-text': FileText,
  search: SearchIcon, 'line-chart': LineChart, 'file-code-2': FileCode2,
  'app-window': AppWindow, terminal: Terminal,
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

      {/* Categories grid — redesigned: lime icon tile + left stripe + arrow on hover */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-[11px] font-mono text-accent font-semibold tracking-[0.18em]">02</span>
              <span className="text-[11px] font-mono text-muted tracking-[0.18em] uppercase">Categories</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
          </div>
          <span className="text-xs text-muted font-mono">{categories.length} total</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const Icon = (cat.icon && CATEGORY_ICONS[cat.icon as string]) || LayoutGrid;
            return (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-r-xl border border-l-[3px] border-border border-l-accent/40 bg-surface/30 hover:border-accent hover:border-l-accent hover:bg-surface/50 transition p-4 flex items-start gap-3"
              >
                {/* Icon tile */}
                <div className="shrink-0 w-9 h-9 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-text group-hover:text-accent transition flex items-center gap-1.5">
                    {cat.name}
                  </div>
                  <div className="text-xs text-muted mt-0.5 line-clamp-2 leading-snug">{cat.description}</div>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition shrink-0 mt-0.5" />
              </a>
            );
          })}
        </div>
      </section>

      {/* StackPicks Connect promo strip — unified MCP gateway for AI agents */}
      <section className="mb-16">
        <div className="rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/[0.12] via-accent/[0.04] to-transparent p-6 md:p-10 relative overflow-hidden">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-3 px-3 py-1 rounded-full border border-accent/40 bg-accent/10">
                <Sparkles className="w-3 h-3" />
                StackPicks Connect · {isConnectLaunched() ? 'Beta' : 'Coming soon'}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
                Turn Claude into a real assistant.
              </h2>
              <p className="text-sm md:text-base text-muted leading-relaxed mb-5">
                Connect your apps once and give Claude, Cursor, and 50+ AI agents real-world capabilities —
                read your Gmail, post to Slack, open GitHub PRs, search Notion. One MCP, 500+ apps,
                bundled in lifetime access.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/connect"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-accent text-bg font-bold text-sm hover:opacity-90 transition"
                >
                  {isConnectLaunched() ? 'Explore the MCP Hub' : 'Preview + join waitlist'}
                </a>
                <a
                  href="/mcp"
                  className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full border border-white/15 hover:border-accent/50 text-sm transition"
                >
                  Browse MCP servers →
                </a>
              </div>
            </div>
            <div className="hidden md:flex flex-wrap gap-2 justify-end">
              {['GitHub','Gmail','Slack','Notion','Stripe','Linear','Drive','Discord','Figma','HubSpot','Supabase','Vercel'].map((n) => (
                <div
                  key={n}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface/40 text-xs font-medium"
                >
                  {n}
                </div>
              ))}
              <div className="px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-xs font-bold text-accent">
                + 488 more
              </div>
            </div>
          </div>
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
          <RepoOwnerLink owner={repo.owner} size="xs" showLabel />
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

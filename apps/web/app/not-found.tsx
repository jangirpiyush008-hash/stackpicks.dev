import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { Search, Compass, Sparkles, ArrowRight } from 'lucide-react';

// Branded 404 — Next.js serves this whenever a route or `notFound()` triggers.
// SEO purpose: give crawlers a useful hub to re-enter the site so a single broken
// inbound link doesn't bounce a session.
//
// Host-aware: on autodm.stackpicks.dev we surface AutoDM destinations (pricing,
// dashboard, blog) instead of the directory's repo/MCP catalog — otherwise the
// 404 looks like it leaked from the wrong product.
//
// Next.js automatically sets the HTTP status to 404 for this file — we do NOT need
// to override it (and overriding it via metadata is not supported here).

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for doesn\'t exist.',
  robots: { index: false, follow: true },
};

const DIRECTORY_POPULAR = [
  { href: '/preview',     label: 'Browse 165+ open-source repos',     hint: 'Curator takes + live GitHub stats' },
  { href: '/mcp',         label: '89 MCP servers for AI agents',      hint: 'Claude, Cursor, Cline, Windsurf' },
  { href: '/tools',       label: 'Best AI tools by use case',         hint: 'Realistic 2026 pricing' },
  { href: '/build',       label: 'Ready-to-ship stack bundles',       hint: 'SaaS, mobile, AI agent, scraper' },
  { href: '/alternatives',label: 'Open-source SaaS alternatives',     hint: '30+ replacement guides' },
  { href: '/blog',        label: 'Blog — long-form curator takes',    hint: 'New posts weekly' },
];

const AUTODM_POPULAR = [
  { href: '/',          label: 'AutoDM home',           hint: 'How comment-to-DM works' },
  { href: '/pricing',   label: 'Plans & pricing',       hint: 'Free, Creator, Pro, Agency, Enterprise' },
  { href: '/dashboard', label: 'Open the dashboard',    hint: 'Connect Instagram and ship rules' },
  { href: '/blog',      label: 'Blog',                  hint: 'IG automation playbooks' },
  { href: '/about',     label: 'About AutoDM',          hint: 'Who builds it and why' },
  { href: '/contact',   label: 'Contact us',            hint: 'Email, phone, support' },
];

export default async function NotFound() {
  const host = (await headers()).get('host')?.toLowerCase() ?? '';
  const isAutoDm = host === 'autodm.stackpicks.dev';

  const popular = isAutoDm ? AUTODM_POPULAR : DIRECTORY_POPULAR;
  const searchAction = isAutoDm ? '/' : '/preview';
  const searchPlaceholder = isAutoDm
    ? 'Search AutoDM docs and blog'
    : "Search 165+ open-source repos, e.g. 'auth', 'AI agent', 'self-hosted'";
  const headline = isAutoDm
    ? "That AutoDM page took a wrong turn."
    : 'That page took a wrong turn.';
  const subhead = isAutoDm
    ? "The URL you tried doesn't exist on AutoDM — paths get renamed, links rot. Jump to one of the popular pages below."
    : "The URL you tried doesn't exist — repos move, slugs get renamed, links rot. Try the search below, or jump to one of the most-visited pages.";

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 md:py-28">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 text-[10px] font-mono uppercase tracking-wider text-accent mb-6">
        <Compass className="w-3 h-3" />
        404 — page not found
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
        {headline}
      </h1>
      <p className="text-lg text-muted leading-relaxed max-w-2xl mb-10">
        {subhead}
      </p>

      {!isAutoDm && (
        <form action={searchAction} method="get" className="mb-12 flex items-center gap-2 max-w-xl">
          <label htmlFor="q" className="sr-only">Search the directory</label>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              id="q"
              name="q"
              type="search"
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-border bg-surface/40 focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition shrink-0"
          >
            Search
          </button>
        </form>
      )}

      <div className="mb-3 text-[10px] font-mono uppercase tracking-wider text-muted flex items-center gap-2">
        <Sparkles className="w-3 h-3" />
        Popular places to start
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {popular.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group flex items-start justify-between gap-3 p-4 rounded-xl border border-border bg-surface/30 hover:border-accent/40 hover:bg-accent/5 transition"
          >
            <div className="min-w-0">
              <div className="font-semibold text-sm text-text mb-0.5 leading-snug">{p.label}</div>
              <div className="text-xs text-muted leading-relaxed">{p.hint}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-border text-xs text-muted">
        Came from a broken link?{' '}
        <Link href="/contact" className="text-accent hover:underline">Let us know</Link>
        {' '}— we&apos;ll fix it.
      </div>
    </div>
  );
}

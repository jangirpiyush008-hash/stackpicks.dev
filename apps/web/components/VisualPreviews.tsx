'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, ArrowRight, Star, Image as ImageIcon, Globe } from 'lucide-react';

/**
 * Featured repos shown as live deployed-app previews on the homepage.
 * Each card renders a real screenshot of the project's actual website (the
 * polished product, not the GitHub repo page). The OG image on the GitHub
 * card is available via a hover/toggle.
 */
interface FeaturedRepo {
  full_name: string;
  short: string;
  demo_url: string;          // the actual deployed app — what users see
  accent: string;            // tailwind gradient for the hover glow
}

const FEATURED_REPOS: FeaturedRepo[] = [
  {
    full_name: 'shadcn-ui/ui',
    short: 'UI primitives you copy into your codebase',
    demo_url: 'https://ui.shadcn.com',
    accent: 'from-zinc-300/30 via-zinc-500/20 to-zinc-700/20',
  },
  {
    full_name: 'vercel/next.js',
    short: 'The React framework — App Router + Server Components',
    demo_url: 'https://nextjs.org',
    accent: 'from-zinc-200/20 via-zinc-400/10 to-zinc-600/10',
  },
  {
    full_name: 'supabase/supabase',
    short: 'Postgres + Auth + Storage + Edge Functions',
    demo_url: 'https://supabase.com',
    accent: 'from-emerald-400/30 via-teal-500/20 to-cyan-500/20',
  },
  {
    full_name: 'colinhacks/zod',
    short: 'TypeScript-first schema validation',
    demo_url: 'https://zod.dev',
    accent: 'from-blue-400/30 via-indigo-500/20 to-violet-500/20',
  },
  {
    full_name: 'better-auth/better-auth',
    short: 'The 2026 auth default — type-safe, plugin-driven',
    demo_url: 'https://www.better-auth.com',
    accent: 'from-pink-500/30 via-rose-500/20 to-orange-500/20',
  },
  {
    full_name: 'pmndrs/zustand',
    short: 'Bear necessities for React state — tiny + tree-shakable',
    demo_url: 'https://zustand-demo.pmnd.rs',
    accent: 'from-amber-400/30 via-orange-500/20 to-red-500/20',
  },
];

/**
 * Microlink generates a live screenshot of the URL and redirects to the image.
 * Free, no API key, more reliable than WordPress mshots for indie/dev sites.
 */
const microlink = (url: string, w = 1280, h = 720) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot&meta=false&embed=screenshot.url&viewport.width=${w}&viewport.height=${h}`;

const ghOg = (fullName: string) =>
  `https://opengraph.githubassets.com/1/${fullName}`;

export function VisualPreviews() {
  return (
    <section className="py-12 md:py-20 border-t border-border relative overflow-hidden">
      {/* Subtle radial backdrop */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/10 rounded-full blur-[140px]" />
      </div>

      <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur text-xs text-accent mb-5">
          <Globe className="w-3.5 h-3.5" />
          <span className="font-mono uppercase tracking-wider">After you ship — live deployed previews</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
          See what you&apos;ll{' '}
          <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            ship.
          </span>
        </h2>
        <p className="text-base md:text-lg text-muted leading-relaxed">
          Not the GitHub repo card — the actual deployed product. Live screenshots of every
          tool&apos;s real website, refreshed from the source. Hover any card to flip to its
          GitHub page.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURED_REPOS.map((repo) => (
            <PreviewCard key={repo.full_name} repo={repo} />
          ))}
        </div>

        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/preview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/40 bg-accent/5 hover:bg-accent/15 hover:border-accent transition text-sm font-semibold text-accent"
          >
            <Sparkles className="w-4 h-4" />
            Browse all 100+ deployed previews
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ repo }: { repo: FeaturedRepo }) {
  const [view, setView] = useState<'live' | 'github'>('live');
  const [failed, setFailed] = useState(false);
  const [owner, name] = repo.full_name.split('/');
  const avatar = `https://avatars.githubusercontent.com/${owner}`;
  // If live screenshot fails to load, gracefully fall back to GitHub OG card
  const imgSrc =
    view === 'live' && !failed
      ? microlink(repo.demo_url)
      : ghOg(repo.full_name);

  return (
    <div className="group relative">
      {/* Animated gradient glow on hover */}
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${repo.accent} opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none blur-sm`}
      />

      <div className="relative rounded-2xl border border-border bg-surface/50 backdrop-blur overflow-hidden h-full transition group-hover:border-accent/60">
        {/* Image area */}
        <Link
          href={`/preview/${owner}/${name}`}
          className="block aspect-[2/1] bg-bg border-b border-border overflow-hidden relative"
        >
          {/* Loading skeleton (visible until image loads) */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-bg">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-muted/30 mx-auto mb-2 animate-pulse" />
              <div className="text-[10px] font-mono text-muted/40 uppercase tracking-wider">
                Loading live screenshot…
              </div>
            </div>
          </div>
          <img
            key={imgSrc}
            src={imgSrc}
            alt={
              view === 'live'
                ? `Live screenshot of ${repo.full_name} — ${repo.short}. Deployed at ${new URL(repo.demo_url).hostname.replace(/^www\./, '')}.`
                : `GitHub repository card for ${repo.full_name} — ${repo.short}. Open-source on github.com.`
            }
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            onError={() => {
              // Live screenshot failed → fall back to GitHub OG card automatically
              if (view === 'live') setFailed(true);
            }}
          />

          {/* Bottom gradient + URL pill */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg/80 to-transparent pointer-events-none" />
          {view === 'live' && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-bg/90 backdrop-blur border border-border text-[10px] font-mono text-accent flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              {new URL(repo.demo_url).hostname.replace(/^www\./, '')}
            </div>
          )}
          {view === 'github' && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-bg/90 backdrop-blur border border-border text-[10px] font-mono text-muted">
              github.com / {repo.full_name}
            </div>
          )}

          {/* View → pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-accent/90 backdrop-blur text-bg text-[10px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition flex items-center gap-1 font-bold">
            Open
            <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </Link>

        {/* Toggle strip */}
        <div className="flex items-center gap-1 px-3 pt-3 border-b border-border/50">
          <ToggleButton
            active={view === 'live'}
            onClick={() => { setFailed(false); setView('live'); }}
          >
            <Globe className="w-3 h-3" />
            Live
          </ToggleButton>
          <ToggleButton active={view === 'github'} onClick={() => setView('github')}>
            <Star className="w-3 h-3" />
            GitHub
          </ToggleButton>
        </div>

        {/* Card meta */}
        <Link
          href={`/preview/${owner}/${name}`}
          className="block p-4 md:p-5 flex items-start gap-3"
        >
          <img
            src={avatar}
            alt=""
            width={36}
            height={36}
            className="rounded-md border border-border bg-surface shrink-0"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[11px] text-muted truncate">{owner}</div>
            <div className="font-bold text-base group-hover:text-accent transition truncate">
              {name}
            </div>
            <p className="text-xs text-muted mt-1 line-clamp-2">{repo.short}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[11px] font-mono px-2 py-1 rounded-md transition inline-flex items-center gap-1 ${
        active ? 'bg-accent/20 text-accent' : 'text-muted hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}

import Link from 'next/link';
import { Image as ImageIcon, ArrowRight, Sparkles, Star, Github } from 'lucide-react';

// Featured repos shown as visual previews on the homepage.
// Each one renders GitHub's actual social card (1280×640) so visitors see what
// the repo looks like before they click through. Real-time, no manual upkeep.
interface FeaturedRepo {
  full_name: string;
  short: string;
  // tailwind gradient classname for the card hover frame
  accent: string;
}

const FEATURED_REPOS: FeaturedRepo[] = [
  { full_name: 'shadcn-ui/ui',          short: 'The default UI primitives',     accent: 'from-fuchsia-500/30 via-indigo-500/20 to-cyan-500/20' },
  { full_name: 'vercel/next.js',        short: 'The framework default',          accent: 'from-zinc-300/20 via-zinc-500/10 to-zinc-700/10' },
  { full_name: 'supabase/supabase',     short: 'Postgres + Auth + Storage',     accent: 'from-emerald-400/30 via-teal-500/20 to-cyan-500/20' },
  { full_name: 'pmndrs/zustand',        short: 'Tiny state, no boilerplate',     accent: 'from-amber-400/30 via-orange-500/20 to-red-500/20' },
  { full_name: 'colinhacks/zod',        short: 'Schema validation everywhere',   accent: 'from-blue-400/30 via-indigo-500/20 to-violet-500/20' },
  { full_name: 'better-auth/better-auth', short: 'The 2026 auth default',        accent: 'from-pink-500/30 via-rose-500/20 to-orange-500/20' },
];

export function VisualPreviews() {
  return (
    <section className="py-12 md:py-20 border-t border-border relative overflow-hidden">
      {/* Subtle radial backdrop */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/10 rounded-full blur-[140px]" />
      </div>

      <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur text-xs text-accent mb-5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="font-mono uppercase tracking-wider">Live from GitHub</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
          See what you&apos;re{' '}
          <span className="bg-gradient-to-r from-accent via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            getting.
          </span>
        </h2>
        <p className="text-base md:text-lg text-muted leading-relaxed">
          Every repo page shows the actual GitHub social card, README, and live star count.
          No guesswork — you see the repo as the maintainer presents it.
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
            Browse all 100+ repos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ repo }: { repo: FeaturedRepo }) {
  const [owner, name] = repo.full_name.split('/');
  const ogImage = `https://opengraph.githubassets.com/1/${owner}/${name}`;
  const avatar = `https://avatars.githubusercontent.com/${owner}`;

  return (
    <Link
      href={`/preview/${owner}/${name}`}
      className="group relative block rounded-2xl overflow-hidden transition"
    >
      {/* Animated gradient border on hover */}
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${repo.accent} opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none blur-sm`}
      />

      <div className="relative rounded-2xl border border-border bg-surface/50 backdrop-blur overflow-hidden h-full transition group-hover:border-accent/60">
        {/* GitHub OG image */}
        <div className="aspect-[2/1] bg-bg border-b border-border overflow-hidden relative">
          {/* Skeleton fallback (shows if image fails) */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-bg">
            <Github className="w-10 h-10 text-muted/30" />
          </div>
          <img
            src={ogImage}
            alt={`${repo.full_name} repository preview`}
            className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          {/* Bottom gradient for legibility of any future overlays */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg/80 to-transparent pointer-events-none" />
          {/* "View on hover" pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-bg/90 backdrop-blur border border-border text-[10px] font-mono uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
            View
            <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Card meta */}
        <div className="p-4 md:p-5 flex items-start gap-3">
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
            <div className="font-bold text-base group-hover:text-accent transition truncate">{name}</div>
            <p className="text-xs text-muted mt-1 line-clamp-1">{repo.short}</p>
          </div>
          <Star className="w-3.5 h-3.5 text-muted/50 group-hover:text-accent transition shrink-0" />
        </div>
      </div>
    </Link>
  );
}

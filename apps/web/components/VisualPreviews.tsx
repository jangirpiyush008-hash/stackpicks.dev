import Link from 'next/link';
import { Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react';

// Featured repos shown as visual previews on the homepage.
// Each one renders GitHub's actual social card (1280×640) so visitors see what
// the repo looks like before they click through. Real-time, no manual upkeep.
const FEATURED_REPOS: { full_name: string; short: string }[] = [
  { full_name: 'shadcn-ui/ui', short: 'The default UI primitives' },
  { full_name: 'vercel/next.js', short: 'The framework default' },
  { full_name: 'supabase/supabase', short: 'Postgres + Auth + Storage' },
  { full_name: 'pmndrs/zustand', short: 'Tiny state, no boilerplate' },
  { full_name: 'colinhacks/zod', short: 'Schema validation everywhere' },
  { full_name: 'better-auth/better-auth', short: 'The 2026 auth default' },
];

export function VisualPreviews() {
  return (
    <section className="py-12 md:py-16 border-t border-border">
      <header className="text-center max-w-2xl mx-auto mb-10 md:mb-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-4">
          <ImageIcon className="w-3.5 h-3.5 text-accent" />
          <span>Visual previews — live from GitHub</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">
          See what you&apos;re getting.
        </h2>
        <p className="text-muted">
          Every repo page shows the actual GitHub social card, README, and live star count.
          No guesswork — you see the repo as the maintainer presents it.
        </p>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FEATURED_REPOS.map((repo) => (
            <PreviewCard key={repo.full_name} fullName={repo.full_name} short={repo.short} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/preview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:border-accent hover:text-accent transition text-sm"
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

function PreviewCard({ fullName, short }: { fullName: string; short: string }) {
  const [owner, name] = fullName.split('/');
  const ogImage = `https://opengraph.githubassets.com/1/${owner}/${name}`;
  return (
    <Link
      href={`/preview/${owner}/${name}`}
      className="group block rounded-xl border border-border bg-surface/40 overflow-hidden hover:border-accent/60 transition"
    >
      <div className="aspect-[2/1] bg-bg border-b border-border overflow-hidden">
        <img
          src={ogImage}
          alt={`${fullName} GitHub preview`}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="font-mono text-[11px] text-muted truncate">{owner}</div>
        <div className="font-bold text-base group-hover:text-accent transition truncate">{name}</div>
        <p className="text-xs text-muted mt-1.5 line-clamp-1">{short}</p>
      </div>
    </Link>
  );
}

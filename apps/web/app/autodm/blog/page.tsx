// AutoDM blog index — lists every post with title, excerpt, dates.
// All posts are about Meta IG automation, Private Reply API, ban
// avoidance, Meta Ads MCP. Stays focused so the subdomain ranks
// for IG-automation queries without polluting the main directory blog.

import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { listAutoDmBlogPosts } from '@/lib/autodm-blog';

export const metadata = {
  title: 'AutoDM Blog — Instagram automation, Meta APIs, ad MCPs explained',
  description:
    'Honest guides on Instagram auto-DM, Private Reply API, Meta Ads MCP, and what gets accounts banned in 2026. Updated weekly by Piyush.',
  alternates: { canonical: 'https://autodm.stackpicks.dev/blog' },
};

const CAT_COLORS: Record<string, string> = {
  'API guide':  'bg-accent/10 text-accent',
  'Compliance': 'bg-amber-500/15 text-amber-500',
  'How-to':     'bg-emerald-500/15 text-emerald-500',
  'Comparison': 'bg-purple-500/15 text-purple-400',
};

export default function AutoDmBlogIndex() {
  const posts = listAutoDmBlogPosts();
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">// AUTODM blog</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Instagram automation, explained.</h1>
        <p className="text-muted mt-3 max-w-xl">
          Private Reply API, Meta Ads MCP, account-ban prevention, the 24h and 7d messaging windows —
          deep technical guides from building StackPicks AutoDM. Updated weekly.
        </p>
      </header>

      <div className="space-y-1.5">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/autodm/blog/${p.slug}`}
            className="block rounded-xl border border-border hover:border-accent/40 bg-bg-card/30 hover:bg-bg-card/60 p-5 transition group"
          >
            <div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[p.category] || 'bg-muted/15 text-muted'}`}>
                {p.category}
              </span>
              <span className="text-xs text-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> {p.reading_time} min
              </span>
              <span className="text-xs text-muted">
                · {new Date(p.published_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-lg font-semibold leading-tight group-hover:text-accent transition">
              {p.title}
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">{p.excerpt}</p>
            <div className="text-xs text-muted mt-3 inline-flex items-center gap-1 group-hover:text-accent transition">
              Read post <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* SEO link block — connects the blog back into the AutoDM product */}
      <div className="mt-12 pt-8 border-t border-border text-sm">
        <div className="font-semibold mb-3">Want auto-DMs that actually deliver?</div>
        <p className="text-muted">
          StackPicks AutoDM ships with Private Reply, follower-aware DM bodies, account warming,
          and an AI follow-up agent. No browser bots. No password sharing. Just Meta\'s official Graph API,
          configured right.
        </p>
        <Link
          href="/autodm/connect"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-accent text-bg px-5 py-2.5 rounded-full hover:bg-accent/90 transition"
        >
          Connect Instagram <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </main>
  );
}

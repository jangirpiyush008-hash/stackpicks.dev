/**
 * Public changelog. Lists every shipped update in UPDATES (lib/whats-new.ts)
 * newest first, grouped by month. Indexable — picked up by sitemap so the
 * "what changed last week on StackPicks?" intent ranks.
 */
import Link from 'next/link';
import { buildMeta } from '@stackpicks/core/seo';
import { UPDATES, type WhatsNewItem } from '@/lib/whats-new';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = buildMeta({
  title: "What's new — StackPicks",
  description: 'Every new tool, MCP, skill, blog post, and AutoDM update on StackPicks.dev. Updated continuously, newest first.',
  path: '/whats-new',
});

function categoryLabel(c: WhatsNewItem['category']): string {
  const map: Record<WhatsNewItem['category'], string> = {
    mcp: 'MCP',
    tool: 'Tool',
    blog: 'Blog',
    skill: 'Skill',
    autodm: 'AutoDM',
    directory: 'Directory',
    feature: 'Feature',
  };
  return map[c];
}

function monthKey(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

export default function WhatsNewPage() {
  const sorted = [...UPDATES].sort((a, b) => (a.date < b.date ? 1 : -1));
  const grouped = new Map<string, WhatsNewItem[]>();
  for (const u of sorted) {
    const k = monthKey(u.date);
    const arr = grouped.get(k) ?? [];
    arr.push(u);
    grouped.set(k, arr);
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent">// changelog</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">What's new on StackPicks</h1>
        <p className="text-muted mt-3 text-base leading-relaxed">
          Every new tool, MCP, blog post, and AutoDM update — newest first.
          {' '}<Link href="/" className="text-accent hover:underline">Back home</Link>.
        </p>

        <div className="mt-10 space-y-12">
          {Array.from(grouped.entries()).map(([month, items]) => (
            <section key={month}>
              <div className="flex items-center gap-2 mb-4 text-muted">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono uppercase tracking-widest">{month}</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
              <ol className="space-y-4">
                {items.map((u) => (
                  <li key={u.id} className="group rounded-2xl border border-border bg-surface/30 hover:bg-surface/50 transition p-5">
                    <Link href={u.href} className="block">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30">
                          {categoryLabel(u.category)}
                        </span>
                        <span className="text-[11px] font-mono text-muted">
                          {new Date(u.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold leading-snug group-hover:text-accent transition">{u.title}</h2>
                      <p className="text-sm text-muted mt-1.5 leading-relaxed">{u.summary}</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-accent">
                        {u.cta ?? 'Open'} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

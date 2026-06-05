import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../lib/admin';
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, Loader2, Instagram } from 'lucide-react';
import { IgAdminTabs } from '../../../components/IgAdminTabs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Instagram Queue · Admin',
  robots: { index: false, follow: false },
};

interface QueueRow {
  id: string;
  post_type: 'reel' | 'video' | 'image' | 'carousel';
  topic: string;
  media_urls: string[];
  caption: string;
  hashtags: string;
  status: 'ready' | 'processing' | 'posted' | 'error';
  scheduled_at: string;
  posted_at: string | null;
  ig_post_id: string | null;
  attempts: number;
  last_error: string | null;
  created_at: string;
}

function fmtIST(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }) + ' IST';
}

function StatusPill({ status }: { status: QueueRow['status'] }) {
  const map = {
    ready:      { icon: Clock,         label: 'Ready',      cls: 'text-amber-300 border-amber-500/40 bg-amber-500/10' },
    processing: { icon: Loader2,       label: 'Processing', cls: 'text-blue-300 border-blue-500/40 bg-blue-500/10' },
    posted:     { icon: CheckCircle2,  label: 'Posted',     cls: 'text-accent border-accent/40 bg-accent/10' },
    error:      { icon: AlertTriangle, label: 'Error',      cls: 'text-rose-300 border-rose-500/40 bg-rose-500/10' },
  } as const;
  const it = map[status];
  const Icon = it.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${it.cls}`}>
      <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {it.label}
    </span>
  );
}

export default async function AdminInstagramPage() {
  const gate = await isAdmin();
  if (!gate.ok && !gate.email) redirect('/admin');
  if (!gate.ok) notFound();

  const supa = adminClient();
  const { data: rows = [] } = await supa
    .from('ig_queue')
    .select('*')
    .order('scheduled_at', { ascending: false })
    .limit(100);

  const items = (rows as unknown as QueueRow[]) ?? [];
  const counts = {
    ready:      items.filter((r) => r.status === 'ready').length,
    processing: items.filter((r) => r.status === 'processing').length,
    posted:     items.filter((r) => r.status === 'posted').length,
    error:      items.filter((r) => r.status === 'error').length,
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin" className="text-muted hover:text-text inline-flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" /> Admin
          </Link>
        </div>
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Instagram className="w-6 h-6 text-accent" />
              Instagram Queue
            </h1>
            <p className="text-muted text-sm mt-1">
              Auto-publishes via Meta Graph API. Cron runs every 30 min at <code className="text-accent">/api/cron/ig-publish</code>.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <Stat label="Ready"      n={counts.ready}      tint="text-amber-300" />
            <Stat label="Processing" n={counts.processing} tint="text-blue-300" />
            <Stat label="Posted"     n={counts.posted}     tint="text-accent" />
            <Stat label="Error"      n={counts.error}      tint="text-rose-300" />
          </div>
        </div>

        <IgAdminTabs
          rows={items}
          queueTable={
            <div className="rounded-xl border border-border bg-surface/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface/50 text-muted text-[10px] font-mono uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Topic</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Scheduled</th>
                    <th className="text-left px-4 py-3">Posted</th>
                    <th className="text-left px-4 py-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted">
                      No items in queue yet. Add one via <code className="text-accent">pnpm ig-queue ...</code>
                    </td></tr>
                  )}
                  {items.map((r) => (
                    <tr key={r.id} className="border-t border-border align-top">
                      <td className="px-4 py-3 font-medium">{r.topic}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted uppercase">{r.post_type}</td>
                      <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                      <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{fmtIST(r.scheduled_at)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">
                        {r.ig_post_id ? (
                          <a href={`https://instagram.com/p/${r.ig_post_id}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                            view ↗
                          </a>
                        ) : fmtIST(r.posted_at)}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted max-w-[280px]">
                        {r.last_error ? (
                          <span className="text-rose-300">⚠ {r.last_error.slice(0, 120)}</span>
                        ) : r.status === 'ready' && r.attempts > 0 ? (
                          <span className="text-amber-300">retry #{r.attempts}</span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />

        <details className="mt-8 text-sm text-muted">
          <summary className="cursor-pointer text-text font-medium">How to add a post</summary>
          <pre className="mt-3 p-4 bg-surface/30 border border-border rounded-lg text-xs overflow-x-auto"><code>{`# Reel (single video)
pnpm ig-queue path/to/video.mp4 --topic "what is stackpicks" --type reel

# Carousel (multiple slides)
pnpm ig-queue slide1.png slide2.png slide3.png --topic "22 apps" --type carousel

# Custom schedule
pnpm ig-queue video.mp4 --topic "google ads" --type reel --at "2026-06-05T14:30:00Z"`}</code></pre>
        </details>
      </div>
    </div>
  );
}

function Stat({ label, n, tint }: { label: string; n: number; tint: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className={`text-2xl font-semibold tabular-nums ${tint}`}>{n}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted mt-0.5">{label}</span>
    </div>
  );
}

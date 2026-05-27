'use client';

import { useMemo, useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import {
  CONNECT_APPS,
  CONNECT_CATEGORIES,
  type ConnectApp,
  type ConnectCategory,
} from '../lib/connect-apps';
import { AppLogo } from './AppLogo';

/**
 * Composio-style App Directory.
 *
 * Layout:
 *   ┌──────────┬───────────────────────────────────┐
 *   │ Sidebar  │  Search                           │
 *   │ - All    │  ──────────────────────────────── │
 *   │ - Live   │  Grid of logo cards (6 cols)      │
 *   │ - Dev    │                                   │
 *   │ ...      │                                   │
 *   └──────────┴───────────────────────────────────┘
 *
 * Defaults to "All apps" (672) so users see the full catalog immediately.
 */

interface ConnectedMap {
  [slug: string]: { id: string; accountLabel: string; status: string };
}

type FilterKey = 'all' | 'live' | ConnectCategory;

interface Props {
  connected: ConnectedMap;
  isAuthed: boolean;
}

export function ConnectDirectory({ connected, isAuthed }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Per-category counts (computed once)
  const counts = useMemo(() => {
    const out: Record<string, number> = { all: CONNECT_APPS.length, live: 0 };
    for (const a of CONNECT_APPS) {
      if (a.status === 'live') out.live++;
      out[a.category] = (out[a.category] ?? 0) + 1;
    }
    return out;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let pool: ConnectApp[] = CONNECT_APPS;
    if (filter === 'live') pool = pool.filter((a) => a.status === 'live');
    else if (filter !== 'all') pool = pool.filter((a) => a.category === filter);
    if (!q) return pool;
    return pool.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.includes(q) ||
        a.tagline.toLowerCase().includes(q),
    );
  }, [query, filter]);

  const sidebarItems: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all',  label: 'All apps',   count: counts.all },
    { key: 'live', label: 'Live now',   count: counts.live },
    ...CONNECT_CATEGORIES.map((c) => ({ key: c.slug, label: c.name, count: counts[c.slug] ?? 0 })),
  ];

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-6 lg:gap-8">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="md:hidden inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-xs"
      >
        Filter: {filter === 'all' ? 'All apps' : sidebarItems.find((s) => s.key === filter)?.label}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen
            ? 'fixed inset-0 z-40 bg-bg p-6 overflow-y-auto'
            : 'hidden md:block'
        }`}
      >
        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close filters"
            className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="md:sticky md:top-20 space-y-0.5">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted px-2 mb-2">
            Categories
          </div>
          {sidebarItems.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setFilter(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-sm transition ${
                  active
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'text-muted hover:bg-surface/50 hover:text-text border border-transparent'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <span className="text-[10px] font-mono shrink-0 tabular-nums">{item.count}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main column */}
      <div className="min-w-0">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 672 apps — GitHub, Slack, Stripe, Notion…"
            className="w-full pl-11 pr-4 h-11 rounded-xl bg-surface/50 border border-border focus:border-accent/60 focus:outline-none text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-muted"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="text-[11px] font-mono text-muted mb-3">
          {filtered.length} app{filtered.length === 1 ? '' : 's'}
          {filter !== 'all' && filter !== 'live' && ` in ${sidebarItems.find((s) => s.key === filter)?.label}`}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((app) => (
            <AppCard
              key={app.slug}
              app={app}
              connection={connected[app.slug]}
              isAuthed={isAuthed}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="text-sm">No apps match &quot;{query}&quot;.</p>
            <p className="text-xs mt-2">
              Missing one?{' '}
              <a href="mailto:hi@stackpicks.dev?subject=Add to Connect" className="text-accent hover:underline">
                Tell us
              </a>{' '}
              and we&apos;ll prioritise it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AppCard({
  app,
  connection,
  isAuthed,
}: {
  app: ConnectApp;
  connection?: { id: string; accountLabel: string; status: string };
  isAuthed: boolean;
}) {
  const isConnected = !!connection && connection.status === 'active';
  const isLive = app.status === 'live';

  async function onConnect(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthed) {
      window.location.href = `/login?redirect=/connect`;
      return;
    }
    if (!isLive) {
      await fetch('/api/connect/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider: app.slug }),
      }).catch(() => {});
      alert(`Got it — we'll email you when ${app.name} is live.`);
      return;
    }
    window.location.href = `/api/connect/${app.slug}/start`;
  }

  return (
    <button
      type="button"
      onClick={onConnect}
      className={`group relative text-left rounded-xl border bg-surface/30 hover:bg-surface/60 transition p-4 flex flex-col gap-3 ${
        isConnected
          ? 'border-accent/40 bg-accent/[0.04] hover:border-accent/60'
          : 'border-border hover:border-accent/40'
      }`}
    >
      {/* Status corner pill */}
      <div className="absolute top-2.5 right-2.5">
        {isConnected ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-1.5 py-0.5 rounded-full">
            <Check className="w-2.5 h-2.5" />
            Connected
          </span>
        ) : isLive ? (
          <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
            Live
          </span>
        ) : (
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-1.5 py-0.5 rounded-full">
            Soon
          </span>
        )}
      </div>

      <AppLogo slug={app.slug} name={app.name} size={44} />

      <div className="min-w-0">
        <div className="text-sm font-semibold leading-tight truncate">{app.name}</div>
        <div className="text-[11px] text-muted leading-snug mt-0.5 line-clamp-2">
          {isConnected ? connection!.accountLabel : app.tagline}
        </div>
      </div>

      <div className="mt-auto pt-1 text-[11px] text-muted group-hover:text-accent transition flex items-center gap-1 font-medium">
        {isConnected ? 'Manage →' : isLive ? 'Connect →' : 'Notify me →'}
      </div>
    </button>
  );
}

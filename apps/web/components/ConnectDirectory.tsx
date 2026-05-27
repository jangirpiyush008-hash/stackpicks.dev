'use client';

import { useMemo, useState } from 'react';
import { Search, Plug, Check, Sparkles, Hourglass, ArrowRight } from 'lucide-react';
import {
  CONNECT_APPS,
  CONNECT_CATEGORIES,
  type ConnectApp,
  type ConnectCategory,
} from '../lib/connect-apps';

/**
 * The 500+ app grid on /connect.
 *
 * Client-side filter + search. Keeps full catalog in memory (~30KB gzip,
 * fine). Server fetches the user's existing connections once and passes
 * them in — we just decorate cards with the right status pill.
 *
 * Behaviour:
 *  - Click "Connect" on a 'live' app → opens /connect/<slug>/start (popup)
 *  - Click "Notify me" on a 'soon' app → POSTs /api/connect/waitlist
 *  - Already connected card flips: shows account label + Reconnect/Disconnect
 */

interface ConnectedMap {
  // slug → { id, account_label, status }
  [slug: string]: { id: string; accountLabel: string; status: string };
}

interface Props {
  connected: ConnectedMap;
  isAuthed: boolean;
}

export function ConnectDirectory({ connected, isAuthed }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | ConnectCategory>('popular');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let pool = CONNECT_APPS;
    if (activeCategory === 'popular') pool = pool.filter((a) => a.popular);
    else if (activeCategory !== 'all') pool = pool.filter((a) => a.category === activeCategory);
    if (!q) return pool;
    return pool.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.includes(q) ||
        a.tagline.toLowerCase().includes(q),
    );
  }, [query, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search + tabs */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 500+ apps — GitHub, Slack, Stripe, Notion…"
            className="w-full pl-11 pr-4 h-12 rounded-xl bg-surface/50 border border-border focus:border-accent/60 focus:outline-none text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {([
            { slug: 'popular' as const, name: 'Popular' },
            { slug: 'all' as const, name: 'All apps' },
            ...CONNECT_CATEGORIES,
          ]).map((tab) => {
            const isActive = activeCategory === tab.slug;
            return (
              <button
                type="button"
                key={tab.slug}
                onClick={() => setActiveCategory(tab.slug)}
                className={`shrink-0 px-3 h-8 rounded-full text-xs font-medium transition border ${
                  isActive
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-surface/30 border-border hover:border-accent/50 text-muted hover:text-text'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result counter */}
      <div className="text-xs font-mono text-muted">
        {filtered.length} of {CONNECT_APPS.length} apps
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
        <div className="text-center py-12 text-muted">
          <p className="text-sm">No apps match "{query}".</p>
          <p className="text-xs mt-2">
            Missing an app?{' '}
            <a href="mailto:hi@stackpicks.dev?subject=Add to Connect" className="text-accent hover:underline">
              Tell us
            </a>{' '}
            and we&apos;ll prioritise it.
          </p>
        </div>
      )}
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

  async function onConnect() {
    if (!isAuthed) {
      window.location.href = `/login?redirect=/connect`;
      return;
    }
    if (!isLive) {
      // soon → waitlist
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
    <div
      className={`group relative rounded-xl border p-3 transition flex flex-col gap-2 ${
        isConnected
          ? 'border-accent/50 bg-accent/[0.04]'
          : 'border-border bg-surface/30 hover:border-accent/40'
      }`}
    >
      {/* Top row: icon stripe + status pill */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`w-9 h-9 rounded-lg bg-gradient-to-br ${
            app.color ?? 'from-zinc-700/40 to-zinc-900/40'
          } flex items-center justify-center font-bold text-sm text-text/90 border border-white/5`}
        >
          {app.name.slice(0, 1)}
        </div>
        <StatusPill app={app} isConnected={isConnected} />
      </div>

      <div>
        <div className="text-sm font-semibold leading-tight">{app.name}</div>
        <div className="text-[11px] text-muted leading-tight mt-0.5 line-clamp-2">
          {isConnected ? connection!.accountLabel : app.tagline}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onConnect}
        className={`mt-auto inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition ${
          isConnected
            ? 'bg-surface border border-border hover:border-accent/50 text-muted hover:text-text'
            : isLive
              ? 'bg-accent text-bg hover:opacity-90'
              : 'bg-surface border border-border hover:border-accent/50 text-muted hover:text-text'
        }`}
      >
        {isConnected ? (
          <>
            Manage
            <ArrowRight className="w-3 h-3" />
          </>
        ) : isLive ? (
          <>
            <Plug className="w-3 h-3" />
            Connect
          </>
        ) : (
          <>
            <Hourglass className="w-3 h-3" />
            Notify me
          </>
        )}
      </button>
    </div>
  );
}

function StatusPill({ app, isConnected }: { app: ConnectApp; isConnected: boolean }) {
  if (isConnected) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-1.5 py-0.5 rounded-full">
        <Check className="w-2.5 h-2.5" />
        Connected
      </span>
    );
  }
  if (app.status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
        <Sparkles className="w-2.5 h-2.5" />
        Live
      </span>
    );
  }
  if (app.status === 'beta') {
    return (
      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
        Beta
      </span>
    );
  }
  return (
    <span className="text-[9px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-1.5 py-0.5 rounded-full">
      Soon
    </span>
  );
}

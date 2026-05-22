'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, IndianRupee, TrendingUp, Sparkles, Clock, Activity,
  RefreshCw, ExternalLink, Send, Loader2,
} from 'lucide-react';

interface LaunchData {
  signups: { hour: number; today: number; last24h: number; last7d: number; total: number };
  paid: { today: number; last24h: number; last7d: number; total: number };
  revenue: { today: number; last24h: number; last7d: number; total: number };
  recentSignups: { email: string; created_at: string }[];
  recentPayments: { user_id: string; amount: number; at: string; plan: string }[];
  conversionRate: number;
}

const PH_KEY = 'sp_admin_ph_slug';
const HN_KEY = 'sp_admin_hn_id';

export function AdminLaunchPanel({ data }: { data: LaunchData }) {
  const router = useRouter();
  const [phSlug, setPhSlug] = useState('');
  const [hnId, setHnId] = useState('');
  const [phData, setPhData] = useState<{ votes: number; rank?: number } | null>(null);
  const [hnData, setHnData] = useState<{ points: number; comments: number } | null>(null);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Load saved PH slug + HN ID from localStorage so they persist between sessions
  useEffect(() => {
    setPhSlug(localStorage.getItem(PH_KEY) ?? '');
    setHnId(localStorage.getItem(HN_KEY) ?? '');
  }, []);

  // Fetch external rankings
  const refreshExternals = async () => {
    // ProductHunt public GraphQL — only product's vote count (no auth needed for public data)
    if (phSlug) {
      try {
        const r = await fetch(`https://www.producthunt.com/frontend/graphql`, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query($slug: String!) { post(slug: $slug) { votesCount commentsCount } }`,
            variables: { slug: phSlug.trim() },
          }),
        });
        const j = await r.json();
        if (j?.data?.post) {
          setPhData({ votes: j.data.post.votesCount });
        }
      } catch {/* CORS may block — that's okay, this is best-effort */}
    }

    // Hacker News via Algolia (no CORS, no auth)
    if (hnId) {
      try {
        const r = await fetch(`https://hn.algolia.com/api/v1/items/${hnId.trim()}`);
        const j = await r.json();
        if (j?.points != null) {
          setHnData({ points: j.points, comments: j.children?.length ?? 0 });
        }
      } catch {/* same */}
    }
  };

  useEffect(() => {
    if (phSlug || hnId) refreshExternals();
  }, [phSlug, hnId]);

  // Auto-refresh server-side metrics every 30s when toggled on
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      router.refresh();
      refreshExternals();
    }, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, router, phSlug, hnId]);

  const saveTracking = () => {
    localStorage.setItem(PH_KEY, phSlug.trim());
    localStorage.setItem(HN_KEY, hnId.trim());
    refreshExternals();
  };

  const pushIndexNow = async () => {
    setPushing(true);
    setPushResult('');
    try {
      const res = await fetch('/api/admin/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const j = await res.json();
      setPushResult(j.ok ? `✓ pushed ${j.pushed} URLs (HTTP ${j.status})` : `✗ ${j.error}`);
    } catch (e) {
      setPushResult(`✗ ${e instanceof Error ? e.message : 'failed'}`);
    } finally {
      setPushing(false);
      setTimeout(() => setPushResult(''), 5000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top action row — refresh + IndexNow + auto-refresh toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => { router.refresh(); refreshExternals(); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border hover:border-accent text-xs transition"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh now
        </button>

        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs cursor-pointer hover:border-accent transition">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="accent-accent"
          />
          Auto-refresh (30s)
          {autoRefresh && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
        </label>

        <button
          type="button"
          onClick={pushIndexNow}
          disabled={pushing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 text-xs transition disabled:opacity-50"
        >
          {pushing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          Push to IndexNow
        </button>

        {pushResult && (
          <span className={`text-xs font-mono ${pushResult.startsWith('✓') ? 'text-accent' : 'text-red-300'}`}>
            {pushResult}
          </span>
        )}
      </div>

      {/* 4-column metrics row — last hour / today / 24h / 7d */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Last hour signups"
          value={data.signups.hour.toString()}
          highlight={data.signups.hour > 0}
        />
        <MetricCard
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Today signups"
          value={data.signups.today.toString()}
          sub={`${data.paid.today} paid · ₹${data.revenue.today.toLocaleString('en-IN')}`}
        />
        <MetricCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Last 24h signups"
          value={data.signups.last24h.toString()}
          sub={`${data.paid.last24h} paid · ₹${data.revenue.last24h.toLocaleString('en-IN')}`}
        />
        <MetricCard
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="Last 7d signups"
          value={data.signups.last7d.toString()}
          sub={`${data.paid.last7d} paid · ₹${data.revenue.last7d.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Conversion rate */}
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted">
            All-time conversion (paid / total signups)
          </div>
          <div className="text-2xl font-bold mt-0.5">
            {data.conversionRate}%
          </div>
        </div>
        <div className="text-xs text-muted text-right">
          <div>{data.paid.total} paid of {data.signups.total} total</div>
          <div className="font-mono text-[10px] mt-0.5">Industry avg for dev directories: ~3–8%</div>
        </div>
      </div>

      {/* External tracking — ProductHunt + HackerNews */}
      <div className="rounded-2xl border border-border bg-surface/30 p-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">
          External launch tracking
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">
              ProductHunt slug
              <span className="text-muted/60 ml-1">(e.g. stackpicks)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={phSlug}
                onChange={(e) => setPhSlug(e.target.value)}
                placeholder="your-product-slug"
                className="flex-1 px-3 py-1.5 rounded bg-bg border border-border focus:border-accent outline-none text-sm font-mono"
              />
              {phData && (
                <span className="px-2 py-1.5 rounded bg-accent/15 text-accent text-xs font-mono">
                  ▲ {phData.votes}
                </span>
              )}
              {phSlug && (
                <a
                  href={`https://www.producthunt.com/posts/${phSlug.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded border border-border hover:border-accent transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">
              Hacker News item ID
              <span className="text-muted/60 ml-1">(the ?id= number)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hnId}
                onChange={(e) => setHnId(e.target.value)}
                placeholder="38492711"
                className="flex-1 px-3 py-1.5 rounded bg-bg border border-border focus:border-accent outline-none text-sm font-mono"
              />
              {hnData && (
                <span className="px-2 py-1.5 rounded bg-orange-400/15 text-orange-300 text-xs font-mono">
                  ▲ {hnData.points} · {hnData.comments}c
                </span>
              )}
              {hnId && (
                <a
                  href={`https://news.ycombinator.com/item?id=${hnId.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded border border-border hover:border-accent transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={saveTracking}
          className="mt-3 px-3 py-1.5 rounded bg-accent text-bg font-semibold text-xs hover:opacity-90 transition"
        >
          Save + fetch
        </button>
        <p className="text-[10px] text-muted/60 mt-2">
          Saved in your browser only. PH vote counts may be blocked by CORS — open the link manually to confirm.
        </p>
      </div>

      {/* Recent activity */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent signups */}
        <div className="rounded-2xl border border-border bg-surface/30 overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-surface/60 text-[10px] font-mono uppercase tracking-wider text-muted">
            Latest signups
          </div>
          <div className="divide-y divide-border">
            {data.recentSignups.length === 0 ? (
              <div className="px-4 py-6 text-center text-muted text-xs">No signups yet</div>
            ) : (
              data.recentSignups.map((s) => (
                <div key={s.email + s.created_at} className="px-4 py-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-mono truncate">{s.email}</span>
                  <span className="text-muted shrink-0">{timeAgo(s.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent payments */}
        <div className="rounded-2xl border border-accent/30 bg-accent/5 overflow-hidden">
          <div className="px-4 py-2 border-b border-accent/30 bg-accent/10 text-[10px] font-mono uppercase tracking-wider text-accent flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Latest payments
          </div>
          <div className="divide-y divide-border">
            {data.recentPayments.length === 0 ? (
              <div className="px-4 py-6 text-center text-muted text-xs">No payments yet</div>
            ) : (
              data.recentPayments.map((p) => (
                <div key={p.user_id + p.at} className="px-4 py-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-mono truncate flex items-center gap-1.5">
                    <IndianRupee className="w-3 h-3 text-accent shrink-0" />
                    {Math.round(p.amount / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted truncate text-[10px]">{p.plan}</span>
                  <span className="text-muted shrink-0">{timeAgo(p.at)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon, label, value, sub, highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface/40'}`}>
      <div className="flex items-center gap-1.5 text-[10px] text-muted font-mono uppercase tracking-wider mb-1.5">
        {icon}
        {label}
      </div>
      <div className={`text-2xl font-bold tracking-tight ${highlight ? 'text-accent' : ''}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-muted mt-1">{sub}</div>}
    </div>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

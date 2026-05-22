'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, IndianRupee, TrendingUp, Sparkles, Clock, Activity,
  RefreshCw, ExternalLink, Send, Loader2, Rocket, Check, Copy,
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
const CHECKLIST_KEY = 'sp_admin_launch_checklist';

const LAUNCH_CHECKLIST = [
  { id: 'ph', label: 'ProductHunt submitted', url: 'https://www.producthunt.com/posts/new' },
  { id: 'ph_comment', label: 'Maker comment posted on PH', url: null },
  { id: 'linkedin', label: 'LinkedIn post live', url: 'https://www.linkedin.com/feed/' },
  { id: 'twitter', label: 'Twitter / X thread posted', url: 'https://x.com/compose/post' },
  { id: 'hn', label: 'Hacker News Show HN posted', url: 'https://news.ycombinator.com/submit' },
  { id: 'reddit_sp', label: 'Reddit r/SideProject post', url: 'https://www.reddit.com/r/SideProject/submit' },
  { id: 'reddit_webdev', label: 'Reddit r/webdev post', url: 'https://www.reddit.com/r/webdev/submit' },
  { id: 'reddit_oss', label: 'Reddit r/opensource post', url: 'https://www.reddit.com/r/opensource/submit' },
  { id: 'ih', label: 'IndieHackers milestone post', url: 'https://www.indiehackers.com/post' },
  { id: 'betalist', label: 'BetaList submitted', url: 'https://betalist.com/submit' },
  { id: 'devhunt', label: 'DevHunt submitted', url: 'https://devhunt.org/submit' },
  { id: 'alttto', label: 'AlternativeTo submitted', url: 'https://alternativeto.net/software/submit' },
  { id: 'dms', label: '15 personal DMs sent', url: null },
  { id: 'indexnow', label: 'IndexNow launch push run', url: null },
];

const SHARE_TEMPLATES = {
  twitter: `Spent 4 hours picking a UI library last week.
Not coding. Picking.

Built StackPicks to fix it →

100+ open-source dev tools, each with a "use this if / skip if" take written by a human.
22 categories, 13 stack bundles, 12 skill tracks.

₹99 lifetime. https://stackpicks.dev`,

  whatsapp: `Hey — launching StackPicks today on ProductHunt.

100+ curated open-source dev tools with honest "use this if / skip if" takes. 13 stack bundles, 12 skill tracks. ₹99 lifetime.

Would mean a lot if you'd check it out + share if useful:
https://stackpicks.dev

Thank you!`,

  linkedin_dm: `Hey — launching StackPicks today.

100+ curated open-source dev tools, each with an honest "use this if / skip if" take. 13 ready-to-ship stack bundles. ₹99 lifetime, no renewals.

Site: https://stackpicks.dev

If you have 60 seconds — would love your honest reaction in the comments on my LinkedIn post.

Thanks!`,
};

// Long-form posts pre-built for one-click compose
const LINKEDIN_POST = `8 months ago I realized something embarrassing.

I'd spent 4 hours picking a UI library for a side project. Not coding. Just choosing.

shadcn? Aceternity? Mantine? Radix? Headless UI?

Every blog post said "top 10 React libraries you must use in 2026."
Every star count looked impressive. Every AI agent recommended the same overhyped repo.

None of it told me what I actually needed:
- Which library plays nice with my existing Tailwind setup?
- Which one is still being maintained in 6 months?
- What's the actual tradeoff if I pick this one?

So I built StackPicks.

100+ open-source dev tools.
22 categories.
13 ready-to-ship stack bundles.
12 skill tracks (AI/ML, marketing, data, DevOps, founder OS).

Every tool has a 100-word analyst take in plain English — "use this if you're already on Next.js + Tailwind, skip if you've already migrated to shadcn, the cost isn't worth it."

No hedging. No buzzwords. No emojis in the curator takes.

The pricing: ₹99 INR (or $2.99 USD outside India). Lifetime access. One payment, no renewals, ever.

It's live at stackpicks.dev

I'd rather have 1,000 builders shipping than 50 reluctant subscribers. The price is low on purpose.

What I'd love your help with:
• If you build software → try it. Tell me which takes are wrong.
• If you know an OSS maintainer → I want their honest input.
• If you find it useful → share it with one other dev.

The curated takes are the moat. Anyone can scrape GitHub. Nobody can clone an honest opinion.

Link: stackpicks.dev

#OpenSource #DeveloperTools #BuildInPublic #IndianStartup`;

const TWITTER_THREAD = [
  `Spent 4 hours picking a UI library last week.
Not coding. Picking.

Built StackPicks to fix it →

100+ open-source dev tools.
Every one has a "use this if / skip if" take written by a human.
22 categories, 13 stack bundles, 12 skill tracks.

₹99 lifetime. stackpicks.dev`,

  `The 13 stacks:
→ Ship a SaaS
→ Mobile app
→ AI agent
→ Web scraper
→ Chrome extension
→ E-commerce
→ Marketing site
→ Internal dashboard
→ Automation workflow
→ Sales/CRM stack
→ Marketing stack
→ Developer tools
→ Content platform

Pick one, get the whole stack curated.`,

  `What's the moat?

Anyone can scrape GitHub for star counts.
Nobody can clone an honest curator take.

"Use this if you're on Next.js 15. Skip if you've already migrated to React 19 RSC — the cost isn't worth it."

That's the actual product. Try /preview to see them all.`,
];

export function AdminLaunchPanel({ data }: { data: LaunchData }) {
  const router = useRouter();
  const [phSlug, setPhSlug] = useState('');
  const [hnId, setHnId] = useState('');
  const [phData, setPhData] = useState<{ votes: number; rank?: number } | null>(null);
  const [hnData, setHnData] = useState<{ points: number; comments: number } | null>(null);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState('');

  // Load saved PH slug + HN ID + checklist from localStorage
  useEffect(() => {
    setPhSlug(localStorage.getItem(PH_KEY) ?? '');
    setHnId(localStorage.getItem(HN_KEY) ?? '');
    try {
      setChecked(JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? '{}'));
    } catch { /* ignore */ }
  }, []);

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetChecklist = () => {
    if (!confirm('Reset the entire launch checklist?')) return;
    setChecked({});
    localStorage.removeItem(CHECKLIST_KEY);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`✓ Copied ${label}`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch {
      setCopyFeedback(`✗ Copy failed`);
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  const completedCount = Object.values(checked).filter(Boolean).length;

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

  // Extract slug from any pasted URL — accepts:
  //   "stackpicks"
  //   "https://www.producthunt.com/products/stackpicks"
  //   "https://www.producthunt.com/products/stackpicks?launch=stackpicks"
  //   "https://producthunt.com/posts/stackpicks"
  const normalizePhSlug = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (!trimmed.includes('producthunt.com')) return trimmed;
    try {
      const u = new URL(trimmed);
      const parts = u.pathname.split('/').filter(Boolean);
      // /products/<slug> or /posts/<slug>
      const i = parts.findIndex((p) => p === 'products' || p === 'posts');
      if (i !== -1 && parts[i + 1]) return parts[i + 1];
      return parts[parts.length - 1] || '';
    } catch {
      return trimmed;
    }
  };

  // Extract HN ID from any input — accepts:
  //   "38492711"
  //   "https://news.ycombinator.com/item?id=38492711"
  const normalizeHnId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (/^\d+$/.test(trimmed)) return trimmed;
    try {
      const u = new URL(trimmed);
      const id = u.searchParams.get('id');
      if (id) return id;
    } catch { /* not a URL */ }
    const match = trimmed.match(/\d+/);
    return match ? match[0] : '';
  };

  const saveTracking = () => {
    const cleanPh = normalizePhSlug(phSlug);
    const cleanHn = normalizeHnId(hnId);
    setPhSlug(cleanPh);
    setHnId(cleanHn);
    localStorage.setItem(PH_KEY, cleanPh);
    localStorage.setItem(HN_KEY, cleanHn);
    refreshExternals();
  };

  const pushIndexNow = async (mode: 'default' | 'launch' = 'default') => {
    setPushing(true);
    setPushResult('');
    try {
      const path = mode === 'launch' ? '/api/admin/indexnow?mode=launch' : '/api/admin/indexnow';
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const j = await res.json();
      setPushResult(j.ok ? `✓ pushed ${j.pushed} URLs (HTTP ${j.status})` : `✗ ${j.error}`);
      if (j.ok && mode === 'launch') {
        // Auto-tick the indexnow checkbox
        setChecked((prev) => {
          const next = { ...prev, indexnow: true };
          localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
          return next;
        });
      }
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
          onClick={() => pushIndexNow('default')}
          disabled={pushing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent/15 border border-accent/40 text-accent hover:bg-accent/25 text-xs transition disabled:opacity-50"
        >
          {pushing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          Push 6 core URLs
        </button>

        <button
          type="button"
          onClick={() => pushIndexNow('launch')}
          disabled={pushing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-bg font-bold text-xs hover:opacity-90 transition disabled:opacity-50"
        >
          {pushing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Rocket className="w-3 h-3" />}
          🚀 LAUNCH PUSH — all 32 URLs
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
        <div className="rounded-2xl border border-accent/30 bg-accent/5 overflow-hidden" id="recent-payments-section">
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

      {/* ─── Launch checklist ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-surface/30 p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted">
              Launch checklist
            </div>
            <span className="text-xs text-muted">
              {completedCount} / {LAUNCH_CHECKLIST.length} done
            </span>
            <div className="w-32 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${(completedCount / LAUNCH_CHECKLIST.length) * 100}%` }}
              />
            </div>
          </div>
          {completedCount > 0 && (
            <button
              type="button"
              onClick={resetChecklist}
              className="text-[10px] text-muted hover:text-red-300 transition"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {LAUNCH_CHECKLIST.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-xs cursor-pointer transition ${
                checked[item.id]
                  ? 'border-accent/40 bg-accent/5 text-text/60 line-through'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggleCheck(item.id)}
                className="accent-accent"
              />
              <span className="flex-1">{item.label}</span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted/60 hover:text-accent transition"
                  title="Open"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* ─── Quick-copy share templates ─────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-surface/30 p-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">
          Quick-copy share templates
        </div>
        <div className="space-y-2">
          <CopyRow
            label="Twitter / X thread (1st tweet)"
            text={SHARE_TEMPLATES.twitter}
            onCopy={() => copyText(SHARE_TEMPLATES.twitter, 'Twitter')}
          />
          <CopyRow
            label="WhatsApp / personal DM"
            text={SHARE_TEMPLATES.whatsapp}
            onCopy={() => copyText(SHARE_TEMPLATES.whatsapp, 'WhatsApp')}
          />
          <CopyRow
            label="LinkedIn DM (to your contacts)"
            text={SHARE_TEMPLATES.linkedin_dm}
            onCopy={() => copyText(SHARE_TEMPLATES.linkedin_dm, 'LinkedIn DM')}
          />
        </div>
        {copyFeedback && (
          <div className={`mt-2 text-xs font-mono ${copyFeedback.startsWith('✓') ? 'text-accent' : 'text-red-300'}`}>
            {copyFeedback}
          </div>
        )}
        <p className="text-[10px] text-muted/60 mt-3">
          For the full launch post library (ProductHunt maker comment, HN Show HN body, full LinkedIn post, etc.) see <span className="font-mono text-accent/70">launch/LAUNCH-POSTS.md</span> in the repo.
        </p>
      </div>

      {/* ─── One-click post buttons ───────────────────────────────── */}
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-1">
          ⚡ One-click post (pre-filled compose)
        </div>
        <p className="text-[11px] text-muted mb-3">
          Opens LinkedIn / X with your launch post already typed. You just click "Post". 100% within ToS, full algorithmic reach.
        </p>

        <div className="grid sm:grid-cols-3 gap-2">
          {/* LinkedIn */}
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(LINKEDIN_POST).catch(() => {});
              window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'noopener');
              setCopyFeedback('✓ LinkedIn post copied. Paste into the compose box.');
              setTimeout(() => setCopyFeedback(''), 5000);
            }}
            className="px-3 py-2.5 rounded bg-[#0a66c2] text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            Post on LinkedIn
          </button>

          {/* X / Twitter — tweet #1 via intent URL (auto-prefills) */}
          <button
            type="button"
            onClick={() => {
              const tweet = encodeURIComponent(TWITTER_THREAD[0]);
              window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank', 'noopener');
              setCopyFeedback('✓ X opened with tweet 1 pre-filled. Post it, then come back for tweet 2.');
              setTimeout(() => setCopyFeedback(''), 6000);
            }}
            className="px-3 py-2.5 rounded bg-black text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            Post on X (tweet 1/3)
          </button>

          {/* X tweet #2 */}
          <button
            type="button"
            onClick={() => {
              const tweet = encodeURIComponent(TWITTER_THREAD[1]);
              window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank', 'noopener');
              setCopyFeedback('✓ Tweet 2/3 ready. Reply to your first tweet with this one.');
              setTimeout(() => setCopyFeedback(''), 6000);
            }}
            className="px-3 py-2.5 rounded border border-border hover:border-accent text-xs transition flex items-center justify-center gap-2"
          >
            X tweet 2/3 (reply)
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-2 mt-2">
          {/* X tweet #3 */}
          <button
            type="button"
            onClick={() => {
              const tweet = encodeURIComponent(TWITTER_THREAD[2]);
              window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank', 'noopener');
              setCopyFeedback('✓ Tweet 3/3 ready. Reply to your last tweet with this final one.');
              setTimeout(() => setCopyFeedback(''), 6000);
            }}
            className="px-3 py-2.5 rounded border border-border hover:border-accent text-xs transition flex items-center justify-center gap-2"
          >
            X tweet 3/3 (reply)
          </button>

          {/* Open Buffer for scheduling */}
          <a
            href="https://buffer.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 rounded border border-accent/40 text-accent hover:bg-accent/10 text-xs transition flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Schedule via Buffer
          </a>

          {/* WhatsApp share (works on mobile) */}
          <button
            type="button"
            onClick={() => {
              const msg = encodeURIComponent(SHARE_TEMPLATES.whatsapp);
              window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener');
            }}
            className="px-3 py-2.5 rounded bg-[#25d366] text-white text-xs font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            WhatsApp share
          </button>
        </div>

        <details className="mt-3 text-[11px]">
          <summary className="cursor-pointer text-muted hover:text-accent transition">
            How this works (and what it can't do)
          </summary>
          <div className="mt-2 text-muted leading-relaxed space-y-1.5 pl-3">
            <p><strong className="text-accent/70">LinkedIn</strong> — text auto-copies to clipboard, the compose page opens, you paste with Cmd+V and hit Post. LinkedIn doesn't support URL pre-fill (the only platform that doesn't), but the copy step takes 2 seconds.</p>
            <p><strong className="text-accent/70">X / Twitter</strong> — text is fully pre-filled via intent URL. You click → tweet appears → click Post. Zero copy-paste.</p>
            <p><strong className="text-accent/70">For a 3-tweet thread on X</strong> — post tweet 1 first, then click "tweet 2 (reply)" while keeping the first tab open. On X, reply to your own tweet to chain.</p>
            <p><strong className="text-accent/70">Want true auto-posting?</strong> Use Buffer (free) — paste the post once Sunday, set time for Tuesday 7:30 AM IST, it fires automatically. Or pay $100/mo for X API direct posting from here (not worth it for a one-shot launch).</p>
          </div>
        </details>
      </div>
    </div>
  );
}

function CopyRow({
  label, text, onCopy,
}: {
  label: string;
  text: string;
  onCopy: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded border border-border bg-bg/40">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-text hover:text-accent transition flex-1 text-left"
        >
          {open ? '▾' : '▸'} {label}
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent text-bg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition"
        >
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>
      {open && (
        <pre className="px-3 py-2 border-t border-border text-[11px] text-muted whitespace-pre-wrap font-sans leading-relaxed">
          {text}
        </pre>
      )}
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

// AutoDM analytics — deeper than the dashboard tiles.
// Shows: 14-day sent+clicked trend (sparkline-ish bars), per-rule CTR
// table, best-performing keyword, cap-hit count, follower vs
// non-follower breakdown. Built on the autodm_dm_log click-tracking
// columns shipped earlier this session.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { BarChart3, ArrowLeft, TrendingUp, MousePointerClick, Send, Users } from 'lucide-react';

export const metadata = {
  title: 'Analytics — StackPicks AutoDM',
  description: '14-day trend, per-rule CTR, top-converting keywords. The real ROI view.',
};

interface LogRow {
  rule_id: string | null;
  status: string;
  clicked_at: string | null;
  click_count: number;
  is_follower: boolean | null;
  created_at: string;
}
interface RuleRow {
  id: string;
  label: string | null;
  keyword: string;
  is_active: boolean;
}

export default async function AnalyticsPage() {
  const supaRoute = await getSupabaseServer();
  const { data: { user } } = await supaRoute.auth.getUser();
  if (!user) redirect('/login?next=/autodm/analytics');

  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants')
    .select('id, ig_username, plan_tier, daily_cap, hourly_cap')
    .eq('owner_user_id', user.id)
    .limit(1);
  const tenant = tenants?.[0];
  if (!tenant) redirect('/autodm/connect');

  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400_000).toISOString();
  const [logRes, ruleRes] = await Promise.all([
    admin.from('autodm_dm_log')
      .select('rule_id, status, clicked_at, click_count, is_follower, created_at')
      .eq('tenant_id', tenant.id as string)
      .gt('created_at', fourteenDaysAgo)
      .limit(5000),
    admin.from('autodm_rules')
      .select('id, label, keyword, is_active')
      .eq('tenant_id', tenant.id as string),
  ]);
  const logs = (logRes.data ?? []) as LogRow[];
  const rules = (ruleRes.data ?? []) as RuleRow[];

  // Build 14-day trend
  const days: { date: string; sent: number; clicked: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, sent: 0, clicked: 0 });
  }
  const dayMap = Object.fromEntries(days.map((d) => [d.date, d]));
  let totalSent = 0, totalClicks = 0, capHits = 0;
  let followerSent = 0, nonFollowerSent = 0, followerClicks = 0, nonFollowerClicks = 0;

  for (const l of logs) {
    if (l.status !== 'sent') continue;
    const dk = l.created_at.slice(0, 10);
    if (dayMap[dk]) dayMap[dk].sent++;
    totalSent++;
    if (l.is_follower === true) { followerSent++; if (l.click_count > 0) followerClicks++; }
    else if (l.is_follower === false) { nonFollowerSent++; if (l.click_count > 0) nonFollowerClicks++; }
    if (l.clicked_at) {
      const ck = l.clicked_at.slice(0, 10);
      if (dayMap[ck]) dayMap[ck].clicked++;
      totalClicks += Math.max(1, l.click_count);
    }
  }

  // Count cap-hit days (days where sent ≥ daily_cap)
  for (const d of days) if (d.sent >= tenant.daily_cap) capHits++;

  // Per-rule CTR
  const ruleStats: Record<string, { sent: number; clicks: number }> = {};
  for (const l of logs) {
    if (l.status !== 'sent' || !l.rule_id) continue;
    const s = ruleStats[l.rule_id] ??= { sent: 0, clicks: 0 };
    s.sent++;
    if (l.click_count > 0) s.clicks++;
  }
  const ruleRows = rules.map((r) => ({
    ...r,
    sent: ruleStats[r.id]?.sent ?? 0,
    clicks: ruleStats[r.id]?.clicks ?? 0,
    ctr: ruleStats[r.id]?.sent ? Math.round((ruleStats[r.id].clicks / ruleStats[r.id].sent) * 100) : 0,
  })).sort((a, b) => b.sent - a.sent);

  const overallCtr = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;
  const followerCtr = followerSent > 0 ? Math.round((followerClicks / followerSent) * 100) : 0;
  const nonFollowerCtr = nonFollowerSent > 0 ? Math.round((nonFollowerClicks / nonFollowerSent) * 100) : 0;
  const maxBar = Math.max(...days.map((d) => d.sent), 1);

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/autodm/dashboard" className="text-xs text-muted hover:text-text inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3 h-3" /> Back to dashboard
      </Link>

      <div className="flex items-start gap-3 mb-8">
        <BarChart3 className="w-7 h-7 text-accent" />
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Analytics</h1>
          <p className="text-sm text-muted mt-1">
            Last 14 days for @{tenant.ig_username}. Click data starts from when tracking shipped — earlier sends show 0 clicks.
          </p>
        </div>
      </div>

      {/* Top tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Tile icon={<Send className="w-4 h-4" />} label="Sent · 14d" value={totalSent} sub={`avg ${Math.round(totalSent / 14)}/day`} />
        <Tile icon={<MousePointerClick className="w-4 h-4" />} label="Clicks · 14d" value={totalClicks} sub={`${overallCtr}% CTR`} accent={totalClicks > 0} />
        <Tile icon={<TrendingUp className="w-4 h-4" />} label="Cap-hit days" value={capHits} sub={capHits >= 3 ? 'upgrade →' : 'plenty of room'} warn={capHits >= 3} />
        <Tile icon={<Users className="w-4 h-4" />} label="Best CTR" value={`${Math.max(followerCtr, nonFollowerCtr)}%`} sub={followerCtr >= nonFollowerCtr ? 'followers' : 'non-followers'} />
      </div>

      {/* 14-day bar chart */}
      <section className="rounded-2xl border border-border bg-bg-card/40 p-5 mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted">// 14-day trend</h2>
          <div className="text-xs text-muted">sent vs <span className="text-accent">clicked</span></div>
        </div>
        <div className="flex items-end justify-between gap-1 h-32">
          {days.map((d) => {
            const sentH = (d.sent / maxBar) * 100;
            const clickedH = d.sent > 0 ? (d.clicked / d.sent) * sentH : 0;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="w-full bg-bg flex flex-col-reverse rounded-t overflow-hidden" style={{ height: '100%' }}>
                  <div className="w-full bg-muted/30" style={{ height: `${sentH}%` }}>
                    <div className="w-full bg-accent" style={{ height: `${d.sent > 0 ? (clickedH / sentH) * 100 : 0}%` }} />
                  </div>
                </div>
                <div className="text-[9px] font-mono text-muted">{d.date.slice(8)}</div>
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block bg-bg border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap z-10">
                  {d.sent} sent · {d.clicked} click
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Follower vs non-follower breakdown */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <Split label="Followers" sent={followerSent} clicks={followerClicks} ctr={followerCtr} />
        <Split label="Non-followers" sent={nonFollowerSent} clicks={nonFollowerClicks} ctr={nonFollowerCtr} />
      </section>

      {/* Per-rule table */}
      <section>
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted mb-3">// rule performance</h2>
        {ruleRows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
            No rules yet. <Link href="/autodm/dashboard" className="text-accent hover:underline">Create one →</Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-muted bg-bg-card/40 border-b border-border">
                  <th className="py-2.5 px-3 font-mono font-semibold">Rule</th>
                  <th className="py-2.5 px-3 font-mono font-semibold">Keyword</th>
                  <th className="py-2.5 px-3 font-mono font-semibold text-right">Sent</th>
                  <th className="py-2.5 px-3 font-mono font-semibold text-right">Clicks</th>
                  <th className="py-2.5 px-3 font-mono font-semibold text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {ruleRows.map((r) => (
                  <tr key={r.id} className="border-b border-border/40">
                    <td className="py-3 px-3">
                      <div className="font-medium">{r.label || '(unnamed)'}</div>
                      {!r.is_active && <div className="text-[10px] text-muted mt-0.5">paused</div>}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-muted">{r.keyword}</td>
                    <td className="py-3 px-3 text-right font-mono">{r.sent}</td>
                    <td className="py-3 px-3 text-right font-mono">{r.clicks}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                        r.ctr >= 20 ? 'bg-accent/15 text-accent' : r.ctr >= 5 ? 'bg-amber-500/10 text-amber-500' : 'bg-muted/10 text-muted'
                      }`}>
                        {r.ctr}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {capHits >= 3 && (
        <div className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-5">
          <div className="text-sm font-semibold">You hit your daily cap {capHits} times this fortnight.</div>
          <div className="text-xs text-muted mt-1">
            That means qualified comments aren&apos;t getting a DM. <Link href="/autodm/dashboard" className="text-accent hover:underline">Upgrade your plan →</Link>
          </div>
        </div>
      )}
    </main>
  );
}

function Tile({ icon, label, value, sub, accent, warn }: { icon: React.ReactNode; label: string; value: number | string; sub: string; accent?: boolean; warn?: boolean }) {
  const cls = accent ? 'border-accent/40 bg-accent/5' : warn ? 'border-amber-500/40 bg-amber-500/5' : 'border-border bg-bg-card/50';
  return (
    <div className={`rounded-2xl border ${cls} p-4`}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted">{icon} {label}</div>
      <div className="text-2xl font-extrabold mt-1.5">{value}</div>
      <div className="text-[10px] text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function Split({ label, sent, clicks, ctr }: { label: string; sent: number; clicks: number; ctr: number }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card/30 p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="flex items-baseline gap-3 mt-2">
        <div className="text-xl font-extrabold">{ctr}%</div>
        <div className="text-xs text-muted">CTR</div>
      </div>
      <div className="text-[11px] text-muted mt-1">{sent} sent · {clicks} clicked</div>
      <div className="mt-3 h-1.5 bg-bg rounded overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${Math.min(100, ctr)}%` }} />
      </div>
    </div>
  );
}

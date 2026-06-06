'use client';

/**
 * AutoDM super-admin client — search, sort, inline support actions.
 *
 * Actions per tenant:
 *  - pause_24h   — emergency pause (Meta 429, ToS issue, etc.)
 *  - resume      — clear pause
 *  - override_plan_tier — manual plan change (refunds, comps, support)
 *  - recompute_caps  — re-derive hourly/daily caps from warming logic
 *  - reset_hourly_window — clear last hour of sent logs (give creator
 *    breathing room after Meta-style cooldown)
 */

import { useMemo, useState } from 'react';
import { Search, Pause, Play, Settings2, RefreshCcw, Loader2, AlertTriangle, Bot } from 'lucide-react';

interface TenantSummary {
  id: string;
  ig_business_id: string;
  ig_username: string | null;
  owner_user_id: string;
  plan_tier: string;
  hourly_cap: number;
  daily_cap: number;
  account_warming_ends_at: string | null;
  ai_followup_agent: boolean;
  is_active: boolean;
  paused_until: string | null;
  paused_reason: string | null;
  created_at: string;
  rule_count: number;
  active_rule_count: number;
  sent_24h: number;
  sent_7d: number;
  escalated_count: number;
}

type Action = 'resume' | 'pause_24h' | 'recompute_caps' | 'override_plan_tier' | 'reset_hourly_window';
type Tier = 'free' | 'creator' | 'pro' | 'agency';

export function AutodmAdminClient({ tenants: initial }: { tenants: TenantSummary[] }) {
  const [tenants, setTenants] = useState<TenantSummary[]>(initial);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [sort, setSort] = useState<'recent' | 'sent_24h' | 'escalated'>('recent');

  const filtered = useMemo(() => {
    const lower = q.trim().toLowerCase();
    let list = !lower ? tenants : tenants.filter((t) =>
      (t.ig_username || '').toLowerCase().includes(lower) ||
      t.ig_business_id.includes(lower) ||
      t.id.startsWith(lower) ||
      t.plan_tier === lower,
    );
    switch (sort) {
      case 'recent':     list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)); break;
      case 'sent_24h':   list = [...list].sort((a, b) => b.sent_24h - a.sent_24h); break;
      case 'escalated':  list = [...list].sort((a, b) => b.escalated_count - a.escalated_count); break;
    }
    return list;
  }, [tenants, q, sort]);

  async function doAction(id: string, action: Action, extra: Record<string, unknown> = {}) {
    setBusy(id + ':' + action);
    try {
      const r = await fetch(`/api/admin/autodm/tenant?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      });
      const j = (await r.json()) as { ok: boolean; error?: string; caps?: { hourly_cap: number; daily_cap: number }; plan_tier?: Tier; deleted?: number };
      if (!j.ok) { alert(j.error || 'failed'); return; }
      // Locally reflect changes
      setTenants((prev) => prev.map((t) => {
        if (t.id !== id) return t;
        if (action === 'pause_24h') return { ...t, paused_until: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), paused_reason: 'Paused by admin' };
        if (action === 'resume')    return { ...t, paused_until: null, paused_reason: null };
        if (action === 'recompute_caps' && j.caps) return { ...t, hourly_cap: j.caps.hourly_cap, daily_cap: j.caps.daily_cap };
        if (action === 'override_plan_tier' && j.plan_tier) return { ...t, plan_tier: j.plan_tier, ...(j.caps ?? {}) };
        return t;
      }));
      if (action === 'reset_hourly_window') alert(`Cleared ${j.deleted ?? 0} log entries from the last hour.`);
    } finally { setBusy(null); }
  }

  return (
    <>
      {/* Search + sort bar */}
      <div className="flex gap-3 mb-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search username · IG ID · tenant ID · plan tier"
            className="w-full bg-bg border border-border rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
          className="bg-bg border border-border rounded-lg px-3 py-2 text-sm"
        >
          <option value="recent">Newest first</option>
          <option value="sent_24h">DMs · 24h ↓</option>
          <option value="escalated">Escalated ↓</option>
        </select>
        <span className="text-xs text-muted">{filtered.length} of {tenants.length}</span>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No tenants match.
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((t) => {
          const isPaused = t.paused_until && new Date(t.paused_until) > new Date();
          const warming = t.account_warming_ends_at && new Date(t.account_warming_ends_at) > new Date();
          return (
            <div key={t.id} className={`rounded-xl border p-4 ${
              isPaused ? 'border-amber-500/40 bg-amber-500/5'
                : warming ? 'border-border bg-bg-card/40'
                : 'border-border bg-bg-card/50'
            }`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">@{t.ig_username || 'no-username'}</span>
                    <TierBadge tier={t.plan_tier as Tier} />
                    {isPaused && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-semibold">Paused</span>}
                    {warming && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted/15 text-muted">Warming</span>}
                    {t.ai_followup_agent && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent"><Bot className="w-2.5 h-2.5" /> agent</span>}
                    {t.escalated_count > 0 && <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500"><AlertTriangle className="w-2.5 h-2.5" /> {t.escalated_count} esc</span>}
                  </div>
                  <div className="text-xs text-muted font-mono break-all">{t.id} · ig:{t.ig_business_id}</div>
                  {isPaused && <div className="text-xs text-amber-500/80 mt-1">{t.paused_reason}</div>}
                </div>
                <div className="text-right text-xs text-muted font-mono whitespace-nowrap">
                  <div>caps: {t.hourly_cap}/hr · {t.daily_cap}/day</div>
                  <div>rules: {t.active_rule_count}/{t.rule_count} · sent: {t.sent_24h}/24h · {t.sent_7d}/7d</div>
                  <div>joined {new Date(t.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {isPaused ? (
                  <ActionBtn busy={busy === t.id + ':resume'} onClick={() => doAction(t.id, 'resume')} icon={<Play className="w-3 h-3" />}>
                    Resume
                  </ActionBtn>
                ) : (
                  <ActionBtn busy={busy === t.id + ':pause_24h'} onClick={() => doAction(t.id, 'pause_24h')} icon={<Pause className="w-3 h-3" />} variant="amber">
                    Pause 24h
                  </ActionBtn>
                )}
                <ActionBtn busy={busy === t.id + ':recompute_caps'} onClick={() => doAction(t.id, 'recompute_caps')} icon={<RefreshCcw className="w-3 h-3" />}>
                  Recompute caps
                </ActionBtn>
                <ActionBtn busy={busy === t.id + ':reset_hourly_window'} onClick={() => {
                  if (confirm(`Delete last-hour sent logs for @${t.ig_username}? Used to give breathing room after Meta cooldown.`)) doAction(t.id, 'reset_hourly_window');
                }} icon={<RefreshCcw className="w-3 h-3" />}>
                  Reset hourly window
                </ActionBtn>
                <PlanPicker
                  current={t.plan_tier as Tier}
                  busy={busy?.startsWith(t.id + ':override_plan_tier')}
                  onSet={(tier) => doAction(t.id, 'override_plan_tier', { plan_tier: tier })}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ActionBtn({ children, onClick, icon, busy, variant }: {
  children: React.ReactNode; onClick: () => void; icon: React.ReactNode; busy?: boolean; variant?: 'amber';
}) {
  return (
    <button
      onClick={onClick} disabled={busy}
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border disabled:opacity-50 ${
        variant === 'amber' ? 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
          : 'border-border text-muted hover:text-text'
      }`}
    >
      {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : icon}
      {children}
    </button>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const colors: Record<Tier, string> = {
    free:    'bg-muted/15 text-muted',
    creator: 'bg-emerald-500/15 text-emerald-500',
    pro:     'bg-accent/15 text-accent',
    agency:  'bg-purple-500/15 text-purple-400',
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${colors[tier]}`}>
      {tier}
    </span>
  );
}

function PlanPicker({ current, busy, onSet }: { current: Tier; busy?: boolean; onSet: (t: Tier) => void }) {
  const [open, setOpen] = useState(false);
  const tiers: Tier[] = ['free', 'creator', 'pro', 'agency'];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)} disabled={busy}
        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-border text-muted hover:text-text disabled:opacity-50"
      >
        {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Settings2 className="w-3 h-3" />}
        Override plan
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-bg border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => { setOpen(false); if (confirm(`Override to ${t}?`)) onSet(t); }}
              className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-bg-card ${t === current ? 'text-accent' : 'text-text'}`}
            >
              {t}{t === current && ' (current)'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

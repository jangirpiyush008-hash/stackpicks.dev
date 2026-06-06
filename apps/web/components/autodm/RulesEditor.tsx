'use client';

/**
 * Client-side rules editor for the AutoDM tenant dashboard.
 *
 * - Auto-fires AI onboarding when the page loads with 0 rules
 * - Lists all rules with inline activate/pause/delete
 * - "Edit" expands a form per rule (keyword, dm_template, cta_url, etc.)
 * - "New rule" button at the top
 * - "Re-run AI onboarding" link (forces — wipes nothing, just adds more drafts)
 */

import { useEffect, useState } from 'react';
import { Sparkles, Plus, Trash2, Save, Loader2, RefreshCw } from 'lucide-react';
import { LinterPanel } from './LinterPanel';

interface Rule {
  id: string;
  label: string | null;
  keyword: string;
  dm_template: string;
  dm_template_variants: string[] | null;
  cta_url: string | null;
  cta_label: string | null;
  comment_reply: string | null;
  comment_reply_follower: string | null;
  follow_nudge: boolean;
  daily_cap_per_recipient: number | null;
  is_active: boolean;
  ai_personality_hint: string | null;
  active_hour_start: number | null;
  active_hour_end: number | null;
  active_days: number[] | null;
}

const EMPTY: Omit<Rule, 'id'> = {
  label: 'New rule',
  keyword: '',
  dm_template: 'Hey {{username}} — tap the link below.',
  dm_template_variants: null,
  cta_url: '',
  cta_label: 'Open link',
  comment_reply: 'Hey @{{username}} — sent it to your DMs',
  comment_reply_follower: 'Link sent ✓ {{username}}',
  follow_nudge: false,
  daily_cap_per_recipient: 1,
  is_active: false,
  ai_personality_hint: null,
  active_hour_start: null,
  active_hour_end: null,
  active_days: null,
};

export function RulesEditor({
  initialRules, hasNoRules, justConnected,
}: { initialRules: Rule[]; hasNoRules: boolean; justConnected: boolean }) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [onboarding, setOnboarding] = useState(false);
  const [onboardError, setOnboardError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Rule> | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto-fire AI onboarding once if tenant has no rules
  useEffect(() => {
    if (hasNoRules && !onboarding) {
      setOnboarding(true);
      fetch('/api/autodm/onboard', { method: 'POST' })
        .then((r) => r.json())
        .then((j: { ok: boolean; rules_created?: number; error?: string }) => {
          if (j.ok && j.rules_created) {
            // refetch rules
            fetch('/api/autodm/rules').then((r) => r.json()).then((rr) => {
              if (rr.ok) setRules(rr.rules);
            });
          } else if (j.error) {
            setOnboardError(j.error);
          }
        })
        .catch((e) => setOnboardError((e as Error).message))
        .finally(() => setOnboarding(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function rerunOnboarding() {
    setOnboarding(true); setOnboardError(null);
    try {
      const r = await fetch('/api/autodm/onboard?force=1', { method: 'POST' });
      const j = (await r.json()) as { ok: boolean; rules_created?: number; error?: string };
      if (j.ok && j.rules_created) {
        const rr = await fetch('/api/autodm/rules').then((x) => x.json());
        if (rr.ok) setRules(rr.rules);
      } else if (j.error) setOnboardError(j.error);
    } finally { setOnboarding(false); }
  }

  async function saveDraft() {
    if (!draft) return;
    setSaving(true);
    try {
      const url = editingId
        ? `/api/autodm/rules?id=${editingId}`
        : `/api/autodm/rules`;
      const method = editingId ? 'PATCH' : 'POST';
      const r = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const j = (await r.json()) as { ok: boolean; rule?: Rule; error?: string };
      if (j.ok && j.rule) {
        setRules((prev) =>
          editingId
            ? prev.map((p) => (p.id === editingId ? j.rule! : p))
            : [j.rule!, ...prev],
        );
        setDraft(null); setEditingId(null);
      } else alert(j.error || 'save failed');
    } finally { setSaving(false); }
  }

  async function toggleActive(rule: Rule) {
    const next = !rule.is_active;
    setRules((p) => p.map((r) => (r.id === rule.id ? { ...r, is_active: next } : r)));
    await fetch(`/api/autodm/rules?id=${rule.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: next }),
    });
  }

  async function deleteRule(rule: Rule) {
    if (!confirm(`Delete rule "${rule.label || rule.keyword}"?`)) return;
    setRules((p) => p.filter((r) => r.id !== rule.id));
    await fetch(`/api/autodm/rules?id=${rule.id}`, { method: 'DELETE' });
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Rules</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={rerunOnboarding}
            disabled={onboarding}
            className="text-xs text-muted hover:text-text inline-flex items-center gap-1 disabled:opacity-50"
          >
            {onboarding ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Re-run AI onboarding
          </button>
          <button
            onClick={() => { setEditingId(null); setDraft({ ...EMPTY }); }}
            className="text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> New rule
          </button>
        </div>
      </div>

      {onboarding && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 mb-3 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-accent flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="text-sm">
            <strong>AI is scanning your last 30 posts + recent comments.</strong>
            <div className="text-muted mt-1">Generating 5 starter rules in your voice. ~30-60 seconds.</div>
          </div>
        </div>
      )}
      {onboardError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 mb-3 text-sm">
          <strong>Onboarding failed:</strong> <span className="text-muted">{onboardError}</span>
          {' '}<button onClick={rerunOnboarding} className="text-accent underline">Retry</button>
        </div>
      )}

      {/* Draft editor */}
      {draft && (
        <div className="rounded-xl border border-accent/40 bg-bg-card/50 p-4 mb-3 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-accent">
            {editingId ? '// edit rule' : '// new rule'}
          </div>
          <Field label="Label (admin-only)">
            <input type="text" value={draft.label || ''}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              className="sp-input" placeholder="Recipe link" />
          </Field>
          <Field label="Trigger keyword(s) — comma-separate for multiple">
            <input type="text" value={draft.keyword || ''}
              onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
              className="sp-input" placeholder="RECIPE, FOOD, PASTA" />
          </Field>
          <Field label="DM body">
            <textarea rows={3} value={draft.dm_template || ''}
              onChange={(e) => setDraft({ ...draft, dm_template: e.target.value })}
              className="sp-input text-sm" />
            <p className="text-[10px] text-muted mt-1">Placeholders: <code className="text-accent">{'{{username}}'}</code>, <code className="text-accent">{'{{keyword}}'}</code></p>
          </Field>

          {/* Body variants — A/B tested via epsilon-greedy. Live CTR shown per variant for saved rules. */}
          <VariantsEditor
            variants={draft.dm_template_variants || []}
            onChange={(v) => setDraft({ ...draft, dm_template_variants: v.length > 0 ? v : null })}
            ruleId={draft.id}
          />

          {/* Live linter — calls /api/autodm/lint as you type */}
          <LinterPanel draft={draft} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA URL">
              <input type="url" value={draft.cta_url || ''}
                onChange={(e) => setDraft({ ...draft, cta_url: e.target.value })}
                className="sp-input" placeholder="https://yourlink.com" />
            </Field>
            <Field label="CTA button label">
              <input type="text" maxLength={20} value={draft.cta_label || ''}
                onChange={(e) => setDraft({ ...draft, cta_label: e.target.value })}
                className="sp-input" placeholder="Open" />
            </Field>
          </div>
          <Field label="Public reply — non-followers">
            <input type="text" maxLength={280} value={draft.comment_reply || ''}
              onChange={(e) => setDraft({ ...draft, comment_reply: e.target.value })}
              className="sp-input text-xs" />
          </Field>
          <Field label="Public reply — followers (concise)">
            <input type="text" maxLength={280} value={draft.comment_reply_follower || ''}
              onChange={(e) => setDraft({ ...draft, comment_reply_follower: e.target.value })}
              className="sp-input text-xs" />
          </Field>
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={!!draft.follow_nudge}
              onChange={(e) => setDraft({ ...draft, follow_nudge: e.target.checked })} />
            Append follow nudge for non-followers
          </label>

          <ScheduleEditor
            start={draft.active_hour_start ?? null}
            end={draft.active_hour_end ?? null}
            days={draft.active_days ?? null}
            onChange={(s, e, d) => setDraft({
              ...draft,
              active_hour_start: s,
              active_hour_end: e,
              active_days: d,
            })}
          />
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={draft.is_active !== false}
              onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} />
            Activate immediately
          </label>
          <div className="flex gap-2">
            <button onClick={saveDraft} disabled={saving || !draft.keyword || !draft.dm_template}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-accent text-bg hover:bg-accent/90 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <button onClick={() => { setDraft(null); setEditingId(null); }}
              className="text-sm text-muted hover:text-text px-3 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules list */}
      {rules.length === 0 && !onboarding && !onboardError && !draft && (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
          {justConnected
            ? 'AI is creating your starter rules. Refresh in a few seconds.'
            : 'No rules yet. Click "New rule" or "Re-run AI onboarding" above.'}
        </div>
      )}

      <div className="space-y-2">
        {rules.map((r) => (
          <div key={r.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{r.label || 'Untitled rule'}</div>
                <div className="text-xs text-muted mt-1 font-mono truncate">{r.keyword}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(r)}
                  className={`text-xs px-2 py-1 rounded-full ${r.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted/10 text-muted'}`}>
                  {r.is_active ? 'live' : 'paused'}
                </button>
                <button onClick={() => { setEditingId(r.id); setDraft(r); }}
                  className="text-xs text-muted hover:text-text px-2 py-1">edit</button>
                <button onClick={() => deleteRule(r)}
                  className="text-xs text-muted hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
            {/* Show DM template preview for context */}
            <div className="text-xs text-muted mt-2 line-clamp-1 italic">&ldquo;{r.dm_template}&rdquo;</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        :global(.sp-input) {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          color: var(--text);
          width: 100%;
          font-family: inherit;
        }
        :global(.sp-input:focus) {
          outline: 2px solid var(--accent);
          outline-offset: -1px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

interface VariantPerfRow { index: number; sent: number; clicks: number; ctr: number; isWinner: boolean }

function VariantsEditor({
  variants, onChange, ruleId,
}: { variants: string[]; onChange: (v: string[]) => void; ruleId?: string }) {
  const [perf, setPerf] = useState<Record<number, VariantPerfRow>>({});

  // Fetch A/B perf for saved rules with >1 variant
  useEffect(() => {
    if (!ruleId || variants.length < 2) { setPerf({}); return; }
    let cancelled = false;
    fetch(`/api/autodm/rules/${ruleId}/variants`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled || !j.ok) return;
        const map: Record<number, VariantPerfRow> = {};
        for (const v of j.variants ?? []) {
          map[v.index] = {
            index: v.index,
            sent: v.sent ?? 0,
            clicks: v.clicks ?? 0,
            ctr: v.sent ? Math.round((v.clicks / v.sent) * 100) : 0,
            isWinner: !!v.isWinner,
          };
        }
        setPerf(map);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [ruleId, variants.length]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="block text-xs text-muted">
          Body variants — A/B tested automatically. Winners get sent more.
        </span>
        {variants.length < 4 && (
          <button
            type="button"
            onClick={() => onChange([...variants, ''])}
            className="text-xs text-accent hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Variant
          </button>
        )}
      </div>
      <p className="text-[10px] text-muted mt-1">
        We pick variants via epsilon-greedy: random while learning, then ~80% the leader, 20% explore.
        Live CTR appears once you have 30+ sends.
      </p>
      {variants.map((v, i) => {
        const p = perf[i];
        return (
          <div key={i} className="mt-2">
            <div className="flex gap-2 items-start">
              <span className="text-[10px] font-mono text-muted mt-2 w-6">#{i + 1}</span>
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={v}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i] = e.target.value;
                    onChange(next);
                  }}
                  className="sp-input text-sm w-full"
                  placeholder="Reword the main DM body — same meaning, different words."
                />
                {p && p.sent > 0 && (
                  <div className="mt-1 flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-muted">{p.sent} sent · {p.clicks} clicked</span>
                    <span className={`px-1.5 py-0.5 rounded ${
                      p.isWinner ? 'bg-accent/15 text-accent font-semibold' :
                      p.ctr >= 10 ? 'bg-amber-500/10 text-amber-500' :
                      'bg-muted/10 text-muted'
                    }`}>
                      {p.ctr}% CTR{p.isWinner ? ' · winner' : ''}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onChange(variants.filter((_, j) => j !== i))}
                className="text-muted hover:text-rose-400 mt-2"
                aria-label="remove variant"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ScheduleEditor({
  start, end, days, onChange,
}: {
  start: number | null;
  end: number | null;
  days: number[] | null;
  onChange: (s: number | null, e: number | null, d: number[] | null) => void;
}) {
  const isScheduled = start != null && end != null;
  const [open, setOpen] = useState(isScheduled || !!(days && days.length && days.length < 7));

  function setPreset(preset: 'always' | 'biz' | 'evenings' | 'weekdays') {
    if (preset === 'always')   onChange(null, null, null);
    if (preset === 'biz')      onChange(9, 21, [1, 2, 3, 4, 5]);  // 9 AM-9 PM weekdays
    if (preset === 'evenings') onChange(18, 22, null);             // 6 PM-10 PM daily
    if (preset === 'weekdays') onChange(start, end, [1, 2, 3, 4, 5]);
  }

  function toggleDay(d: number) {
    const cur = new Set(days ?? [0, 1, 2, 3, 4, 5, 6]);
    if (cur.has(d)) cur.delete(d);
    else cur.add(d);
    const arr = Array.from(cur).sort((a, b) => a - b);
    onChange(start, end, arr.length === 7 ? null : arr);
  }

  return (
    <div className="rounded-xl border border-border bg-bg-card/30 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-xs text-muted">
          When this rule fires:{' '}
          <strong className="text-text">
            {isScheduled || (days && days.length && days.length < 7)
              ? scheduleSummary(start, end, days)
              : 'always on'}
          </strong>
        </span>
        <span className="text-[10px] text-muted">{open ? 'hide' : 'edit'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            <PresetBtn label="Always on" onClick={() => setPreset('always')} active={start == null && (!days || days.length === 7)} />
            <PresetBtn label="Biz hours (9-9, Mon-Fri)" onClick={() => setPreset('biz')} active={start === 9 && end === 21 && JSON.stringify(days) === JSON.stringify([1, 2, 3, 4, 5])} />
            <PresetBtn label="Evenings (6-10 PM)" onClick={() => setPreset('evenings')} active={start === 18 && end === 22 && !days} />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">From</span>
            <select
              value={start ?? ''}
              onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value), end, days)}
              className="bg-bg border border-border rounded px-2 py-1 text-xs font-mono"
            >
              <option value="">always</option>
              {HOURS.map((h) => <option key={h} value={h}>{fmtH(h)}</option>)}
            </select>
            <span className="text-muted">to</span>
            <select
              value={end ?? ''}
              onChange={(e) => onChange(start, e.target.value === '' ? null : Number(e.target.value), days)}
              className="bg-bg border border-border rounded px-2 py-1 text-xs font-mono"
            >
              <option value="">always</option>
              {HOURS.map((h) => <option key={h} value={h}>{fmtH(h)}</option>)}
            </select>
            <span className="text-muted text-[10px]">IST</span>
          </div>

          <div className="flex gap-1">
            {DAY_LABELS.map((label, d) => {
              const sel = !days || days.length === 0 || days.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`px-2 py-1 text-[10px] font-mono rounded transition ${
                    sel ? 'bg-accent/15 text-accent' : 'bg-bg border border-border text-muted'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-muted">
            Outside this window, matching comments still get logged as &quot;skipped: schedule&quot;.
            DMs sent at 3 AM convert ~3× worse than business hours — this is the easiest CTR lever.
          </p>
        </div>
      )}
    </div>
  );
}

function PresetBtn({ label, onClick, active }: { label: string; onClick: () => void; active: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[10px] font-mono px-2 py-1 rounded-full border transition ${
        active ? 'bg-accent/15 border-accent/40 text-accent' : 'border-border text-muted hover:text-text'
      }`}
    >
      {label}
    </button>
  );
}

function fmtH(h: number): string {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function scheduleSummary(s: number | null, e: number | null, d: number[] | null): string {
  const parts: string[] = [];
  if (s != null && e != null) parts.push(`${fmtH(s)}-${fmtH(e)} IST`);
  if (d && d.length > 0 && d.length < 7) {
    if (d.length === 5 && JSON.stringify(d.sort()) === JSON.stringify([1, 2, 3, 4, 5])) parts.push('Mon-Fri');
    else if (d.length === 2 && JSON.stringify(d.sort()) === JSON.stringify([0, 6])) parts.push('Weekends');
    else parts.push(d.map((x) => DAY_LABELS[x]).join(','));
  }
  return parts.length ? parts.join(' · ') : 'always on';
}

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

interface Rule {
  id: string;
  label: string | null;
  keyword: string;
  dm_template: string;
  cta_url: string | null;
  cta_label: string | null;
  comment_reply: string | null;
  comment_reply_follower: string | null;
  follow_nudge: boolean;
  daily_cap_per_recipient: number | null;
  is_active: boolean;
  ai_personality_hint: string | null;
}

const EMPTY: Omit<Rule, 'id'> = {
  label: 'New rule',
  keyword: '',
  dm_template: 'Hey {{username}} — tap the link below.',
  cta_url: '',
  cta_label: 'Open link',
  comment_reply: 'Hey @{{username}} — sent it to your DMs',
  comment_reply_follower: 'Link sent ✓ {{username}}',
  follow_nudge: false,
  daily_cap_per_recipient: 1,
  is_active: false,
  ai_personality_hint: null,
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

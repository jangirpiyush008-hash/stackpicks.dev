'use client';

/**
 * Admin UI for comment→DM rules.
 *
 * Rules trigger when a commenter on one of our IG posts mentions the keyword
 * (case-insensitive substring). On match, the webhook sends them a DM —
 * optionally with a CTA button.
 *
 * Server side: /api/admin/ig-dm-rules (GET / POST / PATCH / DELETE).
 */

import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, Loader2, Power, MessageCircle, ExternalLink } from 'lucide-react';

interface Rule {
  id: string;
  ig_post_id: string | null;
  keyword: string;
  dm_template: string;
  cta_url: string | null;
  cta_label: string | null;
  is_active: boolean;
  daily_cap: number | null;
  label: string | null;
  created_at: string;
}

const EMPTY: Omit<Rule, 'id' | 'created_at'> = {
  ig_post_id: null,
  keyword: '',
  dm_template: 'Hey {{username}} — here\'s the link you asked for. Reply if you have questions!',
  cta_url: 'https://stackpicks.dev',
  cta_label: 'Open StackPicks',
  is_active: true,
  daily_cap: null,
  label: 'New rule',
};

export function IgDmRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<typeof EMPTY | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    const res = await fetch('/api/admin/ig-dm-rules');
    const j = await res.json();
    if (j.ok) setRules(j.rules || []);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function patchRule(id: string, patch: Partial<Rule>) {
    await fetch('/api/admin/ig-dm-rules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, patch }),
    });
    refresh();
  }

  async function deleteRule(id: string) {
    if (!confirm('Delete this rule? Sends already logged stay in ig_dm_log.')) return;
    await fetch(`/api/admin/ig-dm-rules?id=${id}`, { method: 'DELETE' });
    refresh();
  }

  async function saveDraft() {
    if (!draft) return;
    setSaving(true);
    const res = await fetch('/api/admin/ig-dm-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const j = await res.json();
    setSaving(false);
    if (!j.ok) { alert(j.error || 'Save failed'); return; }
    setDraft(null);
    refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Intro */}
      <div className="rounded-xl border border-border bg-surface/30 p-4 text-sm text-muted">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-text">
              <strong>How comment→DM works:</strong> a follower comments a keyword on one of our posts → the webhook DMs them a templated reply (optionally with a button).
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
              <li>Pin a rule to a specific IG post (paste the Media ID) <em>or</em> leave blank to match every post.</li>
              <li>Keyword is case-insensitive substring (e.g. <code className="text-accent">stack</code> matches "I want the STACK").</li>
              <li>Template supports <code className="text-accent">{'{{username}}'}</code> + <code className="text-accent">{'{{keyword}}'}</code> placeholders.</li>
              <li>Daily cap is per-recipient — set to 1 to avoid spamming the same person.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Add */}
      {!draft && (
        <button
          onClick={() => setDraft({ ...EMPTY })}
          className="inline-flex items-center gap-2 self-start text-sm font-medium px-4 py-2 rounded-md
                     bg-accent text-bg hover:bg-accent/90 transition"
        >
          <Plus className="w-4 h-4" /> New rule
        </button>
      )}

      {/* Draft form */}
      {draft && (
        <div className="rounded-xl border border-accent/40 bg-surface/40 p-4 flex flex-col gap-3">
          <Field label="Rule label (admin-only)">
            <input type="text" value={draft.label || ''} onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              placeholder="e.g. 'Comment STACK → directory link'" className="input" />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="IG post ID (optional — leave blank to match all posts)">
              <input type="text" value={draft.ig_post_id || ''} onChange={(e) => setDraft({ ...draft, ig_post_id: e.target.value || null })}
                placeholder="18015262013700309" className="input font-mono text-xs" />
            </Field>
            <Field label="Trigger keyword (required)">
              <input type="text" value={draft.keyword} onChange={(e) => setDraft({ ...draft, keyword: e.target.value })}
                placeholder="STACK" className="input" />
            </Field>
          </div>
          <Field label="DM body (required)">
            <textarea rows={3} value={draft.dm_template} onChange={(e) => setDraft({ ...draft, dm_template: e.target.value })}
              className="input font-sans text-sm" />
            <p className="text-[10px] text-muted mt-1">Placeholders: <code className="text-accent">{'{{username}}'}</code>, <code className="text-accent">{'{{keyword}}'}</code></p>
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="CTA URL (optional)">
              <input type="url" value={draft.cta_url || ''} onChange={(e) => setDraft({ ...draft, cta_url: e.target.value || null })}
                placeholder="https://stackpicks.dev" className="input text-xs" />
            </Field>
            <Field label="CTA button label">
              <input type="text" value={draft.cta_label || ''} maxLength={20} onChange={(e) => setDraft({ ...draft, cta_label: e.target.value || null })}
                placeholder="Open StackPicks" className="input" />
            </Field>
            <Field label="Daily cap per recipient">
              <input type="number" min={1} value={draft.daily_cap ?? ''} onChange={(e) => setDraft({ ...draft, daily_cap: e.target.value ? Number(e.target.value) : null })}
                placeholder="1" className="input" />
            </Field>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={saveDraft} disabled={saving || !draft.keyword || !draft.dm_template}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-accent text-bg
                         hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save rule
            </button>
            <button onClick={() => setDraft(null)} className="text-sm text-muted hover:text-text px-3 py-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing */}
      {loading ? (
        <div className="text-center py-12 text-muted text-sm"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading rules…</div>
      ) : rules.length === 0 && !draft ? (
        <div className="text-center py-12 text-muted text-sm">
          No rules yet. Add one to start auto-DMing commenters.
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface/50 text-muted text-[10px] font-mono uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Rule</th>
                <th className="text-left px-4 py-3">Keyword</th>
                <th className="text-left px-4 py-3">Scope</th>
                <th className="text-left px-4 py-3">Cap</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.label || '(unnamed)'}</div>
                    <div className="text-xs text-muted mt-1 max-w-md whitespace-pre-wrap">{r.dm_template}</div>
                    {r.cta_url && (
                      <a href={r.cta_url} target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1 mt-1 text-[10px] text-accent hover:underline">
                        {r.cta_label || 'CTA'} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3"><code className="text-accent text-xs">{r.keyword}</code></td>
                  <td className="px-4 py-3 text-xs">
                    {r.ig_post_id
                      ? <span className="font-mono text-muted">{r.ig_post_id.slice(0, 10)}…</span>
                      : <span className="text-muted italic">All posts</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{r.daily_cap ?? '∞'}/day</td>
                  <td className="px-4 py-3">
                    <button onClick={() => patchRule(r.id, { is_active: !r.is_active })}
                      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border transition ${
                        r.is_active
                          ? 'text-accent border-accent/40 bg-accent/10 hover:bg-accent/20'
                          : 'text-muted border-border bg-bg/40 hover:bg-bg/60'
                      }`}>
                      <Power className="w-3 h-3" />
                      {r.is_active ? 'On' : 'Off'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteRule(r.id)}
                      className="text-muted hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.375rem;
          color: var(--color-text, white);
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: var(--color-accent, #c6ff00);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted">{label}</span>
      {children}
    </label>
  );
}

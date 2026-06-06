'use client';

/**
 * MCP keys card on the AutoDM dashboard.
 *
 * Press hook: shows the AutoDM MCP endpoint + lets creators issue an
 * API key (revealed ONCE) that they paste into Claude or Cursor as a
 * custom connector. Once paired, they manage their rules from inside
 * their AI client with natural language.
 */

import { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, Check, Loader2, Bot } from 'lucide-react';

interface Key {
  id: string;
  label: string | null;
  prefix: string;
  last_used_at: string | null;
  created_at: string;
  revoked_at: string | null;
}

interface IssuedKey {
  id: string;
  label: string;
  prefix: string;
  plaintext: string;
  created_at: string;
}

export function McpKeysCard() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState('Claude Desktop');
  const [issuing, setIssuing] = useState(false);
  const [revealed, setRevealed] = useState<IssuedKey | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    const r = await fetch('/api/autodm/api-keys');
    const j = (await r.json()) as { ok: boolean; keys?: Key[] };
    if (j.ok && j.keys) setKeys(j.keys.filter((k) => !k.revoked_at));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function issueKey() {
    if (!newLabel.trim()) return;
    setIssuing(true);
    try {
      const r = await fetch('/api/autodm/api-keys', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newLabel }),
      });
      const j = (await r.json()) as { ok: boolean; key?: IssuedKey; error?: string };
      if (j.ok && j.key) {
        setRevealed(j.key);
        setNewLabel('Claude Desktop');
        load();
      } else alert(j.error || 'issue failed');
    } finally { setIssuing(false); }
  }

  async function revokeKey(id: string) {
    if (!confirm('Revoke this key? Any client using it stops working immediately.')) return;
    await fetch(`/api/autodm/api-keys?id=${id}`, { method: 'DELETE' });
    load();
  }

  async function copyPlaintext() {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed.plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const mcpUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://stackpicks.dev'}/api/autodm/mcp`;

  return (
    <div className="rounded-2xl border border-border bg-bg-card/40 p-5 mb-8">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-2">
            Manage rules from Claude (MCP)
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent">New</span>
          </div>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Connect your AutoDM tenant to Claude or Cursor as an MCP server. Then say things like
            &ldquo;<em>add a rule: when someone comments CALENDAR on my post, DM them my Calendly link</em>&rdquo;
            — it just works.
          </p>
        </div>
      </div>

      {/* MCP URL */}
      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-widest text-muted font-mono mb-1">MCP server URL</div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg p-2 font-mono text-xs break-all">
          {mcpUrl}
          <button
            onClick={() => { navigator.clipboard.writeText(mcpUrl); }}
            className="ml-auto text-muted hover:text-text flex-shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reveal-once card after issue */}
      {revealed && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
          <div className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2">
            ⚠ Save this key NOW — we never show it again
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-bg border border-border p-2 font-mono text-xs break-all">
            {revealed.plaintext}
            <button
              onClick={copyPlaintext}
              className="ml-auto text-accent hover:text-text flex-shrink-0 inline-flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <button
            onClick={() => setRevealed(null)}
            className="text-xs text-muted hover:text-text mt-3"
          >
            I&apos;ve saved it →
          </button>
        </div>
      )}

      {/* Issue new key */}
      {!revealed && (
        <div className="mt-4 flex gap-2">
          <input
            type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (e.g. Claude Desktop)"
            className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={issueKey} disabled={issuing || !newLabel.trim()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-accent text-bg px-4 py-2 rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {issuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Issue key
          </button>
        </div>
      )}

      {/* Existing keys */}
      {loading ? (
        <div className="mt-4 text-xs text-muted flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" /> Loading…
        </div>
      ) : keys.length > 0 ? (
        <div className="mt-4 space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-muted font-mono">Active keys ({keys.length})</div>
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-2 text-xs rounded-lg border border-border bg-bg-card/30 p-2.5">
              <Key className="w-3.5 h-3.5 text-muted flex-shrink-0" />
              <div className="font-medium">{k.label || 'Untitled'}</div>
              <code className="text-muted font-mono">{k.prefix}…</code>
              <span className="text-muted ml-auto whitespace-nowrap">
                {k.last_used_at
                  ? `Used ${new Date(k.last_used_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}`
                  : 'Never used'}
              </span>
              <button
                onClick={() => revokeKey(k.id)}
                className="text-muted hover:text-rose-400 flex-shrink-0"
                title="Revoke"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

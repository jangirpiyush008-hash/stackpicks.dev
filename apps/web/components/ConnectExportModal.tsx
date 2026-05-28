'use client';

import { useState } from 'react';
import { X, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

/**
 * "Connect to Claude" modal — issues an API key on first open, then renders
 * Claude Desktop / Cursor / OpenAI configs with the key inlined.
 *
 * The raw key is shown ONCE. After this modal closes, we only ever show the
 * prefix (`sp_live_a1b2…`). Standard secret-handling pattern.
 */

interface ConnectedSummary {
  slug: string;
  name: string;
  accountLabel: string;
}

interface Props {
  connected: ConnectedSummary[];
  /** Existing keys (prefix only) so user can pick one instead of minting fresh. */
  existingKeyPrefixes: string[];
  onClose: () => void;
}

type Tab = 'url' | 'claude' | 'cursor' | 'openai';

export function ConnectExportModal({ connected, existingKeyPrefixes, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('url');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function issueKey() {
    setIssuing(true);
    setError(null);
    try {
      const res = await fetch('/api/connect/keys', { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { key: string };
      setApiKey(data.key);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to issue key');
    } finally {
      setIssuing(false);
    }
  }

  const placeholder = apiKey ?? 'sp_live_XXXXXXXXXXXXXXXXXXXX';
  const config = buildConfig(tab, placeholder);

  function copy(text: string, setter: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 1500);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-border bg-bg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-muted hover:text-text"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8 border-b border-border">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
            <Sparkles className="w-3 h-3" />
            One MCP. All your apps.
          </div>
          <h2 className="text-2xl font-bold mb-1">Connect StackPicks to Claude</h2>
          <p className="text-sm text-muted">
            Paste this config into Claude Desktop, Cursor, or any MCP-compatible agent.
            All {connected.length} connected app{connected.length === 1 ? '' : 's'} become available instantly.
          </p>

          {connected.length > 0 && (
            <div className="mt-4 rounded-lg border border-border bg-surface/40 p-3 text-xs">
              <div className="font-mono uppercase text-[9px] tracking-wider text-muted mb-2">
                Claude will get access to
              </div>
              <ul className="space-y-1">
                {connected.map((c) => (
                  <li key={c.slug} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-accent shrink-0" />
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted">as {c.accountLabel}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-5">
          {/* API key block */}
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Your API key
            </div>
            {apiKey ? (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3">
                <div className="flex items-center gap-2 font-mono text-xs break-all">
                  <span className="flex-1">{apiKey}</span>
                  <button
                    type="button"
                    onClick={() => copy(apiKey, setCopiedKey)}
                    className="shrink-0 inline-flex items-center gap-1 h-7 px-2 rounded bg-bg border border-border hover:border-accent/50 text-[11px]"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                    {copiedKey ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-amber-300 mt-2">
                  Save this now — we&apos;ll never show the full key again. (You can revoke + reissue anytime.)
                </p>
              </div>
            ) : (
              <button
                type="button"
                disabled={issuing}
                onClick={issueKey}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {issuing ? 'Issuing…' : 'Generate API key'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            {existingKeyPrefixes.length > 0 && !apiKey && (
              <p className="text-[11px] text-muted mt-2">
                You already have {existingKeyPrefixes.length} key{existingKeyPrefixes.length === 1 ? '' : 's'} (
                {existingKeyPrefixes.join(', ')}). Generate a new one if you&apos;ve lost the old.
              </p>
            )}
          </div>

          {/* Tab switcher */}
          <div>
            <div className="flex gap-2 mb-3 border-b border-border">
              {(['url', 'claude', 'cursor', 'openai'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-3 py-2 text-xs font-medium transition border-b-2 -mb-px ${
                    tab === t
                      ? 'border-accent text-text'
                      : 'border-transparent text-muted hover:text-text'
                  }`}
                >
                  {labelFor(t)}
                </button>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-surface/40 p-3 relative">
              <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                <code>{config}</code>
              </pre>
              <button
                type="button"
                onClick={() => copy(config, setCopiedConfig)}
                className="absolute top-2 right-2 inline-flex items-center gap-1 h-7 px-2 rounded bg-bg border border-border hover:border-accent/50 text-[11px]"
              >
                {copiedConfig ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
                {copiedConfig ? 'Copied' : 'Copy'}
              </button>
            </div>

            <p className="text-[11px] text-muted mt-3">{hintFor(tab)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function labelFor(tab: Tab): string {
  if (tab === 'url') return 'Connector URL';
  if (tab === 'claude') return 'Claude Desktop';
  if (tab === 'cursor') return 'Cursor';
  return 'OpenAI Agents';
}

function hintFor(tab: Tab): string {
  if (tab === 'url') {
    return 'Easiest — one URL, no API key. In Claude: Settings → Connectors → Add custom connector → paste this URL → it opens a browser to log into StackPicks → done. Works on web, desktop & mobile.';
  }
  if (tab === 'claude') {
    return 'Paste into ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%/Claude/claude_desktop_config.json (Windows). Restart Claude.';
  }
  if (tab === 'cursor') {
    return 'Paste into .cursor/mcp.json at your project root, or open Cursor → Settings → MCP. Reload Cursor.';
  }
  return 'Use with the OpenAI Agents SDK or any MCP-aware OpenAI agent client. The server speaks standard MCP over stdio.';
}

function buildConfig(tab: Tab, key: string): string {
  if (tab === 'url') {
    // Generic OAuth MCP URL — same for everyone, no key. Claude runs the
    // browser login flow itself. This is the cleanest path.
    return `https://stackpicks.dev/api/mcp`;
  }
  if (tab === 'openai') {
    return JSON.stringify(
      {
        mcp_servers: [
          {
            name: 'stackpicks',
            command: 'npx',
            args: ['-y', '@stackpicks/mcp'],
            env: { STACKPICKS_API_KEY: key },
          },
        ],
      },
      null,
      2,
    );
  }
  return JSON.stringify(
    {
      mcpServers: {
        stackpicks: {
          command: 'npx',
          args: ['-y', '@stackpicks/mcp'],
          env: { STACKPICKS_API_KEY: key },
        },
      },
    },
    null,
    2,
  );
}

'use client';

import { useMemo, useState } from 'react';
import { Search, Copy, Check, ExternalLink, Cpu, Cloud, Globe, X, Zap } from 'lucide-react';
import { MCP_SERVERS, MCP_CATEGORIES, type MCPServer, type MCPCategory } from '../lib/mcp-connectors';

// Build the JSON config block users paste into claude_desktop_config.json /
// .cursor/mcp.json / cline_mcp_settings.json. Same shape across all clients.
function buildClientConfig(s: MCPServer): { command: string; args: string[]; env?: Record<string, string> } | { url: string } {
  if (s.install.remote) return { url: s.install.remote };

  const cmd = s.install.npx ?? s.install.uvx ?? s.install.docker ?? s.install.pip ?? '';
  const [command, ...args] = cmd.split(/\s+/).filter(Boolean);
  // Strip leading "env FOO=bar" — clients should set env via the env field.
  const env: Record<string, string> = {};
  let workingArgs = args;
  if (command === 'env') {
    let i = 0;
    while (i < args.length && args[i].includes('=')) {
      const [k, v] = args[i].split('=', 2);
      env[k] = v ?? '';
      i += 1;
    }
    workingArgs = args.slice(i);
    const real = workingArgs.shift();
    return { command: real ?? 'npx', args: workingArgs, env: Object.keys(env).length ? env : undefined };
  }
  return { command, args: workingArgs };
}

// SSR-safe base64. Building this at render time on the server would emit an
// empty config to the rendered HTML and React doesn't recompute on hydrate
// (the href would be permanently broken). So we *always* build the deeplink
// inside the click handler, after we know `window` exists.
function buildCursorDeeplink(s: MCPServer): string {
  const cfg = buildClientConfig(s);
  const b64 = typeof window === 'undefined'
    ? Buffer.from(JSON.stringify(cfg)).toString('base64')
    : window.btoa(JSON.stringify(cfg));
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(s.slug)}&config=${encodeURIComponent(b64)}`;
}

function buildClaudeConfigSnippet(s: MCPServer): string {
  const cfg = buildClientConfig(s);
  return JSON.stringify({ mcpServers: { [s.slug]: cfg } }, null, 2);
}

export function MCPDirectory() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<MCPCategory | 'all'>('all');
  const [activeSource, setActiveSource] = useState<'all' | 'official' | 'vendor' | 'community'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MCP_SERVERS.filter((s) => {
      if (activeCat !== 'all' && !s.categories.includes(activeCat)) return false;
      if (activeSource !== 'all' && s.source !== activeSource) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.publisher.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.use_case.toLowerCase().includes(q) ||
        s.github?.toLowerCase().includes(q) ||
        (s.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeCat, activeSource]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search MCP servers — 'postgres', 'slack', 'browser', 'figma'..."
          className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-surface border border-border focus:border-accent outline-none text-sm transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Source filter chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {([
          { v: 'all', label: 'All sources' },
          { v: 'official', label: 'Official (Anthropic)' },
          { v: 'vendor', label: 'Vendor-built' },
          { v: 'community', label: 'Community' },
        ] as const).map(({ v, label }) => (
          <button
            key={v}
            type="button"
            onClick={() => setActiveSource(v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              activeSource === v
                ? 'bg-accent text-bg'
                : 'border border-border text-muted hover:border-accent hover:text-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveCat('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            activeCat === 'all'
              ? 'bg-text text-bg'
              : 'border border-border text-muted hover:border-text hover:text-text'
          }`}
        >
          All categories
        </button>
        {MCP_CATEGORIES.map((c) => {
          const count = MCP_SERVERS.filter((s) => s.categories.includes(c.slug)).length;
          if (count === 0) return null;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActiveCat(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition inline-flex items-center gap-1.5 ${
                activeCat === c.slug
                  ? 'bg-accent/20 border border-accent text-accent'
                  : 'border border-border text-muted hover:border-accent/50 hover:text-text'
              }`}
            >
              {c.name}
              <span className={`text-[10px] font-mono ${activeCat === c.slug ? 'text-accent' : 'text-muted/60'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <div className="text-xs font-mono text-muted mb-4">
        {filtered.length} {filtered.length === 1 ? 'server' : 'servers'}
        {activeCat !== 'all' && <> in <span className="text-text">{MCP_CATEGORIES.find(c => c.slug === activeCat)?.name}</span></>}
        {query && <> matching <span className="text-text">"{query}"</span></>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Search className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-muted">No MCP servers match that filter.</p>
          <button
            type="button"
            onClick={() => { setQuery(''); setActiveCat('all'); setActiveSource('all'); }}
            className="mt-3 text-xs text-accent hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => <MCPCard key={s.slug} server={s} />)}
        </div>
      )}
    </div>
  );
}

function MCPCard({ server: s }: { server: MCPServer }) {
  const [copied, setCopied] = useState<string | null>(null);

  const installCmd =
    s.install.npx ?? s.install.uvx ?? s.install.docker ?? s.install.pip ?? s.install.remote ?? '';
  const installLabel =
    s.install.npx ? 'npx' :
    s.install.uvx ? 'uvx' :
    s.install.docker ? 'docker' :
    s.install.pip ? 'pip' :
    s.install.remote ? 'remote' : '';

  const copy = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const sourceBadge =
    s.source === 'official' ? { bg: 'bg-accent/20', fg: 'text-accent', label: 'Official' } :
    s.source === 'vendor'   ? { bg: 'bg-blue-500/20', fg: 'text-blue-300', label: 'Vendor' } :
                              { bg: 'bg-fuchsia-500/15', fg: 'text-fuchsia-300', label: 'Community' };

  const transportIcon =
    s.transport.includes('http') || s.transport.includes('sse')
      ? <Cloud className="w-3 h-3" />
      : <Cpu className="w-3 h-3" />;
  const transportLabel = s.install.remote ? 'Remote' : 'Local';

  return (
    <div className="rounded-xl border border-border bg-surface/40 p-5 hover:border-accent/40 transition flex flex-col">
      {/* Header — publisher attribution */}
      <div className="flex items-start gap-3 mb-3">
        {s.publisher_github ? (
          <a
            href={`https://github.com/${s.publisher_github}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            title={`${s.publisher} on GitHub — original maintainer`}
            className="shrink-0"
          >
            <img
              src={`https://avatars.githubusercontent.com/${s.publisher_github}`}
              alt={s.publisher}
              width={40}
              height={40}
              loading="lazy"
              className="rounded-md border border-border bg-surface hover:border-accent transition"
            />
          </a>
        ) : (
          <div className="w-10 h-10 rounded-md bg-bg border border-border flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-muted" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <div className="font-bold text-base leading-tight truncate">{s.name}</div>
            <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${sourceBadge.bg} ${sourceBadge.fg} shrink-0`}>
              {sourceBadge.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-muted/70">Built by</span>
            {s.publisher_github ? (
              <a
                href={`https://github.com/${s.publisher_github}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-mono text-text font-medium hover:text-accent transition truncate inline-flex items-center gap-0.5"
                title={`${s.publisher} on GitHub`}
              >
                {s.publisher}
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ) : (
              <span className="font-mono text-text font-medium truncate">{s.publisher}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description + use case */}
      <p className="text-sm text-text leading-relaxed mb-2">{s.description}</p>
      <p className="text-xs text-muted italic leading-relaxed mb-4 line-clamp-2">→ {s.use_case}</p>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-3 text-[10px] font-mono uppercase tracking-wider text-muted">
        <span className="inline-flex items-center gap-1">
          {transportIcon}
          {transportLabel}
        </span>
        {s.requires_auth && (
          <span className="inline-flex items-center gap-1 text-amber-300/80">
            Auth required
          </span>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1 mb-4">
        {s.categories.slice(0, 3).map((cat) => {
          const cName = MCP_CATEGORIES.find((c) => c.slug === cat)?.name ?? cat;
          return (
            <span key={cat} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-border/40 text-muted">
              {cName}
            </span>
          );
        })}
      </div>

      {/* Install command */}
      {installCmd && (
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
              Install · {installLabel}
            </span>
            <button
              type="button"
              onClick={() => copy(installCmd, 'install')}
              className="text-[10px] font-mono text-muted hover:text-accent transition inline-flex items-center gap-1"
            >
              {copied === 'install' ? (
                <>
                  <Check className="w-3 h-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
          <pre className="bg-bg/80 border border-border rounded-md px-2.5 py-2 text-[11px] font-mono text-text overflow-x-auto whitespace-nowrap leading-tight">
            {installCmd}
          </pre>
        </div>
      )}

      {/* Connect to a client — primary CTAs */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            // Build the deeplink at click-time so we know window is real.
            // Also copy the Claude config to clipboard as a fallback for
            // users who don't have Cursor installed.
            const deeplink = buildCursorDeeplink(s);
            try { navigator.clipboard.writeText(buildClaudeConfigSnippet(s)); } catch { /* ignore */ }
            setCopied('cursor');
            setTimeout(() => setCopied(null), 1800);
            // Navigate to the cursor:// URL. Browsers prompt to open Cursor;
            // if not installed, the page stays put and the clipboard fallback applies.
            window.location.href = deeplink;
          }}
          className="text-[11px] font-bold inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-bg hover:opacity-90 transition"
          title="Open Cursor and install this MCP server (one click)"
        >
          {copied === 'cursor' ? (
            <>
              <Check className="w-3 h-3" /> Opening Cursor…
            </>
          ) : (
            <>
              <Zap className="w-3 h-3" />
              Add to Cursor
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => copy(buildClaudeConfigSnippet(s), 'claude')}
          className="text-[11px] font-medium inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-bg/40 hover:border-accent hover:text-accent text-text transition"
          title="Copy the JSON block to paste into claude_desktop_config.json"
        >
          {copied === 'claude' ? (
            <>
              <Check className="w-3 h-3" /> Copied for Claude
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy for Claude
            </>
          )}
        </button>
      </div>

      {/* Secondary links */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
        {s.github && (
          <a
            href={`https://github.com/${s.github}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[11px] font-medium text-muted hover:text-accent transition inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            GitHub
          </a>
        )}
        {s.docs && (
          <a
            href={s.docs}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[11px] font-medium text-muted hover:text-accent transition inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Docs
          </a>
        )}
        {s.install.remote && (
          <a
            href={s.install.remote}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-[11px] font-medium text-muted hover:text-accent transition inline-flex items-center gap-1"
            title="Remote MCP endpoint URL"
          >
            <Cloud className="w-3 h-3" />
            Endpoint
          </a>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMeta } from '@stackpicks/core/seo';
import { Plug, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { MCPDirectory } from '../../components/MCPDirectory';
import { MCP_SERVERS, MCP_CATEGORIES } from '../../lib/mcp-connectors';

export const revalidate = 3600;

export const metadata: Metadata = buildMeta({
  title: 'MCP Connectors Directory — 80+ Model Context Protocol servers for Claude, Cursor, Cline (May 2026)',
  description:
    'Curated list of 80+ MCP (Model Context Protocol) servers — official Anthropic, vendor-built, and community connectors for Claude, Cursor, Cline, and Windsurf. Search by category, copy install commands, credit original maintainers.',
  path: '/mcp',
});

export default function MCPPage() {
  const total = MCP_SERVERS.length;
  const officialCount = MCP_SERVERS.filter((s) => s.source === 'official').length;
  const vendorCount = MCP_SERVERS.filter((s) => s.source === 'vendor').length;
  const communityCount = MCP_SERVERS.filter((s) => s.source === 'community').length;
  const categoryCount = MCP_CATEGORIES.filter((c) =>
    MCP_SERVERS.some((s) => s.categories.includes(c.slug)),
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 text-[10px] font-mono uppercase tracking-wider text-accent mb-4">
          <Sparkles className="w-3 h-3" />
          Updated May 2026 · {total} servers
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          MCP Connectors Directory
        </h1>
        <p className="text-lg text-muted max-w-3xl leading-relaxed">
          Every Model Context Protocol server worth installing — categorized,
          searchable, with copy-paste install commands.
          Plug them into Claude, Cursor, Cline, or Windsurf and your agent gets real
          tools instead of guessing.
        </p>

        {/* Stat strip */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider text-muted">
          <span><strong className="text-accent">{officialCount}</strong> Official</span>
          <span><strong className="text-blue-300">{vendorCount}</strong> Vendor-built</span>
          <span><strong className="text-fuchsia-300">{communityCount}</strong> Community</span>
          <span><strong className="text-text">{categoryCount}</strong> Categories</span>
        </div>
      </header>

      {/* What is MCP — short intro */}
      <section className="mb-10 p-5 rounded-xl border border-border bg-surface/30">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
            <Plug className="w-4 h-4 text-accent" />
          </div>
          <div className="text-sm text-muted leading-relaxed">
            <strong className="text-text">MCP = Model Context Protocol.</strong> Anthropic-designed open
            standard (Nov 2024) that lets any LLM client talk to any external tool through a single
            JSON-RPC interface. Install a server like <code className="text-accent font-mono text-[12px]">@modelcontextprotocol/server-postgres</code>,
            point Claude at it, and now the agent can read your DB. Same pattern for Slack, GitHub, Figma — 80+ servers below.
            <Link href="/blog/mcp-explained" className="text-accent hover:underline ml-1 inline-flex items-center gap-1">
              Full guide <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* The directory */}
      <MCPDirectory />

      {/* How to connect */}
      <section className="mt-16 p-6 rounded-2xl border border-border bg-surface/30">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          How to connect an MCP server in 60 seconds
        </h2>
        <p className="text-sm text-muted mb-5">
          Two ways: <strong className="text-text">one-click</strong> via the
          <em className="text-accent not-italic"> Add to Cursor </em>
          button on each card (Cursor opens with the config pre-filled), or paste the
          JSON block into your client's config file. Works identically across Claude
          Desktop, Claude Code, Cursor, Cline, Windsurf — same shape.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Claude Desktop / Code</div>
            <div className="text-xs text-muted mb-2">
              File: <code className="text-text font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code> (Mac)
            </div>
            <pre className="bg-bg/80 border border-border rounded-lg p-4 text-[11px] font-mono leading-relaxed overflow-x-auto">{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/projects"]
    }
  }
}`}</pre>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Cursor / Cline / Windsurf</div>
            <div className="text-xs text-muted mb-2">
              File: <code className="text-text font-mono">.cursor/mcp.json</code> or settings UI
            </div>
            <pre className="bg-bg/80 border border-border rounded-lg p-4 text-[11px] font-mono leading-relaxed overflow-x-auto">{`{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
               "ghcr.io/github/github-mcp-server"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
    }
  }
}`}</pre>
          </div>
        </div>

        <div className="text-xs text-muted leading-relaxed">
          <strong className="text-text">For remote MCP servers</strong> (anything with a URL in this directory —
          Linear, Sentry, PostHog, Vercel, Cloudflare), you can also use the <code className="text-text font-mono">/mcp</code> command
          inside Claude Code to add it via OAuth without editing JSON.
        </div>
      </section>

      {/* Cross-sell — free MCP browsers → paid directory */}
      <section className="mt-12 p-8 rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-2">
              Like this directory?
            </div>
            <h2 className="text-2xl font-bold mb-2 leading-tight">
              The full StackPicks directory has 165+ OSS picks with honest curator takes.
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Same vibe as this page — searchable, categorized, no fluff —
              but for every open-source tool worth shipping with.
              Lifetime access, one payment.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition whitespace-nowrap"
            >
              See pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:border-accent text-sm text-muted hover:text-text transition whitespace-nowrap"
            >
              Browse free samples
            </Link>
          </div>
        </div>
      </section>

      {/* Submit your MCP — secondary */}
      <section className="mt-6 p-5 rounded-xl border border-border bg-surface/30 text-center">
        <p className="text-sm text-muted">
          Built an MCP server we missed?{' '}
          <Link
            href="/contact?subject=mcp-submission"
            className="text-accent hover:underline font-medium"
          >
            Submit it →
          </Link>{' '}
          We update this directory monthly with full credit to maintainers.
        </p>
      </section>
    </div>
  );
}

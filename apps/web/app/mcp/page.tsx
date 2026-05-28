import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMeta, faqJsonLd, itemListJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';
import { Plug, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { MCPDirectory } from '../../components/MCPDirectory';
import { MCP_SERVERS, MCP_CATEGORIES } from '../../lib/mcp-connectors';
import { CONNECT_STATS } from '../../lib/connect-apps';
import { isConnectLaunched } from '../../lib/connect-roadmap';

const MCP_FAQS = [
  {
    question: 'What is the Model Context Protocol (MCP)?',
    answer: 'MCP is an open standard released by Anthropic in November 2024. It defines a single JSON-RPC interface so any LLM client (Claude, Cursor, Cline, Windsurf, Continue) can connect to any external tool — databases, GitHub, Slack, Figma — without writing custom integration code.',
  },
  {
    question: 'How many MCP servers exist in May 2026?',
    answer: 'StackPicks has indexed 89 production-ready MCP servers across 18 categories. The ecosystem includes ~15 official Anthropic reference servers, ~35 vendor-built servers from companies like GitHub, Cloudflare, Stripe, Supabase, and ~40 high-quality community servers.',
  },
  {
    question: 'How do I install an MCP server?',
    answer: 'Two paths: (1) Click "Add to Cursor" on any card here — Cursor opens with the install dialog pre-filled. (2) Manually edit your client config: claude_desktop_config.json (Claude Desktop), .cursor/mcp.json (Cursor), or the settings UI (Cline/Windsurf). The JSON shape is identical across all clients.',
  },
  {
    question: 'Which MCP servers should I install first?',
    answer: 'Start with five official Anthropic servers: Filesystem (file edits), GitHub (issues + PRs), Fetch (read URLs), Sequential Thinking (better planning), and Memory (persistent knowledge graph). Together they cover 80% of real workflows. All are listed in the directory above.',
  },
  {
    question: 'Are remote MCP servers different from local?',
    answer: 'Yes. Local MCP servers run as subprocesses on your machine (stdio transport). Remote MCP servers are hosted by the vendor and authenticate via OAuth — Linear, Sentry, PostHog, Cloudflare, Vercel ship remote servers so you never hold raw API keys. Both are listed with their transport type in the directory.',
  },
  {
    question: 'Is this MCP directory free?',
    answer: 'Yes. The full 89-server MCP directory is free, no signup required. Curated paid content lives at /preview (165+ open-source repos with curator takes) and the stack bundles at /build. Lifetime access is ₹99 / $2.99.',
  },
];

export const revalidate = 3600;

export const metadata: Metadata = buildMeta({
  title: 'MCP Servers Directory — 89 connectors for Claude + Cursor',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(MCP_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'MCP Connectors', path: '/mcp' },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(
            MCP_SERVERS.slice(0, 50).map((s) => ({ name: s.name, path: `/mcp#${s.slug}` })),
            'MCP Servers Directory'
          )),
        }}
      />
      {/* === MASTER HERO — single intro, both products framed === */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-4 px-2.5 py-1 rounded-full border border-accent/30 bg-accent/5">
          <Sparkles className="w-3 h-3" />
          MCP Hub · Two ways to connect Claude to your stack
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.05]">
          Give Claude <span className="text-accent">real-world tools</span>.
        </h1>
        <p className="text-base md:text-lg text-muted max-w-3xl leading-relaxed">
          Pick the approach that fits you. <strong className="text-text">Most users</strong> want one
          install that talks to all their apps — that&apos;s StackPicks Connect.{' '}
          <strong className="text-text">Developers and power users</strong> sometimes want to install
          individual MCP servers themselves — the directory below lists every one worth using.
        </p>
      </header>

      {/* === TWO-PRODUCT SPLITTER — let users pick their lane in 2 seconds === */}
      <section className="mb-16 grid md:grid-cols-2 gap-4 md:gap-5">
        {/* CONNECT — primary, accent-bordered */}
        <Link
          href="/connect"
          className="group relative rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/[0.10] via-accent/[0.04] to-transparent p-6 md:p-7 hover:border-accent/70 transition flex flex-col"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-3 self-start px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10">
            {isConnectLaunched() ? 'Recommended' : 'Coming soon'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
            StackPicks Connect
            <span className="block text-sm font-normal text-muted mt-1">
              One MCP. All your apps.
            </span>
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Connect GitHub, Gmail, Slack, Notion, and {CONNECT_STATS.totalApps - 4}+ more apps
            through StackPicks. Paste one config into Claude. Every connected app becomes
            available — no per-app install, no token juggling.
          </p>
          <ul className="text-xs text-muted space-y-1.5 mb-5">
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> One-click OAuth — no API keys to manage</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> Add an app later → Claude sees it instantly</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> Works in Claude, Cursor, OpenAI, every MCP agent</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">✓</span> Bundled in ₹99 / $2.99 lifetime — no subscription</li>
          </ul>
          <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-accent group-hover:gap-2.5 transition-all">
            {isConnectLaunched() ? `Browse ${CONNECT_STATS.totalApps}+ apps` : `Preview ${CONNECT_STATS.totalApps}+ apps`}
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="mt-3 text-[10px] font-mono uppercase tracking-wider text-muted">
            {isConnectLaunched() ? 'Free to browse · Login to connect' : 'Launching at 50+ live apps · join the waitlist'}
          </div>
        </Link>

        {/* DIRECTORY — secondary, neutral-bordered */}
        <a
          href="#mcp-directory"
          className="group rounded-2xl border border-border bg-surface/30 p-6 md:p-7 hover:border-accent/40 transition flex flex-col"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-3 self-start px-2 py-0.5 rounded-full border border-border bg-bg/40">
            For developers
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
            MCP Server Directory
            <span className="block text-sm font-normal text-muted mt-1">
              {total} servers · pick what you need.
            </span>
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            The full catalog of Model Context Protocol servers — Anthropic official, vendor-built,
            and community. Copy install commands, manage your own credentials, run locally or
            connect remotely.
          </p>
          <ul className="text-xs text-muted space-y-1.5 mb-5">
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> {officialCount} official · {vendorCount} vendor · {communityCount} community</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> Local servers (filesystem, postgres) that Connect can&apos;t do</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> One-click <em className="not-italic text-accent">Add to Cursor</em> · copy JSON for Claude</li>
            <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> You own the API keys + tokens</li>
          </ul>
          <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-text group-hover:gap-2.5 group-hover:text-accent transition-all">
            Browse the directory
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="mt-3 text-[10px] font-mono uppercase tracking-wider text-muted">
            Free · No login required
          </div>
        </a>
      </section>

      {/* DIRECTORY anchor section — labelled clearly for the splitter link */}
      <div id="mcp-directory" className="scroll-mt-20">
        <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            MCP Server Directory
          </h2>
          <div className="text-xs font-mono uppercase tracking-wider text-muted">
            {total} servers · updated May 2026
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono uppercase tracking-wider text-muted mb-5">
          <span><strong className="text-accent">{officialCount}</strong> Official</span>
          <span><strong className="text-blue-300">{vendorCount}</strong> Vendor</span>
          <span><strong className="text-fuchsia-300">{communityCount}</strong> Community</span>
          <span><strong className="text-text">{categoryCount}</strong> Categories</span>
        </div>
      </div>

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

      {/* FAQ — GEO bait, gets cited in AI Overviews */}
      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          {MCP_FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-surface/30 p-5 open:border-accent/40"
            >
              <summary className="cursor-pointer font-semibold text-text list-none flex items-start justify-between gap-3">
                <span>{faq.question}</span>
                <span className="text-accent text-xl leading-none group-open:rotate-45 transition shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted leading-relaxed">{faq.answer}</p>
            </details>
          ))}
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

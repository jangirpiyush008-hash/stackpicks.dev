import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, Plug, Zap, Shield, ArrowRight } from 'lucide-react';
import { buildMeta, faqJsonLd, breadcrumbJsonLd } from '@stackpicks/core/seo';
import { ConnectDirectory } from '../../components/ConnectDirectory';
import { ConnectExportButton } from '../../components/ConnectExportButton';
import { CONNECT_APPS, CONNECT_STATS, liveApps } from '../../lib/connect-apps';
import {
  getCurrentUserId,
  listConnections,
  listApiKeys,
  connectionsBySlug,
} from '../../lib/connect-server';

export const dynamic = 'force-dynamic';

const CONNECT_FAQS = [
  {
    question: 'What is StackPicks Connect?',
    answer: `One unified MCP gateway for ${CONNECT_STATS.totalApps}+ apps. Connect GitHub, Gmail, Slack, Notion and more once, then access every connected app through a single @stackpicks/mcp install in Claude, Cursor, or any AI agent.`,
  },
  {
    question: 'How is this different from installing each MCP server separately?',
    answer: 'One install instead of dozens. One API key instead of managing OAuth credentials per provider. Add a new app in StackPicks and it shows up in Claude automatically — no config edits, no restarts.',
  },
  {
    question: 'Where are my OAuth tokens stored?',
    answer: 'In an encrypted token vault, never in plain text and never on your machine. StackPicks Connect uses industry-standard envelope encryption. You can revoke any provider at any time from /dashboard/connections.',
  },
  {
    question: 'Which AI agents can I use this with?',
    answer: 'Anything that speaks the Model Context Protocol — Claude Desktop, Cursor, Cline, Windsurf, Continue, OpenAI Agents SDK, and 50+ more. The export modal generates the right config for each.',
  },
  {
    question: 'Is StackPicks Connect free?',
    answer: 'It is bundled into the StackPicks ₹99 (India) / $2.99 lifetime plan. No subscription, no per-tool-call billing. Pay once, connect forever.',
  },
];

export const metadata: Metadata = buildMeta({
  title: 'StackPicks Connect — One MCP for 500+ apps in Claude & Cursor',
  description: `Connect ${CONNECT_STATS.totalApps}+ apps (GitHub, Gmail, Slack, Notion, Stripe…) to Claude, Cursor, and AI agents through one unified MCP. ${CONNECT_STATS.totalApproxTools}+ tools, OAuth-secured, ${CONNECT_STATS.agentIntegrations}+ agent integrations.`,
  path: '/connect',
});

export default async function ConnectPage() {
  const userId = await getCurrentUserId();
  const isAuthed = !!userId;
  const conns = isAuthed ? await listConnections() : [];
  const keys = isAuthed ? await listApiKeys() : [];
  const connectedMap = connectionsBySlug(conns);

  const connectedSummary = conns
    .filter((c) => c.status === 'active')
    .map((c) => {
      const app = CONNECT_APPS.find((a) => a.slug === c.provider);
      return {
        slug: c.provider,
        name: app?.name ?? c.provider,
        accountLabel: c.account_label,
      };
    });

  const liveCount = liveApps().length;
  const activeConnections = conns.filter((c) => c.status === 'active').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(CONNECT_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Connect', path: '/connect' },
            ]),
          ),
        }}
      />

      {/* HERO */}
      <header className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-4 px-3 py-1 rounded-full border border-accent/30 bg-accent/5">
          <Sparkles className="w-3 h-3" />
          StackPicks Connect — Beta
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.05]">
          One MCP. <span className="text-accent">All your AI tools.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted leading-relaxed mb-7">
          Connect GitHub, Gmail, Slack, Notion and {CONNECT_STATS.totalApps - 4}+ more apps once.
          Use them inside Claude, Cursor, and {CONNECT_STATS.agentIntegrations}+ AI agents through a
          single, unified MCP — no per-app installs, no token juggling.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {isAuthed ? (
            <ConnectExportButton
              connected={connectedSummary}
              existingKeyPrefixes={keys.map((k) => k.key_prefix)}
              disabled={connectedSummary.length === 0}
              label={connectedSummary.length === 0 ? 'Connect an app first' : 'Connect to Claude / Cursor'}
            />
          ) : (
            <Link
              href="/login?redirect=/connect"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent text-bg font-bold text-sm hover:opacity-90 transition shadow-[0_12px_32px_-8px_rgba(198,255,0,0.45)]"
            >
              <Plug className="w-4 h-4" />
              Login to Connect Apps
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/dashboard/connections"
            className="inline-flex items-center gap-1.5 h-12 px-5 rounded-full border border-white/15 hover:border-accent/50 text-sm transition"
          >
            Manage connections
          </Link>
        </div>

        {isAuthed && activeConnections > 0 && (
          <p className="text-xs text-muted mt-4">
            {activeConnections} app{activeConnections === 1 ? '' : 's'} connected
            {keys.length > 0 ? ` · ${keys.length} API key${keys.length === 1 ? '' : 's'} active` : ''}
          </p>
        )}
      </header>

      {/* STATS STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
        <Stat value={`${CONNECT_STATS.totalApps}+`}      label="Apps" />
        <Stat value={`${CONNECT_STATS.totalApproxTools}+`}label="MCP tools" />
        <Stat value={`${CONNECT_STATS.agentIntegrations}+`}label="AI agents" />
        <Stat value="1"                                   label="Unified MCP" accent />
      </section>

      {/* HOW IT WORKS */}
      <section className="mb-14 rounded-2xl border border-border bg-surface/30 p-6 md:p-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-3">
          How it works
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Step n={1} title="Connect apps once" desc="OAuth into GitHub, Gmail, Slack, Notion, and more from one dashboard." />
          <Step n={2} title="Get one config" desc={`Paste a single ${'{ mcpServers: { stackpicks } }'} block into Claude or Cursor.`} />
          <Step n={3} title="Use every tool" desc="Add new apps later — they appear in Claude automatically. No restarts." />
        </div>
      </section>

      {/* DIRECTORY */}
      <section className="mb-14">
        <div className="flex items-end justify-between gap-3 mb-5 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">App Directory</h2>
            <p className="text-sm text-muted mt-1">
              {liveCount} apps live now · {CONNECT_APPS.length - liveCount} more rolling out weekly.
              All bundled in lifetime access.
            </p>
          </div>
          <div className="text-xs text-muted">
            Missing one? <a className="text-accent hover:underline" href="mailto:hi@stackpicks.dev?subject=Add app to StackPicks Connect">Request an app</a>
          </div>
        </div>

        <ConnectDirectory connected={connectedMap} isAuthed={isAuthed} />
      </section>

      {/* SECURITY */}
      <section className="mb-14 grid md:grid-cols-3 gap-4">
        <Trust icon={<Shield className="w-4 h-4" />} title="Encrypted tokens" desc="OAuth tokens stored with envelope encryption. Never logged, never shipped to your laptop." />
        <Trust icon={<Zap className="w-4 h-4" />}   title="Dynamic tool mapping" desc="Tools update live as you connect / disconnect — Claude sees the new set on the next message." />
        <Trust icon={<Plug className="w-4 h-4" />}   title="Revoke anytime"  desc="One click disconnect per provider. One click rotates the StackPicks API key." />
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-5">FAQ</h2>
        <div className="space-y-3">
          {CONNECT_FAQS.map((f) => (
            <details
              key={f.question}
              className="group rounded-xl border border-border bg-surface/30 p-5 open:border-accent/40"
            >
              <summary className="cursor-pointer font-semibold text-text list-none flex items-start justify-between gap-3">
                <span>{f.question}</span>
                <span className="text-accent text-xl leading-none group-open:rotate-45 transition shrink-0">+</span>
              </summary>
              <p className="faq-answer mt-3 text-sm text-muted leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center ${
        accent ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface/30'
      }`}
    >
      <div className={`text-2xl md:text-3xl font-bold ${accent ? 'text-accent' : 'text-text'}`}>
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted mt-1">{label}</div>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg p-5">
      <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono flex items-center justify-center mb-3">
        {n}
      </div>
      <div className="font-semibold mb-1">{title}</div>
      <p className="text-xs text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function Trust({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/30 p-5">
      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="font-semibold mb-1 text-sm">{title}</div>
      <p className="text-xs text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Check, Copy, Plug } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { popularApps, CONNECT_STATS } from '../lib/connect-apps';

const MCP_URL = 'https://stackpicks.dev/api/mcp';

/**
 * Full-page "Coming Soon" takeover for /connect, shown to everyone until
 * NEXT_PUBLIC_CONNECT_LAUNCHED=true (admins bypass and see the real directory).
 *
 * Keeps SEO value — renders the headline, stats, and a teaser wall of real
 * app logos — while making it unmistakable that Connect isn't live yet.
 * Captures emails into the newsletter list (source=connect-waitlist).
 */
export function ConnectComingSoon({ target }: { target: number }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const teaser = popularApps(40);

  function copyUrl() {
    navigator.clipboard.writeText(MCP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'connect-waitlist' }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-5 px-3 py-1 rounded-full border border-accent/40 bg-accent/10">
        <Sparkles className="w-3 h-3" />
        Launching soon
      </div>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
        One MCP. <span className="text-accent">All your AI tools.</span>
      </h1>

      <p className="text-lg md:text-xl text-muted leading-relaxed mb-3 max-w-2xl mx-auto">
        StackPicks Connect lets you wire {CONNECT_STATS.totalApps}+ apps — GitHub, Gmail, Slack,
        Notion, Meta Ads and more — into Claude, Cursor & any AI agent through one connection.
      </p>
      <p className="text-sm text-muted mb-8">
        We&apos;re wiring 5 apps a day. Connect opens publicly at{' '}
        <strong className="text-text">{target}+ live apps</strong>. Join the waitlist —
        lifetime members get it first.
      </p>

      {/* Waitlist capture */}
      {state === 'done' ? (
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-accent/40 bg-accent/10 text-accent font-semibold text-sm mb-10">
          <Check className="w-4 h-4" />
          You&apos;re on the list — we&apos;ll email you at launch.
        </div>
      ) : (
        <form onSubmit={submit} className="flex items-center gap-2 max-w-md mx-auto mb-10 flex-wrap sm:flex-nowrap">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourdomain.com"
            className="flex-1 min-w-[200px] h-12 px-4 rounded-xl bg-surface/50 border border-border focus:border-accent/60 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="h-12 px-6 rounded-xl bg-accent text-bg font-bold text-sm hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
          >
            {state === 'loading' ? 'Joining…' : 'Notify me at launch'}
          </button>
        </form>
      )}
      {state === 'error' && (
        <p className="text-xs text-red-400 -mt-6 mb-10">Something went wrong — try again.</p>
      )}

      {/* Meanwhile — the MCP itself is already live */}
      <div className="max-w-xl mx-auto mb-14 rounded-2xl border border-accent/30 bg-accent/[0.04] p-5 md:p-6 text-left">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
          <Plug className="w-3 h-3" />
          The MCP is already live
        </div>
        <h3 className="text-base md:text-lg font-bold mb-1.5">
          Meanwhile — connect the StackPicks MCP now.
        </h3>
        <p className="text-sm text-muted mb-4">
          The gateway is live — add it to Claude once and new apps light up the moment we open
          the doors. No reinstall, ever. Get in early. Paste this into
          Claude → <span className="text-text">Settings → Connectors → Add custom connector</span>:
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-bg/60 px-3 py-2.5">
          <code className="flex-1 text-xs md:text-sm font-mono text-text break-all">{MCP_URL}</code>
          <button
            type="button"
            onClick={copyUrl}
            className="shrink-0 inline-flex items-center gap-1 h-8 px-2.5 rounded-md bg-accent text-bg text-[11px] font-bold hover:opacity-90"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-[11px] text-muted mt-3">
          You&apos;ll log into StackPicks in your browser — no API key to manage.{' '}
          <Link href="/login?redirect=/connect" className="text-accent hover:underline">
            Sign in to get started →
          </Link>
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-x-8 gap-y-3 flex-wrap text-xs font-mono uppercase tracking-wider text-muted mb-12">
        <span><strong className="text-accent">{CONNECT_STATS.totalApps}+</strong> Apps</span>
        <span><strong className="text-accent">{CONNECT_STATS.totalApproxTools}+</strong> Tools</span>
        <span><strong className="text-accent">{CONNECT_STATS.agentIntegrations}+</strong> AI agents</span>
        <span><strong className="text-accent">1</strong> Unified MCP</span>
      </div>

      {/* Logo teaser wall — dimmed, non-interactive */}
      <div className="relative">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted mb-4">
          A taste of what&apos;s coming
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 opacity-50 pointer-events-none select-none">
          {teaser.map((app) => (
            <div
              key={app.slug}
              className="w-11 h-11 rounded-lg bg-surface/40 border border-border flex items-center justify-center"
              title={app.name}
            >
              <AppLogo slug={app.slug} name={app.name} size={28} />
            </div>
          ))}
        </div>
        {/* fade-out at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Secondary: send them to the free directory in the meantime */}
      <div className="mt-12">
        <Link
          href="/mcp"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition"
        >
          In the meantime, browse 90+ MCP servers
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// StackPicks AutoDM — public landing page
// Lives at autodm.stackpicks.dev — the first surface customers see.
// (Path is /autodm internally; middleware rewrites the subdomain root
// to /autodm so autodm.stackpicks.dev/ → this page.)

import Link from 'next/link';
import { CheckCircle2, MessageSquare, Sparkles, Shield, Zap, Bot, Radio, Instagram, Linkedin } from 'lucide-react';
import { XLogo } from '@/components/autodm/XLogo';

export const metadata = {
  title: 'StackPicks AutoDM — Auto-DM that closes, not just sends',
  description:
    'The only Instagram auto-DM tool that talks back. 90-second AI setup. Voice cloned from your past DMs. AI agent stays in the conversation. Built in India for global creators.',
};

export default function AutoDmLanding() {
  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <div className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
          // STACKPICKS AUTODM · beta
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight max-w-4xl">
          Auto-DM that <span className="text-accent">closes</span>.
          <br />
          Not just sends.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl">
          ManyChat sends a template. We have a conversation. The first IG auto-DM tool
          that learns your voice from your past DMs, and stays in the chat after the
          first message — so you close the sale while you sleep.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/autodm/connect"
            className="group inline-flex items-center gap-2 bg-accent text-bg font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition"
          >
            <Instagram className="w-4 h-4" />
            Connect Instagram
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            href="/autodm/coming-soon/linkedin"
            className="inline-flex items-center gap-2 border border-border bg-surface/40 text-text font-medium px-5 py-3 rounded-full hover:border-[#0a66c2]/60 hover:text-[#4a93e3] transition"
          >
            <Linkedin className="w-4 h-4" />
            Connect LinkedIn
          </Link>
          <Link
            href="/autodm/coming-soon/x"
            className="inline-flex items-center gap-2 border border-border bg-surface/40 text-text font-medium px-5 py-3 rounded-full hover:border-text/40 hover:text-text transition"
          >
            <XLogo className="w-3.5 h-3.5" />
            Connect X
          </Link>
        </div>
        <p className="mt-3 text-sm text-muted">
          90-second setup · free tier · no card required
        </p>
      </section>

      {/* Why we're different */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-border">
        <h2 className="text-3xl font-bold mb-12">Built on every bug we found in the others.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature icon={<Sparkles />} title="Voice-cloned DMs"
            body="AI reads your past 100 DMs, then writes new ones in your tone. Hinglish, emojis, sign-offs — all preserved. Recipients can't tell it's a bot." />
          <Feature icon={<Bot />} title="Conversational follow-up"
            body="When the recipient replies, our AI agent keeps the conversation going for 5+ turns. Handles 'what size', 'is it returnable', 'do you ship to Delhi'. Pings you only if it can't answer." />
          <Feature icon={<Zap />} title="90-second AI setup"
            body="Connect Instagram → AI scans your last 30 posts and DMs → generates 5 starter rules in your voice → live. ManyChat needs a YouTube tutorial." />
          <Feature icon={<CheckCircle2 />} title="Works for non-followers"
            body="Most tools use the standard messaging endpoint that blocks non-followers. We use Private Reply API — 7-day window from comment, works for everyone." />
          <Feature icon={<Shield />} title="Spam-shield protection"
            body="Account warming, body variants, Meta 429 auto-pause, spam-word linter. Your account doesn't get banned. (Most tools won't tell you when they get yours flagged.)" />
          <Feature icon={<MessageSquare />} title="Public reply + private DM"
            body="One comment triggers a public 'Sent ✓' reply AND a private DM with the link. Other viewers see the proof and comment too. Engagement compounds." />
          <Feature icon={<Radio />} title="Works live, mid-broadcast"
            body="Go live, tell viewers to comment a keyword, and every commenter gets your link in their DMs while you're still on air. Posts, Reels, and Lives — same rule, no extra setup." />
        </div>
      </section>

      {/* vs the market */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-border">
        <h2 className="text-3xl font-bold mb-3">Pick the one that doesn't get your account banned.</h2>
        <p className="text-muted mb-8">Honest comparison. Updated June 2026.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="py-3 pr-4 font-medium">Feature</th>
                <th className="py-3 px-3 font-medium">StackPicks AutoDM</th>
                <th className="py-3 px-3 font-medium">ManyChat</th>
                <th className="py-3 px-3 font-medium">WhoseDM</th>
                <th className="py-3 px-3 font-medium">Inrō</th>
              </tr>
            </thead>
            <tbody>
              <Row a="Works for non-followers" b={<Tick/>} c={<Partial/>} d={<Tick/>} e={<Partial/>} />
              <Row a="Voice cloning from past DMs" b={<Tick/>} c={<X/>} d={<X/>} e={<Partial/>} />
              <Row a="Conversational follow-up agent" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="90-second AI onboarding" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Auto-pause on Meta 429" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Multi-keyword per rule" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Public + private reply combo" b={<Tick/>} c={<Tick/>} d={<Tick/>} e={<Tick/>} />
              <Row a="Pricing model" b={<span className="text-accent">Flat</span>} c={<span className="text-rose-400">Per-contact</span>} d={<span>Flat</span>} e={<span>Flat</span>} />
              <Row a="Free tier" b="100 DMs/mo" c="25 contacts" d="—" e="Trial only" />
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-border">
        <h2 className="text-3xl font-bold mb-3">Flat pricing. Your bill never grows with your audience.</h2>
        <p className="text-muted mb-10">
          ManyChat charges by contacts. As you scale, your bill explodes. We charge by tier, period.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PlanCard tier="Free" price="₹0" dms="100 DMs/mo" rules="1 rule"
            accounts={{ instagram: 1, linkedin: 0, x: 0 }}
            feats={['Email support']} />
          <PlanCard tier="Creator" price="₹499/mo" dms="5,000 DMs/mo" rules="10 rules"
            accounts={{ instagram: 1, linkedin: 1, x: 1 }}
            feats={['Brand-free DMs', 'Public + private reply', 'Daily analytics']} />
          <PlanCard tier="Pro" price="₹1,499/mo" dms="Unlimited" rules="Unlimited" highlight
            accounts={{ instagram: 3, linkedin: 3, x: 3 }}
            feats={['AI-generated DMs', 'Voice cloning', 'Follow-up agent', 'Spam-shield Pro']} />
          <PlanCard tier="Agency" price="₹4,999/mo" dms="Unlimited" rules="Unlimited"
            accounts={{ instagram: 25, linkedin: 25, x: 25 }}
            feats={['White-label', 'Team seats', 'Priority support', 'Onboarding call']} />
        </div>
        <p className="text-xs text-muted mt-4 text-center">
          Instagram is live today. LinkedIn + X support ships Q3 2026 — quotas above stay the same when those platforms unlock.
        </p>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center border-t border-border">
        <h2 className="text-4xl font-extrabold leading-tight">
          Your DMs are losing sales while you sleep.
        </h2>
        <p className="mt-4 text-muted text-lg">
          The other tools end the conversation. We continue it.
        </p>
        <Link
          href="/autodm/connect"
          className="mt-8 inline-flex items-center gap-2 bg-accent text-bg font-semibold px-8 py-4 rounded-full hover:bg-accent/90 transition"
        >
          Connect Instagram — 90 seconds <span aria-hidden>→</span>
        </Link>
      </section>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card/50 p-6">
      <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Row({ a, b, c, d, e }: { a: string; b: React.ReactNode; c: React.ReactNode; d: React.ReactNode; e: React.ReactNode }) {
  return (
    <tr className="border-b border-border/60">
      <td className="py-3 pr-4">{a}</td>
      <td className="py-3 px-3 font-medium">{b}</td>
      <td className="py-3 px-3 text-muted">{c}</td>
      <td className="py-3 px-3 text-muted">{d}</td>
      <td className="py-3 px-3 text-muted">{e}</td>
    </tr>
  );
}
function Tick() { return <span className="text-accent">✓</span>; }
function X() { return <span className="text-rose-500/70">✗</span>; }
function Partial() { return <span className="text-amber-500/80">~</span>; }

function PlanCard({ tier, price, dms, rules, accounts, feats, highlight }: {
  tier: string; price: string; dms: string; rules: string;
  accounts: { instagram: number; linkedin: number; x: number };
  feats: string[]; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border ${highlight ? 'border-accent bg-accent/5' : 'border-border bg-bg-card/50'} p-6`}>
      <div className="text-xs font-mono uppercase tracking-widest text-muted">{tier}</div>
      <div className="text-3xl font-extrabold mt-2">{price}</div>
      <div className="text-sm text-muted mt-3">{dms}</div>
      <div className="text-sm text-muted">{rules}</div>

      {/* Per-platform account quotas */}
      <div className="mt-4 grid grid-cols-3 gap-1 text-[10px] font-mono">
        <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1.5 text-center">
          <div className="text-muted uppercase tracking-wide text-[9px]">IG</div>
          <div className="font-bold text-base">{accounts.instagram}</div>
        </div>
        <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1.5 text-center">
          <div className="text-muted uppercase tracking-wide text-[9px]">LinkedIn</div>
          <div className="font-bold text-base">{accounts.linkedin}</div>
        </div>
        <div className="rounded bg-bg-card/60 border border-border px-1.5 py-1.5 text-center">
          <div className="text-muted uppercase tracking-wide text-[9px]">X</div>
          <div className="font-bold text-base">{accounts.x}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {feats.map((f) => <li key={f} className="flex gap-2"><span className="text-accent">✓</span>{f}</li>)}
      </ul>
    </div>
  );
}

// StackPicks AutoDM — public landing page
// Lives at autodm.stackpicks.dev — the first surface customers see.
// (Path is /autodm internally; middleware rewrites the subdomain root
// to /autodm so autodm.stackpicks.dev/ → this page.)

import Link from 'next/link';
import { CheckCircle2, MessageSquare, Sparkles, Shield, Zap, Bot, Radio, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { XLogo } from '@/components/autodm/XLogo';
import { HomePlanCards } from '@/components/autodm/HomePlanCards';
import { GeoText } from '@/components/autodm/GeoText';

export const metadata = {
  title: 'StackPicks AutoDM — Auto-DM that closes, not just sends',
  description:
    'The only Instagram auto-DM tool that talks back. 90-second AI setup. Image-aware DMs that read the post. 5-turn AI follow-up agent. For creators worldwide.',
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
          Templates don&apos;t close. Conversations do. AutoDM clones your voice from your
          past DMs and stays in the chat for 5+ turns — answering &ldquo;what size?&rdquo;,
          &ldquo;ship to Delhi?&rdquo;, &ldquo;is it returnable?&rdquo;. The comment you saw at
          midnight becomes a sale by morning.
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
            body={
              <GeoText
                india="AI reads your past 100 DMs, then writes new ones in your tone. Hinglish, emojis, sign-offs — all preserved. Recipients can't tell it's a bot."
                world="AI reads your past 100 DMs, then writes new ones in your tone. Language mix, emoji style, sign-offs — all preserved. Recipients can't tell it's a bot."
              />
            } />
          <Feature icon={<Bot />} title="Conversational follow-up"
            body="When the recipient replies, our AI agent keeps the conversation going for 5+ turns. Handles 'what size', 'is it returnable', 'do you ship to Delhi'. Pings you only if it can't answer." />
          <Feature icon={<Zap />} title="90-second AI setup"
            body="Connect Instagram → AI scans your last 30 posts and DMs → generates 5 starter rules in your voice → live. No tutorials, no setup wizard, no config files." />
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
        <h2 className="text-3xl font-bold mb-3">Why creators pick AutoDM.</h2>
        <p className="text-muted mb-8">
          Honest comparison. Updated June 2026 — based on each tool&apos;s public pricing
          page and product docs. Tell us if something changed: <a href="mailto:stackpicks.dev@gmail.com" className="underline underline-offset-4 hover:text-accent">stackpicks.dev@gmail.com</a>.
        </p>
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
              {/* Where we lead — exclusive */}
              <Row a="AI drafts your starter rules from your past 30 posts" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Image-aware DMs — AI reads the actual post" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Multi-language auto-detect (incl. Hinglish + 40+ more)" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Auto follow-up at 4 hours if the link wasn't clicked" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Auto A/B testing with AI-picked winner" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Daily AI digest — hot leads + escalations" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Yearly subscribers get +25% DM caps automatically" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              <Row a="Pay in your currency (₹ INR + UPI Autopay or $ USD)" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
              {/* Table stakes — we match everyone */}
              <Row a="Works for non-followers (Private Reply API)" b={<Tick/>} c={<Tick/>} d={<Tick/>} e={<Tick/>} />
              <Row a="Public + private reply combo" b={<Tick/>} c={<Tick/>} d={<Tick/>} e={<Tick/>} />
              <Row a="Multi-keyword per rule" b={<Tick/>} c={<Tick/>} d={<Tick/>} e={<Tick/>} />
              <Row a="Schedule / pause rules" b={<Tick/>} c={<Tick/>} d={<Tick/>} e={<Tick/>} />
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-border">
        <h2 className="text-3xl font-bold mb-3">Flat pricing. Your bill never grows with your audience.</h2>
        <p className="text-muted mb-10">
          Most tools charge per contact — so the better your content does, the more you pay. We charge a flat monthly fee. Go viral on us.
        </p>
        <HomePlanCards />
        <p className="text-xs text-muted mt-4 text-center">
          Instagram is live today. LinkedIn + X support ships Q3 2026 — quotas above stay the same when those platforms unlock.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/autodm/pricing"
            className="inline-flex items-center gap-2 border border-border bg-surface/40 text-text font-medium px-5 py-2.5 rounded-full hover:border-accent hover:text-accent transition"
          >
            See full pricing details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/autodm/connect"
            className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-5 py-2.5 rounded-full hover:bg-accent/90 transition"
          >
            Connect Instagram — free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: React.ReactNode }) {
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


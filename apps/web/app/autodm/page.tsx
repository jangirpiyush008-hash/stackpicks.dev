// StackPicks AutoDM — public landing page
// Lives at autodm.stackpicks.dev — the first surface customers see.
// (Path is /autodm internally; middleware rewrites the subdomain root
// to /autodm so autodm.stackpicks.dev/ → this page.)

import Link from 'next/link';
import { CheckCircle2, MessageSquare, Sparkles, Shield, Zap, Bot, Radio, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { XLogo } from '@/components/autodm/XLogo';
import { HomePlanCards } from '@/components/autodm/HomePlanCards';
import { GeoText } from '@/components/autodm/GeoText';
import { LiveDemoChat } from '@/components/autodm/LiveDemoChat';

export const metadata = {
  title: 'StackPicks AutoDM — Auto-DM that closes, not just sends',
  description:
    'The only Instagram auto-DM tool that talks back. 90-second AI setup. Image-aware DMs that read the post. AI conversation agent that replies to inbound DMs in your voice. For creators worldwide.',
};

export default function AutoDmLanding() {
  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Hero — left-aligned editorial layout with red dot eyebrow */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-5 text-[11px] font-mono uppercase tracking-[0.18em] text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" aria-hidden />
          STACKPICKS AUTODM &nbsp;·&nbsp; BETA
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.98] tracking-[-0.03em] max-w-5xl">
          Auto-DM that <span className="text-accent">closes.</span>
          <br />
          Not just sends.
        </h1>
        {/* Short red rule under the hero */}
        <div className="mt-6 w-14 h-[3px] bg-accent rounded-full" aria-hidden />
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
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-[11px] font-mono text-accent font-semibold tracking-[0.18em]">01</span>
          <span className="text-[11px] font-mono text-muted tracking-[0.18em] uppercase">Why we&apos;re different</span>
        </div>
        <h2 className="text-3xl font-bold mb-10 tracking-tight">Built different from the bento up.</h2>

        {/* Bento grid — 6 columns of varied tile sizes (mobile collapses to single column) */}
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[110px] gap-3">

          {/* Big stat tile — voice clone count */}
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-5 flex flex-col">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-accent/15 blur-3xl" aria-hidden />
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent/70">Voice cloning</div>
            <div className="mt-4 text-6xl font-extrabold text-accent leading-none tracking-tighter">100</div>
            <div className="mt-2 text-xs text-muted leading-relaxed">
              past DMs read by AI &mdash;{' '}
              <GeoText
                india="your tone, Hinglish, emojis, sign-offs preserved"
                world="your tone, emoji style, sign-offs preserved"
              />
            </div>
            <div className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[10px] text-accent font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> trained on your voice
            </div>
          </div>

          {/* Image-aware */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70">Image-aware</span>
            </div>
            <div className="text-sm font-semibold">AI sees the post.</div>
            <div className="text-[11px] text-muted mt-0.5">Replies reference what&apos;s in it.</div>
          </div>

          {/* 5-turn agent */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Bot className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70">5-turn agent</span>
            </div>
            <div className="text-sm font-semibold">Conversations close.</div>
            <div className="text-[11px] text-muted mt-0.5">Multi-turn replies. Not templates.</div>
          </div>

          {/* Languages — geo-aware pill set */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70 mb-2">Languages</div>
            <div className="flex flex-wrap gap-1">
              <span className="text-[9px] border border-accent/60 text-accent px-1.5 py-0.5 rounded">English</span>
              <GeoText
                india={
                  <>
                    <span className="text-[9px] border border-accent/60 text-accent px-1.5 py-0.5 rounded">Hinglish</span>
                    <span className="text-[9px] border border-accent/60 text-accent px-1.5 py-0.5 rounded">हिन्दी</span>
                  </>
                }
                world={
                  <>
                    <span className="text-[9px] border border-accent/60 text-accent px-1.5 py-0.5 rounded">Español</span>
                    <span className="text-[9px] border border-accent/60 text-accent px-1.5 py-0.5 rounded">Français</span>
                  </>
                }
              />
              <span className="text-[9px] border border-border px-1.5 py-0.5 rounded text-muted">+40</span>
            </div>
            <div className="text-[11px] text-muted mt-2">Auto-detect &amp; match.</div>
          </div>

          {/* Live demo mini chat — spans 2x2, geo-aware content */}
          <div className="col-span-2 row-span-2 rounded-2xl border border-border bg-surface/40 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70">Live demo</div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                AI replying
              </div>
            </div>
            <div className="mt-auto">
              <LiveDemoChat />
            </div>
          </div>

          {/* Daily AI digest */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70 mb-1.5">Daily AI digest</div>
            <div className="text-sm font-semibold">9 PM IST · in your inbox.</div>
            <div className="text-[11px] text-muted mt-0.5">Hot leads, escalations, what worked.</div>
          </div>

          {/* Auto A/B */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70 mb-1.5">Auto A/B</div>
            <div className="text-sm font-semibold">3 variants. AI picks winner.</div>
            <div className="text-[11px] text-muted mt-0.5">No setup. Just better CTR.</div>
          </div>

          {/* Spam-shield + live */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70">Spam-shield Pro</span>
            </div>
            <div className="text-sm font-semibold">Auto-pause on Meta 429.</div>
            <div className="text-[11px] text-muted mt-0.5">Your account never gets flagged.</div>
          </div>

          {/* Works live mid-broadcast */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Radio className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70">Live, mid-broadcast</span>
            </div>
            <div className="text-sm font-semibold">Posts, Reels, Lives.</div>
            <div className="text-[11px] text-muted mt-0.5">Same rule, no extra setup.</div>
          </div>

          {/* 90-second setup */}
          <div className="col-span-2 row-span-1 rounded-2xl border border-border bg-surface/40 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-accent/70">Onboarding</span>
            </div>
            <div className="text-sm font-semibold">90-second AI setup.</div>
            <div className="text-[11px] text-muted mt-0.5">Connect IG → 5 starter rules → live.</div>
          </div>

        </div>
      </section>

      {/* vs the market */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-border">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-[11px] font-mono text-accent font-semibold tracking-[0.18em]">02</span>
          <span className="text-[11px] font-mono text-muted tracking-[0.18em] uppercase">vs the market</span>
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Why creators pick AutoDM.</h2>
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
              <Row a="AI conversation agent — replies to inbound DMs in your voice" b={<Tick/>} c={<X/>} d={<X/>} e={<X/>} />
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
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-[11px] font-mono text-accent font-semibold tracking-[0.18em]">03</span>
          <span className="text-[11px] font-mono text-muted tracking-[0.18em] uppercase">Pricing</span>
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Flat pricing. Your bill never grows with your audience.</h2>
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


// /autodm/coming-soon/[platform] — single page handles linkedin + x.
// Anything else returns notFound() so we don't accidentally render a page
// for /autodm/coming-soon/<typo>.
//
// We rotate per-platform copy + colors but keep one component so future
// "coming soon" doors land in the same template.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Linkedin, Twitter, Sparkles, Check, MessageSquare, Rocket } from 'lucide-react';
import { CONTACT } from '@stackpicks/core/constants';

type Platform = 'linkedin' | 'x';

interface PlatformCopy {
  key: Platform;
  name: string;
  Icon: typeof Linkedin;
  accentClass: string;          // text + ring color
  bgGlow: string;                // hero glow gradient
  tagline: string;
  pitch: string;
  whatYouGet: { label: string; detail: string }[];
  why: string;
  eta: string;
}

const PLATFORMS: Record<Platform, PlatformCopy> = {
  linkedin: {
    key: 'linkedin',
    name: 'LinkedIn',
    Icon: Linkedin,
    accentClass: 'text-[#0a66c2]',
    bgGlow: 'from-[#0a66c2]/30 via-blue-500/10 to-transparent',
    tagline: 'Comment-to-DM for LinkedIn — coming Q3 2026.',
    pitch:
      'Same rule engine as Instagram, fitted for LinkedIn. When a prospect comments on your post asking for the resource, AutoDM sends it as a personal DM through LinkedIn Messages. No browser automation, no extension trickery.',
    whatYouGet: [
      { label: 'Post-to-DM for company + personal posts', detail: 'One rule covers both surfaces.' },
      { label: 'Lead-gen form autoresponder', detail: 'When someone submits, AutoDM replies in seconds.' },
      { label: 'Connection request follow-up', detail: 'If they accept, a tailored intro DM fires.' },
      { label: 'CRM hand-off', detail: 'Push qualified replies to HubSpot or Salesforce.' },
    ],
    why:
      'LinkedIn comments convert higher than IG for B2B, but reply latency kills the lead. AutoDM closes that gap to under a minute.',
    eta: 'Targeting Q3 2026. LinkedIn Marketing Developer Platform access is in flight.',
  },
  x: {
    key: 'x',
    name: 'X (Twitter)',
    Icon: Twitter,
    accentClass: 'text-text',
    bgGlow: 'from-white/15 via-slate-500/10 to-transparent',
    tagline: 'Reply-to-DM for X — coming Q3 2026.',
    pitch:
      'When someone replies to one of your posts asking for the link, AutoDM slides the resource into their DMs and keeps the thread going. Works for Spaces hosts and builders who run launches on X.',
    whatYouGet: [
      { label: 'Reply-keyword to DM', detail: 'One keyword in a reply triggers the resource DM.' },
      { label: 'Spaces drop in DM', detail: 'Pin a rule for the Space, AutoDM DMs every joiner.' },
      { label: 'Launch-day mode', detail: 'Burst limit raised for product launches.' },
      { label: 'Anti-spam shield', detail: 'Auto-pause if X rate-limits the account.' },
    ],
    why:
      'Replies on X die in the noise. Most engaged followers churn because they never get the answer. AutoDM keeps them in your funnel.',
    eta: 'Targeting Q3 2026. X API Pro tier procurement in progress.',
  },
};

export const dynamic = 'force-dynamic';

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform } = await params;
  if (platform !== 'linkedin' && platform !== 'x') notFound();
  const p = PLATFORMS[platform as Platform];
  const Icon = p.Icon;

  const subject = `Join the waitlist — AutoDM for ${p.name}`;
  const body = `Hi team — add me to the early-access waitlist for AutoDM ${p.name}. I want in the day it goes live.\n\nMy AutoDM account email: \nMy ${p.name} handle: \nUse case: \n`;
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="relative overflow-hidden">
      {/* Hero glow */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] bg-gradient-to-br ${p.bgGlow}`} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <Link href="/autodm" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
        </Link>

        {/* Hero */}
        <header className="relative mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5 backdrop-blur text-xs text-accent mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Early-access waitlist open · launching Q3 2026</span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl border border-border bg-surface/60 flex items-center justify-center">
              <Icon className={`w-7 h-7 ${p.accentClass}`} />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted">
              AutoDM × {p.name}
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4 leading-[1.05]">
            {p.tagline}
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl leading-relaxed">
            {p.pitch}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={mailto}
              className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-5 py-3 rounded-full hover:bg-accent/90 transition shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)]"
            >
              <Rocket className="w-4 h-4" />
              Join the waitlist for early access
            </a>
            <Link
              href="/autodm"
              className="inline-flex items-center gap-2 border border-border bg-surface/40 text-text font-medium px-5 py-3 rounded-full hover:border-accent hover:text-accent transition"
            >
              Start with Instagram today
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted">
            We&apos;ll email you the moment {p.name} goes live. Yearly subscribers jump the line —{' '}
            <span className="text-accent font-medium">early access on day one</span>.
          </p>
        </header>

        {/* What you get */}
        <section className="mb-12">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-4">What you&apos;ll get</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {p.whatYouGet.map((f) => (
              <div key={f.label} className="rounded-2xl border border-border bg-surface/30 p-5">
                <div className="flex items-start gap-2 mb-1.5">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div className="font-semibold text-text leading-snug">{f.label}</div>
                </div>
                <div className="text-sm text-muted leading-relaxed pl-6">{f.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why */}
        <section className="rounded-2xl border border-border bg-surface/30 p-6 md:p-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            Why we&apos;re building this
          </div>
          <p className="text-text leading-relaxed">{p.why}</p>
        </section>

        {/* CTA repeat + ETA */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            On the launch shortlist
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Want to be one of the first creators on AutoDM × {p.name}?
          </h3>
          <p className="text-muted max-w-xl mx-auto mb-5">
            Drop your email and we&apos;ll ping you the day it ships — plus a personal onboarding
            session if you&apos;re in the first 50.
          </p>
          <a
            href={mailto}
            className="inline-flex items-center gap-2 bg-accent text-bg font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition shadow-[0_0_40px_-10px_rgba(74,222,128,0.5)]"
          >
            <Rocket className="w-4 h-4" />
            Join the waitlist for early access
          </a>
          <div className="mt-5 text-xs text-muted">{p.eta}</div>
          <div className="mt-1 text-xs text-muted">
            Prefer email? <a href={mailto} className="text-accent underline underline-offset-2">{CONTACT.email}</a>
          </div>
        </section>
      </div>
    </div>
  );
}

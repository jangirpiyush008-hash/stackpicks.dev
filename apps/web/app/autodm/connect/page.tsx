// Connect — the 90-second onboarding entry point.
// User clicks a platform card → routes to the OAuth start (Instagram) or
// the waitlist popup page (LinkedIn / X, both coming Q3 2026).
//
// Auth gate: if the visitor isn't signed in, server-side redirects to
// /login?next=/autodm/connect so they land back here after auth.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Instagram, Linkedin, Shield, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import { XLogo } from '@/components/autodm/XLogo';
import { getSupabaseServer } from '@/lib/supabase-server';

export const metadata = {
  title: 'Connect your accounts — StackPicks AutoDM',
  description: 'Connect Instagram (live today). LinkedIn + X coming Q3 2026.',
};

export default async function ConnectPage({
  searchParams,
}: { searchParams: Promise<{ error?: string; plan?: string; allowed?: string }> }) {
  const { error, plan, allowed } = await searchParams;

  // Auth gate — bounce to login first if not signed in
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    redirect('/login?next=' + encodeURIComponent('/autodm/connect'));
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/autodm" className="text-xs text-muted hover:text-text">← Back to AutoDM</Link>

        {error === 'cap_reached' && (
          <div className="mt-6 rounded-2xl border-2 border-amber-500/50 bg-amber-500/5 p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-amber-300">Plan limit hit.</div>
              <div className="text-muted mt-1">
                Your <strong className="capitalize">{plan || 'current'}</strong> plan includes
                {' '}<strong>{allowed || 1}</strong> Instagram slot{allowed === '1' ? '' : 's'} and
                they&apos;re all used. Upgrade your plan from the dashboard to connect another, or
                disconnect an existing IG first.
              </div>
              <Link
                href="/autodm/dashboard#plan"
                className="mt-3 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-500/90 text-white text-xs font-semibold px-3.5 py-2 rounded-full"
              >
                Upgrade plan →
              </Link>
            </div>
          </div>
        )}

        {error === 'ig_already_connected' && (
          <div className="mt-6 rounded-2xl border-2 border-rose-500/50 bg-rose-500/5 p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-rose-300">This Instagram is already connected to another StackPicks account.</div>
              <div className="text-muted mt-1">
                Each Instagram Business account can only be linked to one StackPicks AutoDM
                user at a time. If this is your account, sign in with the email it&apos;s
                connected to, or disconnect it from that account first (
                <Link href="/autodm/dashboard" className="underline underline-offset-2 hover:text-text">dashboard → Disconnect IG</Link>
                ). Need help? Email <a href="mailto:stackpicks.dev@gmail.com" className="underline underline-offset-2 hover:text-text">stackpicks.dev@gmail.com</a>.
              </div>
            </div>
          </div>
        )}

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-[1.05]">
          Connect your accounts.
          <br />
          Live in <span className="text-accent">90 seconds</span>.
        </h1>
        <p className="mt-4 text-muted text-lg">
          Instagram is live today. LinkedIn and X seats are reserved for your tier and ship next.
        </p>

        {/* Three platform cards */}
        <div className="mt-10 space-y-3">
          {/* Instagram — ACTIVE */}
          <div className="rounded-2xl border border-border bg-bg-card/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">
                  Instagram Business Account
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-accent text-bg px-2 py-0.5 rounded-full">Live</span>
                </div>
                <div className="text-xs text-muted">Connect via Meta OAuth — secure, one-tap</div>
              </div>
            </div>

            <ul className="text-sm text-muted space-y-2 mb-6">
              <li className="flex gap-2"><span className="text-accent">✓</span> Permissions: read posts, read comments + Live comments, send DMs, reply to comments</li>
              <li className="flex gap-2"><span className="text-accent">✓</span> Token stored encrypted (AES-256-GCM). We never see your password.</li>
              <li className="flex gap-2"><span className="text-accent">✓</span> Revoke any time from Meta Business Settings or your dashboard</li>
            </ul>

            <a
              href="/api/autodm/oauth/start"
              className="inline-flex items-center justify-center gap-2 w-full bg-accent text-bg font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition"
            >
              <Instagram className="w-4 h-4" />
              Connect with Instagram
            </a>

            <p className="mt-4 text-xs text-muted text-center">
              Your IG account must be Business or Creator (not Personal) — IG&apos;s rule, not ours.
            </p>
          </div>

          {/* LinkedIn — COMING SOON */}
          <div className="rounded-2xl border border-border bg-bg-card/30 p-6 opacity-90">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0a66c2] flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">
                  LinkedIn
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-surface border border-border text-muted px-2 py-0.5 rounded-full">Coming Q3 2026</span>
                </div>
                <div className="text-xs text-muted">Comment-to-DM on your LinkedIn posts</div>
              </div>
            </div>

            <p className="text-sm text-muted mb-4">
              Same rule engine as Instagram, fitted for LinkedIn. Drop your email — we&apos;ll
              email you the day it ships, and yearly subscribers get early access.
            </p>

            <Link
              href="/autodm/coming-soon/linkedin"
              className="inline-flex items-center justify-center gap-2 w-full border border-border bg-surface/40 text-text font-medium px-6 py-3 rounded-full hover:border-accent hover:text-accent transition"
            >
              Join the LinkedIn waitlist →
            </Link>
          </div>

          {/* X — COMING SOON */}
          <div className="rounded-2xl border border-border bg-bg-card/30 p-6 opacity-90">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-black border border-border flex items-center justify-center">
                <XLogo className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">
                  X (formerly Twitter)
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-surface border border-border text-muted px-2 py-0.5 rounded-full">Coming Q3 2026</span>
                </div>
                <div className="text-xs text-muted">Reply-to-DM for posts and Spaces</div>
              </div>
            </div>

            <p className="text-sm text-muted mb-4">
              When someone replies to one of your posts asking for the link, AutoDM slides
              the resource into their DMs and keeps the thread going.
            </p>

            <Link
              href="/autodm/coming-soon/x"
              className="inline-flex items-center justify-center gap-2 w-full border border-border bg-surface/40 text-text font-medium px-6 py-3 rounded-full hover:border-accent hover:text-accent transition"
            >
              Join the X waitlist →
            </Link>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-14">
          <h2 className="text-sm font-mono uppercase tracking-widest text-accent mb-4">
            // what happens after Instagram connect
          </h2>
          <div className="space-y-4">
            <Step n="1" icon={<Instagram className="w-4 h-4" />} title="Meta sign-in"
              body="You log in with your IG account and grant permissions. Takes ~10 seconds." />
            <Step n="2" icon={<Sparkles className="w-4 h-4" />} title="AI onboarding scan"
              body="We pull your last 30 posts + your past 100 replies. Build a style sheet of your voice. Cluster recurring questions in your comments. ~45 seconds." />
            <Step n="3" icon={<Zap className="w-4 h-4" />} title="5 starter rules generated"
              body="You see 5 draft rules — keywords, DM templates in your voice, public replies. Tap Approve. Live." />
            <Step n="4" icon={<Shield className="w-4 h-4" />} title="Spam-shield active"
              body="Account warming auto-paces sends for the first 7 days. Meta 429 detector pauses you proactively if you hit limits. Your account doesn't get banned." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="font-mono text-xs text-muted mt-1 w-6">{n}</div>
      <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-sm text-muted mt-1 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

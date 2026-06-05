// Connect Instagram — the 90-second onboarding entry point.
// User clicks "Connect Instagram" → /api/autodm/oauth/start kicks off Meta OAuth.

import Link from 'next/link';
import { Instagram, Shield, Zap, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Connect Instagram — StackPicks AutoDM',
  description: 'One-tap Instagram connection. Sign in with Meta, we handle the rest.',
};

export default function ConnectPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/autodm" className="text-xs text-muted hover:text-text">← Back to AutoDM</Link>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight leading-[1.05]">
          Connect Instagram.
          <br />
          Live in <span className="text-accent">90 seconds</span>.
        </h1>
        <p className="mt-4 text-muted text-lg">
          One Meta sign-in. We&apos;ll scan your last 30 posts, learn your voice from your past
          replies, and generate 5 starter rules for you to approve. No JSON, no API keys.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-bg-card/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold">Instagram Business Account</div>
              <div className="text-xs text-muted">Connect via Meta OAuth — secure, one-tap</div>
            </div>
          </div>

          <ul className="text-sm text-muted space-y-2 mb-6">
            <li className="flex gap-2"><span className="text-accent">✓</span> Permissions: read posts, read comments, send DMs, reply to comments</li>
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

        {/* What happens next */}
        <div className="mt-12">
          <h2 className="text-sm font-mono uppercase tracking-widest text-accent mb-4">
            // what happens next
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

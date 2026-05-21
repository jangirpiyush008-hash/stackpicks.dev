import Link from 'next/link';
import { Suspense } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { AuthForm } from '../../components/AuthForm';
import { GeoPrice } from '../../components/GeoPrice';

export const metadata = {
  title: 'Create your membership',
  description: 'Sign up for lifetime access to StackPicks. One-time payment, no renewals.',
};

export const dynamic = 'force-dynamic';

const PERKS = [
  'Full directory — 100+ curated tools',
  '13 ready-to-ship stack bundles',
  'Weekly long-form analyses',
  'Members-only Discord',
  'Priority email support',
];

export default function SignupPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
        {/* Perk panel */}
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Lifetime membership</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">
            Create your account
          </h1>
          <p className="text-muted leading-relaxed mb-6">
            Free to sign up. Premium membership is a one-time payment of{' '}
            <GeoPrice className="text-text font-semibold" /> — unlocks the whole directory forever.
            No renewals, no surprises.
          </p>
          <ul className="space-y-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-muted">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Auth panel */}
        <div>
          <header className="text-center md:hidden mb-6">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">Create your account</h1>
            <p className="text-sm text-muted">Free sign-up. Upgrade to membership any time.</p>
          </header>

          <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
            <Suspense fallback={<div className="text-sm text-muted text-center py-8">Loading…</div>}>
              <AuthForm mode="signup" />
            </Suspense>
          </div>

          <p className="text-center text-xs text-muted mt-5">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-muted hover:text-accent underline underline-offset-2">Terms</Link>,{' '}
            <Link href="/privacy" className="text-muted hover:text-accent underline underline-offset-2">Privacy Policy</Link>, and{' '}
            <Link href="/refund" className="text-muted hover:text-accent underline underline-offset-2">Refund Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

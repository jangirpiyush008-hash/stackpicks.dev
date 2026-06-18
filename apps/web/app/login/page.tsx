import Link from 'next/link';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Sparkles } from 'lucide-react';
import { AuthForm } from '../../components/AuthForm';

export const metadata = {
  title: 'Sign in',
  description: 'Sign in to your StackPicks membership.',
};

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // Brand the page for whichever product the user is signing in from.
  const host = (await headers()).get('host')?.toLowerCase() ?? '';
  const isAutoDm = host === 'autodm.stackpicks.dev';
  const brand = isAutoDm ? 'StackPicks AutoDM' : 'StackPicks';
  const blurb = isAutoDm
    ? 'Sign in to connect Instagram and run your auto-DM rules.'
    : 'Welcome back. Use email or your Google account.';

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center px-4 py-12">
      <div className="max-w-md mx-auto w-full">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>{isAutoDm ? 'AutoDM members' : 'Members area'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">Sign in to {brand}</h1>
          <p className="text-sm text-muted">{blurb}</p>
        </header>

        <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
          <Suspense fallback={<div className="text-sm text-muted text-center py-8">Loading…</div>}>
            <AuthForm mode="login" />
          </Suspense>
        </div>

        <p className="text-center text-xs text-muted mt-5">
          By signing in you agree to our <Link href="/terms" className="text-muted hover:text-accent underline underline-offset-2">Terms</Link> and{' '}
          <Link href="/privacy" className="text-muted hover:text-accent underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

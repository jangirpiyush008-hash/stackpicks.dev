// Email verification gate. Anyone signed in but with email_confirmed_at=null
// who tries to start the IG OAuth flow lands here. They click "Resend
// verification email" which calls Supabase to re-deliver the confirmation
// link to their inbox.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase-server';
import { ResendVerificationButton } from '@/components/autodm/ResendVerificationButton';

export const metadata = {
  title: 'Verify your email — StackPicks AutoDM',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function VerifyEmailGate() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) redirect('/login?next=' + encodeURIComponent('/autodm/connect'));
  if (user.email_confirmed_at) redirect('/autodm/connect');

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="max-w-xl mx-auto px-6 py-20">
        <Link href="/autodm" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to AutoDM
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-6">
          <Mail className="w-6 h-6" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">Verify your email first.</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Before we let you connect Instagram, we need a confirmed email on file —
          it&apos;s how we recover your account if you ever lose access. We sent a
          link to <span className="text-text font-mono text-sm">{user.email}</span>{' '}
          when you signed up; click it to verify, then come back here.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ResendVerificationButton email={user.email ?? ''} />
          <a
            href="/autodm/connect"
            className="inline-flex items-center gap-2 border border-border bg-surface/40 text-text font-medium px-5 py-2.5 rounded-full hover:border-accent hover:text-accent transition text-sm"
          >
            I&apos;ve verified — continue
          </a>
        </div>

        <p className="mt-8 text-xs text-muted">
          Didn&apos;t get the email? Check spam, or try a different inbox. Still
          stuck? <a href="mailto:stackpicks.dev@gmail.com" className="underline underline-offset-2 hover:text-text">stackpicks.dev@gmail.com</a>.
        </p>
      </section>
    </main>
  );
}

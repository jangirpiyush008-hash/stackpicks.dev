// Account-security settings: 2FA enrollment + sign-out-everywhere control.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { getSupabaseServer } from '@/lib/supabase-server';
import { Mfa } from '@/components/Mfa';
import { InvalidateOtherSessionsButton } from '@/components/InvalidateOtherSessionsButton';

export const metadata = {
  title: 'Account security',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) redirect('/login?next=' + encodeURIComponent('/profile/security'));

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to profile
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted">Security</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Account security</h1>

      <div className="space-y-4">
        <Mfa />

        <div className="rounded-2xl border border-border bg-surface/40 p-5">
          <div className="font-semibold mb-1">Sign out everywhere else</div>
          <p className="text-xs text-muted mb-3 leading-relaxed">
            Kills any live sessions on devices other than this one. Useful if
            you ever lose a phone or sign in on a shared computer and forget.
          </p>
          <InvalidateOtherSessionsButton />
        </div>
      </div>
    </main>
  );
}

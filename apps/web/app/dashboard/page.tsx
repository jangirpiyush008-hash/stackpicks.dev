import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles, Github, LayoutDashboard, User } from 'lucide-react';
import { getSupabaseServer } from '../../lib/supabase-server';
import { deriveDisplayUser } from '../../lib/auth-user';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Members dashboard',
  description: 'Your StackPicks membership home.',
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/dashboard');

  const display = deriveDisplayUser(user);

  // Check active lifetime membership (RLS allows user to read own subscription)
  const { data: sub } = await supabase
    .from('premium_subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();
  const isMember = !!sub;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Welcome row with avatar */}
      <header className="mb-10 flex items-center gap-5">
        {display.avatarUrl ? (
          <img
            src={display.avatarUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-2xl border border-border bg-surface shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/40 to-fuchsia-500/40 text-text text-xl flex items-center justify-center font-bold shrink-0">
            {display.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Members area</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-accent">{display.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-xs text-muted mt-1">
            Signed in with {display.provider ?? 'email'} · {display.email}
          </p>
        </div>
      </header>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link href="/build" className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent transition">
          <LayoutDashboard className="w-5 h-5 text-accent mb-3" />
          <div className="font-bold mb-1">Stack bundles</div>
          <p className="text-sm text-muted">13 ready-to-ship stacks.</p>
        </Link>
        <Link href="/preview" className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent transition">
          <Github className="w-5 h-5 text-accent mb-3" />
          <div className="font-bold mb-1">Directory</div>
          <p className="text-sm text-muted">100+ curated repos.</p>
        </Link>
        <Link href="/submit-repo" className="rounded-2xl border border-accent/40 bg-accent/5 p-5 hover:border-accent transition">
          <Sparkles className="w-5 h-5 text-accent mb-3" />
          <div className="font-bold mb-1">Submit a repo</div>
          <p className="text-sm text-muted">We&apos;ll feature the best.</p>
        </Link>
      </div>

      {/* Membership card */}
      <div className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
          Membership status
        </div>
        {isMember ? (
          <>
            <div className="text-lg font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Lifetime member
            </div>
            <p className="text-sm text-muted">
              Full directory + bundles unlocked. Thanks for backing the project.
            </p>
          </>
        ) : (
          <>
            <div className="text-lg font-bold mb-1">Free account</div>
            <p className="text-sm text-muted mb-4">
              You&apos;re signed in but haven&apos;t purchased the lifetime membership yet.
              Upgrade for full directory + bundle access.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
            >
              Upgrade — lifetime
            </Link>
          </>
        )}
      </div>

      {/* Profile / settings link */}
      <div className="text-center">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition"
        >
          <User className="w-3.5 h-3.5" />
          Manage profile
        </Link>
      </div>
    </div>
  );
}

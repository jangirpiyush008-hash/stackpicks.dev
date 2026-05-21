import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles, LogOut } from 'lucide-react';
import { getSupabaseServer } from '../../lib/supabase-server';
import { LogoutButton } from '../../components/LogoutButton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Members dashboard',
  description: 'Your StackPicks membership home.',
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/dashboard');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Members area</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-1">Welcome back.</h1>
        <p className="text-sm text-muted">
          Signed in as <span className="text-text font-mono">{user.email}</span>
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link href="/build" className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent transition">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Bundles</div>
          <div className="text-lg font-bold mb-1">All 13 stack bundles</div>
          <p className="text-sm text-muted">Open one. Feed to your AI agent. Ship.</p>
        </Link>
        <Link href="/preview" className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent transition">
          <div className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Directory</div>
          <div className="text-lg font-bold mb-1">100+ curated repos</div>
          <p className="text-sm text-muted">Browse the full library.</p>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Membership status</div>
        <div className="text-lg font-bold mb-1">Free account</div>
        <p className="text-sm text-muted mb-4">
          You&apos;re signed in but haven&apos;t purchased the lifetime membership yet. Upgrade for full
          directory + bundle access.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
        >
          Upgrade — lifetime
        </Link>
      </div>

      <div className="text-center">
        <LogoutButton>
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </LogoutButton>
      </div>
    </div>
  );
}

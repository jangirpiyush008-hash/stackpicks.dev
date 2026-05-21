import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles, User as UserIcon, Mail, Calendar, Github, ArrowRight } from 'lucide-react';
import { getSupabaseServer } from '../../lib/supabase-server';
import { deriveDisplayUser } from '../../lib/auth-user';
import { LogoutButton } from '../../components/LogoutButton';
import { formatIST } from '@stackpicks/core/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profile',
  description: 'Manage your StackPicks profile.',
};

export default async function ProfilePage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile');

  const display = deriveDisplayUser(user);
  const isMember = false; // TODO: wire to premium_subscriptions
  const memberSince = user.created_at ? formatIST(user.created_at) : '—';

  // Load this user's repo submissions (count + recent)
  let submissions: { full_name: string; status: string; created_at: string }[] = [];
  let submissionCount = 0;
  try {
    const { data, count } = await supabase
      .from('repo_submissions')
      .select('full_name, status, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) submissions = data;
    if (count != null) submissionCount = count;
  } catch {
    // table not created yet — silent
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-8 flex items-start gap-5">
        {display.avatarUrl ? (
          <img
            src={display.avatarUrl}
            alt=""
            width={80}
            height={80}
            className="rounded-2xl border border-border bg-surface shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/40 to-fuchsia-500/40 text-text text-2xl flex items-center justify-center font-bold shrink-0">
            {display.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-1">{display.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <Mail className="w-3.5 h-3.5" />
            <span>{display.email}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {isMember ? (
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent bg-accent/15 border border-accent/30 px-2 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Lifetime member
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-1 rounded-full">
                Free account
              </span>
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-1 rounded-full">
              {display.provider ?? 'email'} sign-in
            </span>
          </div>
        </div>
      </header>

      {/* Account info */}
      <section className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 mb-6">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted mb-4">Account</h2>
        <dl className="space-y-3 text-sm">
          <Row label="Display name" value={display.name} />
          <Row label="Email" value={display.email ?? '—'} />
          <Row label="Member since" value={memberSince} />
          <Row label="User ID" value={<code className="text-xs text-muted/70 font-mono">{display.id}</code>} />
        </dl>
        <p className="text-[11px] text-muted mt-4">
          Update name + avatar via your Google account — they sync on next sign-in.
        </p>
      </section>

      {/* Membership */}
      <section className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 mb-6">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted mb-4">Membership</h2>
        {isMember ? (
          <>
            <div className="text-lg font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Lifetime — Active
            </div>
            <p className="text-sm text-muted mb-4">
              Full directory + bundles unlocked. No renewals.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/build" className="px-3 py-1.5 rounded-lg border border-border hover:border-accent text-xs transition">
                Browse bundles
              </Link>
              <Link href="/preview" className="px-3 py-1.5 rounded-lg border border-border hover:border-accent text-xs transition">
                Open directory
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-lg font-bold mb-1">Free account</div>
            <p className="text-sm text-muted mb-4">
              You see a sample of the directory. Upgrade once to unlock everything forever.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
            >
              Upgrade — lifetime
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </section>

      {/* Repo submissions */}
      <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5 md:p-6 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-accent">
            Your repo submissions
          </h2>
          <span className="text-xs text-muted">{submissionCount} total</span>
        </div>
        <p className="text-sm text-muted mb-4">
          Built or maintain something we should add? Submit it. Best picks get featured on
          the homepage with a curator take.
        </p>

        {submissions.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {submissions.map((s) => (
              <li key={s.full_name} className="py-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-mono truncate">{s.full_name}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                  s.status === 'featured' ? 'bg-accent/20 text-accent' :
                  s.status === 'approved' ? 'bg-emerald-400/15 text-emerald-300' :
                  s.status === 'rejected' ? 'bg-red-400/15 text-red-300' :
                  'bg-surface text-muted border border-border'
                }`}>
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/submit-repo"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
        >
          <Github className="w-4 h-4" />
          Submit a repo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Sign out */}
      <div className="text-center pt-4">
        <LogoutButton>
          <UserIcon className="w-3.5 h-3.5" />
          Sign out
        </LogoutButton>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <dt className="text-xs text-muted/70 font-mono uppercase tracking-wider w-32 shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-text break-all">{value}</dd>
    </div>
  );
}

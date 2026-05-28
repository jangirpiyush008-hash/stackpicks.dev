import { notFound } from 'next/navigation';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../lib/admin';
import { AdminUserRow } from '../../components/AdminUserRow';
import { AdminLoginForm } from '../../components/AdminLoginForm';
import { AdminCoupons } from '../../components/AdminCoupons';
import { LogoutButton } from '../../components/LogoutButton';
import { AdminLaunchPanel } from '../../components/AdminLaunchPanel';
import Link from 'next/link';
import { Shield, Users, Sparkles, IndianRupee, LogOut, Tag, Rocket, Flame, ArrowRight } from 'lucide-react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin · StackPicks',
  robots: { index: false, follow: false },
};

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  is_member: boolean;
  plan_id: string | null;
  razorpay_payment_id: string | null;
  amount_inr: number | null;
  member_since: string | null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // 1) Gate
  const gate = await isAdmin();

  // 1a) Not signed in -> render the terminal login UI inline (same URL).
  if (!gate.ok && !gate.email) {
    return <AdminLoginShell />;
  }

  // 1b) Signed in but not allow-listed -> hide existence
  if (!gate.ok) notFound();

  const { q } = await searchParams;
  const search = q?.trim().toLowerCase() ?? '';

  const admin = adminClient();

  // 2) Pull auth users + subscriptions in parallel
  const [usersRes, subsRes, couponsRes] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin
      .from('premium_subscriptions')
      .select('user_id, plan_id, status, razorpay_customer_id, amount_inr, current_period_start'),
    admin.from('coupons').select('*').order('created_at', { ascending: false }),
  ]);
  if (usersRes.error) console.error('[admin] listUsers failed:', usersRes.error);

  const allUsers = usersRes.data?.users ?? [];
  const subByUser = new Map(
    (subsRes.data ?? [])
      .filter((s) => s.status === 'active')
      .map((s) => [s.user_id as string, s])
  );

  const rows: UserRow[] = allUsers
    .map((u) => {
      const sub = subByUser.get(u.id);
      return {
        id: u.id,
        email: u.email ?? '(no email)',
        created_at: u.created_at,
        is_member: !!sub,
        plan_id: sub?.plan_id ?? null,
        razorpay_payment_id: (sub?.razorpay_customer_id as string | null) ?? null,
        amount_inr: (sub?.amount_inr as number | null) ?? null,
        member_since: (sub?.current_period_start as string | null) ?? null,
      };
    })
    .filter((r) => !search || r.email.toLowerCase().includes(search))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  // Stats
  const totalUsers = allUsers.length;
  const paidUsers = rows.filter((r) => r.is_member).length;
  const freeUsers = totalUsers - paidUsers;
  const activeSubs = (subsRes.data ?? []).filter((s) => s.status === 'active');
  const totalRevenuePaise = activeSubs.reduce((sum, s) => sum + ((s.amount_inr as number) || 0), 0);
  const totalRevenueINR = Math.round(totalRevenuePaise / 100);

  // ─── Launch metrics: time-bucketed counts ───────────────────────────
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last1h = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  const signups24h = allUsers.filter((u) => u.created_at >= last24h).length;
  const signups1h = allUsers.filter((u) => u.created_at >= last1h).length;
  const signupsToday = allUsers.filter((u) => u.created_at >= startOfToday).length;
  const signups7d = allUsers.filter((u) => u.created_at >= last7d).length;

  const paidToday = activeSubs.filter((s) => (s.current_period_start as string) >= startOfToday).length;
  const paid24h = activeSubs.filter((s) => (s.current_period_start as string) >= last24h).length;
  const paid7d = activeSubs.filter((s) => (s.current_period_start as string) >= last7d).length;

  const revenue24hPaise = activeSubs
    .filter((s) => (s.current_period_start as string) >= last24h)
    .reduce((sum, s) => sum + ((s.amount_inr as number) || 0), 0);
  const revenueTodayPaise = activeSubs
    .filter((s) => (s.current_period_start as string) >= startOfToday)
    .reduce((sum, s) => sum + ((s.amount_inr as number) || 0), 0);
  const revenue7dPaise = activeSubs
    .filter((s) => (s.current_period_start as string) >= last7d)
    .reduce((sum, s) => sum + ((s.amount_inr as number) || 0), 0);

  const recentSignups = allUsers
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 10)
    .map((u) => ({ email: u.email ?? '(no email)', created_at: u.created_at }));

  const recentPayments = activeSubs
    .slice()
    .sort((a, b) => ((a.current_period_start as string) < (b.current_period_start as string) ? 1 : -1))
    .slice(0, 10)
    .map((s) => ({
      user_id: s.user_id as string,
      amount: (s.amount_inr as number) || 0,
      at: s.current_period_start as string,
      plan: s.plan_id as string,
    }));

  const launchMetrics = {
    signups: { hour: signups1h, today: signupsToday, last24h: signups24h, last7d: signups7d, total: totalUsers },
    paid: { today: paidToday, last24h: paid24h, last7d: paid7d, total: paidUsers },
    revenue: {
      today: Math.round(revenueTodayPaise / 100),
      last24h: Math.round(revenue24hPaise / 100),
      last7d: Math.round(revenue7dPaise / 100),
      total: totalRevenueINR,
    },
    recentSignups,
    recentPayments,
    conversionRate: totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 1000) / 10 : 0,
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header bar */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <Shield className="w-5 h-5 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold font-mono">stackpicks<span className="text-accent">.admin</span></h1>
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
            {gate.email}
          </span>
          <div className="ml-auto">
            <LogoutButton>
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </LogoutButton>
          </div>
        </div>
        <p className="text-sm text-muted mb-8">
          Internal. Not indexed.
        </p>

        {/* SEO CALENDAR — primary daily action, top of page */}
        <section className="mb-8">
          <Link
            href="/admin/seo"
            className="flex items-center justify-between gap-3 p-5 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:border-accent/70 transition group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Flame className="w-5 h-5 text-accent shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-base">Today&apos;s SEO + GEO task</div>
                <div className="text-xs text-muted">90-day ranking campaign · check off today&apos;s task</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        </section>

        {/* CONNECT WIRING — daily 5-app setup tracker */}
        <section className="mb-8">
          <Link
            href="/admin/connect"
            className="flex items-center justify-between gap-3 p-5 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent hover:border-accent/70 transition group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Rocket className="w-5 h-5 text-accent shrink-0" />
              <div className="min-w-0">
                <div className="font-bold text-base">Connect wiring roadmap</div>
                <div className="text-xs text-muted">Wire 5 apps/day · opens to public at 50 live</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0" />
          </Link>
        </section>

        {/* Stats — at-a-glance health */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Stat icon={<Users className="w-4 h-4" />} label="Total users" value={totalUsers.toString()} />
          <Stat
            icon={<Sparkles className="w-4 h-4 text-accent" />}
            label="Lifetime members"
            value={paidUsers.toString()}
            sub={`${freeUsers} free`}
            highlight
          />
          <Stat
            icon={<IndianRupee className="w-4 h-4" />}
            label="Revenue (active subs)"
            value={`₹${totalRevenueINR.toLocaleString('en-IN')}`}
          />
        </div>

        {/* LAUNCH METRICS — collapsed by default. Useful for launch-day pushes
            and share-template copy/paste; not daily-essential anymore. */}
        <details className="mb-12 rounded-2xl border border-border bg-surface/30 overflow-hidden group">
          <summary className="cursor-pointer flex items-center gap-3 px-5 py-4 hover:bg-surface/50 transition">
            <Rocket className="w-4 h-4 text-muted" />
            <span className="font-bold text-sm">Launch metrics + share templates</span>
            <span className="text-xs text-muted ml-auto">click to expand</span>
          </summary>
          <div className="p-5 border-t border-border">
            <AdminLaunchPanel data={launchMetrics} />
          </div>
        </details>

        {/* USERS */}
        <section className="mb-12">
          <div className="flex items-baseline gap-3 mb-4">
            <Users className="w-4 h-4 text-muted" />
            <h2 className="text-lg font-bold">Users</h2>
            <span className="text-xs text-muted">{totalUsers} total</span>
          </div>

          <form action="/admin" method="get" className="mb-4">
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Filter by email…"
              className="w-full md:w-96 px-3 py-2 rounded-lg bg-surface border border-border focus:border-accent outline-none text-sm font-mono"
            />
          </form>

          <div className="rounded-2xl border border-border bg-surface/30 overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_120px_180px] gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border bg-surface/60">
              <div>User</div>
              <div>Status</div>
              <div>Joined</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-border">
              {rows.length === 0 ? (
                <div className="px-4 py-10 text-center text-muted text-sm">No users match.</div>
              ) : (
                rows.map((r) => <AdminUserRow key={r.id} row={r} />)
              )}
            </div>
          </div>
          <p className="text-[11px] text-muted mt-2">
            Showing {rows.length} of {totalUsers}{search && ` · filtered by "${search}"`}
          </p>
        </section>

        {/* COUPONS */}
        <section>
          <div className="flex items-baseline gap-3 mb-4">
            <Tag className="w-4 h-4 text-muted" />
            <h2 className="text-lg font-bold">Coupons</h2>
            <span className="text-xs text-muted">{couponsRes.data?.length ?? 0} total</span>
          </div>
          <AdminCoupons initial={couponsRes.data ?? []} />
        </section>
      </div>
    </div>
  );
}

// ─── Inline login shell ─────────────────────────────────────────────────
function AdminLoginShell() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-10 font-mono">
      {/* CRT scanlines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, #c6ff00 2px, #c6ff00 3px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#c6ff00 1px, transparent 1px), linear-gradient(90deg, #c6ff00 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-4 text-center">
          <div className="inline-block px-3 py-1 border border-red-500/60 bg-red-500/10 text-red-300 text-[10px] uppercase tracking-[0.2em] rounded">
            ▲ Restricted Area
          </div>
        </div>

        <div className="border border-accent/40 bg-black/60 backdrop-blur-xl rounded-md shadow-[0_0_40px_-10px_rgba(198,255,0,0.3)] overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 border-b border-accent/30">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent ml-2">
              stackpicks://admin/console
            </span>
          </div>

          <div className="p-6">
            <pre className="text-[10px] leading-tight text-accent/80 mb-5 select-none">
{`╔══════════════════════════════════════════╗
║   STACKPICKS  ADMIN  CONSOLE  v1.0      ║
║   AUTHORIZED PERSONNEL ONLY              ║
╚══════════════════════════════════════════╝`}
            </pre>

            <div className="text-xs text-accent/70 mb-1">
              <span className="text-accent">$</span> system.identify_operator()
            </div>
            <div className="text-[11px] text-muted mb-6">
              All access attempts are logged. Failed authentication triggers session lockout.
            </div>

            <AdminLoginForm />
          </div>

          <div className="px-6 py-3 border-t border-accent/20 bg-accent/[0.03] text-[10px] text-muted/60">
            <span className="text-accent/60">●</span> TLS 1.3 · ap-south-1 · session: unauthenticated
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] text-muted/50 uppercase tracking-[0.2em]">
          Unauthorized access violates IT Act, 2000
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon, label, value, sub, highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface/40'}`}>
      <div className="flex items-center gap-2 text-xs text-muted font-mono uppercase tracking-wider mb-2">
        {icon}
        {label}
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

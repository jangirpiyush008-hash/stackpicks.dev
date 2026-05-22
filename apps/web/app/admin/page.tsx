import { notFound } from 'next/navigation';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../lib/admin';
import { AdminUserRow } from '../../components/AdminUserRow';
import { AdminLoginForm } from '../../components/AdminLoginForm';
import { AdminCoupons } from '../../components/AdminCoupons';
import { LogoutButton } from '../../components/LogoutButton';
import { Shield, Users, Sparkles, IndianRupee, LogOut, Tag } from 'lucide-react';

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
  const totalRevenuePaise = (subsRes.data ?? [])
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + ((s.amount_inr as number) || 0), 0);
  const totalRevenueINR = Math.round(totalRevenuePaise / 100);

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
          Internal. Not indexed. Audit trail prints to server logs.
        </p>

        {/* Stats */}
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

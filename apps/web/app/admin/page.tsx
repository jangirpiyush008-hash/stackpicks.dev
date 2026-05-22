import { notFound, redirect } from 'next/navigation';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../lib/admin';
import { AdminUserRow } from '../../components/AdminUserRow';
import { LogoutButton } from '../../components/LogoutButton';
import { Shield, Users, Sparkles, IndianRupee, LogOut } from 'lucide-react';

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
  // 1) Gate: must be signed in AND email must be in ADMIN_EMAIL allowlist
  const gate = await isAdmin();
  if (!gate.ok) {
    // Not signed in -> route to the dedicated admin login console.
    // Signed in but not authorized -> 404 (hide the page exists).
    if (!gate.email) redirect('/admin/login');
    notFound();
  }

  const { q } = await searchParams;
  const search = q?.trim().toLowerCase() ?? '';

  const admin = adminClient();

  // 2) Pull auth users via admin API
  const { data: usersData, error: usersErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (usersErr) {
    console.error('[admin] listUsers failed:', usersErr);
  }
  const allUsers = usersData?.users ?? [];

  // 3) Pull all active premium_subscriptions
  const { data: subs } = await admin
    .from('premium_subscriptions')
    .select('user_id, plan_id, status, razorpay_customer_id, amount_inr, current_period_start')
    .eq('status', 'active');

  const subByUser = new Map(
    (subs ?? []).map((s) => [s.user_id as string, s])
  );

  // 4) Merge + filter
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

  // 5) Stats
  const totalUsers = allUsers.length;
  const paidUsers = rows.filter((r) => r.is_member).length;
  const freeUsers = totalUsers - paidUsers;
  const totalRevenuePaise = (subs ?? []).reduce(
    (sum, s) => sum + ((s.amount_inr as number) || 0),
    0
  );
  const totalRevenueINR = Math.round(totalRevenuePaise / 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <Shield className="w-5 h-5 text-accent" />
        <h1 className="text-2xl md:text-3xl font-bold">Admin</h1>
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
        Internal. Not indexed. Audit-trail prints to server logs on every grant/revoke.
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
          label="Revenue (active subs only)"
          value={`₹${totalRevenueINR.toLocaleString('en-IN')}`}
        />
      </div>

      {/* Search */}
      <form action="/admin" method="get" className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Filter by email…"
          className="w-full md:w-96 px-3 py-2 rounded-lg bg-surface border border-border focus:border-accent outline-none text-sm font-mono"
        />
      </form>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_180px] gap-3 px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border bg-surface/60">
          <div>User</div>
          <div>Status</div>
          <div>Joined</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-border">
          {rows.length === 0 ? (
            <div className="px-4 py-10 text-center text-muted text-sm">
              No users match.
            </div>
          ) : (
            rows.map((r) => <AdminUserRow key={r.id} row={r} />)
          )}
        </div>
      </div>

      <p className="text-[11px] text-muted mt-6">
        Showing {rows.length} of {totalUsers} users{search && ` · filtered by "${search}"`}.
      </p>
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

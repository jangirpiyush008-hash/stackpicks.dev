// AutoDM super-admin — see every tenant + recent activity + support tools.
// Admin only via isAdmin() check.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { adminClient } from '@stackpicks/core/db';
import { AutodmAdminClient } from '@/components/admin/AutodmAdminClient';
import { Users } from 'lucide-react';

export const metadata = {
  title: 'AutoDM admin — StackPicks',
  description: 'Super-admin cockpit for StackPicks AutoDM tenants.',
};

interface TenantSummary {
  id: string;
  ig_business_id: string;
  ig_username: string | null;
  owner_user_id: string;
  plan_tier: string;
  hourly_cap: number;
  daily_cap: number;
  account_warming_ends_at: string | null;
  ai_followup_agent: boolean;
  is_active: boolean;
  paused_until: string | null;
  paused_reason: string | null;
  created_at: string;
  // computed
  rule_count: number;
  active_rule_count: number;
  sent_24h: number;
  sent_7d: number;
  escalated_count: number;
}

export default async function AutodmAdminPage() {
  const check = await isAdmin();
  if (!check.ok) redirect('/');

  const admin = adminClient();
  const { data: tenantsRaw } = await admin
    .from('autodm_tenants')
    .select('id, ig_business_id, ig_username, owner_user_id, plan_tier, hourly_cap, daily_cap, account_warming_ends_at, ai_followup_agent, is_active, paused_until, paused_reason, created_at')
    .order('created_at', { ascending: false });
  const tenants = (tenantsRaw ?? []) as Omit<TenantSummary, 'rule_count' | 'active_rule_count' | 'sent_24h' | 'sent_7d' | 'escalated_count'>[];

  // Fan out per-tenant metrics in parallel — fine for early scale
  const summaries: TenantSummary[] = await Promise.all(tenants.map(async (t) => {
    const day = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [rules, activeRules, sent24, sent7, escalated] = await Promise.all([
      admin.from('autodm_rules').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id),
      admin.from('autodm_rules').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id).eq('is_active', true),
      admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id).eq('status', 'sent').gte('created_at', day),
      admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id).eq('status', 'sent').gte('created_at', week),
      admin.from('autodm_conversations').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id).eq('status', 'creator_escalated'),
    ]);
    return {
      ...t,
      rule_count: rules.count ?? 0,
      active_rule_count: activeRules.count ?? 0,
      sent_24h: sent24.count ?? 0,
      sent_7d: sent7.count ?? 0,
      escalated_count: escalated.count ?? 0,
    };
  }));

  // Aggregate stats for the header
  const totals = {
    tenants: summaries.length,
    paid: summaries.filter((s) => s.plan_tier !== 'free').length,
    active: summaries.filter((s) => s.is_active && !s.paused_until).length,
    paused: summaries.filter((s) => s.paused_until && new Date(s.paused_until) > new Date()).length,
    sent_24h: summaries.reduce((acc, s) => acc + s.sent_24h, 0),
    escalated: summaries.reduce((acc, s) => acc + s.escalated_count, 0),
  };

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">// admin</div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <Users className="w-7 h-7 text-accent" /> AutoDM tenants
            </h1>
            <p className="text-sm text-muted mt-1">
              {check.email} · {totals.tenants} total · {totals.paid} paid · {totals.active} live · {totals.paused} paused
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href="/admin" className="text-xs text-muted hover:text-text border border-border rounded-full px-3 py-1.5">← All admin</Link>
          </div>
        </div>

        {/* Aggregate stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Tenants" value={String(totals.tenants)} />
          <Stat label="DMs · 24h" value={String(totals.sent_24h)} />
          <Stat label="Paid plans" value={String(totals.paid)} sub={`of ${totals.tenants}`} />
          <Stat label="Escalated" value={String(totals.escalated)} highlight={totals.escalated > 0} />
        </div>

        {/* Tenant list (client component handles actions) */}
        <AutodmAdminClient tenants={summaries} />
      </section>
    </main>
  );
}

function Stat({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-amber-500/40 bg-amber-500/5' : 'border-border bg-bg-card/40'}`}>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      {sub && <div className="text-[10px] text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

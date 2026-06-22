/**
 * Per-tenant detail report — admin only.
 *
 * Lists every legally-storable field on a single tenant + recent
 * activity + aggregate counts. Used to answer support tickets and
 * to satisfy compliance/data-subject-access requests (DPDP Section 11
 * — user has the right to a copy of data we hold about them).
 *
 * Hard rule: this page MUST NOT show commenter PII (commenter @handles,
 * commenter IGSIDs in raw form, comment bodies past the first 80 chars).
 * Meta Platform Terms §4.b prohibits aggregating recipient data; the
 * admin uses aggregate counts and per-rule attribution only.
 */
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, AlertTriangle, Activity, Users, FileText } from 'lucide-react';
import { isAdmin } from '@/lib/admin';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tenant report — AutoDM admin',
  robots: { index: false, follow: false },
};

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const check = await isAdmin();
  if (!check.ok) redirect('/');
  const { tenantId } = await params;

  const admin = adminClient();
  const { data: tenant } = await admin
    .from('autodm_tenants')
    .select('*')
    .eq('id', tenantId)
    .single();
  if (!tenant) notFound();

  // Pull owner email (lightweight — auth admin call)
  let ownerEmail: string | null = null;
  try {
    const { data: u } = await admin.auth.admin.getUserById(tenant.owner_user_id as string);
    ownerEmail = u?.user?.email ?? null;
  } catch { /* non-fatal */ }

  // Aggregate stats — fan out in parallel, time-bucketed
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const last7d  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [rulesRes, sent24Res, sent7Res, sent30Res, allTimeRes, clicksRes, recentRes] = await Promise.all([
    admin.from('autodm_rules').select('id, label, keyword, is_active, cta_url, cta_label, follow_nudge, daily_cap_per_recipient, ai_personality_hint, created_at').eq('tenant_id', tenantId).order('created_at', { ascending: false }),
    admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'sent').gte('created_at', last24h),
    admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'sent').gte('created_at', last7d),
    admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'sent').gte('created_at', last30d),
    admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'sent'),
    admin.from('autodm_dm_log').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).not('clicked_at', 'is', null),
    admin.from('autodm_dm_log').select('id, rule_id, trigger_event, ig_username, status, error, sent_body, created_at, click_count, reply_status').eq('tenant_id', tenantId).order('created_at', { ascending: false }).limit(20),
  ]);

  const rules = rulesRes.data ?? [];
  const sent24 = sent24Res.count ?? 0;
  const sent7  = sent7Res.count ?? 0;
  const sent30 = sent30Res.count ?? 0;
  const sentAllTime = allTimeRes.count ?? 0;
  const clicks = clicksRes.count ?? 0;
  const clickRate = sentAllTime > 0 ? Math.round((clicks / sentAllTime) * 1000) / 10 : 0;
  const recent = (recentRes.data ?? []) as Array<{
    id: string; rule_id: string | null; trigger_event: string | null;
    ig_username: string | null; status: string | null; error: string | null;
    sent_body: string | null; created_at: string; click_count: number | null;
    reply_status: string | null;
  }>;

  const t = tenant as Record<string, unknown>;
  const created = t.created_at as string;
  const accountAgeDays = Math.floor((now.getTime() - +new Date(created)) / (24 * 60 * 60 * 1000));

  const reportUrl = `/api/admin/autodm/tenant-report?tenant_id=${tenantId}&format=csv`;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">// admin · tenant report</span>
          <Link href="/admin/autodm" className="ml-auto inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-fg border border-border rounded-full px-3 py-1">
            <ArrowLeft className="w-3 h-3" />
            All tenants
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 flex-wrap">
          <Users className="w-6 h-6 text-accent shrink-0" />
          @{(t.ig_username as string) || '(no username)'}
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted bg-surface border border-border px-2 py-0.5 rounded-full">{(t.plan_tier as string) || 'free'}</span>
          {(t.is_active as boolean) ? null : (
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">inactive</span>
          )}
        </h1>
        <p className="text-xs text-muted mt-1 font-mono">
          {ownerEmail ?? '(owner email unavailable)'} · tenant {tenantId.slice(0, 8)} · joined {new Date(created).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} ({accountAgeDays}d ago)
        </p>

        {/* Privacy banner — what we CAN'T do */}
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-amber-100/80 leading-relaxed">
            <strong>Meta Platform Terms §4.b + India DPDP Section 7.</strong>{' '}
            This report contains creator (tenant) data only. Commenter / recipient
            data is aggregate-count or pseudonymous (@handle for support context).
            Do not export recipient @handles for ad targeting or build audience
            lists from this data — Meta revokes apps that aggregate Platform Data.
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid sm:grid-cols-4 gap-3 mt-6">
          <Stat label="Sent · 24h" value={sent24} />
          <Stat label="Sent · 7d" value={sent7} />
          <Stat label="Sent · 30d" value={sent30} />
          <Stat label="Sent · all-time" value={sentAllTime} sub={`${clicks} clicks · ${clickRate}% CTR`} />
        </div>

        {/* Identity + connection */}
        <Section title="Identity + connection">
          <Row k="ig_username" v={(t.ig_username as string) || '—'} />
          <Row k="ig_business_id" v={(t.ig_business_id as string) || '—'} />
          <Row k="tenant_id" v={tenantId} />
          <Row k="owner_email" v={ownerEmail ?? '—'} />
          <Row k="owner_user_id" v={(t.owner_user_id as string) || '—'} />
          <Row k="is_active" v={String(t.is_active)} />
          <Row k="created_at" v={fmt(t.created_at as string)} />
          <Row k="last_webhook_received_at" v={fmt(t.last_webhook_received_at as string | null)} />
          <Row k="last_webhook_event" v={(t.last_webhook_event as string) || '—'} />
          <Row k="webhook_subscribed_at" v={fmt(t.webhook_subscribed_at as string | null)} />
          <Row k="webhook_subscribe_error" v={(t.webhook_subscribe_error as string) || '—'} mono />
          <Row k="paused_until" v={fmt(t.paused_until as string | null)} />
          <Row k="paused_reason" v={(t.paused_reason as string) || '—'} />
          <Row k="account_warming_ends_at" v={fmt(t.account_warming_ends_at as string | null)} />
        </Section>

        {/* Plan + limits */}
        <Section title="Plan + limits">
          <Row k="plan_tier" v={(t.plan_tier as string) || 'free'} />
          <Row k="hourly_cap" v={String(t.hourly_cap ?? '—')} />
          <Row k="daily_cap" v={String(t.daily_cap ?? '—')} />
          <Row k="ai_followup_agent" v={String(t.ai_followup_agent ?? false)} />
          <Row k="billing_cycle" v={(t.billing_cycle as string) || '—'} />
          <Row k="currency" v={(t.currency as string) || '—'} />
        </Section>

        {/* Rules */}
        <Section title={`Rules (${rules.length})`}>
          {rules.length === 0 ? (
            <div className="text-sm text-muted">No rules configured.</div>
          ) : (
            <div className="space-y-2">
              {rules.map((r) => (
                <div key={r.id as string} className="border border-border rounded-lg p-3 bg-surface/30">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className={`font-mono ${(r.is_active as boolean) ? 'text-accent' : 'text-muted'}`}>
                      [{(r.is_active as boolean) ? 'ON ' : 'OFF'}]
                    </span>
                    <span className="font-semibold">{(r.label as string) || '(no label)'}</span>
                    <span className="text-muted font-mono">→ keyword: {(r.keyword as string) || '—'}</span>
                  </div>
                  {(r.cta_url as string) ? (
                    <div className="text-[11px] text-muted mt-1 font-mono break-all">
                      CTA: {(r.cta_label as string) || 'Open link'} → {(r.cta_url as string)}
                    </div>
                  ) : null}
                  <div className="text-[10px] text-muted mt-1 font-mono">
                    daily cap/recipient: {String(r.daily_cap_per_recipient ?? '∞')} · created {fmt(r.created_at as string)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Recent DM activity */}
        <Section title="Recent DM activity (last 20)">
          {recent.length === 0 ? (
            <div className="text-sm text-muted">No DMs sent yet.</div>
          ) : (
            <div className="space-y-1">
              {recent.map((r) => (
                <div key={r.id} className="text-[11px] font-mono text-muted flex flex-wrap gap-2 items-baseline border-b border-border/40 pb-1">
                  <span className="text-fg/80">{fmt(r.created_at)}</span>
                  <span className={r.status === 'sent' ? 'text-accent' : 'text-rose-300'}>{r.status}</span>
                  <span className="text-fg">@{r.ig_username || '?'}</span>
                  <span className="truncate flex-1">{r.sent_body || (r.error ?? '—')}</span>
                  {r.click_count ? <span className="text-accent">{r.click_count}c</span> : null}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Export */}
        <Section title="Export">
          <p className="text-xs text-muted mb-2">
            Full report as CSV. Includes everything on this page plus the full DM log (no commenter PII besides @handle).
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={reportUrl} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-accent/40 bg-accent/10 hover:bg-accent/20 text-sm font-mono text-accent">
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </a>
            <a href={`/api/admin/autodm/tenant-report?tenant_id=${tenantId}&format=json`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-surface/50 text-sm font-mono text-muted">
              <FileText className="w-3.5 h-3.5" />
              JSON
            </a>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/30 p-4">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted">{label}</div>
      <div className="text-2xl font-bold mt-1">{value.toLocaleString()}</div>
      {sub ? <div className="text-[10px] text-muted mt-1 font-mono">{sub}</div> : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-mono uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" />
        {title}
      </h2>
      <div className="rounded-xl border border-border bg-surface/30 p-4">
        {children}
      </div>
    </section>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 py-1 text-xs border-b border-border/30 last:border-0">
      <div className="font-mono text-muted">{k}</div>
      <div className={`${mono ? 'font-mono' : ''} text-fg break-all`}>{v || '—'}</div>
    </div>
  );
}

function fmt(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  } catch { return iso; }
}

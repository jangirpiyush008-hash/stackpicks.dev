// AutoDM tenant dashboard — the page a creator lands on after connecting.
// Shows: connection status, recent DM activity, rules list, plan info.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';
import { DEFAULT_PLAN_CAPS, type PlanTier } from '@stackpicks/core/autodm/types';
import { TenantSwitcher } from '@/components/autodm/TenantSwitcher';
import { ResyncButton } from '@/components/autodm/ResyncButton';
import { Instagram, Sparkles, AlertCircle, CheckCircle2, Pause, Inbox, Users, BarChart3 } from 'lucide-react';
import { RulesEditor } from '@/components/autodm/RulesEditor';
import { FollowupAgentToggle } from '@/components/autodm/FollowupAgentToggle';
import { PlanUpgrade } from '@/components/autodm/PlanUpgrade';
import { SubscriptionManager } from '@/components/autodm/SubscriptionManager';
import { WebhookHealthBanner } from '@/components/autodm/WebhookHealthBanner';
import { VoiceMatchCard } from '@/components/autodm/VoiceMatchCard';

export const metadata = {
  title: 'Dashboard — StackPicks AutoDM',
  description: 'Manage your auto-DM rules, see live activity, monitor account safety.',
};

interface TenantRow {
  id: string;
  ig_business_id: string;
  ig_username: string | null;
  plan_tier: string;
  hourly_cap: number;
  daily_cap: number;
  is_active: boolean;
  paused_until: string | null;
  paused_reason: string | null;
  account_warming_ends_at: string | null;
  ai_followup_agent: boolean;
  ai_dm_generation: boolean;
  last_webhook_received_at: string | null;
  created_at: string;
}

interface RuleRow {
  ig_post_id: string | null;
  id: string;
  label: string | null;
  keyword: string;
  dm_template: string;
  dm_template_variants: string[] | null;
  cta_url: string | null;
  cta_label: string | null;
  comment_reply: string | null;
  comment_reply_follower: string | null;
  follow_nudge: boolean;
  daily_cap_per_recipient: number | null;
  is_active: boolean;
  ai_personality_hint: string | null;
  active_hour_start: number | null;
  active_hour_end: number | null;
  active_days: number[] | null;
}
interface LogRow {
  ig_username: string | null;
  status: string;
  created_at: string;
  error: string | null;
  clicked_at: string | null;
  click_count: number;
  trigger_event: string | null;
}

export default async function DashboardPage({
  searchParams,
}: { searchParams: Promise<{ connected?: string }> }) {
  const supaRoute = await getSupabaseServer();
  const { data: { user } } = await supaRoute.auth.getUser();
  if (!user) redirect('/login?next=/autodm/dashboard');

  const supa = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant: activeLite, all: allTenants } = await getActiveTenant(supa, user.id, preferredId);

  // Hydrate the active tenant fully (all dashboard fields)
  let tenant: TenantRow | null = null;
  if (activeLite) {
    const { data: full } = await supa
      .from('autodm_tenants')
      .select('id, ig_business_id, ig_username, plan_tier, hourly_cap, daily_cap, is_active, paused_until, paused_reason, account_warming_ends_at, ai_followup_agent, ai_dm_generation, last_webhook_received_at, created_at')
      .eq('id', activeLite.id)
      .single();
    tenant = (full as TenantRow | null);
  }

  if (!tenant) {
    return (
      <main className="min-h-screen bg-bg text-text">
        <section className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-extrabold">No Instagram connected yet.</h1>
          <p className="mt-3 text-muted">Connect your IG to start sending auto-DMs in your voice.</p>
          <Link href="/autodm/connect"
            className="mt-6 inline-flex items-center gap-2 bg-accent text-bg font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition">
            <Instagram className="w-4 h-4" />
            Connect Instagram
          </Link>
        </section>
      </main>
    );
  }

  const { searchParams: _ } = { searchParams: await searchParams };
  const justConnected = (await searchParams).connected === '1';

  const [rulesRes, logRes, convCountRes, subRes] = await Promise.all([
    supa.from('autodm_rules').select('id, label, ig_post_id, keyword, dm_template, dm_template_variants, cta_url, cta_label, comment_reply, comment_reply_follower, follow_nudge, daily_cap_per_recipient, is_active, ai_personality_hint, active_hour_start, active_hour_end, active_days').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(50),
    supa.from('autodm_dm_log').select('ig_username, status, created_at, error, clicked_at, click_count, trigger_event').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(20),
    supa.from('autodm_conversations').select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id).eq('status', 'creator_escalated'),
    supa.from('autodm_subscriptions')
        .select('id, razorpay_subscription_id, plan_tier, status, current_period_end, cancel_at_cycle_end')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false })
        .limit(1),
  ]);
  const rules = (rulesRes.data ?? []) as RuleRow[];
  const logs = (logRes.data ?? []) as LogRow[];
  const escalatedCount = convCountRes.count ?? 0;
  const subRow = (subRes.data?.[0] as {
    id: string;
    razorpay_subscription_id: string;
    plan_tier: 'creator' | 'pro' | 'agency';
    status: string;
    current_period_end: string | null;
    cancel_at_cycle_end: boolean;
  } | undefined) ?? null;
  const subscription = subRow ? {
    id: subRow.id,
    razorpay_subscription_id: subRow.razorpay_subscription_id,
    plan_tier: subRow.plan_tier,
    status: subRow.status,
    current_end: subRow.current_period_end,
    cancel_at_cycle_end: subRow.cancel_at_cycle_end,
  } : null;

  const sentToday = logs.filter((l) =>
    l.status === 'sent' &&
    new Date(l.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  const clickedToday = logs.filter((l) =>
    l.clicked_at &&
    new Date(l.clicked_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  const ctrToday = sentToday > 0 ? Math.round((clickedToday / sentToday) * 100) : 0;

  const isWarming = tenant.account_warming_ends_at && new Date(tenant.account_warming_ends_at) > new Date();
  const isPaused = tenant.paused_until && new Date(tenant.paused_until) > new Date();

  // Plan-cap math for the switcher dropdown
  const tierRank: Record<PlanTier, number> = { free: 0, creator: 1, pro: 2, agency: 3 };
  const ownerPlan: PlanTier = (allTenants
    .map((t) => (t.plan_tier as PlanTier))
    .sort((a, b) => tierRank[b] - tierRank[a])[0]) ?? 'free';
  const igAllowed = DEFAULT_PLAN_CAPS[ownerPlan].instagram_accounts;
  const canAddMore = allTenants.length < igAllowed;

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">// dashboard</div>
            <h1 className="text-3xl font-extrabold">@{tenant.ig_username || 'creator'}</h1>
            <div className="text-sm text-muted mt-1">{tenant.plan_tier.toUpperCase()} · {tenant.hourly_cap}/hr · {tenant.daily_cap}/day</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <TenantSwitcher
              active={{ id: tenant.id, ig_username: tenant.ig_username, plan_tier: tenant.plan_tier, is_active: tenant.is_active }}
              all={allTenants}
              canAddMore={canAddMore}
              capInfo={{ used: allTenants.length, allowed: igAllowed, plan: ownerPlan }}
            />
            <Link
              href="/autodm/analytics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition bg-bg-card border border-border text-muted hover:text-text"
            >
              <BarChart3 className="w-3 h-3" /> Analytics
            </Link>
            <Link
              href="/autodm/contacts"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition bg-bg-card border border-border text-muted hover:text-text"
            >
              <Users className="w-3 h-3" /> Contacts
            </Link>
            <Link
              href="/autodm/inbox"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                escalatedCount > 0
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/15'
                  : 'bg-bg-card border border-border text-muted hover:text-text'
              }`}
            >
              <Inbox className="w-3 h-3" /> Inbox
              {escalatedCount > 0 && (
                <span className="ml-0.5 inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20">
                  {escalatedCount}
                </span>
              )}
            </Link>
            <ResyncButton />
            {isPaused ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold">
                <Pause className="w-3 h-3" /> Paused
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            )}
          </div>
        </div>

        {/* Webhook health — first thing creator sees if Meta isn't delivering */}
        <WebhookHealthBanner
          lastWebhookReceivedAt={tenant.last_webhook_received_at}
          tenantCreatedAt={tenant.created_at}
        />

        {/* Just-connected banner */}
        {justConnected && (
          <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/5 p-5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Connected. Spinning up your AI onboarding…</div>
              <div className="text-sm text-muted mt-1">
                We&apos;re scanning your last 30 posts and recent replies. In ~60 seconds you&apos;ll see 5 starter
                rules drafted in your voice. Refresh this page.
              </div>
            </div>
          </div>
        )}

        {/* Account-warming notice */}
        {isWarming && (
          <div className="mb-6 rounded-xl border border-border bg-bg-card/50 p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Account warming.</strong> <span className="text-muted">
                For the first 21 days your daily cap is {tenant.daily_cap} to keep Meta&apos;s spam ML happy.
                Auto-ramps after {new Date(tenant.account_warming_ends_at!).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}.
              </span>
            </div>
          </div>
        )}

        {/* Pause reason */}
        {isPaused && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 flex items-start gap-3">
            <Pause className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Paused until {new Date(tenant.paused_until!).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.</strong>
              <div className="text-muted mt-1">{tenant.paused_reason}</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Stat label="Sent · 24h" value={String(sentToday)} sub={`of ${tenant.daily_cap} cap`} />
          <Stat label="Clicked · 24h" value={String(clickedToday)} sub={`${ctrToday}% CTR`} highlight={clickedToday > 0} />
          <Stat label="Active rules" value={String(rules.filter((r) => r.is_active).length)} sub={`of ${rules.length} total`} />
          <Stat label="Plan" value={tenant.plan_tier} sub="upgrade →" />
        </div>

        {/* Subscription manager — cancel + status of active Razorpay sub */}
        <SubscriptionManager subscription={subscription} currentTier={tenant.plan_tier} />

        {/* Plan upgrade */}
        <PlanUpgrade currentTier={tenant.plan_tier} />

        {/* Follow-up agent toggle (Pro+) */}
        <div className="mb-6">
          <FollowupAgentToggle initiallyOn={tenant.ai_followup_agent} planTier={tenant.plan_tier} />
        </div>

        {/* Voice match — proves the bot speaks like the creator */}
        <VoiceMatchCard />

        {/* Rules (client-side editor) */}
        <RulesEditor initialRules={rules} hasNoRules={rules.length === 0} justConnected={justConnected} />

        {/* Activity */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent activity</h2>
          {logs.length === 0 ? (
            <div className="text-sm text-muted">No DMs sent yet. Comments matching your keywords will appear here.</div>
          ) : (
            <div className="space-y-1">
              {logs.map((l, i) => (
                <div key={i} className="text-sm flex items-center justify-between border-b border-border/50 py-2">
                  <div className="flex items-center gap-2">
                    <StatusDot status={l.status} />
                    <span>@{l.ig_username || 'anon'}</span>
                    {l.trigger_event === 'live_comment' && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400">
                        <span className="w-1 h-1 rounded-full bg-rose-400" /> live
                      </span>
                    )}
                    {l.status === 'skipped' && (
                      <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                        skipped
                      </span>
                    )}
                    {l.error && (
                      <span className="text-xs text-rose-400/80">· {humanizeSkipReason(l.error)}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted">{new Date(l.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border ${highlight ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg-card/50'} p-4`}>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="text-2xl font-extrabold mt-1 capitalize">{value}</div>
      <div className="text-[10px] text-muted mt-0.5">{sub}</div>
    </div>
  );
}

function humanizeSkipReason(reason: string): string {
  if (reason === 'daily_cap_per_recipient') return 'already DM\'d today (per-recipient cap)';
  if (reason.startsWith('hourly_cap')) return reason.replace('hourly_cap', 'account hourly cap reached');
  if (reason.startsWith('schedule:outside_hours')) return 'outside rule\'s active hours';
  if (reason.startsWith('schedule:wrong_day')) return 'rule not active on this weekday';
  if (reason === 'no_original_cta_url') return 'no CTA URL on rule — followup skipped';
  return reason;
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'sent' ? 'bg-emerald-500' : status === 'error' ? 'bg-rose-500' : 'bg-amber-500';
  return <span className={`w-1.5 h-1.5 rounded-full ${color}`} />;
}

/**
 * Weekly digest email cron.
 *
 * Fires once a week (recommended: Monday 9 AM IST = 03:30 UTC Monday).
 * For each active AutoDM tenant with the owner's email available,
 * aggregates last 7 days of dm_log → builds digest stats → sends one
 * Resend email per tenant.
 *
 * Skips:
 *   - tenants with 0 sends in the window (no point emailing "nothing happened")
 *   - paused tenants
 *   - owners we couldn't look up an email for
 *   - if RESEND_API_KEY is unset, we still RUN (compute + log) so you
 *     can verify aggregation. Sends become no-ops.
 *
 * Bearer ${CRON_SECRET}.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { buildDigestHtml, sendDigestEmail, type DigestStats } from '@stackpicks/core/autodm/digest-email';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const FROM_DEFAULT = 'StackPicks AutoDM <hello@stackpicks.dev>';

interface TenantRow {
  id: string;
  ig_username: string | null;
  owner_user_id: string;
  plan_tier: string;
  daily_cap: number;
  is_active: boolean;
  paused_until: string | null;
}
interface LogRow {
  rule_id: string | null;
  status: string;
  clicked_at: string | null;
  click_count: number;
  is_follower: boolean | null;
  created_at: string;
}
interface RuleRow { id: string; label: string | null; keyword: string }

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supa = adminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000);
  const today = new Date();

  // 1. Active tenants
  const { data: tenants } = await supa
    .from('autodm_tenants')
    .select('id, ig_username, owner_user_id, plan_tier, daily_cap, is_active, paused_until')
    .eq('is_active', true);
  const eligible = ((tenants ?? []) as TenantRow[]).filter((t) => {
    if (!t.paused_until) return true;
    return new Date(t.paused_until) < new Date();
  });

  const results: { tenant: string; status: string; reason?: string }[] = [];
  let sent = 0;

  for (const t of eligible) {
    // 2. Aggregate logs for this tenant
    const { data: logs } = await supa
      .from('autodm_dm_log')
      .select('rule_id, status, clicked_at, click_count, is_follower, created_at')
      .eq('tenant_id', t.id)
      .gt('created_at', sevenDaysAgo.toISOString())
      .limit(3000);

    const rows = (logs ?? []) as LogRow[];
    const sentRows = rows.filter((r) => r.status === 'sent');
    if (sentRows.length === 0) {
      results.push({ tenant: t.ig_username || t.id, status: 'skip', reason: 'no_sends_in_window' });
      continue;
    }

    // 3. Build daily array (7 days, oldest first)
    const dailySends = Array.from({ length: 7 }, () => 0);
    const dayKeys: string[] = [];
    for (let i = 6; i >= 0; i--) {
      dayKeys.push(new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10));
    }
    let totalClicks = 0, followerSent = 0, followerClicks = 0, nonFollowerSent = 0, nonFollowerClicks = 0;
    const perRule: Record<string, { sent: number; clicks: number }> = {};

    for (const r of sentRows) {
      const dk = r.created_at.slice(0, 10);
      const idx = dayKeys.indexOf(dk);
      if (idx >= 0) dailySends[idx]++;
      if (r.is_follower === true) { followerSent++; if (r.click_count > 0) followerClicks++; }
      else if (r.is_follower === false) { nonFollowerSent++; if (r.click_count > 0) nonFollowerClicks++; }
      if (r.click_count > 0) totalClicks += Math.max(1, r.click_count);
      if (r.rule_id) {
        const s = perRule[r.rule_id] ??= { sent: 0, clicks: 0 };
        s.sent++; if (r.click_count > 0) s.clicks++;
      }
    }

    const totalSent = sentRows.length;
    const ctrPct = totalSent ? Math.round((totalClicks / totalSent) * 100) : 0;
    const capHitDays = dailySends.filter((n) => n >= t.daily_cap).length;

    // 4. Best rule (≥3 sends, highest CTR; tie-break on volume)
    let bestRule: DigestStats['bestRule'] = null;
    const bestRuleId = Object.entries(perRule)
      .filter(([, v]) => v.sent >= 3)
      .sort((a, b) => {
        const ctrA = a[1].clicks / a[1].sent;
        const ctrB = b[1].clicks / b[1].sent;
        if (ctrB !== ctrA) return ctrB - ctrA;
        return b[1].sent - a[1].sent;
      })[0]?.[0];
    if (bestRuleId) {
      const { data: rule } = await supa
        .from('autodm_rules')
        .select('id, label, keyword')
        .eq('id', bestRuleId).single();
      if (rule) {
        const r = rule as RuleRow;
        const stats = perRule[bestRuleId];
        bestRule = {
          label: r.label || r.keyword,
          keyword: r.keyword,
          sent: stats.sent,
          ctr: Math.round((stats.clicks / stats.sent) * 100),
        };
      }
    }

    // 5. Look up owner email via auth.users
    const { data: userData } = await supa.auth.admin.getUserById(t.owner_user_id);
    const email = userData?.user?.email;
    if (!email) {
      results.push({ tenant: t.ig_username || t.id, status: 'skip', reason: 'no_email' });
      continue;
    }

    // 6. Build + send
    const stats: DigestStats = {
      tenantId: t.id,
      igUsername: t.ig_username || 'creator',
      planTier: t.plan_tier,
      dailyCap: t.daily_cap,
      weekStart: sevenDaysAgo.toISOString().slice(0, 10),
      weekEnd: today.toISOString().slice(0, 10),
      totalSent,
      totalClicks,
      ctrPct,
      dailySends,
      capHitDays,
      followerSent, followerClicks,
      nonFollowerSent, nonFollowerClicks,
      bestRule,
      // On autodm.stackpicks.dev the middleware rewrites bare paths
      // (/dashboard, /analytics) → /autodm/* internally. Email links
      // must use the BARE path or they 404.
      upgradeUrl: `${autodmOrigin()}/dashboard#plan`,
      analyticsUrl: `${autodmOrigin()}/analytics`,
      contactsUrl: `${autodmOrigin()}/contacts`,
    };
    const { subject, html, text } = buildDigestHtml(stats);

    const out = await sendDigestEmail({
      to: email,
      from: process.env.AUTODM_DIGEST_FROM || FROM_DEFAULT,
      subject, html, text,
    });

    if (out.ok) {
      sent++;
      results.push({ tenant: t.ig_username || t.id, status: 'sent' });
    } else {
      results.push({ tenant: t.ig_username || t.id, status: 'error', reason: out.error });
    }
  }

  return NextResponse.json({
    ok: true,
    eligible: eligible.length,
    sent,
    results: results.slice(0, 50),
  });
}

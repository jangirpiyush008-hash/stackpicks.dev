/**
 * Followup nudge cron — runs every 30 min.
 *
 * Finds dm_log rows that:
 *   - status='sent'
 *   - clicked_at IS NULL  (recipient never clicked the CTA)
 *   - followup_sent_at IS NULL
 *   - created_at < now() - 4 hours
 * For each, generate a soft "did you check the link?" nudge in the
 * creator's voice and send via sendDm. Update followup_sent_at on success.
 *
 * Auth: Bearer ${CRON_SECRET} (same as ig-publish + warming-tick).
 * Safety: caps at 50 nudges per run to avoid burst spending Anthropic
 * tokens or tripping Meta. Spread across tenants — at most 5 per tenant
 * per tick.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { decryptToken } from '@stackpicks/core/autodm/crypto';
import { sendDm, renderTemplate } from '@stackpicks/core/autodm/dm';
import { generateFollowupNudge } from '@stackpicks/core/autodm/followup-nudge';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_NUDGES_PER_RUN = 50;
const MAX_NUDGES_PER_TENANT = 5;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supa = adminClient();
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
  const aDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Find candidates — only consider rows from the last 24h to avoid
  // chasing very stale leads. Order so each tenant gets a fair share.
  const { data: candidates } = await supa
    .from('autodm_dm_log')
    .select('id, tenant_id, ig_user_id, ig_username, original_cta_url')
    .eq('status', 'sent')
    .is('clicked_at', null)
    .is('followup_sent_at', null)
    .lt('created_at', fourHoursAgo)
    .gt('created_at', aDayAgo)
    .order('tenant_id', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(MAX_NUDGES_PER_RUN * 3);

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, scanned: 0 });
  }

  // Round-robin across tenants, max MAX_NUDGES_PER_TENANT each
  const byTenant: Record<string, typeof candidates> = {};
  for (const r of candidates) {
    const key = r.tenant_id as string;
    (byTenant[key] ??= []).push(r);
  }
  const queue: typeof candidates = [];
  let any = true;
  while (any && queue.length < MAX_NUDGES_PER_RUN) {
    any = false;
    for (const tid of Object.keys(byTenant)) {
      const list = byTenant[tid];
      if (!list.length) continue;
      const tenantQuota = queue.filter((q) => q.tenant_id === tid).length;
      if (tenantQuota >= MAX_NUDGES_PER_TENANT) continue;
      queue.push(list.shift()!);
      any = true;
      if (queue.length >= MAX_NUDGES_PER_RUN) break;
    }
  }

  // Per-tenant decrypt + voice + nudge generation
  type TenantCtx = { token: string; igBusinessId: string; username: string; voiceSamples: string[] };
  const tenantCache = new Map<string, TenantCtx | null>();

  async function getTenantCtx(tenantId: string): Promise<TenantCtx | null> {
    if (tenantCache.has(tenantId)) return tenantCache.get(tenantId) ?? null;
    const { data: t } = await supa
      .from('autodm_tenants')
      .select('ig_business_id, ig_username, ig_user_token_encrypted, is_active, paused_until')
      .eq('id', tenantId).single();
    if (!t || !t.is_active) { tenantCache.set(tenantId, null); return null; }
    if (t.paused_until && new Date(t.paused_until as string) > new Date()) {
      tenantCache.set(tenantId, null); return null;
    }
    if (!t.ig_user_token_encrypted) { tenantCache.set(tenantId, null); return null; }
    let token: string;
    try { token = decryptToken(t.ig_user_token_encrypted as string); }
    catch { tenantCache.set(tenantId, null); return null; }

    const { data: rules } = await supa
      .from('autodm_rules')
      .select('dm_template')
      .eq('tenant_id', tenantId).limit(6);
    const voiceSamples = (rules ?? []).map((r) => (r as { dm_template: string }).dm_template);

    const ctx: TenantCtx = {
      token,
      igBusinessId: t.ig_business_id as string,
      username: (t.ig_username as string) || 'creator',
      voiceSamples,
    };
    tenantCache.set(tenantId, ctx);
    return ctx;
  }

  let sent = 0;
  const results: string[] = [];

  for (const r of queue) {
    const tenantId = r.tenant_id as string;
    const ctx = await getTenantCtx(tenantId);
    if (!ctx) {
      await supa.from('autodm_dm_log').update({
        followup_sent_at: new Date().toISOString(),
        followup_skipped_reason: 'tenant_unavailable',
      }).eq('id', r.id);
      continue;
    }

    // Skip if the original DM had no CTA URL — there's nothing to re-send
    if (!r.original_cta_url) {
      await supa.from('autodm_dm_log').update({
        followup_sent_at: new Date().toISOString(),
        followup_skipped_reason: 'no_original_cta_url',
      }).eq('id', r.id);
      results.push(`skip:${r.id}:no_cta`);
      continue;
    }

    // Generate the reminder text — short, friendly, one sentence in the
    // creator's voice. Critically: the link gets appended separately.
    let nudgeTpl: string;
    try {
      nudgeTpl = await generateFollowupNudge({
        tenantUsername: ctx.username,
        voiceSamples: ctx.voiceSamples,
        originalDmText: `Followup for the link sent earlier to @${r.ig_username || 'them'}.`,
      });
    } catch {
      nudgeTpl = `hey {{username}} — just bumping the link from earlier in case you missed it`;
    }
    const nudgeText = renderTemplate(nudgeTpl, { username: r.ig_username || undefined });

    // Generate a NEW short_id for the followup so we can attribute its
    // clicks separately. Same destination URL as the original.
    const followupShortId = Math.random().toString(36).slice(2, 12);
    const trackerUrl = `${autodmOrigin()}/c/${followupShortId}`;

    // Final body = nudge text + link on its own line. Apparent in IG chat
    // as a normal message preview with the URL as the second line.
    const body = `${nudgeText}\n\n${trackerUrl}`;

    // Send via standard messaging — conversation window from the original
    // DM is still open if the recipient hasn't replied. If outside the
    // window, Meta returns "outside allowed window" and we record skip.
    const out = await sendDm({
      igBusinessId: ctx.igBusinessId,
      tenantToken: ctx.token,
      recipientIgsid: r.ig_user_id as string,
      body,
    }).catch((e) => ({ ok: false, error: (e as Error).message }));

    if (out.ok) {
      sent++;
      const msgId = 'message_id' in out ? out.message_id : undefined;
      await supa.from('autodm_dm_log').update({
        followup_sent_at: new Date().toISOString(),
        followup_message_id: msgId,
        followup_short_id: followupShortId,
      }).eq('id', r.id);
      results.push(`sent:${r.id}`);
    } else {
      const reason = (('error' in out ? out.error : '') || '').slice(0, 120);
      await supa.from('autodm_dm_log').update({
        followup_sent_at: new Date().toISOString(),
        followup_skipped_reason: reason || 'send_failed',
      }).eq('id', r.id);
      results.push(`skip:${r.id}:${reason.slice(0, 30)}`);
    }
  }

  return NextResponse.json({
    ok: true,
    scanned: candidates.length,
    queued: queue.length,
    sent,
    results: results.slice(0, 20),
  });
}

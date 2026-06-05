/**
 * StackPicks AutoDM — multi-tenant Meta webhook receiver.
 *
 * Lifecycle:
 *   1. Meta sends event → we verify the signature
 *   2. Lookup tenant by entry.id (IG business ID)
 *   3. Skip if tenant is paused / inactive / over rate cap / self-comment
 *   4. Match a rule, follow-check the commenter
 *   5. Send DM via Private Reply, post public reply, log everything
 *
 * Completely separate from the StackPicks-bot webhook at /api/webhook/instagram.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';
import {
  matchRule, sendDm, renderTemplate, applyFollowNudge, replyToComment,
  checkIsFollower,
} from '@stackpicks/core/autodm/dm';
import { decryptToken } from '@stackpicks/core/autodm/crypto';
import type { AutoDmTenant, AutoDmRule } from '@stackpicks/core/autodm/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ────────────────────────────────────────────────────────────────────────
// GET — webhook verification handshake (Meta).
// We use a SHARED verify token across all tenants (Meta requires one per
// app). Tenant identity is resolved per event from entry.id.
// ────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  const expected = process.env.AUTODM_META_VERIFY_TOKEN;
  if (mode === 'subscribe' && expected && token === expected) {
    return new NextResponse(challenge ?? '', { status: 200 });
  }
  return new NextResponse('forbidden', { status: 403 });
}

// ────────────────────────────────────────────────────────────────────────
// POST — incoming Meta events
// ────────────────────────────────────────────────────────────────────────
type Entry = { id: string; time?: number; changes?: { field: string; value: WebhookValue }[] };
type WebhookValue = {
  id?: string;                              // comment id (Private Reply key)
  text?: string;
  from?: { id?: string; username?: string };
  media?: { id?: string };
};
type Payload = { object?: string; entry?: Entry[] };

function verifySignature(req: NextRequest, raw: string): boolean {
  const sig = req.headers.get('x-hub-signature-256');
  const secret = process.env.AUTODM_META_APP_SECRET;
  if (!sig || !secret) return false;
  const expected = 'sha256=' + createHmac('sha256', secret).update(raw).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sigOk = verifySignature(req, raw);
  const supa = adminClient();

  // 1. Log every inbound webhook to autodm_webhook_log (per-IG-account scoped)
  let payload: Payload = {};
  try { payload = JSON.parse(raw) as Payload; } catch { /* ignore */ }
  const firstEntryId = payload.entry?.[0]?.id;
  await supa.from('autodm_webhook_log').insert({
    ig_business_id: firstEntryId,
    signature_ok: sigOk,
    raw_body: payload,
    parsed_field: payload.entry?.[0]?.changes?.[0]?.field,
    parsed_value: payload.entry?.[0]?.changes?.[0]?.value as object | undefined,
  });

  if (!sigOk) return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 401 });

  const processed: string[] = [];

  // 2. Process each entry — lookup tenant per IG business ID
  for (const entry of payload.entry ?? []) {
    if (!entry.id) continue;

    const { data: tenantRow } = await supa
      .from('autodm_tenants')
      .select('*')
      .eq('ig_business_id', entry.id)
      .single();
    const tenant = tenantRow as AutoDmTenant | null;
    if (!tenant) { processed.push(`skip:no_tenant:${entry.id}`); continue; }
    if (!tenant.is_active) { processed.push(`skip:inactive:${tenant.id}`); continue; }
    if (tenant.paused_until && new Date(tenant.paused_until) > new Date()) {
      processed.push(`skip:paused:${tenant.id}`); continue;
    }
    if (!tenant.ig_user_token_encrypted) { processed.push(`skip:no_token:${tenant.id}`); continue; }

    let tenantToken: string;
    try { tenantToken = decryptToken(tenant.ig_user_token_encrypted); }
    catch { processed.push(`skip:decrypt:${tenant.id}`); continue; }

    // Load this tenant's active rules
    const { data: rulesRaw } = await supa
      .from('autodm_rules')
      .select('id, tenant_id, label, ig_post_id, keyword, dm_template, dm_template_variants, cta_url, cta_label, comment_reply, comment_reply_follower, follow_nudge, daily_cap_per_recipient, is_active, use_ai_generation, ai_personality_hint')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true);
    const rules = (rulesRaw ?? []) as AutoDmRule[];
    if (!rules.length) { processed.push(`skip:no_rules:${tenant.id}`); continue; }

    for (const change of entry.changes ?? []) {
      if (change.field !== 'comments') continue;
      const v = change.value || {};
      const commentText = v.text || '';
      const commentId = v.id || '';
      const postId = v.media?.id || '';
      const fromIgsid = v.from?.id || '';
      const fromUsername = v.from?.username;
      if (!commentText || !postId || !fromIgsid) continue;

      // Self-loop guard (the bug that almost destroyed the StackPicks bot)
      if (fromIgsid === tenant.ig_business_id ||
          (fromUsername && tenant.ig_username && fromUsername.toLowerCase() === tenant.ig_username.toLowerCase())) {
        processed.push(`skip:self:${tenant.id}`); continue;
      }

      // Account-hourly cap (tenant-scoped)
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count: hourly } = await supa
        .from('autodm_dm_log')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenant.id).eq('status', 'sent').gte('created_at', hourAgo);
      if ((hourly ?? 0) >= tenant.hourly_cap) {
        await supa.from('autodm_dm_log').insert({
          tenant_id: tenant.id, ig_user_id: fromIgsid, ig_username: fromUsername,
          trigger_event: 'comment', trigger_post_id: postId,
          trigger_text: commentText.slice(0, 500), trigger_comment_id: commentId,
          status: 'skipped', error: `hourly_cap (${tenant.hourly_cap}/hr)`,
        });
        processed.push(`skip:hourly_cap:${tenant.id}`); continue;
      }

      const rule = matchRule(rules, commentText, postId);
      if (!rule) continue;

      // Per-recipient daily cap
      if (rule.daily_cap_per_recipient) {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: dailyToUser } = await supa
          .from('autodm_dm_log')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id).eq('rule_id', rule.id).eq('ig_user_id', fromIgsid)
          .gte('created_at', dayAgo).eq('status', 'sent');
        if ((dailyToUser ?? 0) >= rule.daily_cap_per_recipient) {
          await supa.from('autodm_dm_log').insert({
            tenant_id: tenant.id, rule_id: rule.id, ig_user_id: fromIgsid, ig_username: fromUsername,
            trigger_event: 'comment', trigger_post_id: postId,
            trigger_text: commentText.slice(0, 500), trigger_comment_id: commentId,
            status: 'skipped', error: 'daily_cap_per_recipient',
          });
          processed.push(`skip:per_recipient:${rule.id}`); continue;
        }
      }

      // Humanizing delay (2-5s — instant-feeling but bot-detector safe)
      await new Promise((r) => setTimeout(r, 2000 + Math.floor(Math.random() * 3000)));

      // Follow check branches behavior
      const followerCheck = await checkIsFollower(fromIgsid, tenantToken);
      const isFollower = followerCheck.isFollower === true;

      // Pick body variant (if creator added multiple) — random for spam-shield
      const variants = rule.dm_template_variants && rule.dm_template_variants.length > 0
        ? rule.dm_template_variants
        : [rule.dm_template];
      const variantIdx = Math.floor(Math.random() * variants.length);
      const rawBody = renderTemplate(variants[variantIdx], {
        username: fromUsername, keyword: rule.keyword,
      });
      const ownHandle = tenant.ig_username ? `@${tenant.ig_username}` : '@yourcreator';
      const body = applyFollowNudge(rawBody, rule, isFollower, ownHandle);

      // Send DM
      let send;
      try {
        send = await sendDm({
          igBusinessId: tenant.ig_business_id, tenantToken,
          recipientIgsid: fromIgsid, commentId: commentId || undefined,
          body,
          ctaUrl: rule.cta_url ?? undefined, ctaLabel: rule.cta_label ?? undefined,
        });
      } catch (e) { send = { ok: false, error: (e as Error).message }; }

      // Public comment reply (follower-aware text)
      const replyTemplate = isFollower
        ? (rule.comment_reply_follower || rule.comment_reply)
        : rule.comment_reply;
      let replyStatus = 'skipped_no_template';
      let replyId: string | undefined;
      let replyError: string | undefined;
      if (!send.ok) { replyStatus = 'skipped_dm_failed'; }
      else if (replyTemplate && commentId) {
        const replyText = renderTemplate(replyTemplate, { username: fromUsername, keyword: rule.keyword });
        try {
          const r = await replyToComment({ tenantToken, commentId, message: replyText });
          if (r.ok) { replyStatus = 'sent'; replyId = r.id; }
          else { replyStatus = 'error'; replyError = r.error; }
        } catch (e) { replyStatus = 'error'; replyError = (e as Error).message; }
      } else if (!commentId) replyStatus = 'skipped_no_comment_id';

      // Detect Meta 429 / action-blocked → pause tenant 4h (the auto-protection feature)
      if (!send.ok && send.error && /action.*blocked|429|too.+many/i.test(send.error)) {
        await supa.from('autodm_tenants').update({
          paused_until: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          paused_reason: `Meta rate-limited: ${send.error.slice(0, 200)}`,
        }).eq('id', tenant.id);
      }

      await supa.from('autodm_dm_log').insert({
        tenant_id: tenant.id, rule_id: rule.id,
        ig_user_id: fromIgsid, ig_username: fromUsername,
        trigger_event: 'comment', trigger_post_id: postId,
        trigger_text: commentText.slice(0, 500), trigger_comment_id: commentId,
        is_follower: followerCheck.isFollower,
        follow_check_source: followerCheck.source,
        follow_check_error: followerCheck.rawError,
        status: send.ok ? 'sent' : 'error',
        ig_message_id: send.ok ? send.message_id : undefined,
        error: send.ok ? replyError : send.error,
        reply_status: replyStatus, reply_id: replyId,
        ai_generated: false, body_variant_index: variantIdx,
      });

      processed.push(send.ok ? `sent:${tenant.id}:${rule.id}` : `err:${tenant.id}:${rule.id}`);
    }
  }

  return NextResponse.json({ ok: true, processed: processed.length, results: processed });
}

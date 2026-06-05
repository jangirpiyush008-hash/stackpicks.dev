/**
 * Instagram webhook — receives comment + message events from Meta.
 *
 * Meta calls this endpoint in two flows:
 *
 * 1. **GET (verify)** — When you subscribe a webhook in the Meta App
 *    dashboard, Meta hits this endpoint with `hub.mode=subscribe`,
 *    `hub.challenge=<random>`, `hub.verify_token=<your secret>`. We must
 *    echo the challenge back as plain text if the token matches.
 *
 * 2. **POST (event)** — When a tracked event fires (comment, message,
 *    mention…), Meta POSTs the payload here. We verify the X-Hub-Signature-256
 *    header against META_APP_SECRET, then process the event.
 *
 * Env required (Railway):
 *   META_VERIFY_TOKEN   any random string — also paste into the Meta dashboard
 *   META_APP_SECRET     from Meta App Settings → Basic → App Secret
 *   META_LONG_TOKEN     reused from publisher (system-user, never-expiring)
 *   IG_BUSINESS_ID      reused from publisher
 *
 * Meta dashboard subscribe URL:
 *   https://stackpicks.dev/api/webhook/instagram
 *
 * Subscribe these event fields on the Instagram product:
 *   comments, messages, mentions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';
import {
  matchRule, sendDm, renderTemplate, applyFollowNudge, replyToComment,
  type DmRule,
} from '@stackpicks/core/instagram/dm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────────────────────────────────────
// GET — webhook verification handshake
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const expected = process.env.META_VERIFY_TOKEN;
  if (mode === 'subscribe' && expected && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }
  return new NextResponse('forbidden', { status: 403 });
}

// ─────────────────────────────────────────────────────────────────────────────
// POST — event handler
// ─────────────────────────────────────────────────────────────────────────────

function verifySignature(rawBody: string, sigHeader: string | null): boolean {
  if (!sigHeader || !sigHeader.startsWith('sha256=')) return false;
  // IG Login API webhooks are signed with the Instagram app secret
  // (Stackpicks.dev-IG, app id 1543430567490468), not the Meta App secret.
  // Try IG_APP_SECRET first, fall back to META_APP_SECRET for FB Graph webhooks.
  const secrets = [process.env.IG_APP_SECRET, process.env.META_APP_SECRET].filter(Boolean) as string[];
  if (!secrets.length) return false;
  const provided = sigHeader.slice('sha256='.length);
  const b = Buffer.from(provided, 'hex');
  for (const secret of secrets) {
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected, 'hex');
    if (a.length === b.length) {
      try { if (timingSafeEqual(a, b)) return true; } catch { /* try next */ }
    }
  }
  return false;
}

interface MetaWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    time?: number;
    changes?: Array<{
      field?: string; // 'comments' | 'mentions' | 'messages'
      value?: {
        from?: { id?: string; username?: string };
        media?: { id?: string };
        text?: string;
        id?: string; // comment id
      };
    }>;
    messaging?: Array<{
      sender?: { id?: string };
      message?: { text?: string };
    }>;
  }>;
}

export async function POST(req: NextRequest) {
  // 1. Read raw body so we can verify the signature
  const raw = await req.text();
  const sigOk = verifySignature(raw, req.headers.get('x-hub-signature-256'));

  // Log EVERY hit so we can debug what Meta is/isn't sending
  const supa = adminClient();
  await supa.from('ig_webhook_log').insert({
    method: 'POST',
    signature_ok: sigOk,
    raw_body: raw.slice(0, 4000),
    note: sigOk ? null : 'signature failed',
  }).then(() => undefined);

  if (!sigOk) {
    return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 401 });
  }

  let payload: MetaWebhookPayload;
  try { payload = JSON.parse(raw) as MetaWebhookPayload; }
  catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }); }

  // 2. Load active rules once
  const { data: rulesRaw } = await supa
    .from('ig_dm_rules')
    .select('id, ig_post_id, keyword, dm_template, cta_url, cta_label, is_active, daily_cap, label, follow_nudge, comment_reply')
    .eq('is_active', true);
  const rules = (rulesRaw ?? []) as DmRule[];

  const processed: string[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      // Only comment-trigger DMs for v1. Messages + mentions: future.
      if (change.field !== 'comments') continue;

      const v = change.value || {};
      const commentText = v.text || '';
      const commentId = v.id || '';            // IG comment ID — unlocks Private Reply path
      const postId = v.media?.id || '';
      const fromIgsid = v.from?.id || '';
      const fromUsername = v.from?.username;

      if (!commentText || !postId || !fromIgsid) continue;

      const rule = matchRule(rules, commentText, postId);
      if (!rule) continue;

      // Daily-cap check: count today's sends for this rule + recipient.
      if (rule.daily_cap !== null && rule.daily_cap !== undefined) {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supa
          .from('ig_dm_log')
          .select('id', { count: 'exact', head: true })
          .eq('rule_id', rule.id)
          .eq('ig_user_id', fromIgsid)
          .gte('created_at', since)
          .eq('status', 'sent');
        if ((count ?? 0) >= rule.daily_cap) {
          await supa.from('ig_dm_log').insert({
            rule_id: rule.id,
            ig_user_id: fromIgsid,
            ig_username: fromUsername,
            trigger_event: 'comment',
            trigger_post_id: postId,
            trigger_text: commentText.slice(0, 500),
            status: 'skipped',
            error: 'daily_cap reached',
          });
          processed.push(`skip:${rule.id}`);
          continue;
        }
      }

      // Send
      const rawBody = renderTemplate(rule.dm_template, { username: fromUsername, keyword: rule.keyword });
      const body = applyFollowNudge(rawBody, rule);
      let send;
      try {
        send = await sendDm({
          recipientIgsid: fromIgsid,
          commentId: commentId || undefined,  // Private Reply path — 7-day window, works for non-followers
          body,
          ctaUrl: rule.cta_url ?? undefined,
          ctaLabel: rule.cta_label ?? undefined,
        });
      } catch (e) {
        send = { ok: false, error: (e as Error).message };
      }

      // Public comment reply — fires AFTER DM succeeds. Tells the commenter
      // "here's your link" publicly and signals to other viewers to do the same.
      // Best-effort: a reply failure doesn't undo the DM. We log the outcome
      // verbatim so we can diagnose IG permission / API issues.
      let replyStatus: string;        // 'sent' | 'skipped_no_template' | 'skipped_no_comment_id' | 'error'
      let replyId: string | undefined;
      let replyError: string | undefined;
      if (!send.ok) {
        replyStatus = 'skipped_dm_failed';
      } else if (!rule.comment_reply) {
        replyStatus = 'skipped_no_template';
      } else if (!commentId) {
        replyStatus = 'skipped_no_comment_id';
      } else {
        const replyText = renderTemplate(rule.comment_reply, {
          username: fromUsername,
          keyword: rule.keyword,
        });
        try {
          const r = await replyToComment({ commentId, message: replyText });
          if (r.ok) {
            replyStatus = 'sent';
            replyId = r.id;
          } else {
            replyStatus = 'error';
            replyError = r.error;
          }
        } catch (e) {
          replyStatus = 'error';
          replyError = (e as Error).message;
        }
      }

      await supa.from('ig_dm_log').insert({
        rule_id: rule.id,
        ig_user_id: fromIgsid,
        ig_username: fromUsername,
        trigger_event: 'comment',
        trigger_post_id: postId,
        trigger_text: commentText.slice(0, 500),
        status: send.ok ? 'sent' : 'error',
        ig_message_id: send.ok ? send.message_id : undefined,
        error: send.ok ? replyError : send.error,
        reply_status: replyStatus,
        reply_id: replyId,
      });

      processed.push(send.ok ? `sent:${rule.id}+reply:${replyStatus}` : `err:${rule.id}`);
    }
  }

  return NextResponse.json({ ok: true, processed: processed.length, results: processed });
}

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
  checkIsFollower, type DmRule,
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
    .select('id, ig_post_id, keyword, dm_template, cta_url, cta_label, is_active, daily_cap, label, follow_nudge, comment_reply, comment_reply_follower')
    .eq('is_active', true);
  const rules = (rulesRaw ?? []) as DmRule[];

  const processed: string[] = [];

  // Health-beat: this legacy handler is also the URL Meta still pings for
  // many tenants (the autodm webhook handler at /api/autodm/webhook is the
  // newer multi-tenant one but Meta only delivers to ONE URL per app).
  // Bump last_webhook_received_at on any matching tenant so the dashboard
  // banner clears even if events come through the legacy route. Fire and
  // forget — DM dispatch must not wait on telemetry.
  for (const entry of payload.entry ?? []) {
    if (entry.id) {
      void supa.from('autodm_tenants').update({
        last_webhook_received_at: new Date().toISOString(),
        last_webhook_event: entry.changes?.[0]?.field || 'unknown',
        last_webhook_alert_sent_at: null,
      }).eq('ig_business_id', entry.id);
    }
  }

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

      // CRITICAL self-loop guard: if the comment came from our OWN business
      // account, ignore it. Otherwise our public reply ("Hey @x here's the
      // link...") gets re-detected as a new comment with the keyword "link",
      // triggering another reply, ad infinitum. This was actually happening
      // — `stackpicks.dev` showed up as a commenter in ig_dm_log because the
      // webhook fired on our own /replies output.
      const ownBusinessId = process.env.IG_BUSINESS_ID;
      const ownHandle = (process.env.IG_OWN_HANDLE || 'stackpicks.dev').toLowerCase();
      if (
        (ownBusinessId && fromIgsid === ownBusinessId) ||
        (fromUsername && fromUsername.toLowerCase() === ownHandle)
      ) {
        processed.push('skip:self_comment');
        continue;
      }

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
            trigger_text: commentText.slice(0, 80),
            status: 'skipped',
            error: 'daily_cap reached',
          });
          processed.push(`skip:${rule.id}`);
          continue;
        }
      }

      // Account-level rate cap — Meta's spam ML penalises high-volume bursts
      // on new accounts. Default: 60 outbound DMs/hour. Counted across all
      // rules, not per-rule (the account is the throttle target). Once hit,
      // we skip cleanly and log — creator can upgrade to raise the cap later.
      const ACCOUNT_HOURLY_CAP = Number(process.env.IG_ACCOUNT_HOURLY_CAP ?? 60);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count: hourlyCount } = await supa
        .from('ig_dm_log')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'sent')
        .gte('created_at', hourAgo);
      if ((hourlyCount ?? 0) >= ACCOUNT_HOURLY_CAP) {
        await supa.from('ig_dm_log').insert({
          rule_id: rule.id, ig_user_id: fromIgsid, ig_username: fromUsername,
          trigger_event: 'comment', trigger_post_id: postId,
          trigger_text: commentText.slice(0, 80),
          status: 'skipped', error: `account_hourly_cap (${ACCOUNT_HOURLY_CAP}/hr)`,
        });
        processed.push(`skip:rate_limited`);
        continue;
      }

      // Humanizing delay — 2-5 seconds randomized. Feels live to the
      // commenter, looks human to Meta's bot-detection ML. Sub-second
      // replies pattern-match as automated. Per Piyush: don't sacrifice
      // perceived speed, just avoid the dead-giveaway < 3s window.
      const delayMs = 2000 + Math.floor(Math.random() * 3000);  // 2000-5000
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      // Follow check — branches behavior:
      //   follower     → DM body without PS nudge + concise "Link sent ✓" public reply
      //   non-follower → DM body WITH PS follow nudge + friendly "here's the link" public reply
      // Trust-first default: when the IG API can't tell us (returns null),
      // treat as a follower so we never append "PS — follow @us" to someone
      // who actually follows. Nudging a real follower reads as an obvious
      // bot tell. (graph.instagram.com tokens don't expose
      // is_user_follow_business at all — null is the common case.)
      const followerCheck = await checkIsFollower(fromIgsid);
      const isFollower = followerCheck.isFollower !== false;

      // Send DM
      const rawBody = renderTemplate(rule.dm_template, { username: fromUsername, keyword: rule.keyword });
      const body = applyFollowNudge(rawBody, rule, isFollower);
      const cardHandle = ownHandle.replace(/^@/, '');
      let send;
      try {
        send = await sendDm({
          recipientIgsid: fromIgsid,
          commentId: commentId || undefined,  // Private Reply path — 7-day window, works for non-followers
          body,
          ctaUrl: rule.cta_url ?? undefined,
          ctaLabel: rule.cta_label ?? undefined,
          // Card title — first line of the DM (trimmed). Stops IG from
          // rendering the same string twice when title == button label.
          ctaTitle: rawBody.split('\n')[0]?.replace(/^\s*[—-]+\s*/, '').slice(0, 80),
          // Subtitle hides the URL hostname and brands the card.
          ctaSubtitle: `by @${cardHandle}`,
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
      // Pick the right public reply template based on follow status.
      // Followers get the concise "Link sent ✓" confirmation; non-followers
      // get the friendly "here's the link" opener that signals other viewers
      // to comment too. Falls back to comment_reply if follower variant unset.
      const replyTemplate = isFollower
        ? (rule.comment_reply_follower || rule.comment_reply)
        : rule.comment_reply;

      if (!send.ok) {
        replyStatus = 'skipped_dm_failed';
      } else if (!replyTemplate) {
        replyStatus = 'skipped_no_template';
      } else if (!commentId) {
        replyStatus = 'skipped_no_comment_id';
      } else {
        const replyText = renderTemplate(replyTemplate, {
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
        trigger_text: commentText.slice(0, 80),
        status: send.ok ? 'sent' : 'error',
        ig_message_id: send.ok ? send.message_id : undefined,
        error: send.ok ? replyError : send.error,
        reply_status: replyStatus,
        reply_id: replyId,
        is_follower: followerCheck.isFollower,
        follow_check_source: followerCheck.source,
        follow_check_error: followerCheck.rawError,
      });

      processed.push(send.ok ? `sent:${rule.id}+reply:${replyStatus}+follower:${isFollower}(${followerCheck.source})` : `err:${rule.id}`);
    }
  }

  return NextResponse.json({ ok: true, processed: processed.length, results: processed });
}

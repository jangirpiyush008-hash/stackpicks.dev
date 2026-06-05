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
import { matchRule, sendDm, renderTemplate, type DmRule } from '@stackpicks/core/instagram/dm';

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
  const secret = process.env.META_APP_SECRET;
  if (!secret) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = sigHeader.slice('sha256='.length);
  // timingSafeEqual requires equal-length buffers
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(provided, 'hex');
  if (a.length !== b.length) return false;
  try { return timingSafeEqual(a, b); } catch { return false; }
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
  if (!verifySignature(raw, req.headers.get('x-hub-signature-256'))) {
    return NextResponse.json({ ok: false, error: 'bad signature' }, { status: 401 });
  }

  let payload: MetaWebhookPayload;
  try { payload = JSON.parse(raw) as MetaWebhookPayload; }
  catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }); }

  const supa = adminClient();

  // 2. Load active rules once
  const { data: rulesRaw } = await supa
    .from('ig_dm_rules')
    .select('id, ig_post_id, keyword, dm_template, cta_url, cta_label, is_active, daily_cap, label')
    .eq('is_active', true);
  const rules = (rulesRaw ?? []) as DmRule[];

  const processed: string[] = [];

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      // Only comment-trigger DMs for v1. Messages + mentions: future.
      if (change.field !== 'comments') continue;

      const v = change.value || {};
      const commentText = v.text || '';
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
      const body = renderTemplate(rule.dm_template, { username: fromUsername, keyword: rule.keyword });
      let send;
      try {
        send = await sendDm({
          recipientIgsid: fromIgsid,
          body,
          ctaUrl: rule.cta_url ?? undefined,
          ctaLabel: rule.cta_label ?? undefined,
        });
      } catch (e) {
        send = { ok: false, error: (e as Error).message };
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
        error: send.ok ? undefined : send.error,
      });

      processed.push(send.ok ? `sent:${rule.id}` : `err:${rule.id}`);
    }
  }

  return NextResponse.json({ ok: true, processed: processed.length, results: processed });
}

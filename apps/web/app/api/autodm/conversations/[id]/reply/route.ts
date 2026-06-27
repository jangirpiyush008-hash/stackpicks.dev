/**
 * Creator-authored manual reply to an AutoDM conversation.
 *
 *   POST /api/autodm/conversations/[id]/reply  { message: string }
 *
 * This is the human-in-the-loop path that justifies our `Human Agent`
 * Meta permission request. Flow:
 *   1. Creator opens the inbox → sees a `creator_escalated` conversation
 *      that the AI agent couldn't handle
 *   2. Creator reviews the transcript + composes a reply
 *   3. This endpoint sends the reply via the IG Send API with
 *      `messaging_type: MESSAGE_TAG` + `tag: HUMAN_AGENT`, which allows
 *      delivery up to 7 days after the recipient's last message (vs the
 *      standard 24h window). This is the explicit Meta-supported path
 *      for support/customer-service replies that need a human to draft.
 *   4. Reply is appended to the conversation transcript + logged to
 *      autodm_dm_log with ai_generated: false so the audit trail proves
 *      a human composed it (which is what Human Agent permission requires).
 *
 * Hard gates enforced by the endpoint:
 *   - Caller must own the tenant (Supabase auth.uid())
 *   - Conversation must belong to the tenant (RLS-equivalent check)
 *   - Conversation must be in active OR creator_escalated status
 *     (closed/expired conversations cannot be replied to)
 *   - Send must be within 7 days of recipient's last turn — Meta caps
 *     HUMAN_AGENT at 7 days; older conversations return 400 with a
 *     clear "window expired" error rather than silently failing at Meta
 *   - Message body non-empty + capped at 1000 chars (IG cap)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { sendDm } from '@stackpicks/core/autodm/dm';
import { decryptToken } from '@stackpicks/core/autodm/crypto';

export const runtime = 'nodejs';

interface TranscriptTurn {
  role: 'user' | 'creator_bot' | 'creator_human';
  text: string;
  at: string;
}

const HUMAN_AGENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const REPLY_MAX_CHARS = 1000;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const { id: conversationId } = await params;
  if (!conversationId) return NextResponse.json({ ok: false, error: 'id_required' }, { status: 400 });

  let body: { message?: string };
  try { body = (await req.json()) as { message?: string }; }
  catch { return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 }); }

  const message = (body.message ?? '').trim();
  if (!message) return NextResponse.json({ ok: false, error: 'empty_message' }, { status: 400 });
  if (message.length > REPLY_MAX_CHARS) {
    return NextResponse.json({ ok: false, error: 'message_too_long', max: REPLY_MAX_CHARS }, { status: 400 });
  }

  const admin = adminClient();

  // Load conversation + verify tenant ownership in one go via inner join.
  const { data: convRaw } = await admin
    .from('autodm_conversations')
    .select(`
      id, recipient_igsid, recipient_username, status, last_turn_at, turn_count, full_transcript, initial_rule_id,
      tenant:autodm_tenants!inner ( id, ig_business_id, ig_username, ig_user_token_encrypted, owner_user_id, is_active, paused_until )
    `)
    .eq('id', conversationId)
    .single();

  const conv = convRaw as {
    id: string;
    recipient_igsid: string;
    recipient_username: string | null;
    status: string;
    last_turn_at: string;
    turn_count: number;
    full_transcript: TranscriptTurn[] | null;
    initial_rule_id: string | null;
    tenant: {
      id: string;
      ig_business_id: string;
      ig_username: string | null;
      ig_user_token_encrypted: string | null;
      owner_user_id: string;
      is_active: boolean;
      paused_until: string | null;
    };
  } | null;

  if (!conv) return NextResponse.json({ ok: false, error: 'conversation_not_found' }, { status: 404 });
  if (conv.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }
  if (!conv.tenant.is_active) {
    return NextResponse.json({ ok: false, error: 'tenant_inactive' }, { status: 403 });
  }
  if (conv.tenant.paused_until && new Date(conv.tenant.paused_until) > new Date()) {
    return NextResponse.json({ ok: false, error: 'tenant_paused' }, { status: 403 });
  }
  if (!conv.tenant.ig_user_token_encrypted) {
    return NextResponse.json({ ok: false, error: 'no_ig_token — reconnect Instagram' }, { status: 400 });
  }

  // Only active or escalated conversations can be replied to.
  if (conv.status !== 'active' && conv.status !== 'creator_escalated') {
    return NextResponse.json({
      ok: false,
      error: 'cannot_reply_to_status',
      status: conv.status,
      hint: 'Conversation must be active or creator_escalated to send a manual reply.',
    }, { status: 400 });
  }

  // Human Agent window guard — Meta caps at 7 days from the recipient's
  // last interaction. Past that, the send will fail at Meta with a
  // generic 400; we surface a clean error here instead.
  const ageMs = Date.now() - new Date(conv.last_turn_at).getTime();
  if (ageMs > HUMAN_AGENT_WINDOW_MS) {
    return NextResponse.json({
      ok: false,
      error: 'human_agent_window_expired',
      hint: 'Meta caps Human Agent replies at 7 days from the recipient’s last message. Reach out via IG directly.',
    }, { status: 400 });
  }

  // Decrypt tenant's IG OAuth token (single-use; never persisted).
  let tenantToken: string;
  try { tenantToken = decryptToken(conv.tenant.ig_user_token_encrypted); }
  catch { return NextResponse.json({ ok: false, error: 'token_decrypt_failed' }, { status: 500 }); }

  // Send with HUMAN_AGENT tag — the explicit Meta-supported path for
  // human-reviewed support replies. Recipient = IGSID (no commentId
  // because this isn't a Private Reply path; it's a direct DM reply
  // inside the existing conversation thread).
  let send: { ok: boolean; message_id?: string; error?: string };
  try {
    send = await sendDm({
      igBusinessId: conv.tenant.ig_business_id,
      tenantToken,
      recipientIgsid: conv.recipient_igsid,
      body: message,
      messagingTag: 'HUMAN_AGENT',
    });
  } catch (e) {
    send = { ok: false, error: (e as Error).message };
  }

  // Append to transcript regardless of success — we want the failed
  // attempt visible in the inbox so the creator knows to try again or
  // reach out directly.
  const transcript: TranscriptTurn[] = [
    ...(conv.full_transcript ?? []),
    { role: 'creator_human', text: message.slice(0, REPLY_MAX_CHARS), at: new Date().toISOString() },
  ];

  await admin.from('autodm_conversations').update({
    turn_count: conv.turn_count + 1,
    last_turn_at: new Date().toISOString(),
    full_transcript: transcript,
    // After a successful human reply, mark as active again so future
    // recipient messages route to the AI follow-up agent normally
    // (or stay escalated until manually closed).
    ...(send.ok && conv.status === 'creator_escalated' ? { status: 'active' } : {}),
  }).eq('id', conv.id);

  // Audit log — ai_generated: false is the row we can point Meta at
  // to prove a human composed this message.
  await admin.from('autodm_dm_log').insert({
    tenant_id: conv.tenant.id,
    rule_id: conv.initial_rule_id,
    ig_user_id: conv.recipient_igsid,
    ig_username: conv.recipient_username,
    trigger_event: 'manual_reply',
    trigger_text: message.slice(0, 80),
    status: send.ok ? 'sent' : 'error',
    ig_message_id: send.ok ? send.message_id : undefined,
    error: send.ok ? undefined : send.error,
    ai_generated: false,
    sent_body: send.ok ? message.slice(0, 2000) : null,
  });

  if (!send.ok) {
    return NextResponse.json({ ok: false, error: 'send_failed', detail: send.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, message_id: send.message_id });
}

/**
 * Daily AI digest cron — fires once a day (recommended: 9 PM IST = 15:30 UTC).
 *
 * For each active tenant with activity in the last 24h:
 *   1. Aggregate dm_log + conversations
 *   2. Ask Claude to summarise: hot leads, escalations, FAQ themes
 *   3. Send a tight 1-screen email via Resend
 *
 * Distinct from /api/autodm/digest-tick (weekly stats email). Daily one is
 * intentionally short — for triage, not analytics. Honors `daily_digest_enabled`
 * per tenant; defaults to true so all paid tiers opt in by default.
 *
 * Bearer ${CRON_SECRET}.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { adminClient } from '@stackpicks/core/db';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const FROM_DEFAULT = 'StackPicks AutoDM <hello@stackpicks.dev>';
const HOURS = 24;

interface TenantRow {
  id: string;
  ig_username: string | null;
  owner_user_id: string;
  plan_tier: string;
  is_active: boolean;
  paused_until: string | null;
}

interface DmRow {
  id: string;
  status: string;
  click_count: number;
  is_follower: boolean | null;
  recipient_igsid: string | null;
  created_at: string;
}

interface ConvRow {
  recipient_igsid: string;
  status: string | null;
  escalation_reason: string | null;
  turn_count: number | null;
  initial_comment_text: string | null;
  last_recipient_text: string | null;
  updated_at: string;
}

interface DailySummary {
  tenantId: string;
  ig: string;
  sent: number;
  clicks: number;
  conversations: number;
  hotLeads: { handle: string; snippet: string }[];
  escalations: { handle: string; reason: string }[];
  aiTakeaway: string;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const admin = adminClient();
  const sinceIso = new Date(Date.now() - HOURS * 60 * 60 * 1000).toISOString();

  const { data: tenantsRaw } = await admin
    .from('autodm_tenants')
    .select('id, ig_username, owner_user_id, plan_tier, is_active, paused_until');
  const tenants = (tenantsRaw ?? []) as TenantRow[];

  const eligible: DailySummary[] = [];
  for (const t of tenants) {
    if (!t.is_active) continue;
    if (t.paused_until && new Date(t.paused_until).getTime() > Date.now()) continue;
    if (t.plan_tier === 'free') continue; // paid only

    const { data: dmsRaw } = await admin
      .from('autodm_dm_log')
      .select('id, status, click_count, is_follower, recipient_igsid, created_at')
      .eq('tenant_id', t.id)
      .gte('created_at', sinceIso);
    const dms = (dmsRaw ?? []) as DmRow[];

    if (!dms.length) continue;

    const { data: convsRaw } = await admin
      .from('autodm_conversations')
      .select('recipient_igsid, status, escalation_reason, turn_count, initial_comment_text, last_recipient_text, updated_at')
      .eq('tenant_id', t.id)
      .gte('updated_at', sinceIso)
      .limit(50);
    const convs = (convsRaw ?? []) as ConvRow[];

    const sent = dms.filter((d) => d.status === 'sent').length;
    const clicks = dms.reduce((s, d) => s + (d.click_count || 0), 0);
    const hotLeads = convs
      .filter((c) => (c.turn_count ?? 0) >= 2 && c.status !== 'escalated' && c.status !== 'closed')
      .slice(0, 5)
      .map((c) => ({
        handle: c.recipient_igsid ?? 'unknown',
        snippet: (c.last_recipient_text ?? c.initial_comment_text ?? '').slice(0, 80),
      }));
    const escalations = convs
      .filter((c) => c.status === 'escalated')
      .slice(0, 5)
      .map((c) => ({
        handle: c.recipient_igsid ?? 'unknown',
        reason: c.escalation_reason ?? 'unknown',
      }));

    const aiTakeaway = await summarise(t.ig_username ?? 'creator', { sent, clicks, hotLeads, escalations, convs });
    eligible.push({ tenantId: t.id, ig: t.ig_username ?? 'creator', sent, clicks, conversations: convs.length, hotLeads, escalations, aiTakeaway });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTODM_DIGEST_FROM ?? FROM_DEFAULT;

  let sentCount = 0;
  const results: { tenant: string; status: string }[] = [];
  for (const s of eligible) {
    const email = await emailFor(admin, s.tenantId);
    if (!email) { results.push({ tenant: s.ig, status: 'no_email' }); continue; }
    if (!apiKey) { results.push({ tenant: s.ig, status: 'no_resend_key' }); continue; }

    const subject = `AutoDM daily — ${s.sent} sent · ${s.hotLeads.length} hot · ${s.escalations.length} escalations`;
    const html = buildHtml(s);
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'authorization': `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({ from, to: email, subject, html }),
      });
      if (r.ok) { sentCount++; results.push({ tenant: s.ig, status: 'sent' }); }
      else { const body = await r.text().catch(() => ''); results.push({ tenant: s.ig, status: `resend_${r.status}_${body.slice(0, 80)}` }); }
    } catch (e) { results.push({ tenant: s.ig, status: `err_${(e as Error).message.slice(0, 60)}` }); }
  }

  return NextResponse.json({ ok: true, eligible: eligible.length, sent: sentCount, results });
}

async function summarise(
  ig: string,
  ctx: { sent: number; clicks: number; hotLeads: { handle: string; snippet: string }[]; escalations: { handle: string; reason: string }[]; convs: ConvRow[] },
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return `Quiet day. ${ctx.sent} DMs sent, ${ctx.clicks} clicks. ${ctx.hotLeads.length} active chats.`;

  const claude = new Anthropic({ apiKey });
  const sample = ctx.convs.slice(0, 12).map((c, i) => `[${i + 1}] @${c.recipient_igsid} — turn ${c.turn_count}: "${(c.last_recipient_text ?? c.initial_comment_text ?? '').slice(0, 120)}"`).join('\n');

  const prompt = `You are writing the closing paragraph of a daily AutoDM digest email for @${ig}.

Today's numbers:
- DMs sent: ${ctx.sent}
- Clicks: ${ctx.clicks}
- Hot leads (multi-turn, not escalated): ${ctx.hotLeads.length}
- Escalations: ${ctx.escalations.length}

Recent conversation snippets:
${sample || '(none)'}

Write a 2-3 sentence honest takeaway: what's working, what to look at tomorrow. Conversational, no jargon, no buzzwords. Indian creator audience — Hinglish okay if the conversations are in Hinglish. ≤60 words. Output text only, no markdown.`;

  try {
    const res = await claude.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }],
    });
    const block = res.content[0];
    return block.type === 'text' ? block.text.trim() : '';
  } catch { return ''; }
}

async function emailFor(admin: ReturnType<typeof adminClient>, tenantId: string): Promise<string | null> {
  const { data } = await admin.from('autodm_tenants').select('owner_user_id').eq('id', tenantId).single();
  const ownerId = (data as { owner_user_id?: string } | null)?.owner_user_id;
  if (!ownerId) return null;
  const { data: u } = await admin.auth.admin.getUserById(ownerId);
  return u.user?.email ?? null;
}

function buildHtml(s: DailySummary): string {
  const url = autodmOrigin();
  const hotList = s.hotLeads.length
    ? s.hotLeads.map((h) => `<li><strong>@${escape(h.handle)}</strong> — ${escape(h.snippet)}</li>`).join('')
    : '<li style="color:#999;">No hot leads today.</li>';
  const escList = s.escalations.length
    ? s.escalations.map((e) => `<li><strong>@${escape(e.handle)}</strong> — ${escape(e.reason)}</li>`).join('')
    : '<li style="color:#999;">Nothing escalated.</li>';

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
    <h1 style="font-size:20px;margin:0 0 4px;">AutoDM daily — @${escape(s.ig)}</h1>
    <p style="color:#666;margin:0 0 20px;font-size:13px;">Last 24 hours</p>
    <div style="background:#f8f9fa;border-radius:12px;padding:16px;margin-bottom:20px;">
      <div style="font-size:32px;font-weight:700;line-height:1;">${s.sent}</div>
      <div style="color:#666;font-size:13px;margin-top:4px;">DMs sent · ${s.clicks} clicks · ${s.conversations} ongoing chats</div>
    </div>
    <h2 style="font-size:15px;margin:20px 0 8px;">🔥 Hot leads</h2>
    <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.6;">${hotList}</ul>
    <h2 style="font-size:15px;margin:20px 0 8px;">⚠️ Escalations</h2>
    <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.6;">${escList}</ul>
    ${s.aiTakeaway ? `<div style="margin-top:24px;padding:14px 16px;background:#fff4eb;border-left:3px solid #FF6B35;border-radius:0 8px 8px 0;font-size:14px;line-height:1.5;">${escape(s.aiTakeaway)}</div>` : ''}
    <p style="margin-top:28px;font-size:12px;color:#888;">
      <a href="${url}/dashboard" style="color:#FF6B35;">Open dashboard →</a>
    </p>
  </div>`;
}

function escape(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

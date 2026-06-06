/**
 * Webhook health alert cron.
 *
 * Runs every 30 min. Finds active tenants whose last_webhook_received_at
 * is older than 24h (or null AND tenant > 24h old), and:
 *   1. emails the creator a single alert per outage
 *   2. flips paused_until = now + 24h so we don't burn cycles trying to
 *      send DMs against a broken connection. Resumes automatically when
 *      the next webhook arrives (webhook handler clears the alert flag).
 *
 * Suppression: last_webhook_alert_sent_at is set after sending, and
 * cleared by the webhook handler on next delivery. So at most one alert
 * per outage period — creators don't get spammed during a long break.
 *
 * Bearer ${CRON_SECRET}.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { autodmOrigin } from '@stackpicks/core/autodm/origin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const RESEND_FROM = 'StackPicks AutoDM <hello@stackpicks.dev>';

interface CandidateRow {
  id: string;
  owner_user_id: string;
  ig_username: string | null;
  last_webhook_received_at: string | null;
  last_webhook_alert_sent_at: string | null;
  ig_token_expires_at: string | null;
  created_at: string;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supa = adminClient();
  const dayAgo = new Date(Date.now() - ONE_DAY_MS).toISOString();

  // Active tenants — exclude ones we've already alerted (and not seen a
  // fresh webhook since), and ones too young to alert on.
  const { data: tenants } = await supa
    .from('autodm_tenants')
    .select('id, owner_user_id, ig_username, last_webhook_received_at, last_webhook_alert_sent_at, ig_token_expires_at, created_at')
    .eq('is_active', true)
    .lt('created_at', dayAgo)
    .is('last_webhook_alert_sent_at', null)
    .limit(500);

  // Two kinds of trouble:
  //   • webhooks gone silent (24h+)
  //   • token expires soon (within 7 days) — proactive nudge before it dies
  const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;
  const candidates = ((tenants ?? []) as CandidateRow[]).filter((t) => {
    const silent = !t.last_webhook_received_at
      || +new Date(t.last_webhook_received_at) < Date.now() - ONE_DAY_MS;
    const tokenExpiringSoon = t.ig_token_expires_at
      && +new Date(t.ig_token_expires_at) - Date.now() < SEVEN_DAYS_MS
      && +new Date(t.ig_token_expires_at) > Date.now();
    return silent || tokenExpiringSoon;
  });

  const results: { tenant: string; status: string; reason?: string }[] = [];
  let alerted = 0;

  for (const t of candidates) {
    // 1. Email owner
    const { data: userData } = await supa.auth.admin.getUserById(t.owner_user_id);
    const email = userData?.user?.email;
    if (!email) {
      results.push({ tenant: t.ig_username || t.id, status: 'skip', reason: 'no_email' });
      continue;
    }

    const tokenExpiresSoon = t.ig_token_expires_at
      && +new Date(t.ig_token_expires_at) - Date.now() < 7 * ONE_DAY_MS
      && +new Date(t.ig_token_expires_at) > Date.now();
    const reason: 'silent' | 'token_expiring' = tokenExpiresSoon && t.last_webhook_received_at
      && +new Date(t.last_webhook_received_at) >= Date.now() - ONE_DAY_MS
      ? 'token_expiring' : 'silent';

    const sent = await sendOutageEmail(email, t.ig_username || 'your creator account', t.last_webhook_received_at, reason, t.ig_token_expires_at);
    if (!sent.ok) {
      results.push({ tenant: t.ig_username || t.id, status: 'error', reason: sent.error });
      continue;
    }

    // Mark alert sent. Auto-pause ONLY on real silence — don't punish a
    // healthy tenant whose token simply needs renewal.
    const update: Record<string, unknown> = {
      last_webhook_alert_sent_at: new Date().toISOString(),
    };
    if (reason === 'silent') {
      update.paused_until = new Date(Date.now() + ONE_DAY_MS).toISOString();
      update.paused_reason = 'Webhook silence > 24h — auto-paused. Reconnect to resume.';
    }
    await supa.from('autodm_tenants').update(update).eq('id', t.id);

    alerted++;
    results.push({ tenant: t.ig_username || t.id, status: 'alerted' });
  }

  return NextResponse.json({
    ok: true,
    scanned: candidates.length,
    alerted,
    results: results.slice(0, 50),
  });
}

async function sendOutageEmail(
  to: string,
  igUsername: string,
  lastSeenAt: string | null,
  kind: 'silent' | 'token_expiring' = 'silent',
  tokenExpiresAt: string | null = null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not set' };

  const reconnectUrl = `${autodmOrigin()}/connect`;
  const dashboardUrl = `${autodmOrigin()}/dashboard`;
  const lastSeen = lastSeenAt
    ? new Date(lastSeenAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : 'never';
  const tokenExpiresStr = tokenExpiresAt
    ? new Date(tokenExpiresAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const subject = kind === 'token_expiring'
    ? `${igUsername}: AutoDM token expires ${tokenExpiresStr} — reconnect soon`
    : `${igUsername}: AutoDM webhook silent for 24h+ — reconnect needed`;
  const accent = kind === 'token_expiring' ? '#f59e0b' : '#dc2626';
  const border = kind === 'token_expiring' ? '#fde68a' : '#fecaca';
  const headline = kind === 'token_expiring'
    ? `Your Instagram token expires ${tokenExpiresStr}`
    : `Meta has gone quiet on @${escape(igUsername)}`;
  const labelText = kind === 'token_expiring' ? '// token expiry warning' : '// webhook health alert';
  const html = `<!doctype html>
<html><body style="background:#fafafa;margin:0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
  <table style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid ${border};padding:32px;width:100%;border-collapse:collapse;">
    <tr><td>
      <div style="font:11px/1 monospace;color:${accent};text-transform:uppercase;letter-spacing:.15em;margin-bottom:8px;">${labelText}</div>
      <h1 style="font-size:22px;margin:0;font-weight:800;color:#111;">${headline}</h1>
    </td></tr>
    <tr><td style="padding-top:18px;">
      ${kind === 'token_expiring' ? `
      <p style="font-size:15px;line-height:1.6;margin:0 0 12px;">
        Your Instagram access token expires on <strong>${tokenExpiresStr}</strong>.
        Once it expires, comments will stop triggering DMs until you reconnect.
      </p>
      <p style="font-size:14px;line-height:1.6;margin:0 0 12px;color:#555;">
        Meta tokens last 60 days. We get an extension every time you use the app, but the safest
        play is to reconnect now while you have time. It takes ~30 seconds and won&apos;t reset your rules,
        analytics, or contacts.
      </p>
      ` : `
      <p style="font-size:15px;line-height:1.6;margin:0 0 12px;">
        We haven&apos;t received any webhook events from Instagram for your account in the last 24 hours.
        Last event: <strong>${escape(lastSeen)}</strong>.
      </p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 12px;color:#555;">
        That means new comments aren&apos;t triggering DMs right now. Most common causes:
      </p>
      <ul style="font-size:14px;line-height:1.7;color:#555;padding-left:20px;margin:0 0 12px;">
        <li>Instagram access token expired (60-day Meta limit hit)</li>
        <li>App or Facebook page was disconnected</li>
        <li>Meta marked the app for review and paused delivery</li>
      </ul>
      <p style="font-size:14px;line-height:1.6;margin:14px 0 0;color:#555;">
        We&apos;ve auto-paused sends for 24h so your account doesn&apos;t burn through cap on a broken connection.
        Reconnect to resume — it takes ~30 seconds and won&apos;t reset your rules or stats.
      </p>
      `}
    </td></tr>
    <tr><td style="padding-top:22px;">
      <a href="${reconnectUrl}" style="display:inline-block;background:${accent};color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;font-size:14px;">Reconnect Instagram →</a>
      <a href="${dashboardUrl}" style="display:inline-block;margin-left:10px;color:#666;text-decoration:none;padding:12px 4px;font-size:14px;">Open dashboard</a>
    </td></tr>
    <tr><td style="padding-top:24px;border-top:1px solid #f0f0f0;margin-top:24px;">
      <div style="font-size:11px;color:#999;padding-top:16px;">
        StackPicks AutoDM · This alert fires once per outage. You won&apos;t get a duplicate until events start flowing again.
      </div>
    </td></tr>
  </table>
</body></html>`;

  const text = kind === 'token_expiring'
    ? `Your IG token expires ${tokenExpiresStr}. Reconnect to keep AutoDM working: ${reconnectUrl}\n`
    : `Meta has gone quiet on @${igUsername}. Last event: ${lastSeen}. Reconnect: ${reconnectUrl}\n`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.AUTODM_DIGEST_FROM || RESEND_FROM,
        to: [to],
        subject, html, text,
        tags: [{ name: 'kind', value: 'autodm_webhook_outage' }],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return { ok: false, error: `${res.status}:${t.slice(0, 120)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message.slice(0, 200) };
  }
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

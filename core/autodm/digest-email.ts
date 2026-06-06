/**
 * Weekly digest email builder for AutoDM creators.
 *
 * Aggregates the last 7 days of dm_log per tenant and renders an HTML
 * email with: hero stat, sparkline of daily sends, best-performing
 * rule, follower vs non-follower CTR, cap-hit count + upgrade nudge.
 *
 * Sent every Monday 9 AM IST via api/autodm/digest-tick cron.
 * Honest: skips tenants with 0 sends in the window (no point emailing
 * "your bot did nothing"). Skips paused tenants too.
 */

export interface DigestStats {
  tenantId: string;
  igUsername: string;
  planTier: string;
  dailyCap: number;
  weekStart: string;          // ISO date, 7 days ago
  weekEnd: string;            // ISO date, today
  totalSent: number;
  totalClicks: number;
  ctrPct: number;
  dailySends: number[];       // 7 items, oldest first
  capHitDays: number;         // count of days in window where sent >= dailyCap
  followerSent: number;
  followerClicks: number;
  nonFollowerSent: number;
  nonFollowerClicks: number;
  bestRule: { label: string; keyword: string; sent: number; ctr: number } | null;
  upgradeUrl: string;
  analyticsUrl: string;
  contactsUrl: string;
}

export function buildDigestHtml(s: DigestStats): { subject: string; html: string; text: string } {
  const maxBar = Math.max(...s.dailySends, 1);
  const bars = s.dailySends.map((n) => {
    const h = Math.max(2, Math.round((n / maxBar) * 40));
    return `<td style="vertical-align:bottom;padding:0 2px;width:14%;">
      <div style="background:#FF6B35;height:${h}px;border-radius:2px 2px 0 0;"></div>
      <div style="font:11px/1.4 monospace;color:#888;text-align:center;margin-top:4px;">${n}</div>
    </td>`;
  }).join('');

  const followerCtr = s.followerSent ? Math.round((s.followerClicks / s.followerSent) * 100) : 0;
  const nonFollowerCtr = s.nonFollowerSent ? Math.round((s.nonFollowerClicks / s.nonFollowerSent) * 100) : 0;

  const capHitBlock = s.capHitDays >= 3 ? `
    <tr><td style="padding:16px 0 0;">
      <div style="background:#FEF3C7;border-left:3px solid #F59E0B;padding:14px 16px;border-radius:6px;font:14px/1.5 -apple-system,sans-serif;color:#92400E;">
        <strong>You hit your daily cap ${s.capHitDays} times this week.</strong><br/>
        Qualified comments aren't getting a DM. <a href="${s.upgradeUrl}" style="color:#92400E;">Bump your plan →</a>
      </div>
    </td></tr>` : '';

  const bestRuleBlock = s.bestRule ? `
    <tr><td style="padding:14px 0 0;">
      <div style="background:#F4F4F5;padding:14px 16px;border-radius:6px;font:14px/1.5 -apple-system,sans-serif;">
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#666;font-family:monospace;">// best performer</div>
        <div style="margin-top:6px;font-weight:600;">${escape(s.bestRule.label)}</div>
        <div style="color:#666;font-size:13px;">keyword <code style="background:#fff;padding:1px 6px;border-radius:3px;font-size:12px;">${escape(s.bestRule.keyword)}</code> · ${s.bestRule.sent} sent · ${s.bestRule.ctr}% CTR</div>
      </div>
    </td></tr>` : '';

  const html = `<!doctype html>
<html><body style="background:#fafafa;margin:0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
  <table style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e5e5;padding:32px;width:100%;border-collapse:collapse;">
    <tr><td>
      <div style="font:11px/1 monospace;color:#FF6B35;text-transform:uppercase;letter-spacing:.15em;margin-bottom:8px;">// weekly digest</div>
      <h1 style="font-size:24px;margin:0;font-weight:800;">@${escape(s.igUsername)} · week of ${s.weekStart.slice(5)}</h1>
      <div style="color:#666;margin-top:6px;font-size:14px;">Here's what your auto-DM bot did Mon-Sun.</div>
    </td></tr>

    <tr><td style="padding:24px 0 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:14px;background:#FFF7F3;border:1px solid #FFD9C7;border-radius:8px;width:50%;">
            <div style="font:11px/1 monospace;color:#666;text-transform:uppercase;letter-spacing:.1em;">Sent · 7d</div>
            <div style="font-size:30px;font-weight:800;margin-top:6px;">${s.totalSent}</div>
            <div style="font-size:12px;color:#666;">avg ${Math.round(s.totalSent / 7)}/day</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:14px;background:#FFF7F3;border:1px solid #FFD9C7;border-radius:8px;width:50%;">
            <div style="font:11px/1 monospace;color:#666;text-transform:uppercase;letter-spacing:.1em;">Clicks · 7d</div>
            <div style="font-size:30px;font-weight:800;margin-top:6px;color:#FF6B35;">${s.totalClicks}</div>
            <div style="font-size:12px;color:#666;">${s.ctrPct}% CTR</div>
          </td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:20px 0 0;">
      <div style="font:11px/1 monospace;color:#666;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">// 7-day trend</div>
      <table style="width:100%;border-collapse:collapse;"><tr>${bars}</tr></table>
    </td></tr>

    <tr><td style="padding:18px 0 0;">
      <div style="font:11px/1 monospace;color:#666;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">// audience split</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">Followers</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;color:#666;">${s.followerSent} sent · <strong style="color:#111;">${followerCtr}%</strong> CTR</td>
        </tr>
        <tr>
          <td style="padding:8px 0;">Non-followers</td>
          <td style="padding:8px 0;text-align:right;color:#666;">${s.nonFollowerSent} sent · <strong style="color:#111;">${nonFollowerCtr}%</strong> CTR</td>
        </tr>
      </table>
    </td></tr>

    ${bestRuleBlock}
    ${capHitBlock}

    <tr><td style="padding:24px 0 0;">
      <a href="${s.analyticsUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;font-size:14px;">Open full analytics →</a>
      <a href="${s.contactsUrl}" style="display:inline-block;margin-left:10px;color:#666;text-decoration:none;padding:12px 4px;font-size:14px;">Contacts</a>
    </td></tr>

    <tr><td style="padding:24px 0 0;border-top:1px solid #f0f0f0;margin-top:24px;">
      <div style="font-size:11px;color:#999;padding-top:18px;">
        StackPicks AutoDM · <a href="https://autodm.stackpicks.dev" style="color:#999;">autodm.stackpicks.dev</a> ·
        <a href="https://autodm.stackpicks.dev/blog" style="color:#999;">Blog</a>
        <br/>Don't want these? Reply STOP and we'll skip you next week.
      </div>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Weekly digest for @${s.igUsername}`,
    `Week of ${s.weekStart.slice(5)} - ${s.weekEnd.slice(5)}`,
    ``,
    `Sent: ${s.totalSent}`,
    `Clicks: ${s.totalClicks} (${s.ctrPct}% CTR)`,
    `Cap-hit days: ${s.capHitDays}`,
    s.bestRule ? `Best rule: ${s.bestRule.label} (${s.bestRule.ctr}% CTR)` : '',
    ``,
    `Full analytics: ${s.analyticsUrl}`,
  ].filter(Boolean).join('\n');

  const subject = `${s.igUsername}: ${s.totalSent} DMs sent, ${s.totalClicks} clicks this week`;
  return { subject, html, text };
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/**
 * Send via Resend's HTTP API directly. Returns ok/error tuple — never
 * throws. Logs nothing sensitive.
 */
export async function sendDigestEmail(input: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not set' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        tags: [{ name: 'kind', value: 'autodm_digest' }],
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      return { ok: false, error: `${res.status} ${t.slice(0, 200)}` };
    }
    const j = await res.json() as { id?: string };
    return { ok: true, id: j.id || '' };
  } catch (e) {
    return { ok: false, error: (e as Error).message.slice(0, 200) };
  }
}

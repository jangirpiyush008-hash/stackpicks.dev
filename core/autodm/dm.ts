// StackPicks AutoDM — multi-tenant DM send engine.
//
// Direct port of the StackPicks-internal logic in core/instagram/dm.ts, but
// every function takes a `tenantToken` argument instead of reading from env.
// All the hard-won fixes carry over:
//   • Private Reply API by comment_id (works for non-followers, 7-day window)
//   • 2-message split: plain text body + button card (no invisible subtitle)
//   • Real-time follower detection via graph.facebook.com
//   • Public comment reply path (separate endpoint)

const GRAPH = 'https://graph.facebook.com/v21.0';
const GRAPH_IG = 'https://graph.instagram.com/v22.0';

export interface SendDmResult {
  ok: boolean;
  message_id?: string;
  error?: string;
}

/**
 * Send a DM as a tenant.
 *
 * commentId path = Private Reply (7-day window, works for non-followers).
 * No commentId = standard messaging (24h conversation window).
 */
export async function sendDm(input: {
  igBusinessId: string;
  tenantToken: string;
  recipientIgsid: string;
  commentId?: string;
  body: string;
  ctaUrl?: string;
  ctaLabel?: string;
}): Promise<SendDmResult> {
  const { igBusinessId, tenantToken, recipientIgsid, commentId, body, ctaUrl, ctaLabel } = input;

  const recipient = commentId ? { comment_id: commentId } : { id: recipientIgsid };
  const baseUrl = tenantToken.length > 200 ? GRAPH_IG : GRAPH;  // crude: IG-Login tokens are longer

  async function post(messagePayload: unknown) {
    const url = `${baseUrl}/${igBusinessId}/messages?access_token=${encodeURIComponent(tenantToken)}`;
    const payload: Record<string, unknown> = { recipient, message: messagePayload };
    if (!commentId) payload.messaging_type = 'RESPONSE';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j = (await res.json().catch(() => ({}))) as {
      message_id?: string; error?: { message?: string };
    };
    return { ok: res.ok, json: j, status: res.status };
  }

  // 1. Plain-text DM (full body visible — no subtitle clipping)
  const text = await post({ text: body.slice(0, 1000) });
  if (!text.ok) return { ok: false, error: text.json?.error?.message || `HTTP ${text.status}` };

  // 2. Optional CTA button card — best-effort (text already delivered)
  if (ctaUrl && ctaLabel) {
    try {
      await post({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: ctaLabel.slice(0, 80),
              buttons: [{ type: 'web_url', url: ctaUrl, title: ctaLabel.slice(0, 20) }],
            }],
          },
        },
      });
    } catch { /* card-failure non-fatal */ }
  }

  return { ok: true, message_id: text.json?.message_id };
}

/**
 * Public comment reply — not subject to the 24h DM window.
 * POST /{comment-id}/replies with { message }.
 */
export async function replyToComment(input: {
  tenantToken: string;
  commentId: string;
  message: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { tenantToken, commentId, message } = input;
  if (!commentId || !message.trim()) return { ok: false, error: 'missing input' };

  const baseUrl = tenantToken.length > 200 ? GRAPH_IG : GRAPH;
  const url = `${baseUrl}/${commentId}/replies?access_token=${encodeURIComponent(tenantToken)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message.slice(0, 280) }),
  });
  const j = (await res.json().catch(() => ({}))) as {
    id?: string; error?: { message?: string; code?: number };
  };
  if (!res.ok) return { ok: false, error: j?.error?.message || `HTTP ${res.status}` };
  return { ok: true, id: j.id };
}

/**
 * Follow-status check. Uses graph.facebook.com where the field exists
 * for Page Access Tokens. Returns null when API can't answer (default
 * to non-follower behavior for safety).
 */
export interface FollowCheckResult {
  isFollower: boolean | null;
  source: string;
  rawError?: string;
}
export async function checkIsFollower(
  igsid: string,
  tenantToken: string,
): Promise<FollowCheckResult> {
  if (!igsid) return { isFollower: null, source: 'none', rawError: 'no_igsid' };
  try {
    const url = `${GRAPH}/${igsid}?fields=is_user_follow_business&access_token=${encodeURIComponent(tenantToken)}`;
    const res = await fetch(url);
    const j = (await res.json().catch(() => ({}))) as {
      is_user_follow_business?: boolean;
      error?: { message?: string };
    };
    if (typeof j.is_user_follow_business === 'boolean') {
      return { isFollower: j.is_user_follow_business, source: 'fb_graph' };
    }
    return { isFollower: null, source: 'fb_graph', rawError: j.error?.message || 'no field' };
  } catch (e) {
    return { isFollower: null, source: 'fb_graph', rawError: (e as Error).message };
  }
}

/** Template placeholder substitution — {{username}}, {{keyword}}. */
export function renderTemplate(
  template: string,
  ctx: { username?: string; keyword?: string },
): string {
  return template
    .replace(/\{\{\s*username\s*\}\}/gi, ctx.username ? `@${ctx.username}` : 'there')
    .replace(/\{\{\s*keyword\s*\}\}/gi, ctx.keyword || '');
}

/**
 * Multi-keyword rule matcher (comma-separated keywords supported).
 * Returns best matching rule or null. Post-pinned rules win over global.
 */
export interface RuleForMatch {
  id: string;
  ig_post_id: string | null;
  keyword: string;
  is_active: boolean;
}
export function matchRule<R extends RuleForMatch>(
  rules: R[], commentText: string, postId: string,
): R | null {
  const text = (commentText || '').toLowerCase().trim();
  if (!text) return null;
  const matches = (kw: string) =>
    kw.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean)
      .some((k) => text.includes(k));
  const active = rules.filter((r) => r.is_active && matches(r.keyword));
  if (!active.length) return null;
  const pinned = active.find((r) => r.ig_post_id === postId);
  return pinned ?? active[0];
}

/** Append PS follow nudge if rule allows AND recipient is not a follower. */
export function applyFollowNudge(
  body: string, rule: { follow_nudge?: boolean | null }, isFollower: boolean, handle: string,
): string {
  if (!rule.follow_nudge || isFollower) return body;
  return `${body.trimEnd()}\n\nPS — follow ${handle} for more.`;
}

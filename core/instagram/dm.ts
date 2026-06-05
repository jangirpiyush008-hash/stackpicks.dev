// IG Messaging — auto-DM sender + comment-trigger matcher.
//
// Used by /api/webhook/instagram. The webhook receives Meta events when a
// comment lands on one of our posts, we check ig_dm_rules for a match, and
// fire a DM via the Send API (Graph v21).
//
// Env required (already set for the publisher):
//   META_LONG_TOKEN
//   IG_BUSINESS_ID
//
// Docs: https://developers.facebook.com/docs/messenger-platform/instagram

// Route based on which token we have: IG Login API tokens use graph.instagram.com,
// FB-issued System User tokens use graph.facebook.com.
const GRAPH = process.env.IG_USER_TOKEN
  ? 'https://graph.instagram.com/v22.0'
  : 'https://graph.facebook.com/v21.0';

function token(): string {
  // Prefer the IG-OAuth user token (has the right scopes for Send API),
  // fall back to the System User token.
  const t = process.env.IG_USER_TOKEN || process.env.META_LONG_TOKEN;
  if (!t) throw new Error('IG_USER_TOKEN / META_LONG_TOKEN env not set');
  return t;
}

function igBusinessId(): string {
  const id = process.env.IG_BUSINESS_ID;
  if (!id) throw new Error('IG_BUSINESS_ID env not set');
  return id;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface DmRule {
  id: string;
  ig_post_id: string | null;
  keyword: string;
  dm_template: string;
  cta_url: string | null;
  cta_label: string | null;
  is_active: boolean;
  daily_cap: number | null;
  label: string | null;
  follow_nudge: boolean;
  comment_reply: string | null;
  /** Public reply text used when commenter ALREADY follows. Falls back to comment_reply. */
  comment_reply_follower: string | null;
}

/**
 * Check whether an IGSID (commenter) follows the business account.
 *
 * Uses the IG Messaging "user profile" endpoint which exposes
 * `is_user_follow_business` for any user with a messaging context with the
 * business. Comments grant exactly that context (7-day window), so it's
 * available right when we need it.
 *
 * Returns `true` / `false` / `null` (when the API can't answer — we default
 * to non-follower behavior so we don't accidentally drop the follow nudge
 * for someone who actually isn't following).
 */
export async function checkIsFollower(igsid: string): Promise<boolean | null> {
  if (!igsid) return null;
  try {
    const url = `${GRAPH}/${igsid}?fields=is_user_follow_business&access_token=${encodeURIComponent(token())}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = (await res.json().catch(() => ({}))) as { is_user_follow_business?: boolean };
    return typeof j.is_user_follow_business === 'boolean' ? j.is_user_follow_business : null;
  } catch {
    return null;
  }
}

/**
 * Reply publicly to a comment via the IG Graph API.
 *
 * This is the public-facing half of the "comment → DM" flow. After sending
 * the DM, we also post a short visible reply ("Sent ✓ — check your DMs")
 * directly under the user's comment. Three reasons:
 *   1. Tells the commenter the action succeeded (DMs are easy to miss).
 *   2. Signals to OTHER viewers "comment this keyword to get yours too" —
 *      drives more comments → more engagement → algorithm boost.
 *   3. Counts as a comment reply, which the IG algorithm rewards.
 *
 * Endpoint: POST /{comment-id}/replies with { message }
 * Note: comment replies are NOT subject to the 24-hour messaging window —
 * they're public comment activity, governed by spam policy only.
 */
export async function replyToComment(input: {
  commentId: string;
  message: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const { commentId, message } = input;
  if (!commentId || !message.trim()) return { ok: false, error: 'missing input' };

  const url = `${GRAPH}/${commentId}/replies?access_token=${encodeURIComponent(token())}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message.slice(0, 280) }),  // IG cap
  });
  const json = (await res.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };
  if (!res.ok) {
    return { ok: false, error: json?.error?.message || `HTTP ${res.status}` };
  }
  return { ok: true, id: json.id };
}

/** Brand handle appended to follow-nudge lines. Hardcoded for now; env-overridable later. */
const FOLLOW_HANDLE = '@stackpicks_official';

/**
 * If a rule has follow_nudge=true, append a short "follow for more" line to
 * the DM body. Pure string transform — no API call, no follow-status check.
 * Non-followers AND followers see the same nudge; followers ignore it,
 * non-followers convert from it.
 */
export function applyFollowNudge(body: string, rule: { follow_nudge?: boolean | null }): string {
  if (!rule.follow_nudge) return body;
  return `${body.trimEnd()}\n\nPS — follow ${FOLLOW_HANDLE} for more picks like this.`;
}

/**
 * Pick the best matching rule for a comment event.
 *
 * The `keyword` field on a rule can hold a SINGLE keyword (e.g. `STACK`)
 * OR a COMMA-SEPARATED list (e.g. `STACK, BUNDLE, LINK`). We split on
 * commas, trim each, lowercase, and OR-match: if ANY token appears as a
 * case-insensitive substring of the comment text, the rule matches.
 *
 * Match precedence:
 *   1. Rules pinned to this exact post (ig_post_id === postId)
 *   2. Global rules (ig_post_id IS NULL)
 *
 * Returns null if no rule matches.
 */
export function matchRule(
  rules: DmRule[],
  commentText: string,
  postId: string,
): DmRule | null {
  const text = (commentText || '').toLowerCase().trim();
  if (!text) return null;
  const matches = (kw: string) =>
    kw.split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean)
      .some((k) => text.includes(k));
  const active = rules.filter((r) => r.is_active && matches(r.keyword));
  if (!active.length) return null;
  // Prefer post-specific over global
  const pinned = active.find((r) => r.ig_post_id === postId);
  return pinned ?? active[0];
}

// ─────────────────────────────────────────────────────────────────────────────

export interface SendDmResult {
  ok: boolean;
  message_id?: string;
  error?: string;
}

/**
 * Send a DM to a user via the IG Messaging Send API.
 *
 * Two delivery paths:
 *
 * 1. **Private Reply (preferred for comment triggers)** — pass `commentId`.
 *    Meta lets you DM the commenter for up to 7 days after their comment,
 *    even if they've NEVER messaged you before. This is the supported path
 *    for "comment → DM" automation. Bypasses the 24-hour conversation window
 *    that blocks first-time DMs.
 *
 * 2. **Standard messaging (fallback)** — pass `recipientIgsid` only.
 *    Only works inside an active 24-hour conversation window. Use this only
 *    when there's no comment context (e.g. message-trigger DMs).
 *
 * `recipientIgsid` is Meta's Instagram-Scoped ID (IGSID) — it comes in on
 * the webhook event as `from.id`. NOT the user's @handle.
 *
 * `commentId` is the IG comment ID (webhook `value.id` on a comments event).
 *
 * If `ctaUrl` + `ctaLabel` are provided, we send the message as a "generic
 * template" with a single web_url button. Otherwise plain text.
 */
export async function sendDm(input: {
  recipientIgsid: string;
  commentId?: string;
  body: string;
  ctaUrl?: string;
  ctaLabel?: string;
}): Promise<SendDmResult> {
  const { recipientIgsid, commentId, body, ctaUrl, ctaLabel } = input;

  // Private Reply path: address by comment_id, NOT user_id. Meta uses the
  // comment as the messaging anchor and grants a 7-day window from the
  // comment timestamp. No `messaging_type` needed — it's inferred.
  // Standard path: by IGSID, requires an active 24h conversation.
  const recipient = commentId
    ? { comment_id: commentId }
    : { id: recipientIgsid };

  /**
   * IG Messaging quirk: when you use the generic-template card with a button,
   * the `subtitle` field is tiny italic text under the title (often clipped).
   * That ate the follow-nudge PS line completely.
   *
   * Fix: send TWO messages. First a plain-text DM with the FULL body
   * (every word visible, no truncation). Then a second template-card DM
   * with JUST a button. Matches the ManyChat-style "message + CTA card" flow.
   *
   * When no CTA is configured, we send a single text message only.
   */
  async function postMessage(messagePayload: unknown) {
    const url = `${GRAPH}/${igBusinessId()}/messages?access_token=${encodeURIComponent(token())}`;
    const payload: Record<string, unknown> = {
      recipient,
      message: messagePayload,
    };
    if (!commentId) payload.messaging_type = 'RESPONSE';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j = (await res.json().catch(() => ({}))) as {
      message_id?: string;
      error?: { message?: string };
    };
    return { ok: res.ok, json: j, status: res.status };
  }

  // 1. Plain-text DM with full body (incl. follow nudge, no truncation).
  const textRes = await postMessage({ text: body.slice(0, 1000) });
  if (!textRes.ok) {
    return {
      ok: false,
      error: textRes.json?.error?.message || `HTTP ${textRes.status}`,
    };
  }
  const primaryId = textRes.json?.message_id;

  // 2. Optional: follow-up button card. Best-effort — text DM already
  //    landed, so a card failure is non-fatal.
  if (ctaUrl && ctaLabel) {
    try {
      await postMessage({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: ctaLabel.slice(0, 80),       // button label as title — short + clean
                buttons: [
                  { type: 'web_url', url: ctaUrl, title: ctaLabel.slice(0, 20) },
                ],
              },
            ],
          },
        },
      });
    } catch {
      // Swallow — primary DM already delivered.
    }
  }

  return { ok: true, message_id: primaryId };
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fill {{placeholder}} tokens in a template.
 * Supported: {{username}}, {{keyword}}.
 */
export function renderTemplate(
  template: string,
  ctx: { username?: string; keyword?: string },
): string {
  return template
    .replace(/\{\{\s*username\s*\}\}/gi, ctx.username ? `@${ctx.username}` : 'there')
    .replace(/\{\{\s*keyword\s*\}\}/gi, ctx.keyword || '');
}

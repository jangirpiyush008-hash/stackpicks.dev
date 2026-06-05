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
 * `recipientIgsid` is Meta's Instagram-Scoped ID (IGSID) — it comes in on
 * the webhook event as `from.id`. NOT the user's @handle.
 *
 * If `ctaUrl` + `ctaLabel` are provided, we send the message as a "generic
 * template" with a single web_url button. Otherwise plain text.
 *
 * IG only lets you send messages within a 24-hour window after the user's
 * last interaction with you (their comment counts as an interaction).
 */
export async function sendDm(input: {
  recipientIgsid: string;
  body: string;
  ctaUrl?: string;
  ctaLabel?: string;
}): Promise<SendDmResult> {
  const { recipientIgsid, body, ctaUrl, ctaLabel } = input;

  const messagePayload =
    ctaUrl && ctaLabel
      ? {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [
                {
                  title: body.slice(0, 80),
                  subtitle: body.length > 80 ? body.slice(80, 240) : undefined,
                  buttons: [
                    { type: 'web_url', url: ctaUrl, title: ctaLabel.slice(0, 20) },
                  ],
                },
              ],
            },
          },
        }
      : { text: body };

  const url = `${GRAPH}/${igBusinessId()}/messages?access_token=${encodeURIComponent(token())}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientIgsid },
      message: messagePayload,
      messaging_type: 'RESPONSE',
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    message_id?: string;
    error?: { message?: string };
  };
  if (!res.ok) {
    return { ok: false, error: json?.error?.message || `HTTP ${res.status}` };
  }
  return { ok: true, message_id: json.message_id };
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

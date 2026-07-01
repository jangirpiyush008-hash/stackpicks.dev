// StackPicks AutoDM — multi-tenant DM send engine.
//
// Direct port of the StackPicks-internal logic in core/instagram/dm.ts, but
// every function takes a `tenantToken` argument instead of reading from env.
// All the hard-won fixes carry over:
//   • Private Reply API by comment_id (works for non-followers, 7-day window)
//   • 2-message split: plain text body + button card (no invisible subtitle)
//   • Real-time follower detection via graph.instagram.com
//   • Public comment reply path (separate endpoint)

// AutoDM uses Business Login for Instagram — every call goes to
// graph.instagram.com with the creator's Instagram user token.
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
  /** Branding line shown under title. Setting this makes IG render this
   *  INSTEAD of the URL hostname under the title — the key to a clean
   *  shop-style card (HYPD / Burger Bae pattern) with zero URL visible. */
  ctaSubtitle?: string;
  /** Image at top of the card. Use post permalink image or creator avatar. */
  ctaImageUrl?: string;
  /** Meta message tag — required when sending OUTSIDE the 24-hour
   *  standard messaging window. `HUMAN_AGENT` is for human-reviewed
   *  manual replies sent within the 7-day Human Agent window (gated by
   *  the `Human Agent` permission). Other valid tags: POST_PURCHASE_UPDATE,
   *  ACCOUNT_UPDATE. Leave unset for replies inside the 24h window. */
  messagingTag?: 'HUMAN_AGENT' | 'POST_PURCHASE_UPDATE' | 'ACCOUNT_UPDATE';
}): Promise<SendDmResult> {
  const { igBusinessId, tenantToken, recipientIgsid, commentId, body, ctaUrl, ctaLabel, ctaSubtitle, ctaImageUrl, messagingTag } = input;

  const recipient = commentId ? { comment_id: commentId } : { id: recipientIgsid };
  const baseUrl = GRAPH_IG;

  async function post(messagePayload: unknown) {
    const url = `${baseUrl}/${igBusinessId}/messages?access_token=${encodeURIComponent(tenantToken)}`;
    const payload: Record<string, unknown> = { recipient, message: messagePayload };
    if (messagingTag) {
      // MESSAGE_TAG path — unlocks 24h+ replies for the specific tag.
      // HUMAN_AGENT requires the Human Agent permission and a creator-in-the-loop
      // review (handled in /api/autodm/conversations/[id]/reply).
      payload.messaging_type = 'MESSAGE_TAG';
      payload.tag = messagingTag;
    } else if (!commentId) {
      payload.messaging_type = 'RESPONSE';
    }
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

  // Meta compliance: the Private Reply path (commentId set) explicitly
  // limits us to ONE message per commenter per Meta docs
  // (https://developers.facebook.com/documentation/business-messaging/instagram-messaging/features/private-replies —
  // "Only one message can be sent to the Instagram user who commented").
  // On this path we combine body + URL into a single text send.
  //
  // Standard messaging path (no commentId — user has replied to us, 24h
  // window is open) can still use the template-card UX. Same for the
  // MESSAGE_TAG paths (HUMAN_AGENT etc.) where multi-message flows are
  // supported.
  const isPrivateReply = !!commentId && !messagingTag;

  if (isPrivateReply) {
    // Single-message compliance: append the URL to the body on a new line
    // if a CTA was configured. Cap at IG's 1000-char limit. This keeps us
    // strictly inside Meta's "one message" rule while still delivering
    // the link to the recipient in the first (and only) send.
    const parts = [body.trim()];
    if (ctaUrl) parts.push('', ctaUrl); // blank line then URL
    const combined = parts.join('\n').slice(0, 1000);
    const one = await post({ text: combined });
    if (!one.ok) return { ok: false, error: one.json?.error?.message || `HTTP ${one.status}` };
    return { ok: true, message_id: one.json?.message_id };
  }

  // Standard-messaging + MESSAGE_TAG paths — multi-message allowed.
  // 1. Body text.
  const text = await post({ text: body.slice(0, 1000) });
  if (!text.ok) return { ok: false, error: text.json?.error?.message || `HTTP ${text.status}` };

  // 2. Optional CTA card. Only fires on non-Private-Reply paths where
  //    Meta permits attachments. Setting `subtitle` swaps the URL host
  //    for a brand line so the card reads clean.
  if (ctaUrl && ctaLabel) {
    const element: Record<string, unknown> = {
      title: ctaLabel.slice(0, 80),
      buttons: [{ type: 'web_url', url: ctaUrl, title: ctaLabel.slice(0, 20) }],
    };
    if (ctaSubtitle) element.subtitle = ctaSubtitle.slice(0, 80);
    if (ctaImageUrl) element.image_url = ctaImageUrl;

    const cardRes = await post({
      attachment: {
        type: 'template',
        payload: { template_type: 'generic', elements: [element] },
      },
    }).catch(() => ({ ok: false, json: {} as { error?: { message?: string } }, status: 0 }));

    if (!cardRes.ok) {
      // Card rejected — send URL as plain text so the link still reaches
      // the recipient. Text message already landed above.
      await post({ text: ctaUrl.slice(0, 1000) }).catch(() => undefined);
    }
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

  const url = `${GRAPH_IG}/${commentId}/replies?access_token=${encodeURIComponent(tenantToken)}`;
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
 * Follow-status check via graph.instagram.com. Returns null when the API
 * can't answer (we then default to non-follower behavior for safety —
 * which only ever ADDS the follow nudge, never withholds the link).
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
    const url = `${GRAPH_IG}/${igsid}?fields=is_user_follow_business&access_token=${encodeURIComponent(tenantToken)}`;
    const res = await fetch(url);
    const j = (await res.json().catch(() => ({}))) as {
      is_user_follow_business?: boolean;
      error?: { message?: string };
    };
    if (typeof j.is_user_follow_business === 'boolean') {
      return { isFollower: j.is_user_follow_business, source: 'ig_graph' };
    }
    return { isFollower: null, source: 'ig_graph', rawError: j.error?.message || 'no field' };
  } catch (e) {
    return { isFollower: null, source: 'ig_graph', rawError: (e as Error).message };
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

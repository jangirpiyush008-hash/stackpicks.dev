/**
 * AI onboarding — the magic 90-second moment.
 *
 * Given a tenant with a valid IG token:
 *   1. Fetch their last 30 published posts (Graph API)
 *   2. For each post, fetch the top 20 comments
 *   3. Cluster recurring questions/intents via Claude
 *   4. Generate 5 starter rules with keywords + DM templates in the
 *      creator's voice (extracted from their own post captions)
 *
 * Output: 5 draft rules (is_active=false) — creator approves on dashboard.
 *
 * This is what turns "30-60 min ManyChat setup" into "90-second onboarding".
 */

import Anthropic from '@anthropic-ai/sdk';

// Business Login for Instagram — read posts + comments via graph.instagram.com.
const GRAPH = 'https://graph.instagram.com/v22.0';

export interface RuleDraft {
  label: string;
  keyword: string;
  dm_template: string;
  comment_reply: string;
  comment_reply_follower: string;
  ai_personality_hint?: string;
}

interface PostSnapshot {
  caption: string;
  comment_count: number;
  top_comments: string[];
}

/** Step 1+2: pull the creator's recent content + the comments people leave on it. */
export async function fetchCreatorSnapshot(
  igBusinessId: string,
  pageToken: string,
): Promise<{ captions: string[]; comments: string[]; posts: PostSnapshot[] }> {
  const mediaRes = await fetch(
    `${GRAPH}/${igBusinessId}/media?fields=id,caption,comments_count,media_type&limit=30&access_token=${encodeURIComponent(pageToken)}`,
  );
  const mediaJson = (await mediaRes.json().catch(() => ({}))) as {
    data?: { id: string; caption?: string; comments_count?: number }[];
  };
  const media = mediaJson.data ?? [];

  const posts: PostSnapshot[] = [];
  for (const m of media.slice(0, 30)) {
    const commentsRes = await fetch(
      `${GRAPH}/${m.id}/comments?fields=text,from&limit=20&access_token=${encodeURIComponent(pageToken)}`,
    );
    const cj = (await commentsRes.json().catch(() => ({}))) as {
      data?: { text?: string; from?: { id?: string } }[];
    };
    const commentsTexts = (cj.data ?? [])
      .map((c) => c.text?.trim())
      .filter((t): t is string => !!t && t.length > 0 && t.length < 500);
    posts.push({
      caption: m.caption ?? '',
      comment_count: m.comments_count ?? 0,
      top_comments: commentsTexts,
    });
  }

  return {
    captions: posts.map((p) => p.caption).filter(Boolean),
    comments: posts.flatMap((p) => p.top_comments),
    posts,
  };
}

/** Step 3+4: ask Claude to cluster comments + generate 5 rule drafts. */
export async function generateStarterRules(input: {
  igUsername: string;
  captions: string[];
  comments: string[];
  fallbackCtaUrl: string;
}): Promise<RuleDraft[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const claude = new Anthropic({ apiKey });

  // IG captions/comments often contain partial emojis (unpaired UTF-16
  // surrogates) when the source is truncated mid-character or scraped from
  // mixed-encoding fields. These slip through fine in JS strings but Claude's
  // JSON parser rejects them with "no low surrogate in string" 400 errors.
  // Strip any lone high/low surrogate and replace with the Unicode replacement
  // char so the prompt stays valid JSON.
  const sanitize = (s: string): string => s
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '�')  // high surrogate not followed by low
    .replace(/(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '$1�'); // low surrogate not preceded by high

  const captionsBlock = input.captions
    .slice(0, 20).map((c, i) => `[${i + 1}] ${sanitize(c).slice(0, 300)}`).join('\n');
  const commentsBlock = input.comments
    .slice(0, 80).map((c) => `- ${sanitize(c)}`).join('\n');

  const prompt = `You are setting up auto-DM rules for an Instagram creator. They get LOTS of comments asking the same things, and you'll generate 5 keyword rules that auto-DM the right link when those keywords appear.

# The creator
Handle: @${input.igUsername}

# Their recent post captions (use these to learn their VOICE — tone, emoji, Hinglish vs English, sign-offs):
${captionsBlock || '(no captions yet — use a neutral casual tone)'}

# Recent comments people leave on their posts (use these to find PATTERNS — what people ask for, common intents):
${commentsBlock || '(no comments yet — pick 5 GENERIC starter rules)'}

# Task
Generate exactly 5 JSON rule objects covering the most common intents you see (link requests, price asks, "how to" asks, recipe/tutorial requests, etc.). Each rule needs:
  - "label": short admin-only name, e.g. "Recipe link"
  - "keyword": ONE word OR comma-separated keywords commenters might use. ALL CAPS. e.g. "RECIPE, PASTA, FOOD"
  - "dm_template": the DM body the bot sends. MUST be in the creator's voice (match the captions above). Use {{username}} for the recipient. Keep it 1-3 sentences. DON'T include a URL in the body — the button card delivers the link separately.
  - "comment_reply": short public reply under the comment, follower-aware-friendly. e.g. "Hey @{{username}} — sent the link 💛"
  - "comment_reply_follower": even shorter for existing followers. e.g. "Link sent ✓ {{username}}"
  - "ai_personality_hint": one-line description of the tone (used later for AI-generated variants)

Output ONLY a JSON array of 5 rule objects. No markdown, no commentary.`;

  const res = await claude.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = res.content[0];
  const raw = block.type === 'text' ? block.text : '';
  // Strip code fences if Claude adds them despite instructions
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

  let parsed: unknown;
  try { parsed = JSON.parse(cleaned); }
  catch { throw new Error('Claude returned non-JSON: ' + cleaned.slice(0, 200)); }
  if (!Array.isArray(parsed)) throw new Error('Claude did not return an array');

  return parsed.slice(0, 5).map((r: Record<string, unknown>) => ({
    label: String(r.label ?? 'Starter rule'),
    keyword: String(r.keyword ?? '').toUpperCase(),
    dm_template: String(r.dm_template ?? ''),
    comment_reply: String(r.comment_reply ?? ''),
    comment_reply_follower: String(r.comment_reply_follower ?? ''),
    ai_personality_hint: r.ai_personality_hint ? String(r.ai_personality_hint) : undefined,
  })).filter((r) => r.keyword && r.dm_template);
}

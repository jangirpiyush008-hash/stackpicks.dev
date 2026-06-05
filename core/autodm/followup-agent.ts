/**
 * Conversational follow-up agent — the other killer feature.
 *
 * Every other auto-DM tool dies after message #1. We stay alive for
 * up to 5 turns with Claude-powered replies in the creator's voice.
 *
 * When the recipient replies to our initial DM, we:
 *   1. Look up the autodm_conversations row
 *   2. Append the new message to the transcript
 *   3. Ask Claude for the next reply (or to escalate to creator)
 *   4. Send it back via the standard messaging API
 *      (window is now open — they DMed us)
 *
 * Returns either:
 *   - { reply: string } → send this back
 *   - { escalate: true, reason } → ping the creator, don't reply
 *   - { close: true, reason } → conversation ended naturally
 */

import Anthropic from '@anthropic-ai/sdk';

export interface TranscriptTurn {
  role: 'user' | 'creator_bot';
  text: string;
  at: string;     // ISO timestamp
}

export interface AgentInput {
  tenantUsername: string;
  voiceSamples: string[];           // creator's captions / past replies for tone
  productContext: string;           // bio + key URLs + plan info
  initialComment: string;           // what triggered the whole convo
  initialDmSent: string;            // what we DM'd them first
  transcript: TranscriptTurn[];     // includes the new incoming message as the last user turn
  ctaUrl?: string;                  // primary CTA in case AI wants to nudge
}

export interface AgentOutput {
  intent: 'reply' | 'escalate' | 'close';
  reply?: string;
  reason?: string;
  confidence: 'high' | 'medium' | 'low';
}

const SYSTEM_PROMPT = `You are an AI agent helping an Instagram creator handle inbound DM conversations on their behalf. Your job: respond to recipient messages naturally, in the creator's voice, like the creator themselves would. Goal is to be helpful and convert the conversation toward whatever the creator's CTA is, without sounding robotic or pushy.

Hard rules:
- ALWAYS respond in the creator's voice (samples provided). Match tone, emoji use, language mix (Hinglish/English), sentence length.
- Keep replies SHORT (1-3 sentences max). DMs are not emails.
- If you don't know the answer to a specific question (sizes, shipping to a country, prices, dates), escalate to the creator — don't guess.
- Never invent product details, prices, return policies, or commitments. Only use facts from the product context provided.
- If the recipient is hostile, asks for a refund/complaint, mentions legal/medical issues, or seems to be a real customer-support case — escalate.
- If the conversation has reached a natural close ("thanks!", "ok got it", emoji thumbs up), output close intent.

Output STRICT JSON:
{
  "intent": "reply" | "escalate" | "close",
  "reply": "the message to send if intent=reply",
  "reason": "short explanation if intent=escalate or close",
  "confidence": "high" | "medium" | "low"
}`;

export async function generateFollowupReply(input: AgentInput): Promise<AgentOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const claude = new Anthropic({ apiKey });

  const userPrompt = `# Creator handle
@${input.tenantUsername}

# Creator's voice samples (their own words — match this tone, emoji, sentence length, language):
${input.voiceSamples.slice(0, 10).map((s, i) => `${i + 1}. "${s.slice(0, 250)}"`).join('\n')}

# Product context (use only these facts):
${input.productContext}
${input.ctaUrl ? `Primary CTA URL: ${input.ctaUrl}` : ''}

# How this conversation started
Recipient commented on a post: "${input.initialComment}"
We DM'd them: "${input.initialDmSent}"

# Conversation so far (newest at bottom):
${input.transcript.map((t) => `[${t.role === 'user' ? 'RECIPIENT' : 'CREATOR-BOT'}]: ${t.text}`).join('\n')}

# Task
Based on the LATEST recipient message, decide: reply (and what to say), escalate (and why), or close.

Output JSON only.`;

  const res = await claude.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });
  const block = res.content[0];
  const raw = block.type === 'text' ? block.text : '';
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();

  let parsed: AgentOutput;
  try { parsed = JSON.parse(cleaned) as AgentOutput; }
  catch { throw new Error('Agent returned non-JSON: ' + cleaned.slice(0, 200)); }
  if (!['reply', 'escalate', 'close'].includes(parsed.intent)) {
    throw new Error('Agent returned bad intent: ' + parsed.intent);
  }
  return parsed;
}

/** Hard caps before we close a conversation regardless of AI output. */
export const FOLLOWUP_LIMITS = {
  MAX_TURNS: 5,                 // 5 back-and-forths max
  MAX_AGE_HOURS: 24,            // close 24h after last activity
};

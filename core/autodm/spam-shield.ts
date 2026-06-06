/**
 * Spam-shield — the "your account doesn't get banned" guarantee.
 *
 * Two layers:
 *  1. Per-rule linter — surfaces risks BEFORE the creator saves a rule
 *     (trigger words, multiple URLs, identical templates)
 *  2. Account-warming caps — automatic ramp-up over the first 21 days
 *     so we never burst-send on a brand-new IG business account
 *
 * Calibrated against Meta's known anti-abuse signals — the same ones
 * that flagged the StackPicks developer account on 2026-06-06 when we
 * burst 10+ DMs in 90 min during debugging.
 */

import { DEFAULT_PLAN_CAPS, type PlanTier } from './types';

// ─── Spam-word linter ─────────────────────────────────────────────────────

/** Words Meta's spam ML weights heavily. NOT a complete list — calibrated
 *  for the buyer/creator surface we serve. */
export const SPAM_TRIGGERS: { word: string; severity: 'high' | 'medium' }[] = [
  { word: 'free',          severity: 'high' },
  { word: 'guaranteed',    severity: 'high' },
  { word: 'guarantee',     severity: 'high' },
  { word: 'no cost',       severity: 'medium' },
  { word: 'exclusive',     severity: 'medium' },
  { word: 'limited time',  severity: 'high' },
  { word: 'limited offer', severity: 'high' },
  { word: 'act now',       severity: 'high' },
  { word: 'click here',    severity: 'high' },
  { word: 'click below',   severity: 'medium' },
  { word: 'buy now',       severity: 'high' },
  { word: 'order now',     severity: 'high' },
  { word: 'special offer', severity: 'medium' },
  { word: 'last chance',   severity: 'medium' },
  { word: 'urgent',        severity: 'medium' },
  { word: 'cash',          severity: 'medium' },
  { word: '100%',          severity: 'medium' },
  { word: 'risk free',     severity: 'high' },
];

const URL_RE = /\bhttps?:\/\/\S+|\b\S+\.(com|in|io|dev|ai|co|me|org|net)\b/gi;

export interface LintFinding {
  field: 'dm_template' | 'comment_reply' | 'comment_reply_follower';
  severity: 'high' | 'medium' | 'low';
  code: 'spam_word' | 'url_in_body' | 'multiple_urls' | 'identical_repeat' | 'too_short' | 'too_long';
  message: string;
  match?: string;
}

/** Lint a single rule before save. Returns ALL findings. UI shows warnings
 *  but doesn't block — the creator can still ship a flagged rule. */
export function lintRule(input: {
  dm_template: string;
  dm_template_variants?: string[] | null;
  cta_url?: string | null;
  comment_reply?: string | null;
  comment_reply_follower?: string | null;
}): LintFinding[] {
  const out: LintFinding[] = [];
  const fields: { name: LintFinding['field']; value: string | null | undefined }[] = [
    { name: 'dm_template', value: input.dm_template },
    { name: 'comment_reply', value: input.comment_reply },
    { name: 'comment_reply_follower', value: input.comment_reply_follower },
  ];

  for (const f of fields) {
    if (!f.value) continue;
    const text = f.value.toLowerCase();

    // 1. Spam triggers
    for (const t of SPAM_TRIGGERS) {
      const re = new RegExp(`\\b${t.word.replace(/\s+/g, '\\s+')}\\b`, 'i');
      const m = text.match(re);
      if (m) {
        out.push({
          field: f.name, severity: t.severity, code: 'spam_word',
          message: `Contains "${t.word}" — Meta's spam ML weights this term heavily. Consider rewording.`,
          match: m[0],
        });
      }
    }

    // 2. URLs in body — DM body should describe value; the CTA card delivers the link
    if (f.name === 'dm_template') {
      const urls = (text.match(URL_RE) || []);
      if (urls.length > 0 && input.cta_url) {
        out.push({
          field: f.name, severity: 'high', code: 'url_in_body',
          message: 'Body contains a URL AND the rule has a CTA card. Two links in one DM is the #1 spam trigger — keep only the card link.',
          match: urls[0],
        });
      } else if (urls.length > 1) {
        out.push({
          field: f.name, severity: 'high', code: 'multiple_urls',
          message: `${urls.length} URLs in the body. Multi-link DMs are aggressively flagged. Use one link in the CTA card instead.`,
        });
      }

      // 3. Length sanity
      if (f.value.trim().length < 10) {
        out.push({
          field: f.name, severity: 'low', code: 'too_short',
          message: 'DM body is very short — recipients can\'t tell what you\'re offering.',
        });
      } else if (f.value.length > 800) {
        out.push({
          field: f.name, severity: 'medium', code: 'too_long',
          message: 'DM body is over 800 chars — gets truncated in most clients.',
        });
      }
    }
  }

  // 4. Identical variants — defeats the point of having variants
  if (input.dm_template_variants && input.dm_template_variants.length > 0) {
    const unique = new Set(input.dm_template_variants.concat([input.dm_template]).map((s) => s.trim().toLowerCase()));
    if (unique.size < input.dm_template_variants.length + 1) {
      out.push({
        field: 'dm_template', severity: 'medium', code: 'identical_repeat',
        message: 'One or more variants are identical to the main body. Spam ML notices when identical text fans out to many recipients — rephrase each variant.',
      });
    }
  }

  return out;
}

// ─── Account-warming auto-ramp ────────────────────────────────────────────

/** Compute the hourly/daily caps for a tenant based on plan tier + how
 *  long they've been a tenant. New tenants get a softer ramp regardless
 *  of plan, then graduate to plan caps after 21 days. */
export function computeWarmingCaps(input: {
  plan_tier: PlanTier;
  created_at: string;
  account_warming_ends_at: string | null;
}): { hourly_cap: number; daily_cap: number; warming_active: boolean } {
  const plan = DEFAULT_PLAN_CAPS[input.plan_tier];
  const warmingEnds = input.account_warming_ends_at ? new Date(input.account_warming_ends_at) : null;
  const now = new Date();

  if (!warmingEnds || warmingEnds <= now) {
    return { hourly_cap: plan.hourly, daily_cap: plan.daily, warming_active: false };
  }

  // Age in days
  const created = new Date(input.created_at);
  const ageDays = Math.floor((now.getTime() - created.getTime()) / 86400000);

  // Phased ramp regardless of plan — soft cap that grows:
  //   Day 0-6:   30% of plan
  //   Day 7-13:  60% of plan
  //   Day 14-20: 100% of plan
  let factor = 0.3;
  if (ageDays >= 14) factor = 1.0;
  else if (ageDays >= 7) factor = 0.6;

  return {
    hourly_cap: Math.max(5, Math.floor(plan.hourly * factor)),
    daily_cap:  Math.max(20, Math.floor(plan.daily  * factor)),
    warming_active: true,
  };
}

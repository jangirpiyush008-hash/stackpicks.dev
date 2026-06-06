// StackPicks AutoDM — shared types
// Mirrors the autodm_* schema. Centralised so apps stay thin.

export type PlanTier = 'free' | 'creator' | 'pro' | 'agency';

export interface AutoDmTenant {
  id: string;
  owner_user_id: string;
  ig_business_id: string;
  ig_username: string | null;
  ig_user_token_encrypted: string | null;
  ig_token_expires_at: string | null;
  meta_long_token_encrypted: string | null;
  plan_tier: PlanTier;
  hourly_cap: number;
  daily_cap: number;
  account_warming_ends_at: string | null;
  voice_style_sheet: Record<string, unknown> | null;
  ai_dm_generation: boolean;
  ai_followup_agent: boolean;
  is_active: boolean;
  paused_until: string | null;
  paused_reason: string | null;
  // Webhook health beats — bumped on every Meta delivery for this tenant.
  // Dashboard renders banner if stale; cron auto-pauses + emails if 24h+.
  last_webhook_received_at: string | null;
  last_webhook_event: string | null;
  last_webhook_alert_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutoDmRule {
  id: string;
  tenant_id: string;
  label: string | null;
  ig_post_id: string | null;
  keyword: string;
  dm_template: string;
  dm_template_variants: string[] | null;
  cta_url: string | null;
  cta_label: string | null;
  comment_reply: string | null;
  comment_reply_follower: string | null;
  follow_nudge: boolean;
  daily_cap_per_recipient: number | null;
  is_active: boolean;
  use_ai_generation: boolean;
  ai_personality_hint: string | null;
}

export interface AutoDmLogInsert {
  tenant_id: string;
  rule_id?: string;
  ig_user_id?: string;
  ig_username?: string;
  trigger_event?: string;
  trigger_post_id?: string;
  trigger_text?: string;
  trigger_comment_id?: string;
  is_follower?: boolean | null;
  follow_check_source?: string;
  follow_check_error?: string;
  status: 'sent' | 'skipped' | 'error';
  ig_message_id?: string;
  reply_status?: string;
  reply_id?: string;
  error?: string;
  ai_generated?: boolean;
  body_variant_index?: number;
}

/** Per-plan resource caps.
 *
 *  hourly / daily — outbound DM rate caps (enforced today on the
 *                   StackPicks-internal bot and on every tenant via
 *                   the webhook handler).
 *  instagram / linkedin / x — number of social accounts a tenant can
 *                   connect at that plan tier. Today only Instagram is
 *                   built; LinkedIn + X land in Q3 2026 and the caps
 *                   are set now so customers see the brand promise. */
export interface PlanCaps {
  hourly: number;
  daily: number;
  instagram_accounts: number;
  linkedin_accounts: number;
  x_accounts: number;
}

export const DEFAULT_PLAN_CAPS: Record<PlanTier, PlanCaps> = {
  free:    { hourly: 10,  daily: 50,   instagram_accounts: 1,  linkedin_accounts: 0,  x_accounts: 0  },
  creator: { hourly: 30,  daily: 200,  instagram_accounts: 1,  linkedin_accounts: 1,  x_accounts: 1  },
  pro:     { hourly: 120, daily: 1000, instagram_accounts: 3,  linkedin_accounts: 3,  x_accounts: 3  },
  agency:  { hourly: 300, daily: 5000, instagram_accounts: 25, linkedin_accounts: 25, x_accounts: 25 },
};

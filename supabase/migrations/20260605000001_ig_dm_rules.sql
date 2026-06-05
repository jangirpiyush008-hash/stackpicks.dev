-- =============================================================================
-- Instagram auto-DM: trigger rules + send log
-- =============================================================================
-- Pattern: someone comments a keyword on one of our IG posts → we auto-DM them
-- with a templated message (e.g. "Comment STACK → DM with stackpicks.dev link").
--
-- Webhook flow:
--   1. cron-job.org → /api/webhook/instagram (GET verify) — Meta calls this on subscribe
--   2. Meta → /api/webhook/instagram (POST) when a tracked event fires
--   3. We match the comment text against ig_dm_rules, pick the winner, send the DM
--   4. Log the send in ig_dm_log
--
-- All access is service-role-only. RLS is on, no public policies — only
-- adminClient() can touch these tables.

create table public.ig_dm_rules (
  id              uuid primary key default gen_random_uuid(),

  -- What triggers the DM
  -- Either a specific post (Meta media id, e.g. "18015262013700309") OR null
  -- to match all posts.
  ig_post_id      text,
  -- Trigger keyword (case-insensitive substring match). Required.
  keyword         text not null,

  -- What we send back
  -- DM body text. May contain {{username}} placeholder.
  dm_template     text not null,
  -- Optional URL we tack onto the DM as a CTA button (Graph API generic template).
  cta_url         text,
  cta_label       text,

  -- Lifecycle
  is_active       boolean not null default true,
  -- Stop sending after N total DMs (null = unlimited)
  daily_cap       integer,

  -- Metadata
  label           text,                    -- human-readable name for the admin UI
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index ig_dm_rules_active_idx on public.ig_dm_rules (is_active) where is_active = true;
create index ig_dm_rules_post_idx   on public.ig_dm_rules (ig_post_id) where ig_post_id is not null;

alter table public.ig_dm_rules enable row level security;
-- No policies → service role only.

-- ─────────────────────────────────────────────────────────────────────────────

create table public.ig_dm_log (
  id              uuid primary key default gen_random_uuid(),
  rule_id         uuid references public.ig_dm_rules(id) on delete set null,

  -- Who we DM'd
  ig_user_id      text not null,           -- recipient IGSID from webhook
  ig_username     text,                    -- if Meta gave it to us

  -- Why
  trigger_event   text not null,           -- 'comment' | 'message' | 'mention'
  trigger_post_id text,
  trigger_text    text,                    -- the comment / message body that triggered us

  -- Result
  status          text not null,           -- 'sent' | 'error' | 'skipped'
  ig_message_id   text,                    -- Meta's message id on success
  error           text,                    -- error string on failure

  created_at      timestamptz not null default now()
);

create index ig_dm_log_user_idx    on public.ig_dm_log (ig_user_id, created_at desc);
create index ig_dm_log_status_idx  on public.ig_dm_log (status, created_at desc);
-- We need cheap "did we already DM this user for this rule today?" lookups
-- to enforce the daily_cap. Composite covers it.
create index ig_dm_log_rule_day_idx on public.ig_dm_log (rule_id, ig_user_id, created_at);

alter table public.ig_dm_log enable row level security;
-- No policies → service role only.

-- ─────────────────────────────────────────────────────────────────────────────

-- updated_at trigger for rules
create or replace function public.tg_ig_dm_rules_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ig_dm_rules_updated_at
  before update on public.ig_dm_rules
  for each row execute function public.tg_ig_dm_rules_updated_at();

-- ============================================================================
-- Instagram auto-posting queue
-- ----------------------------------------------------------------------------
-- A single table that holds every IG post (video/reel/image/carousel), its
-- scheduled time, and its lifecycle state. The Railway cron picks up rows
-- where status='ready' AND scheduled_at <= now() and publishes them via the
-- Meta Graph API.
-- ============================================================================

create table if not exists public.ig_queue (
  id               uuid primary key default gen_random_uuid(),

  -- Content
  post_type        text not null check (post_type in ('reel', 'video', 'image', 'carousel')),
  topic            text not null,                  -- short topic key — used to pick caption template
  media_urls       text[] not null,                -- 1 url for reel/video/image, N for carousel
  cover_url        text,                           -- optional cover image (Reels)
  caption          text not null,
  hashtags         text not null default '',       -- space-separated, no #

  -- Lifecycle
  status           text not null default 'ready'   -- ready -> processing -> posted | error
                     check (status in ('ready', 'processing', 'posted', 'error')),
  scheduled_at     timestamptz not null,           -- when the cron should pick it up
  posted_at        timestamptz,                    -- when Meta confirmed publish
  ig_creation_id   text,                           -- Graph API container id (intermediate)
  ig_post_id       text,                           -- final published media id

  -- Error tracking
  attempts         int not null default 0,
  last_error       text,
  last_error_at    timestamptz,

  -- Meta
  notes            text,                           -- free-form, optional
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists ig_queue_scheduled_idx
  on public.ig_queue (status, scheduled_at)
  where status in ('ready', 'processing');

create index if not exists ig_queue_status_idx on public.ig_queue (status, created_at desc);

-- Auto-bump updated_at on every UPDATE
create or replace function public.ig_queue_touch() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists ig_queue_touch_trg on public.ig_queue;
create trigger ig_queue_touch_trg
  before update on public.ig_queue
  for each row execute function public.ig_queue_touch();

-- ----------------------------------------------------------------------------
-- RLS — admin only (service role for cron, admin user via /admin/instagram)
-- ----------------------------------------------------------------------------
alter table public.ig_queue enable row level security;

-- No public/auth user access. Admin pages talk to this via the service role
-- client (server-side only). The cron also uses service role.
grant all on public.ig_queue to service_role;

-- Optional: let the admin user (identified by ADMIN_EMAIL) read via RLS.
-- Easier path: admin page just uses the service-role client — same pattern
-- as /admin/connect and /admin/seo. So no SELECT policy needed for anon/auth.

comment on table public.ig_queue is
  'Instagram auto-posting queue. Service-role only. Cron at /api/cron/ig-publish picks up ready rows where scheduled_at <= now().';

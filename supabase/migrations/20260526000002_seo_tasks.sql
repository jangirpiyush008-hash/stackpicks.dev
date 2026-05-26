-- seo_tasks: completion state for the 90-day SEO calendar.
-- The plan itself lives in apps/web/lib/seo-calendar.ts (static, single source
-- of truth). This table only stores per-day completion + notes.
--
-- Launch date is stored once in a singleton row of seo_calendar_config so the
-- "what day is it" math works after a restart / multi-device check-in.

create table public.seo_tasks (
  day_number int primary key check (day_number >= 1 and day_number <= 90),
  completed_at timestamptz,
  notes text,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.seo_tasks enable row level security;

-- Read-public so the admin page can render the calendar with completion state
-- visible to anyone (the data is non-sensitive — just checkboxes).
create policy "seo_tasks_select_public" on public.seo_tasks
  for select using (true);

-- Writes go through the /api/admin/seo-task route (service role).

grant select on public.seo_tasks to anon, authenticated;

create table public.seo_calendar_config (
  id int primary key default 1 check (id = 1),
  launch_date date not null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.seo_calendar_config enable row level security;

create policy "seo_calendar_config_select_public" on public.seo_calendar_config
  for select using (true);

grant select on public.seo_calendar_config to anon, authenticated;

-- Seed today (2026-05-26) as Day 1 of the 90-day campaign. Admin can update.
insert into public.seo_calendar_config (id, launch_date)
values (1, '2026-05-26')
on conflict (id) do nothing;

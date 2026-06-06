-- AutoDM rule scheduling — restrict a rule to specific IST hours/days.
-- Applied 2026-06-06 via MCP. Checked in for fresh-env replay.
--
-- active_hour_start / active_hour_end:
--   • null/null  → always on
--   • 9, 22      → 09:00-22:59 IST (same-day window)
--   • 22, 6      → 22:00-06:59 IST (overnight, crosses midnight)
-- active_days: array of weekday integers 0-6 where 0=Sun.
--   • null/empty → all 7 days

alter table public.autodm_rules
  add column if not exists active_hour_start smallint,
  add column if not exists active_hour_end smallint,
  add column if not exists active_days smallint[];

alter table public.autodm_rules
  drop constraint if exists autodm_rules_active_hours_check;
alter table public.autodm_rules
  add constraint autodm_rules_active_hours_check
  check (
    (active_hour_start is null and active_hour_end is null)
    or (active_hour_start between 0 and 23 and active_hour_end between 0 and 23)
  );

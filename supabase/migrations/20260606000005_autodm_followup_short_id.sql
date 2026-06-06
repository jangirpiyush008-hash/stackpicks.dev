-- AutoDM: dedicated short_id for the 4h auto-followup so its clicks are
-- attributable separately. Redirects to the SAME original_cta_url as the
-- initial DM — the followup just re-sends the same link with a short
-- reminder message in the creator's voice.
--
-- Applied 2026-06-06 via MCP. Checked in for fresh-env replay.

alter table public.autodm_dm_log
  add column if not exists followup_short_id text;

create unique index if not exists autodm_dm_log_followup_short_id_uq
  on public.autodm_dm_log (followup_short_id)
  where followup_short_id is not null;

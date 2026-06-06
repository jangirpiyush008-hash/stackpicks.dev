-- AutoDM: store the rendered body of each sent DM. Required by the
-- voice-clone eval harness to score "did the actual send match the
-- creator's voice" vs scoring the template (which is what they typed
-- once). Capped at 2000 chars; Meta limit is 1000 anyway.
--
-- Applied 2026-06-06 via MCP. Checked in for fresh-env replay.

alter table public.autodm_dm_log
  add column if not exists sent_body text;

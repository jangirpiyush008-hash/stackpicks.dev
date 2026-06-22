-- Privacy hardening — bound commenter-PII retention to the minimum
-- needed for tenant support + Meta Platform Terms §4.b compliance.
--
-- The bodies of these statements have already been applied to the live
-- database via Supabase MCP on 2026-06-22; this file is the canonical
-- record of the change for the migration history.
--
-- Retention contract:
--   ig_webhook_log.raw_body         7 days   (diagnostic only)
--   autodm_webhook_log.raw_body     7 days   (diagnostic only)
--   autodm_dm_log (entire row)      90 days  (tenant support window)
--   ig_dm_log     (entire row)      90 days  (legacy single-tenant)
--
-- All `purge_*_old()` functions are SECURITY DEFINER + service_role-only.
-- Daily cron at /api/cron/autodm-purge calls each one.

-- Backfill — anything past 80 chars in stored comment text is dropped now.
update public.autodm_dm_log
   set trigger_text = left(trigger_text, 80)
 where trigger_text is not null and length(trigger_text) > 80;

update public.ig_dm_log
   set trigger_text = left(trigger_text, 80)
 where trigger_text is not null and length(trigger_text) > 80;

comment on column public.autodm_dm_log.trigger_text is
  'First 80 chars of triggering comment. 90-day TTL via purge_autodm_dm_log_old(). Truncated on write.';
comment on column public.autodm_dm_log.sent_body is
  'Body of the DM that we sent. 90-day TTL via purge_autodm_dm_log_old(). Used only for tenant support; never exported for ad/audience use.';
comment on column public.autodm_dm_log.ig_username is
  'Recipient @handle. Retained for tenant support context. 90-day TTL via purge.';
comment on column public.autodm_dm_log.ig_user_id is
  'Recipient IGSID — required for daily_cap_per_recipient enforcement. 90-day TTL via purge.';
comment on column public.ig_webhook_log.raw_body is
  'Raw Meta webhook payload (first 4KB). 7-day TTL via purge_ig_webhook_log_old(). Diagnostic only.';
comment on column public.autodm_webhook_log.raw_body is
  'Raw Meta webhook payload. 7-day TTL via purge_autodm_webhook_log_old(). Diagnostic only.';

create or replace function public.purge_ig_webhook_log_old()
returns integer
language plpgsql security definer set search_path = public as $$
declare deleted_count integer;
begin
  delete from public.ig_webhook_log where received_at < now() - interval '7 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end; $$;

create or replace function public.purge_autodm_webhook_log_old()
returns integer
language plpgsql security definer set search_path = public as $$
declare deleted_count integer;
begin
  delete from public.autodm_webhook_log where received_at < now() - interval '7 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end; $$;

create or replace function public.purge_autodm_dm_log_old()
returns integer
language plpgsql security definer set search_path = public as $$
declare deleted_count integer;
begin
  delete from public.autodm_dm_log where created_at < now() - interval '90 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end; $$;

create or replace function public.purge_ig_dm_log_old()
returns integer
language plpgsql security definer set search_path = public as $$
declare deleted_count integer;
begin
  delete from public.ig_dm_log where created_at < now() - interval '90 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end; $$;

revoke execute on function public.purge_ig_webhook_log_old()      from public, authenticated, anon;
revoke execute on function public.purge_autodm_webhook_log_old()  from public, authenticated, anon;
revoke execute on function public.purge_autodm_dm_log_old()       from public, authenticated, anon;
revoke execute on function public.purge_ig_dm_log_old()           from public, authenticated, anon;
grant  execute on function public.purge_ig_webhook_log_old()      to service_role;
grant  execute on function public.purge_autodm_webhook_log_old()  to service_role;
grant  execute on function public.purge_autodm_dm_log_old()       to service_role;
grant  execute on function public.purge_ig_dm_log_old()           to service_role;

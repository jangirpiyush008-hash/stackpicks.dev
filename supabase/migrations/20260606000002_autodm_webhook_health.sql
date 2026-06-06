-- AutoDM webhook health tracking.
-- Webhook handler bumps last_webhook_received_at on every Meta delivery.
-- Dashboard shows banner if stale; cron auto-pauses + emails if 24h+.
--
-- Applied 2026-06-06 via MCP. Checked in for fresh-env replay.

alter table public.autodm_tenants
  add column if not exists last_webhook_received_at timestamptz,
  add column if not exists last_webhook_event text,
  add column if not exists last_webhook_alert_sent_at timestamptz;

create index if not exists autodm_tenants_webhook_health_idx
  on public.autodm_tenants (last_webhook_received_at)
  where is_active = true;

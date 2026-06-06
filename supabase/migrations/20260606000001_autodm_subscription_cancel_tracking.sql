-- AutoDM: track "cancel scheduled at cycle end" so the dashboard can
-- show "Cancels on Jun 28" the moment the user clicks cancel, without
-- waiting for the Razorpay webhook (which only fires when the cycle
-- actually ends).
--
-- Applied 2026-06-06 via MCP. Kept here for version control + replay
-- on fresh environments.

alter table public.autodm_subscriptions
  add column if not exists cancel_at_cycle_end boolean not null default false,
  add column if not exists cancelled_at timestamptz;

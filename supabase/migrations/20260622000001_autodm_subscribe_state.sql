-- AutoDM: track the subscribe-to-webhooks call result per tenant.
--
-- Why: previously the OAuth callback issued POST /<ig>/subscribed_apps but
-- swallowed any Meta error in an empty catch block. Tenants ended up in
-- "connected but never receives webhooks" zombie state and we had no way
-- to tell whether the subscribe call had ever even reached Meta.
--
-- These two columns make the state legible:
--   webhook_subscribed_at    — last time POST /subscribed_apps succeeded
--   webhook_subscribe_error  — last failure message from Meta, NULL on success
--
-- The dashboard banner reads these alongside last_webhook_received_at to
-- distinguish (a) subscribe failed → user must fix, (b) subscribe ok but
-- Meta not delivering → silent Meta-side issue, (c) all healthy.

alter table public.autodm_tenants
  add column if not exists webhook_subscribed_at   timestamptz,
  add column if not exists webhook_subscribe_error text;

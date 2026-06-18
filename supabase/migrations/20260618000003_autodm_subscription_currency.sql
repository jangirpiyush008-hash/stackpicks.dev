-- Track billing currency on each subscription so the webhook can route
-- the right plan ID and so we keep a per-row record of which checkout
-- experience the customer used. Default 'inr' so legacy rows match
-- the pre-USD behaviour.

alter table public.autodm_subscriptions
  add column if not exists currency text not null default 'inr'
    check (currency in ('inr', 'usd'));

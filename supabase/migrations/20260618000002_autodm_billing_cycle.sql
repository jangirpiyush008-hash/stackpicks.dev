-- Track billing cycle (monthly | yearly) on each subscription so the
-- Razorpay webhook can grant yearly customers their bonus caps when the
-- subscription activates / renews.
--
-- Default 'monthly' so existing pre-migration rows keep their original
-- caps. New yearly subscribers get the column written at /subscribe time.

alter table public.autodm_subscriptions
  add column if not exists billing_cycle text not null default 'monthly'
    check (billing_cycle in ('monthly', 'yearly'));

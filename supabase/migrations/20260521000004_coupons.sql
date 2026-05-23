-- Coupons + redemption tracking for promotional discounts.
-- Paste this in the Supabase SQL Editor.

create table if not exists public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,                          -- 'LAUNCH50', 'FREEACCESS' — case-insensitive (we normalize on insert)
  description text,                                    -- internal note
  kind text not null check (kind in ('percentage','fixed_inr','fixed_usd','free')),
  -- percentage: value = 1..100 (% off)
  -- fixed_inr:  value = paise off (e.g. 5000 = ₹50 off)
  -- fixed_usd:  value = cents off (e.g. 100 = $1 off)
  -- free:       value ignored — grants 100% off
  value int not null default 0,
  max_uses int,                                        -- null = unlimited
  used_count int not null default 0,
  expires_at timestamptz,                              -- null = never expires
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists coupons_code_idx on public.coupons (lower(code));
create index if not exists coupons_active_idx on public.coupons (is_active) where is_active = true;

create trigger coupons_updated_at before update on public.coupons
  for each row execute function public.set_updated_at();

alter table public.coupons enable row level security;

-- Public can attempt to look up by code (rate-limited at API layer); cannot enumerate.
-- Inserts/updates only via service role (admin).
create policy "coupons_select_active" on public.coupons
  for select using (is_active = true);

-- IMPORTANT: RLS only kicks in *after* table-level GRANTs. Without these,
-- anon/authenticated sessions cannot see active coupons even with the policy
-- above, so /api/checkout/lifetime silently fails to apply discounts and
-- bills the full base price. (Caught this 3 days before launch.)
grant select on public.coupons to anon, authenticated;

-- Track which user redeemed which coupon — so we know who got what
create table if not exists public.coupon_redemptions (
  id uuid primary key default uuid_generate_v4(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  original_amount_paise int,
  discount_amount_paise int,
  final_amount_paise int,
  razorpay_payment_id text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists redemptions_coupon_idx on public.coupon_redemptions (coupon_id, created_at desc);
create index if not exists redemptions_user_idx on public.coupon_redemptions (user_id, created_at desc);

alter table public.coupon_redemptions enable row level security;

-- Users can read their own redemption history; service role bypasses for admin reports
create policy "redemptions_select_own" on public.coupon_redemptions
  for select using (auth.uid() = user_id);

-- Seed a couple of starter codes (you can edit / disable these later in Supabase Studio)
insert into public.coupons (code, description, kind, value, max_uses, is_active) values
  ('LAUNCH50',  'Launch week — 50% off',     'percentage', 50,   1000, true),
  ('FREEACCESS','Free comp for a beta user', 'free',       0,    10,   true),
  ('FRIENDS25', 'Network discount',          'percentage', 25,   null, true)
on conflict (code) do nothing;

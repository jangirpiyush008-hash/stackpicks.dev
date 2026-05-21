-- StackPicks initial schema
-- All tables: UUID PK, created_at/updated_at UTC, RLS enabled, explicit policies

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- fuzzy search on repo names

-- ============================================================================
-- HELPER: updated_at trigger
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end; $$;

-- ============================================================================
-- CATEGORIES (UI, animation, auth, payments, db, ai, design-systems, etc.)
-- ============================================================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  icon text, -- lucide icon name
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "categories_select_public" on public.categories
  for select using (true);

-- Categories are admin-managed; no INSERT/UPDATE/DELETE policies for end users.
-- Service role bypasses RLS, so admin scripts work.

-- ============================================================================
-- REPOS (scraped from GitHub)
-- ============================================================================
create table public.repos (
  id uuid primary key default uuid_generate_v4(),
  github_id bigint not null unique,
  slug text not null unique, -- e.g. "shadcn-ui-ui"
  owner text not null,
  name text not null,
  full_name text not null, -- "owner/name"
  description text,
  homepage text,
  github_url text not null,
  language text,
  topics text[] default '{}',
  license text,

  stars int not null default 0,
  forks int not null default 0,
  open_issues int not null default 0,
  watchers int not null default 0,
  stars_last_week int not null default 0, -- velocity for "trending"

  pushed_at timestamptz,
  github_created_at timestamptz,

  -- Curation (Piyush's "use this if / skip if" notes)
  curator_take text,
  use_this_if text,
  skip_if text,
  is_featured boolean not null default false,
  is_published boolean not null default false, -- review queue gate

  -- Monetization
  affiliate_url text, -- overrides github_url for outbound

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index repos_slug_idx on public.repos (slug);
create index repos_full_name_idx on public.repos (full_name);
create index repos_stars_idx on public.repos (stars desc);
create index repos_velocity_idx on public.repos (stars_last_week desc);
create index repos_published_idx on public.repos (is_published) where is_published = true;
create index repos_name_trgm_idx on public.repos using gin (name gin_trgm_ops);

create trigger repos_updated_at before update on public.repos
  for each row execute function public.set_updated_at();

alter table public.repos enable row level security;

create policy "repos_select_published" on public.repos
  for select using (is_published = true);

-- ============================================================================
-- REPO <-> CATEGORY (many-to-many)
-- ============================================================================
create table public.repo_categories (
  repo_id uuid not null references public.repos(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (repo_id, category_id)
);

alter table public.repo_categories enable row level security;

create policy "repo_categories_select_public" on public.repo_categories
  for select using (true);

-- ============================================================================
-- COLLECTIONS ("Best for shadcn stack", "FitProof builder picks")
-- ============================================================================
create table public.collections (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text,
  cover_image text,
  is_premium boolean not null default false, -- gated for paid users
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger collections_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

alter table public.collections enable row level security;

-- Public collections visible to all; premium collections only to subscribers
create policy "collections_select_public" on public.collections
  for select using (
    is_published = true and (
      is_premium = false
      or exists (
        select 1 from public.premium_subscriptions ps
        where ps.user_id = auth.uid() and ps.status = 'active'
      )
    )
  );

create table public.collection_repos (
  collection_id uuid not null references public.collections(id) on delete cascade,
  repo_id uuid not null references public.repos(id) on delete cascade,
  sort_order int not null default 0,
  note text, -- contextual note for this repo in this collection
  primary key (collection_id, repo_id)
);

alter table public.collection_repos enable row level security;

create policy "collection_repos_select_public" on public.collection_repos
  for select using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.is_published = true and (
        c.is_premium = false
        or exists (
          select 1 from public.premium_subscriptions ps
          where ps.user_id = auth.uid() and ps.status = 'active'
        )
      )
    )
  );

-- ============================================================================
-- SPONSORS (paying tool makers)
-- ============================================================================
create table public.sponsors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  contact_email text not null,
  contact_phone text, -- +91 format
  website text,
  gstin text, -- Indian GST number for invoicing
  razorpay_customer_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger sponsors_updated_at before update on public.sponsors
  for each row execute function public.set_updated_at();

alter table public.sponsors enable row level security;

create policy "sponsors_select_own" on public.sponsors
  for select using (auth.uid() = user_id);

create policy "sponsors_insert_own" on public.sponsors
  for insert with check (auth.uid() = user_id);

create policy "sponsors_update_own" on public.sponsors
  for update using (auth.uid() = user_id);

-- ============================================================================
-- SPONSORED SLOTS (featured listings)
-- ============================================================================
create type sponsor_placement as enum ('category_top', 'homepage_featured', 'newsletter');

create table public.sponsored_slots (
  id uuid primary key default uuid_generate_v4(),
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  repo_id uuid references public.repos(id) on delete set null, -- nullable: can be external product
  external_name text, -- if not a tracked repo
  external_url text,
  external_logo text,
  placement sponsor_placement not null,
  category_id uuid references public.categories(id) on delete set null, -- required if placement = category_top
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  amount_inr int not null, -- in paise (100 paise = ₹1)
  razorpay_subscription_id text,
  razorpay_payment_id text,
  status text not null default 'pending', -- pending | active | expired | cancelled
  impressions int not null default 0,
  clicks int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index sponsored_slots_active_idx on public.sponsored_slots (status, ends_at)
  where status = 'active';

create trigger sponsored_slots_updated_at before update on public.sponsored_slots
  for each row execute function public.set_updated_at();

alter table public.sponsored_slots enable row level security;

create policy "sponsored_slots_select_active" on public.sponsored_slots
  for select using (
    status = 'active' and ends_at > timezone('utc', now())
    or exists (
      select 1 from public.sponsors s
      where s.id = sponsor_id and s.user_id = auth.uid()
    )
  );

create policy "sponsored_slots_insert_own" on public.sponsored_slots
  for insert with check (
    exists (
      select 1 from public.sponsors s
      where s.id = sponsor_id and s.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PREMIUM SUBSCRIPTIONS (₹299/mo)
-- ============================================================================
create table public.premium_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_subscription_id text not null unique,
  razorpay_customer_id text,
  plan_id text not null, -- RAZORPAY_PLAN_PREMIUM_MONTHLY
  status text not null default 'pending', -- pending | active | cancelled | expired | paused
  current_period_start timestamptz,
  current_period_end timestamptz,
  amount_inr int not null, -- in paise
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index premium_subs_user_idx on public.premium_subscriptions (user_id, status);

create trigger premium_subscriptions_updated_at before update on public.premium_subscriptions
  for each row execute function public.set_updated_at();

alter table public.premium_subscriptions enable row level security;

create policy "premium_subs_select_own" on public.premium_subscriptions
  for select using (auth.uid() = user_id);

-- Inserts/updates only via service role (webhook handler)

-- ============================================================================
-- REPO ENGAGEMENT
-- ============================================================================
create table public.repo_views (
  id uuid primary key default uuid_generate_v4(),
  repo_id uuid not null references public.repos(id) on delete cascade,
  view_date date not null default (timezone('utc', now()))::date,
  view_count int not null default 1,
  unique (repo_id, view_date)
);

create index repo_views_repo_date_idx on public.repo_views (repo_id, view_date desc);

alter table public.repo_views enable row level security;

-- Public read for aggregated counts, writes via service role only
create policy "repo_views_select_public" on public.repo_views
  for select using (true);

create table public.repo_upvotes (
  id uuid primary key default uuid_generate_v4(),
  repo_id uuid not null references public.repos(id) on delete cascade,
  ip_hash text not null, -- sha256(ip + daily_salt) -- no PII stored
  created_at timestamptz not null default timezone('utc', now()),
  unique (repo_id, ip_hash)
);

create index repo_upvotes_repo_idx on public.repo_upvotes (repo_id);

alter table public.repo_upvotes enable row level security;

create policy "repo_upvotes_select_public" on public.repo_upvotes
  for select using (true);

-- Inserts via API endpoint that hashes IP server-side

create table public.outbound_clicks (
  id uuid primary key default uuid_generate_v4(),
  repo_id uuid references public.repos(id) on delete set null,
  sponsored_slot_id uuid references public.sponsored_slots(id) on delete set null,
  destination_url text not null,
  is_affiliate boolean not null default false,
  is_sponsored boolean not null default false,
  ip_hash text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default timezone('utc', now())
);

create index outbound_clicks_repo_idx on public.outbound_clicks (repo_id, created_at desc);
create index outbound_clicks_slot_idx on public.outbound_clicks (sponsored_slot_id, created_at desc);

alter table public.outbound_clicks enable row level security;
-- Writes via service role only; reads via admin only

-- ============================================================================
-- NEWSLETTER
-- ============================================================================
create table public.newsletter_subs (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  source text, -- 'homepage', 'category_page', 'repo_page'
  confirmed boolean not null default false,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index newsletter_subs_email_idx on public.newsletter_subs (email);

alter table public.newsletter_subs enable row level security;

-- All operations via service role only

-- ============================================================================
-- JOB BOARD (phase 2, table exists now)
-- ============================================================================
create type job_type as enum ('full_time', 'part_time', 'contract', 'freelance');
create type job_remote as enum ('onsite', 'hybrid', 'remote', 'remote_india');

create table public.job_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  company_logo text,
  title text not null,
  description text not null,
  apply_url text not null,
  location text,
  job_type job_type not null,
  remote job_remote not null,
  salary_min_inr int, -- annual, in INR (not paise here)
  salary_max_inr int,
  required_tags text[] default '{}', -- e.g. ['react', 'supabase']
  amount_paid_inr int not null, -- in paise
  razorpay_payment_id text,
  is_published boolean not null default false,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index job_posts_published_idx on public.job_posts (is_published, expires_at)
  where is_published = true;

create trigger job_posts_updated_at before update on public.job_posts
  for each row execute function public.set_updated_at();

alter table public.job_posts enable row level security;

create policy "job_posts_select_published" on public.job_posts
  for select using (
    is_published = true and expires_at > timezone('utc', now())
    or auth.uid() = user_id
  );

create policy "job_posts_insert_own" on public.job_posts
  for insert with check (auth.uid() = user_id);

create policy "job_posts_update_own" on public.job_posts
  for update using (auth.uid() = user_id);

-- ============================================================================
-- ADMIN VIEW: revenue summary
-- ============================================================================
create or replace view public.revenue_summary as
select
  date_trunc('month', created_at) as month,
  sum(case when status = 'active' then amount_inr else 0 end) / 100.0 as sponsored_inr,
  count(*) filter (where status = 'active') as active_sponsors
from public.sponsored_slots
group by 1
order by 1 desc;

-- Note: view inherits RLS from underlying tables. Admin queries via service role.

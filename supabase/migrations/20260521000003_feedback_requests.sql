-- Feedback requests — from the "missing repo / drop your email" form on /preview.
-- Paste this into Supabase SQL Editor when ready.

create table if not exists public.feedback_requests (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  missing_repo text not null,
  source text,
  user_agent text,
  fulfilled boolean not null default false,
  fulfilled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists feedback_requests_created_idx
  on public.feedback_requests (created_at desc);

create index if not exists feedback_requests_unfulfilled_idx
  on public.feedback_requests (created_at desc) where fulfilled = false;

alter table public.feedback_requests enable row level security;

-- Inserts via service role only (the API route uses service role).
-- No public select — admin reads through Supabase Studio.

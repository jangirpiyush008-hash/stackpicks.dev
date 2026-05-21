-- User-submitted repos for directory consideration.
-- Members submit GitHub repos; admin reviews and may feature them on the homepage.

create table if not exists public.repo_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  full_name text not null,        -- normalized 'owner/repo'
  category_slug text,             -- which category they think it belongs to
  why_recommended text not null,  -- their pitch (50-500 chars)
  url text,                       -- live demo / homepage URL (optional)
  -- Lifecycle
  status text not null default 'pending' check (status in ('pending','approved','featured','rejected')),
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists submissions_user_repo_idx
  on public.repo_submissions (user_id, lower(full_name));
create index if not exists submissions_status_idx
  on public.repo_submissions (status, created_at desc);

create trigger repo_submissions_updated_at before update on public.repo_submissions
  for each row execute function public.set_updated_at();

alter table public.repo_submissions enable row level security;

-- Users can read + insert + update their own submissions (until approved)
create policy "submissions_select_own" on public.repo_submissions
  for select using (auth.uid() = user_id);

create policy "submissions_insert_own" on public.repo_submissions
  for insert with check (auth.uid() = user_id);

create policy "submissions_update_own_pending" on public.repo_submissions
  for update using (auth.uid() = user_id and status = 'pending');

-- Service role bypasses RLS for admin moderation.

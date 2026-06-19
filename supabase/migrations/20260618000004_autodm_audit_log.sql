-- Audit log of sensitive user actions across StackPicks + AutoDM.
-- Captured from server-side handlers; never written from the browser.
-- Service-role only — no public RLS policy.

create table if not exists public.autodm_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_id text,
  ip_hash text,
  user_agent text,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists autodm_audit_log_user_id_idx
  on public.autodm_audit_log (user_id, created_at desc);
create index if not exists autodm_audit_log_action_idx
  on public.autodm_audit_log (action, created_at desc);
alter table public.autodm_audit_log enable row level security;

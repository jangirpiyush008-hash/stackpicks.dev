-- AutoDM Meta data-deletion compliance.
-- Applied 2026-06-18 via MCP. Checked in for fresh-env replay.
--
-- meta_user_id: captured at OAuth time so the data-deletion / deauthorize
-- signed_request callback can find and delete the right tenant(s).
-- autodm_deletion_log: audit trail of every deletion/deauthorize callback.

alter table public.autodm_tenants
  add column if not exists meta_user_id text;
create index if not exists autodm_tenants_meta_user_id_idx
  on public.autodm_tenants (meta_user_id) where meta_user_id is not null;

create table if not exists public.autodm_deletion_log (
  id uuid primary key default gen_random_uuid(),
  confirmation_code text not null unique,
  meta_user_id text,
  tenants_deleted int not null default 0,
  kind text not null default 'data_deletion',
  raw jsonb,
  created_at timestamptz not null default now()
);
alter table public.autodm_deletion_log enable row level security;
-- Service-role only; no public policy = no anon/auth access.

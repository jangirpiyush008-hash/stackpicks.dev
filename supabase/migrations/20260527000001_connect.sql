-- StackPicks Connect: OAuth connections + per-user MCP API keys + audit log.
--
-- Token storage strategy:
--   We delegate raw OAuth token storage to Nango. We only persist a
--   `nango_connection_id` per (user, provider, account_label). When the
--   MCP gateway needs to call a provider, it asks Nango for a fresh
--   access token using the service-role key. Tokens never live in our
--   Postgres. This keeps our security surface small and lets us swap
--   the broker (Composio, Pipedream Connect) later without schema change.
--
-- All tables are RLS-on with owner-scoped policies.

-- ---------------------------------------------------------------------------
-- 1. oauth_connections — one row per (user, provider, account)
-- ---------------------------------------------------------------------------
create table if not exists public.oauth_connections (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  provider              text not null,                  -- 'github' | 'gmail' | …
  nango_connection_id   text,                           -- null until token broker wires in
  account_label         text not null,                  -- 'piyush@gmail.com' / 'org-name'
  scopes                text[] not null default '{}',
  status                text not null default 'pending' check (status in ('pending','active','expired','revoked','error')),
  last_error            text,
  connected_at          timestamptz not null default now(),
  last_used_at          timestamptz,
  unique (user_id, provider, account_label)
);

create index if not exists oauth_connections_user_idx
  on public.oauth_connections (user_id, status);

create index if not exists oauth_connections_provider_idx
  on public.oauth_connections (provider, status);

alter table public.oauth_connections enable row level security;

-- Owner reads + manages own connections.
drop policy if exists "oauth_connections_select_own" on public.oauth_connections;
create policy "oauth_connections_select_own"
  on public.oauth_connections for select
  using (auth.uid() = user_id);

drop policy if exists "oauth_connections_insert_own" on public.oauth_connections;
create policy "oauth_connections_insert_own"
  on public.oauth_connections for insert
  with check (auth.uid() = user_id);

drop policy if exists "oauth_connections_update_own" on public.oauth_connections;
create policy "oauth_connections_update_own"
  on public.oauth_connections for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "oauth_connections_delete_own" on public.oauth_connections;
create policy "oauth_connections_delete_own"
  on public.oauth_connections for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.oauth_connections to authenticated;
grant all on public.oauth_connections to service_role;

-- ---------------------------------------------------------------------------
-- 2. stackpicks_api_keys — per-user MCP gateway keys (sp_live_…)
-- ---------------------------------------------------------------------------
create table if not exists public.stackpicks_api_keys (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null default 'Default',
  key_prefix   text not null,                           -- 'sp_live_XXXX' first 12 chars (shown in UI)
  key_hash     text not null unique,                    -- sha-256 of the raw key
  last_used_at timestamptz,
  revoked_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists stackpicks_api_keys_user_idx
  on public.stackpicks_api_keys (user_id, revoked_at);

alter table public.stackpicks_api_keys enable row level security;

-- Owners can read metadata (never the raw key — only returned once at create time).
drop policy if exists "stackpicks_api_keys_select_own" on public.stackpicks_api_keys;
create policy "stackpicks_api_keys_select_own"
  on public.stackpicks_api_keys for select
  using (auth.uid() = user_id);

drop policy if exists "stackpicks_api_keys_update_own" on public.stackpicks_api_keys;
create policy "stackpicks_api_keys_update_own"
  on public.stackpicks_api_keys for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- INSERTs happen via service-role API route only (hashed write).
-- DELETE not allowed; use revoke (set revoked_at) instead.
grant select, update on public.stackpicks_api_keys to authenticated;
grant all on public.stackpicks_api_keys to service_role;

-- ---------------------------------------------------------------------------
-- 3. mcp_audit_log — every tool call routed through the gateway
-- ---------------------------------------------------------------------------
create table if not exists public.mcp_audit_log (
  id           bigserial primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  api_key_id   uuid references public.stackpicks_api_keys(id) on delete set null,
  provider     text not null,
  tool_name    text not null,
  status       text not null check (status in ('ok','error','rate_limited','unauthorized')),
  latency_ms   integer,
  error_code   text,
  request_id   text,                                    -- for debugging from MCP client
  created_at   timestamptz not null default now()
);

create index if not exists mcp_audit_log_user_time_idx
  on public.mcp_audit_log (user_id, created_at desc);

create index if not exists mcp_audit_log_provider_idx
  on public.mcp_audit_log (provider, created_at desc);

alter table public.mcp_audit_log enable row level security;

-- Read-own (so /dashboard/connections can show recent activity).
drop policy if exists "mcp_audit_log_select_own" on public.mcp_audit_log;
create policy "mcp_audit_log_select_own"
  on public.mcp_audit_log for select
  using (auth.uid() = user_id);

-- Writes only via service-role (the MCP gateway).
grant select on public.mcp_audit_log to authenticated;
grant all on public.mcp_audit_log to service_role;

-- ---------------------------------------------------------------------------
-- 4. mcp_waitlist — users requesting a 'soon' provider be wired next
-- ---------------------------------------------------------------------------
create table if not exists public.mcp_waitlist (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete set null,
  provider    text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, provider)
);

create index if not exists mcp_waitlist_provider_idx
  on public.mcp_waitlist (provider);

alter table public.mcp_waitlist enable row level security;

drop policy if exists "mcp_waitlist_select_own" on public.mcp_waitlist;
create policy "mcp_waitlist_select_own"
  on public.mcp_waitlist for select
  using (auth.uid() = user_id);

drop policy if exists "mcp_waitlist_insert_own" on public.mcp_waitlist;
create policy "mcp_waitlist_insert_own"
  on public.mcp_waitlist for insert
  with check (auth.uid() = user_id);

grant select, insert on public.mcp_waitlist to authenticated;
grant all on public.mcp_waitlist to service_role;

-- StackPicks as an OAuth 2.1 Authorization Server for MCP.
--
-- Lets AI clients (Claude, Cursor) connect to the generic MCP URL
-- (https://stackpicks.dev/api/mcp) and authenticate the END USER via a
-- browser OAuth flow — no per-user API key to copy. Implements the subset
-- of OAuth 2.1 the MCP spec requires: Dynamic Client Registration (RFC 7591),
-- Authorization Code + PKCE, and opaque access tokens.
--
-- All three tables are service-role managed (the OAuth endpoints run with
-- the service client). RLS on, no public policies — clients never touch
-- these directly.

-- ---------------------------------------------------------------------------
-- 1. oauth_clients — dynamically registered MCP clients (Claude, Cursor…)
-- ---------------------------------------------------------------------------
create table if not exists public.oauth_clients (
  client_id        text primary key,              -- we generate (random)
  client_name      text,
  redirect_uris    text[] not null default '{}',
  grant_types      text[] not null default '{authorization_code,refresh_token}',
  token_endpoint_auth_method text not null default 'none', -- public clients (PKCE)
  created_at       timestamptz not null default now()
);
alter table public.oauth_clients enable row level security;
grant all on public.oauth_clients to service_role;

-- ---------------------------------------------------------------------------
-- 2. oauth_auth_codes — short-lived authorization codes (PKCE)
-- ---------------------------------------------------------------------------
create table if not exists public.oauth_auth_codes (
  code                  text primary key,          -- random, single-use
  user_id               uuid not null references auth.users(id) on delete cascade,
  client_id             text not null,
  redirect_uri          text not null,
  code_challenge        text not null,             -- PKCE S256 challenge
  code_challenge_method text not null default 'S256',
  scope                 text,
  resource              text,
  expires_at            timestamptz not null,      -- ~10 min TTL
  used                  boolean not null default false,
  created_at            timestamptz not null default now()
);
create index if not exists oauth_auth_codes_expiry_idx on public.oauth_auth_codes (expires_at);
alter table public.oauth_auth_codes enable row level security;
grant all on public.oauth_auth_codes to service_role;

-- ---------------------------------------------------------------------------
-- 3. mcp_oauth_tokens — issued access + refresh tokens (hashed)
-- ---------------------------------------------------------------------------
create table if not exists public.mcp_oauth_tokens (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  client_id       text not null,
  access_hash     text not null unique,            -- sha-256 of access token
  refresh_hash    text unique,                     -- sha-256 of refresh token
  scope           text,
  access_expires_at  timestamptz not null,         -- ~30 days
  refresh_expires_at timestamptz,                  -- ~1 year
  revoked_at      timestamptz,
  last_used_at    timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists mcp_oauth_tokens_user_idx on public.mcp_oauth_tokens (user_id, revoked_at);
alter table public.mcp_oauth_tokens enable row level security;

-- Owners may read their own token metadata (for a "connected agents" list).
drop policy if exists "mcp_oauth_tokens_select_own" on public.mcp_oauth_tokens;
create policy "mcp_oauth_tokens_select_own"
  on public.mcp_oauth_tokens for select
  using (auth.uid() = user_id);

grant select on public.mcp_oauth_tokens to authenticated;
grant all on public.mcp_oauth_tokens to service_role;

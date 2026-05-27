// Server-side helpers for the Connect feature. RLS-friendly: we read via the
// user-context Supabase client (cookies), then fall back to service-role only
// where strictly needed (key issuance writes).

import 'server-only';
import { getSupabaseServer } from './supabase-server';
import { adminClient } from '@stackpicks/core/db';

export interface ConnectionRow {
  id: string;
  provider: string;
  account_label: string;
  status: string;
  scopes: string[];
  connected_at: string;
  last_used_at: string | null;
}

export interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

/** Returns the signed-in user's id, or null if anon. Never throws. */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** All non-revoked connections for the signed-in user. Empty array for anon. */
export async function listConnections(): Promise<ConnectionRow[]> {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // RLS limits this to own rows already, but be explicit.
  const { data, error } = await supabase
    .from('oauth_connections')
    .select('id, provider, account_label, status, scopes, connected_at, last_used_at')
    .eq('user_id', user.id)
    .neq('status', 'revoked')
    .order('connected_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ConnectionRow[];
}

/** Map slug → connection summary, for the directory grid. */
export function connectionsBySlug(rows: ConnectionRow[]) {
  const map: Record<string, { id: string; accountLabel: string; status: string }> = {};
  for (const r of rows) {
    map[r.provider] = { id: r.id, accountLabel: r.account_label, status: r.status };
  }
  return map;
}

/** Non-revoked API key metadata for current user (no raw keys, ever). */
export async function listApiKeys(): Promise<ApiKeyRow[]> {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('stackpicks_api_keys')
    .select('id, name, key_prefix, last_used_at, revoked_at, created_at')
    .eq('user_id', user.id)
    .is('revoked_at', null)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ApiKeyRow[];
}

/** Recent audit log lines for /dashboard/connections. */
export async function recentAuditLog(limit = 25) {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Use admin client; the audit log is service-role-write but user-readable
  // via RLS. We just need to bypass select column restrictions if any.
  const admin = adminClient();
  const { data } = await admin
    .from('mcp_audit_log')
    .select('id, provider, tool_name, status, latency_ms, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

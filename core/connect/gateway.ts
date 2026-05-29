// Shared gateway logic — used by BOTH the REST endpoints (/api/mcp/v1/*)
// and the remote MCP-over-HTTP server (/api/mcp/s/[key]). Keeps tool
// resolution + execution + audit logging in one place (DRY).

import { adminClient } from '../db';
import { toolsForProviders, getToolByName, type ConnectTool, type Provider } from './tools';
import { executeTool, type ExecResult } from './executors';
import { getAccessToken, nangoConfigured } from '../nango/client';
import { isApiKeyProvider } from './providers';
import { decryptSecret } from './crypto';

export interface GatewayUser {
  userId: string;
  // FK to stackpicks_api_keys. For OAuth-token callers (generic /api/mcp),
  // pass null — those tokens live in mcp_oauth_tokens, not the api_keys table,
  // so we can't reference them here without violating the FK.
  apiKeyId: string | null;
}

/** Tools available to a user — union of active OAuth + API-key connections. */
export async function resolveTools(userId: string): Promise<ConnectTool[]> {
  const admin = adminClient();
  const [oauth, apikey] = await Promise.all([
    admin.from('oauth_connections').select('provider').eq('user_id', userId).eq('status', 'active'),
    admin.from('api_key_connections').select('provider').eq('user_id', userId).eq('status', 'active'),
  ]);

  const activeProviders = new Set<Provider>(
    [...(oauth.data ?? []), ...(apikey.data ?? [])]
      .map((c) => c.provider as Provider)
      .filter(Boolean),
  );
  return toolsForProviders(activeProviders);
}

/** Run a tool call end-to-end: resolve connection, fetch token, execute, audit. */
export async function runToolCall(
  user: GatewayUser,
  toolName: string,
  args: Record<string, unknown>,
  requestId?: string,
): Promise<ExecResult> {
  const startedAt = Date.now();
  const tool = getToolByName(toolName);
  if (!tool) {
    return { ok: false, is_error: true, error: `Unknown tool: ${toolName}` };
  }

  const admin = adminClient();
  let accessToken: string;

  if (isApiKeyProvider(tool.provider)) {
    // API-key provider — fetch the user's encrypted key, decrypt, use directly.
    const { data: conn } = await admin
      .from('api_key_connections')
      .select('id, key_cipher')
      .eq('user_id', user.userId)
      .eq('provider', tool.provider)
      .eq('status', 'active')
      .maybeSingle();

    if (!conn) {
      await logAudit(user, tool.provider, toolName, 'unauthorized', null, 'no_active_connection', requestId);
      return {
        ok: false,
        is_error: true,
        error: `No active ${tool.provider} connection. Add your API key at https://stackpicks.dev/connect.`,
      };
    }
    try {
      accessToken = decryptSecret(conn.key_cipher as string);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await logAudit(user, tool.provider, toolName, 'unauthorized', Date.now() - startedAt, msg, requestId);
      return { ok: false, is_error: true, error: `Could not read stored key: ${msg}` };
    }
    admin.from('api_key_connections').update({ last_used_at: new Date().toISOString() }).eq('id', conn.id)
      .then(() => undefined, () => undefined);
  } else {
    // OAuth provider — resolve a fresh token via Nango.
    const { data: conn } = await admin
      .from('oauth_connections')
      .select('id, nango_connection_id, status')
      .eq('user_id', user.userId)
      .eq('provider', tool.provider)
      .eq('status', 'active')
      .order('connected_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!conn) {
      await logAudit(user, tool.provider, toolName, 'unauthorized', null, 'no_active_connection', requestId);
      return {
        ok: false,
        is_error: true,
        error: `No active ${tool.provider} connection. Connect at https://stackpicks.dev/connect.`,
      };
    }
    try {
      if (!nangoConfigured()) throw new Error('OAuth broker not configured on the server.');
      if (!conn.nango_connection_id) throw new Error('Connection missing — please reconnect.');
      accessToken = await getAccessToken({
        connectionId: conn.nango_connection_id as string,
        provider: tool.provider,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await logAudit(user, tool.provider, toolName, 'unauthorized', Date.now() - startedAt, msg, requestId);
      return { ok: false, is_error: true, error: msg };
    }
    admin.from('oauth_connections').update({ last_used_at: new Date().toISOString() }).eq('id', conn.id)
      .then(() => undefined, () => undefined);
  }

  const result = await executeTool(tool.provider, toolName, args, accessToken);
  const latency = Date.now() - startedAt;
  await logAudit(
    user,
    tool.provider,
    toolName,
    result.ok ? 'ok' : 'error',
    latency,
    result.error ?? null,
    requestId,
  );

  return result;
}

async function logAudit(
  user: GatewayUser,
  provider: string,
  toolName: string,
  status: 'ok' | 'error' | 'rate_limited' | 'unauthorized',
  latencyMs: number | null,
  errorCode: string | null,
  requestId?: string,
) {
  const admin = adminClient();
  await admin
    .from('mcp_audit_log')
    .insert({
      user_id: user.userId,
      api_key_id: user.apiKeyId,
      provider,
      tool_name: toolName,
      status,
      latency_ms: latencyMs,
      error_code: errorCode,
      request_id: requestId ?? null,
    })
    .then(() => undefined, () => undefined);
}

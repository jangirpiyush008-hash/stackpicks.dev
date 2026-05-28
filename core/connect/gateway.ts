// Shared gateway logic — used by BOTH the REST endpoints (/api/mcp/v1/*)
// and the remote MCP-over-HTTP server (/api/mcp/s/[key]). Keeps tool
// resolution + execution + audit logging in one place (DRY).

import { adminClient } from '../db';
import { toolsForProviders, getToolByName, type ConnectTool, type Provider } from './tools';
import { executeTool, type ExecResult } from './executors';
import { getAccessToken, nangoConfigured } from '../nango/client';

export interface GatewayUser {
  userId: string;
  apiKeyId: string;
}

/** Tools available to a user, based on their active OAuth connections. */
export async function resolveTools(userId: string): Promise<ConnectTool[]> {
  const admin = adminClient();
  const { data: conns } = await admin
    .from('oauth_connections')
    .select('provider')
    .eq('user_id', userId)
    .eq('status', 'active');

  const activeProviders = new Set<Provider>(
    (conns ?? []).map((c) => c.provider as Provider).filter(Boolean),
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

  let accessToken: string;
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

  admin
    .from('oauth_connections')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', conn.id)
    .then(() => undefined, () => undefined);

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

import { NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { verifyApiKey, bearerFromRequest } from '@stackpicks/core/connect/auth';
import { getToolByName } from '@stackpicks/core/connect/tools';
import { executeTool } from '@stackpicks/core/connect/executors';
import { getAccessToken, nangoConfigured } from '@stackpicks/core/nango/client';

/**
 * POST /api/mcp/v1/exec
 *
 * Body: { tool_name: string, args: object, request_id?: string }
 *
 * Executes a tool call on behalf of the authenticated user:
 *   1. Verify API key   → userId
 *   2. Resolve tool     → provider
 *   3. Look up user's connection for that provider
 *   4. Get fresh access token from Nango
 *   5. Run the provider executor
 *   6. Write audit log row
 *
 * Latency target: <800ms p95. Most of that is the provider API itself.
 */
export async function POST(req: Request) {
  const startedAt = Date.now();
  const raw = bearerFromRequest(req);
  if (!raw) return new NextResponse('missing bearer token', { status: 401 });

  const ctx = await verifyApiKey(raw);
  if (!ctx) return new NextResponse('invalid or revoked API key', { status: 401 });

  let body: { tool_name?: string; args?: Record<string, unknown>; request_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const toolName = body.tool_name;
  const args = body.args ?? {};
  if (!toolName) {
    return NextResponse.json({ ok: false, error: 'missing tool_name' }, { status: 400 });
  }

  const tool = getToolByName(toolName);
  if (!tool) {
    return NextResponse.json(
      { ok: false, error: `Unknown tool: ${toolName}` },
      { status: 404 },
    );
  }

  const admin = adminClient();

  // Find this user's active connection for the tool's provider.
  const { data: conn } = await admin
    .from('oauth_connections')
    .select('id, nango_connection_id, status, account_label')
    .eq('user_id', ctx.userId)
    .eq('provider', tool.provider)
    .eq('status', 'active')
    .order('connected_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!conn) {
    await logAudit(ctx, tool.provider, toolName, 'unauthorized', null, 'no_active_connection');
    return NextResponse.json(
      {
        ok: false,
        is_error: true,
        error: `No active ${tool.provider} connection. Connect at https://stackpicks.dev/connect.`,
      },
      { status: 200 }, // 200 so MCP client surfaces the error message to the user
    );
  }

  // Resolve a fresh access token via Nango.
  let accessToken: string;
  try {
    if (!nangoConfigured()) {
      throw new Error('OAuth broker not yet configured on the server. (Phase 1 setup pending.)');
    }
    if (!conn.nango_connection_id) {
      throw new Error('Connection has no Nango ID — please reconnect from /dashboard/connections.');
    }
    accessToken = await getAccessToken({
      connectionId: conn.nango_connection_id as string,
      provider: tool.provider,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logAudit(ctx, tool.provider, toolName, 'unauthorized', Date.now() - startedAt, msg);
    return NextResponse.json(
      { ok: false, is_error: true, error: msg },
      { status: 200 },
    );
  }

  // Run the executor.
  const result = await executeTool(tool.provider, toolName, args, accessToken);
  const latency = Date.now() - startedAt;

  await logAudit(
    ctx,
    tool.provider,
    toolName,
    result.ok ? 'ok' : 'error',
    latency,
    result.error ?? null,
    body.request_id,
  );

  // Update connection.last_used_at — fire and forget.
  admin
    .from('oauth_connections')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', conn.id)
    .then(() => undefined, () => undefined);

  return NextResponse.json(result);
}

async function logAudit(
  ctx: { userId: string; apiKeyId: string },
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
      user_id: ctx.userId,
      api_key_id: ctx.apiKeyId,
      provider,
      tool_name: toolName,
      status,
      latency_ms: latencyMs,
      error_code: errorCode,
      request_id: requestId ?? null,
    })
    .then(() => undefined, () => undefined);
}

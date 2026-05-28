import { NextResponse } from 'next/server';
import { verifyApiKey, bearerFromRequest } from '@stackpicks/core/connect/auth';
import { runToolCall } from '@stackpicks/core/connect/gateway';

/**
 * POST /api/mcp/v1/exec   { tool_name, args, request_id? }
 *
 * REST flavour of the gateway, used by the @stackpicks/mcp npm package.
 * Shares all execution logic with the remote MCP server via runToolCall.
 */
export async function POST(req: Request) {
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

  if (!body.tool_name) {
    return NextResponse.json({ ok: false, error: 'missing tool_name' }, { status: 400 });
  }

  const result = await runToolCall(
    { userId: ctx.userId, apiKeyId: ctx.apiKeyId },
    body.tool_name,
    body.args ?? {},
    body.request_id,
  );

  return NextResponse.json(result);
}

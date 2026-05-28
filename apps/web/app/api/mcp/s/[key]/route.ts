import { NextResponse } from 'next/server';
import { verifyApiKey } from '@stackpicks/core/connect/auth';
import { resolveTools, runToolCall } from '@stackpicks/core/connect/gateway';

/**
 * Remote MCP server (Streamable HTTP transport).
 *
 *   URL:  https://stackpicks.dev/api/mcp/s/<sp_live_key>
 *
 * Paste that URL into Claude's "Add custom connector", Cursor's remote MCP
 * field, or any MCP client that supports HTTP transport. The API key lives
 * in the path (same pattern as Zapier's MCP). No npx, works on web + mobile.
 *
 * Implements the JSON-RPC methods Claude calls:
 *   initialize, notifications/initialized, ping, tools/list, tools/call
 *
 * We respond with plain application/json (single response per request) —
 * sufficient for a stateless tool gateway. No server-initiated streaming
 * needed, so we don't open an SSE channel.
 */

const PROTOCOL_VERSION = '2024-11-05';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, mcp-protocol-version',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
};

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

function rpcResult(id: string | number | null | undefined, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, result }, { headers: CORS });
}

function rpcError(id: string | number | null | undefined, code: number, message: string) {
  return NextResponse.json(
    { jsonrpc: '2.0', id: id ?? null, error: { code, message } },
    { headers: CORS },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// Some clients probe with GET to open an SSE stream. We're stateless, so we
// just return 200 with a hint. Claude uses POST for the real protocol.
export async function GET() {
  return new NextResponse('StackPicks MCP — use POST (JSON-RPC) or paste this URL into a custom connector.', {
    status: 200,
    headers: CORS,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  // Auth — key is in the URL path.
  const ctx = await verifyApiKey(key);
  if (!ctx) return rpcError(null, -32001, 'Invalid or revoked StackPicks API key');

  let body: JsonRpcRequest;
  try {
    body = (await req.json()) as JsonRpcRequest;
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  const { id, method, params: rpcParams } = body;

  switch (method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion:
          (rpcParams?.protocolVersion as string) || PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'stackpicks', version: '0.1.0' },
        instructions:
          'StackPicks Connect — one MCP for all your connected apps. Tools appear based on which apps you have connected at stackpicks.dev/connect.',
      });

    case 'notifications/initialized':
    case 'notifications/cancelled':
      // Notifications have no id and expect no response body.
      return new NextResponse(null, { status: 202, headers: CORS });

    case 'ping':
      return rpcResult(id, {});

    case 'tools/list': {
      const tools = await resolveTools(ctx.userId);
      return rpcResult(id, { tools });
    }

    case 'tools/call': {
      const name = rpcParams?.name as string | undefined;
      const args = (rpcParams?.arguments as Record<string, unknown>) ?? {};
      if (!name) return rpcError(id, -32602, 'Missing tool name');

      const result = await runToolCall(
        { userId: ctx.userId, apiKeyId: ctx.apiKeyId },
        name,
        args,
        typeof id === 'string' ? id : undefined,
      );

      // MCP tools/call result shape.
      return rpcResult(id, {
        content: result.content ?? [{ type: 'text', text: result.error ?? '' }],
        isError: !result.ok || !!result.is_error,
      });
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

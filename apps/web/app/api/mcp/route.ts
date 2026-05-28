import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@stackpicks/core/oauth/server';
import { resolveTools, runToolCall } from '@stackpicks/core/connect/gateway';
import { SITE } from '@stackpicks/core/constants';

/**
 * Generic remote MCP endpoint — OAuth-authenticated.
 *
 *   URL: https://stackpicks.dev/api/mcp   ← same for everyone
 *
 * Paste this single URL into Claude's custom connector. Claude discovers our
 * OAuth server (via /.well-known/*), registers, runs the browser login flow,
 * gets a bearer token, and includes it on every request here.
 *
 * Unauthenticated requests get a 401 with a WWW-Authenticate header pointing
 * at the protected-resource metadata — that's what kicks off Claude's OAuth.
 */

const PROTOCOL_VERSION = '2024-11-05';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, mcp-protocol-version',
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
  return NextResponse.json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } }, { headers: CORS });
}

function unauthorized() {
  // RFC 9728 — point clients at the protected-resource metadata so they can
  // discover the auth server and start the OAuth flow.
  return new NextResponse(
    JSON.stringify({ error: 'unauthorized', error_description: 'OAuth required' }),
    {
      status: 401,
      headers: {
        ...CORS,
        'Content-Type': 'application/json',
        'WWW-Authenticate': `Bearer resource_metadata="${SITE.url}/.well-known/oauth-protected-resource"`,
      },
    },
  );
}

function bearer(req: Request): string | null {
  const h = req.headers.get('authorization') ?? '';
  const m = /^Bearer\s+(.+)$/i.exec(h.trim());
  return m ? m[1] : null;
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export function GET(req: Request) {
  // Probe / SSE-open attempts: require auth too, so Claude triggers OAuth.
  const token = bearer(req);
  if (!token) return unauthorized();
  return new NextResponse('StackPicks MCP — use POST for JSON-RPC.', { status: 200, headers: CORS });
}

export async function POST(req: Request) {
  const token = bearer(req);
  if (!token) return unauthorized();

  const ctx = await verifyAccessToken(token);
  if (!ctx) return unauthorized();

  let body: JsonRpcRequest;
  try {
    body = (await req.json()) as JsonRpcRequest;
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  const { id, method, params } = body;

  switch (method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: (params?.protocolVersion as string) || PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'stackpicks', version: '0.1.0' },
        instructions:
          'StackPicks Connect — one MCP for all your connected apps. Tools appear based on the apps you connected at stackpicks.dev/connect.',
      });

    case 'notifications/initialized':
    case 'notifications/cancelled':
      return new NextResponse(null, { status: 202, headers: CORS });

    case 'ping':
      return rpcResult(id, {});

    case 'tools/list': {
      const tools = await resolveTools(ctx.userId);
      return rpcResult(id, { tools });
    }

    case 'tools/call': {
      const name = params?.name as string | undefined;
      const args = (params?.arguments as Record<string, unknown>) ?? {};
      if (!name) return rpcError(id, -32602, 'Missing tool name');
      const result = await runToolCall(
        { userId: ctx.userId, apiKeyId: ctx.tokenId },
        name,
        args,
        typeof id === 'string' ? id : undefined,
      );
      return rpcResult(id, {
        content: result.content ?? [{ type: 'text', text: result.error ?? '' }],
        isError: !result.ok || !!result.is_error,
      });
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

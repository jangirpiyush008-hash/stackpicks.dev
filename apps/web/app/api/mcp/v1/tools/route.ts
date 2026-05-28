import { NextResponse } from 'next/server';
import { verifyApiKey, bearerFromRequest } from '@stackpicks/core/connect/auth';
import { resolveTools } from '@stackpicks/core/connect/gateway';

/**
 * GET /api/mcp/v1/tools
 *
 * Called by @stackpicks/mcp on every tools/list request. Returns the union
 * of tools available to the authenticated user — based on which OAuth
 * connections they have in 'active' status.
 *
 * Auth: Bearer sp_live_… in the Authorization header.
 */
export async function GET(req: Request) {
  const raw = bearerFromRequest(req);
  if (!raw) return new NextResponse('missing bearer token', { status: 401 });

  const ctx = await verifyApiKey(raw);
  if (!ctx) return new NextResponse('invalid or revoked API key', { status: 401 });

  const tools = await resolveTools(ctx.userId);

  return NextResponse.json(
    {
      tools,
      user: { id: ctx.userId },
    },
    {
      // Allow MCP clients to cache for a few seconds — newly connected apps
      // still appear on the next list call. Keeps the gateway cheap.
      headers: { 'Cache-Control': 'private, max-age=5' },
    },
  );
}

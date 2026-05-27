import { NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { verifyApiKey, bearerFromRequest } from '@stackpicks/core/connect/auth';
import { toolsForProviders, type Provider } from '@stackpicks/core/connect/tools';

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

  const admin = adminClient();
  const { data: conns } = await admin
    .from('oauth_connections')
    .select('provider')
    .eq('user_id', ctx.userId)
    .eq('status', 'active');

  const activeProviders = new Set<Provider>(
    (conns ?? []).map((c) => c.provider as Provider).filter(Boolean),
  );

  const tools = toolsForProviders(activeProviders);

  return NextResponse.json(
    {
      tools,
      user: { id: ctx.userId },
      active_providers: Array.from(activeProviders),
    },
    {
      // Allow MCP clients to cache for a few seconds — newly connected apps
      // still appear on the next list call. Keeps the gateway cheap.
      headers: { 'Cache-Control': 'private, max-age=5' },
    },
  );
}

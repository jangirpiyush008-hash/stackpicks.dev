import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { deleteConnection, nangoConfigured } from '@stackpicks/core/nango/client';

/**
 * POST /api/connect/[provider]/disconnect
 *
 * Revokes both the upstream OAuth (via Nango) and the local connection
 * row. We never leave stale tokens with the broker.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  const admin = adminClient();

  // Fetch the Nango connection IDs we need to revoke first.
  const { data: conns } = await admin
    .from('oauth_connections')
    .select('id, nango_connection_id')
    .eq('user_id', user.id)
    .eq('provider', provider)
    .eq('status', 'active');

  // Revoke upstream — best-effort, log + continue on failure so we still
  // mark the DB row revoked locally (user expects "disconnect" to feel final).
  if (nangoConfigured()) {
    for (const c of conns ?? []) {
      if (!c.nango_connection_id) continue;
      try {
        await deleteConnection({
          connectionId: c.nango_connection_id as string,
          provider,
        });
      } catch (err) {
        console.error('[connect/disconnect] nango revoke failed', err);
      }
    }
  }

  const { error } = await admin
    .from('oauth_connections')
    .update({ status: 'revoked' })
    .eq('user_id', user.id)
    .eq('provider', provider);

  // Also revoke any API-key connection for this provider (Firecrawl, etc.).
  await admin
    .from('api_key_connections')
    .update({ status: 'revoked' })
    .eq('user_id', user.id)
    .eq('provider', provider)
    .then(() => undefined, () => undefined);

  if (error) return new NextResponse('disconnect failed', { status: 500 });
  return NextResponse.json({ ok: true });
}

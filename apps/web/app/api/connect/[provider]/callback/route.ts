import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getAppBySlug } from '../../../../../lib/connect-apps';

/**
 * GET /api/connect/[provider]/callback
 *
 * OAuth callback. With Nango, this is largely a no-op — Nango stores the
 * token and fires a webhook to us. We just persist the connection metadata
 * once the popup closes.
 *
 * Until Nango wires in, this endpoint is a STUB that accepts a
 * `?connection_id=` param and writes a pending row. Useful for local dev
 * + smoke-testing the UI flow end-to-end.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const app = getAppBySlug(provider);
  if (!app) return new NextResponse('unknown provider', { status: 404 });

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('unauthorized', { status: 401 });

  const url = new URL(req.url);
  const nangoConnectionId = url.searchParams.get('connection_id');
  const accountLabel = url.searchParams.get('account_label') ?? user.email ?? 'connected';
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/connect?error=${encodeURIComponent(error)}`, req.url));
  }

  const admin = adminClient();
  const { error: dbErr } = await admin
    .from('oauth_connections')
    .upsert(
      {
        user_id: user.id,
        provider,
        nango_connection_id: nangoConnectionId,
        account_label: accountLabel,
        status: nangoConnectionId ? 'active' : 'pending',
        connected_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider,account_label' },
    );

  if (dbErr) {
    console.error('[connect/callback] upsert failed', dbErr.message);
    return NextResponse.redirect(new URL(`/connect?error=db`, req.url));
  }

  return NextResponse.redirect(new URL(`/connect?connected=${provider}`, req.url));
}

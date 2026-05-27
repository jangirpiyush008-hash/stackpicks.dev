import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';

/**
 * POST /api/connect/[provider]/disconnect
 *
 * Soft-revokes the user's connection for a provider. We also notify Nango
 * (once wired) so the upstream OAuth token is revoked too — leaving stale
 * tokens with the broker is a security smell.
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

  // TODO(nango): call nango.deleteConnection(provider, user.id) before this.

  const { error } = await admin
    .from('oauth_connections')
    .update({ status: 'revoked' })
    .eq('user_id', user.id)
    .eq('provider', provider);

  if (error) return new NextResponse('disconnect failed', { status: 500 });
  return NextResponse.json({ ok: true });
}

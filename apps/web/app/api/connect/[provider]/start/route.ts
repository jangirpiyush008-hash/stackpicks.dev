import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase-server';
import { getAppBySlug } from '../../../../../lib/connect-apps';

/**
 * GET /api/connect/[provider]/start
 *
 * Begins the OAuth handshake for a connected app.
 *
 * MVP stub: until Nango (or Composio) is fully wired, we redirect the user
 * to a "coming soon" landing instead of hitting a half-built OAuth flow.
 * Wiring Nango means setting:
 *   NANGO_HOST, NANGO_SECRET_KEY, NANGO_PUBLIC_KEY
 * and rewriting this handler to call:
 *   nango.create({ providerConfigKey: provider, connectionId: userId })
 * then return their hosted-auth URL.
 *
 * Anon callers are bounced to /login with redirect back.
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
  if (!user) {
    const back = `/connect?after=${provider}`;
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(back)}`, req.url));
  }

  if (app.status !== 'live') {
    return NextResponse.redirect(new URL(`/connect?soon=${provider}`, req.url));
  }

  // TODO(nango): replace with actual broker.
  // For MVP launch, we land on a holding page that explains we're wiring this
  // specific provider and offer to notify when it goes live.
  return NextResponse.redirect(new URL(`/connect?pending=${provider}`, req.url));
}

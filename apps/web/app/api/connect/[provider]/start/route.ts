import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase-server';
import { getAppBySlug } from '../../../../../lib/connect-apps';
import { createConnectSession, nangoConfigured } from '@stackpicks/core/nango/client';
import { SITE } from '@stackpicks/core/constants';
import { isConnectLaunched } from '../../../../../lib/connect-roadmap';
import { isAdmin } from '../../../../../lib/admin';

/**
 * GET /api/connect/[provider]/start
 *
 * Kicks off the OAuth handshake via Nango's hosted Connect UI. Flow:
 *   1. Verify the user is logged in (otherwise bounce to /login)
 *   2. Verify the provider exists and is marked 'live'
 *   3. Ask Nango for a one-time Connect session URL
 *   4. Redirect the user there — they approve the OAuth in their browser
 *   5. Nango redirects them to our /callback with ?connection_id=...
 *
 * If NANGO_SECRET_KEY isn't set yet (Phase 1 setup pending), we redirect to
 * /connect?pending=<provider> so the UI can show a helpful message.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const app = getAppBySlug(provider);
  if (!app) return new NextResponse('unknown provider', { status: 404 });

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const back = `/connect?after=${provider}`;
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(back)}`, SITE.url));
  }

  // Launch gate — non-admins can't connect until we publicly launch.
  if (!isConnectLaunched() && !(await isAdmin()).ok) {
    return NextResponse.redirect(new URL(`/connect?soon=${provider}`, SITE.url));
  }

  if (app.status !== 'live') {
    return NextResponse.redirect(new URL(`/connect?soon=${provider}`, SITE.url));
  }

  if (!nangoConfigured()) {
    // Phase 1 setup not yet complete — surface a clear message instead of a
    // half-broken OAuth attempt.
    return NextResponse.redirect(new URL(`/connect?pending=${provider}`, SITE.url));
  }

  try {
    const session = await createConnectSession({
      provider,
      endUserId: user.id,
      endUserEmail: user.email ?? undefined,
      redirectUri: `${SITE.url}/api/connect/${provider}/callback`,
    });
    return NextResponse.redirect(session.url);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'oauth_start_failed';
    return NextResponse.redirect(
      new URL(`/connect?error=${encodeURIComponent(msg)}`, SITE.url),
    );
  }
}

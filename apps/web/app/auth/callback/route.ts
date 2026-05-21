import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase-server';

/**
 * Handles the OAuth + email-link callback from Supabase Auth.
 * Exchanges the `code` query param for a session cookie, then redirects
 * to wherever the sign-in flow wanted to send the user next.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';
  const debug = url.searchParams.get('debug') === '1';

  // Log for Railway debugging — visible in Railway logs.
  console.log(JSON.stringify({
    type: 'auth_callback',
    url: req.url,
    origin: url.origin,
    next,
    has_code: !!code,
    referer: req.headers.get('referer'),
    host: req.headers.get('host'),
    forwarded_host: req.headers.get('x-forwarded-host'),
    forwarded_proto: req.headers.get('x-forwarded-proto'),
  }));

  if (code) {
    const supabase = await getSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Build the post-auth redirect using the host the request actually arrived on.
  // This prevents any stale ${origin} from a redirect chain pointing somewhere unexpected.
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') ?? 'https';
  const finalOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin;

  if (debug) {
    return NextResponse.json({
      diagnostic: {
        request_url: req.url,
        request_origin: url.origin,
        request_host: req.headers.get('host'),
        forwarded_host: forwardedHost,
        forwarded_proto: forwardedProto,
        computed_final_origin: finalOrigin,
        next_path: next,
        would_redirect_to: new URL(next, finalOrigin).toString(),
        referer: req.headers.get('referer'),
      },
      hint: 'If "would_redirect_to" shows the wrong host, check Supabase Site URL + Redirect URLs allowlist.',
    });
  }

  return NextResponse.redirect(new URL(next, finalOrigin));
}

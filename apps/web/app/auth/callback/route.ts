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
  const rawNext = url.searchParams.get('next');
  // Open-redirect defence — only allow same-origin paths through.
  // Anything else (//evil.com, https://..., javascript:, control chars,
  // overlong) falls back to /dashboard. Mirrors lib/security.safeNext.
  const next = (() => {
    if (!rawNext || rawNext.length > 1024 || !rawNext.startsWith('/')) return '/dashboard';
    if (rawNext.startsWith('//') || rawNext.startsWith('/\\')) return '/dashboard';
    if (/[\x00-\x1f]/.test(rawNext)) return '/dashboard';
    return rawNext;
  })();
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
  // Validate against an allowlist — x-forwarded-host is attacker-controllable
  // if our edge isn't strict, so an unvalidated value here is an open-redirect.
  const ALLOWED_HOSTS = new Set([
    'stackpicks.dev', 'autodm.stackpicks.dev',
    'localhost:3000', 'localhost:3001', '127.0.0.1:3000', '127.0.0.1:3001',
  ]);
  const rawForwardedHost = req.headers.get('x-forwarded-host')?.toLowerCase();
  const rawHost = req.headers.get('host')?.toLowerCase();
  const safeHost =
    (rawForwardedHost && ALLOWED_HOSTS.has(rawForwardedHost)) ? rawForwardedHost
    : (rawHost && ALLOWED_HOSTS.has(rawHost))                   ? rawHost
    : 'stackpicks.dev';   // safe default — never trust an unknown host
  const forwardedProto = req.headers.get('x-forwarded-proto') ?? 'https';
  const finalOrigin = `${forwardedProto}://${safeHost}`;
  // Keep these for the (dev-only) ?debug=1 dump below.
  const forwardedHost = rawForwardedHost;

  // ?debug=1 exposes internal routing details — never serve it in production.
  // In dev (NODE_ENV !== 'production') it's still available for local OAuth
  // troubleshooting.
  if (debug && process.env.NODE_ENV !== 'production') {
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

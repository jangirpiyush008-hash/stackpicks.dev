/**
 * Host-aware routing middleware.
 *
 * On autodm.stackpicks.dev:
 *   /              → renders /autodm
 *   /connect       → renders /autodm/connect
 *   /dashboard     → renders /autodm/dashboard
 *   /autodm/connect → renders as-is (when an internal Link bakes the
 *                     /autodm prefix in)
 *
 * The smart bit: if the incoming path already starts with /autodm we
 * leave it alone, so internal <Link href="/autodm/..."/> clicks don't
 * double-rewrite into /autodm/autodm/... → 404.
 *
 * API + static + asset paths are passed through untouched.
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').toLowerCase();
  if (host === 'autodm.stackpicks.dev') {
    const url = req.nextUrl.clone();

    // Pass-through: API routes, Next internals, files with an extension
    if (
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/_vercel/') ||
      /\.[a-zA-Z0-9]+$/.test(url.pathname)
    ) {
      return NextResponse.next();
    }

    // Already at /autodm/* — serve as-is so internal Links don't double-wrap
    if (url.pathname === '/autodm' || url.pathname.startsWith('/autodm/')) {
      return NextResponse.next();
    }

    // Auth pages are shared with the main app — serve them as-is on the
    // subdomain (do NOT rewrite to /autodm/login, which doesn't exist).
    // Login here sets a session cookie scoped to autodm.stackpicks.dev,
    // which the OAuth connect flow (same host) then reads.
    const AUTH_PATHS = ['/login', '/signup', '/auth', '/forgot-password', '/reset-password'];
    if (AUTH_PATHS.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'))) {
      return NextResponse.next();
    }

    // Rewrite naked paths to their /autodm counterpart
    url.pathname = '/autodm' + (url.pathname === '/' ? '' : url.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

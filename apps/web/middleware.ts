/**
 * Host-aware routing middleware + global security layer.
 *
 * Three jobs:
 *   1. URL hardening — drop hostile paths early (null bytes, control chars,
 *      overlong segments) with a plain 400.
 *   2. CSRF / Origin defence — for state-changing requests, the Origin
 *      (or Referer) header must match one of our known hosts. Cookie is
 *      scoped to .stackpicks.dev for SSO, which means SameSite=Lax alone
 *      isn't enough — a malicious autodm page could POST to stackpicks
 *      APIs with the session attached. Origin check blocks this cleanly.
 *   3. Subdomain routing — autodm.stackpicks.dev rewrites naked paths to
 *      /autodm/* so the standalone app feels like its own domain.
 *
 * Trusted-host derivation: prefer the platform-set x-forwarded-host (Railway
 * stamps this from the actual edge hostname); fall back to the raw Host
 * header otherwise. Both are checked against ALLOWED_HOSTS before being
 * trusted for routing.
 */

import { NextRequest, NextResponse } from 'next/server';

const HOSTILE_PATH_RE = /[\x00-\x1f\x7f]|%00|\\\\/;

// Public origins we ever serve from. Anything else is suspicious.
// localhost variants are kept so dev / preview ports keep working.
const ALLOWED_HOSTS = new Set([
  'stackpicks.dev',
  'autodm.stackpicks.dev',
  'localhost:3000',
  'localhost:3001',
  '127.0.0.1:3000',
  '127.0.0.1:3001',
]);

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Public POST endpoints called cross-origin on purpose (webhook receivers
// with their own signature verification). These bypass the Origin check —
// the signature is the real auth.
const PUBLIC_POST_PATHS = [
  '/api/webhook/',                    // Razorpay (signature verified)
  '/api/autodm/webhook',              // Meta IG (signature verified)
  '/api/autodm/billing/webhook',      // Razorpay AutoDM (signature verified)
  '/api/autodm/data-deletion',        // Meta signed_request
  '/api/cron/',                       // Cron jobs (Bearer token)
  '/api/autodm/oauth/callback',       // OAuth provider redirect
  '/auth/callback',                   // Supabase OAuth callback
];

function trustedHost(req: NextRequest): string {
  // Railway sets x-forwarded-host to the real edge hostname. Trust that
  // over the raw Host header — internal Host may be the container's
  // localhost:PORT. If both are absent, return '' so callers know.
  const fwd = req.headers.get('x-forwarded-host')?.toLowerCase();
  if (fwd && ALLOWED_HOSTS.has(fwd)) return fwd;
  const raw = (req.headers.get('host') || '').toLowerCase();
  if (raw && ALLOWED_HOSTS.has(raw)) return raw;
  return '';
}

function originHost(req: NextRequest): string {
  const o = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!o) return '';
  try { return new URL(o).host.toLowerCase(); } catch { return ''; }
}

export function middleware(req: NextRequest) {
  // ───────────────── 1. URL hardening ─────────────────
  const incoming = req.nextUrl;
  if (HOSTILE_PATH_RE.test(incoming.pathname) || incoming.pathname.length > 2048) {
    return new NextResponse('Bad request', { status: 400 });
  }
  for (const [, v] of incoming.searchParams) {
    if (v.length > 4096 || /[\x00-\x1f]/.test(v)) {
      return new NextResponse('Bad request', { status: 400 });
    }
  }

  // ───────────────── 2. CSRF / Origin check on mutations ─────────────────
  if (MUTATION_METHODS.has(req.method)) {
    const path = incoming.pathname;
    const isPublic = PUBLIC_POST_PATHS.some((p) => path.startsWith(p));
    if (!isPublic) {
      const oh = originHost(req);
      // Allow same-host POSTs only. Empty origin (some legacy clients) is
      // rejected too — modern browsers always send Origin on POST.
      if (!oh || !ALLOWED_HOSTS.has(oh)) {
        return new NextResponse('Forbidden — bad origin', { status: 403 });
      }
    }
  }

  // ───────────────── 3. Subdomain routing ─────────────────
  const host = trustedHost(req);
  if (host === 'autodm.stackpicks.dev') {
    const url = req.nextUrl.clone();

    if (
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/_vercel/') ||
      /\.[a-zA-Z0-9]+$/.test(url.pathname)
    ) {
      return NextResponse.next();
    }
    if (url.pathname === '/autodm' || url.pathname.startsWith('/autodm/')) {
      return NextResponse.next();
    }
    const AUTH_PATHS = ['/login', '/signup', '/auth', '/forgot-password', '/reset-password'];
    if (AUTH_PATHS.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'))) {
      return NextResponse.next();
    }
    url.pathname = '/autodm' + (url.pathname === '/' ? '' : url.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

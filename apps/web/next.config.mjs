import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@stackpicks/core'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  // typedRoutes was experimental and caused inconsistent SWC behavior across
  // local vs Railway builds. Disable until Next 16 stabilises it.

  // OAuth discovery — MCP clients (Claude) probe these well-known paths.
  // Route them to our handlers. Some clients also append the resource path
  // (…/oauth-authorization-server/api/mcp), so map that variant too.
  async rewrites() {
    return [
      // ── OAuth discovery (MCP clients probe these well-known paths) ───────
      // Subdomain routing for autodm.stackpicks.dev lives in middleware.ts
      // — it can't be done with path-based rewrites without infinite-loop
      // pitfalls on internal Link clicks.
      {
        source: '/.well-known/oauth-authorization-server',
        destination: '/api/oauth/metadata/authorization-server',
      },
      {
        source: '/.well-known/oauth-authorization-server/:path*',
        destination: '/api/oauth/metadata/authorization-server',
      },
      {
        source: '/.well-known/oauth-protected-resource',
        destination: '/api/oauth/metadata/protected-resource',
      },
      {
        source: '/.well-known/oauth-protected-resource/:path*',
        destination: '/api/oauth/metadata/protected-resource',
      },
    ];
  },

  // Security headers — applied to every response. Tuned so the third-party
  // origins we legitimately use (Supabase, Razorpay, Anthropic, ipapi,
  // PostHog, Plausible, Google Fonts) keep working. Tweak the CSP if you
  // add another origin; never relax frame-ancestors without thought.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://js.stripe.com https://plausible.io https://us.i.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://ipapi.co https://us.i.posthog.com https://plausible.io https://api.anthropic.com",
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
      "object-src 'none'",
      "form-action 'self' https://api.razorpay.com",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ];

    return [{ source: '/(.*)', headers: securityHeaders }];
  },

  // IG carousels reference /mcp/category/<slug> — those don't have dynamic
  // routes yet. 302 redirect them to /mcp (the listing page) until we wire
  // proper category-filtered MCP routes. Avoids 404s on slide-6 swipes.
  async redirects() {
    return [
      { source: '/mcp/category/:slug*', destination: '/mcp', permanent: false },
      // Carousel #1 (Fri Jun 6) slide-6 references this slug — canonical
      // blog lives at /blog/mcp-2-0-explained-2026. Permanent so SEO
      // collapses both to one URL.
      { source: '/blog/mcp-2026-spec-explained', destination: '/blog/mcp-2-0-explained-2026', permanent: true },
    ];
  },
};

export default nextConfig;

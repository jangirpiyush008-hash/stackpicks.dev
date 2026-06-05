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
      // ── autodm.stackpicks.dev → /autodm/* (subdomain serving) ────────────
      // When a request comes in for the autodm.stackpicks.dev hostname,
      // rewrite the path so the user sees clean URLs like
      // autodm.stackpicks.dev/connect (not /autodm/connect). Routes still
      // live under app/autodm/* — only the URL bar changes.
      {
        source: '/',
        has: [{ type: 'host', value: 'autodm.stackpicks.dev' }],
        destination: '/autodm',
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'autodm.stackpicks.dev' }],
        destination: '/autodm/:path*',
      },

      // ── OAuth discovery (MCP clients probe these well-known paths) ───────
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

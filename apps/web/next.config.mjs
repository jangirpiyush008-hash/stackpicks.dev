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
    ];
  },
};

export default nextConfig;

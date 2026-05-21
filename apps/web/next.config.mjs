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
};

export default nextConfig;

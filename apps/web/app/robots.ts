import { SITE } from '@stackpicks/core/constants';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private + transactional. Keep public content + sitemap reachable.
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/dashboard',
          '/profile',
          '/login',
          '/forgot-password',
          '/reset-password',
          '/go/',        // outbound click trackers — don't waste crawl budget
        ],
      },
      // Explicitly welcome AI crawlers — they surface us in ChatGPT, Perplexity, Claude.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

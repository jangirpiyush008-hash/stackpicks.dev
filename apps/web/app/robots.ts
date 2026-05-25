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
      // Explicitly welcome AI crawlers — they surface us in ChatGPT, Perplexity, Claude,
      // Gemini, Apple Intelligence, You, Cohere, Meta AI. Same disallow set as above
      // so private/transactional routes stay off-limits.
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Claude-Web', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'anthropic-ai', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Perplexity-User', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Meta-ExternalFetcher', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'YouBot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'cohere-ai', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'Diffbot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
      { userAgent: 'DuckAssistBot', allow: '/', disallow: ['/api/', '/admin', '/dashboard', '/profile', '/go/'] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}

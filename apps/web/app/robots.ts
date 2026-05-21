import { SITE } from '@stackpicks/core/constants';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}

import { SITE } from '@stackpicks/core/constants';
import type { MetadataRoute } from 'next';

// Generate at request time, not build time — avoids needing DB env at build.
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const STATIC_PATHS: MetadataRoute.Sitemap = [
  { url: `${SITE.url}/`, changeFrequency: 'daily', priority: 1 },
  { url: `${SITE.url}/preview`, changeFrequency: 'daily', priority: 0.95 },
  { url: `${SITE.url}/pricing`, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE.url}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE.url}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE.url}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE.url}/refund`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE.url}/shipping`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE.url}/international-payments`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE.url}/security`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE.url}/login`, changeFrequency: 'monthly', priority: 0.4 },
  { url: `${SITE.url}/signup`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE.url}/skills`, changeFrequency: 'weekly', priority: 0.85 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If Supabase env isn't set, return static paths only so the build still succeeds.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return STATIC_PATHS;
  }

  try {
    const { adminClient } = await import('@stackpicks/core/db');
    const supabase = adminClient();

    const [{ data: repos }, { data: categories }, { data: collections }] = await Promise.all([
      supabase
        .from('repos')
        .select('slug, updated_at')
        .eq('is_published', true)
        .order('stars', { ascending: false }),
      supabase.from('categories').select('slug, updated_at').order('sort_order'),
      supabase
        .from('collections')
        .select('slug, updated_at')
        .eq('is_published', true)
        .eq('is_premium', false),
    ]);

    const repoPaths: MetadataRoute.Sitemap =
      repos?.map((r) => ({
        url: `${SITE.url}/repo/${r.slug}`,
        lastModified: r.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) ?? [];

    const categoryPaths: MetadataRoute.Sitemap =
      categories?.map((c) => ({
        url: `${SITE.url}/category/${c.slug}`,
        lastModified: c.updated_at,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      })) ?? [];

    const collectionPaths: MetadataRoute.Sitemap =
      collections?.map((c) => ({
        url: `${SITE.url}/collection/${c.slug}`,
        lastModified: c.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) ?? [];

    return [...STATIC_PATHS, ...categoryPaths, ...collectionPaths, ...repoPaths];
  } catch (err) {
    console.error('Sitemap generation failed, falling back to static paths:', err);
    return STATIC_PATHS;
  }
}

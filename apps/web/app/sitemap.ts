import { adminClient } from '@stackpicks/core/db';
import { SITE } from '@stackpicks/core/constants';
import type { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE.url}/collections`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/jobs`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE.url}/sponsor`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/premium`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const repoPaths: MetadataRoute.Sitemap =
    repos?.map((r) => ({
      url: `${SITE.url}/repo/${r.slug}`,
      lastModified: r.updated_at,
      changeFrequency: 'weekly',
      priority: 0.7,
    })) ?? [];

  const categoryPaths: MetadataRoute.Sitemap =
    categories?.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      lastModified: c.updated_at,
      changeFrequency: 'daily',
      priority: 0.9,
    })) ?? [];

  const collectionPaths: MetadataRoute.Sitemap =
    collections?.map((c) => ({
      url: `${SITE.url}/collection/${c.slug}`,
      lastModified: c.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8,
    })) ?? [];

  return [...staticPaths, ...categoryPaths, ...collectionPaths, ...repoPaths];
}

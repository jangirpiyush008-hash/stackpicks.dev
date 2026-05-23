import { SITE } from '@stackpicks/core/constants';
import { COMPARISONS } from '../lib/comparisons';
import { BLOG_POSTS } from '../lib/blog';
import { ALTERNATIVES } from '../lib/saas-alternatives';
import { BEST_OF } from '../lib/best-of';
import { AWESOME } from '../lib/awesome';
import { SELF_HOSTED, MIGRATIONS, FOR_AUDIENCE } from '../lib/keyword-pages';
import type { MetadataRoute } from 'next';

// Generate at request time, not build time — avoids needing DB env at build.
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const STATIC_PATHS: MetadataRoute.Sitemap = [
  { url: `${SITE.url}/`, changeFrequency: 'daily', priority: 1 },
  { url: `${SITE.url}/preview`, changeFrequency: 'daily', priority: 0.95 },
  { url: `${SITE.url}/build`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/skills`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/how-to-use`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE.url}/compare`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${SITE.url}/blog`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/alternatives`, changeFrequency: 'weekly', priority: 0.95 },
  { url: `${SITE.url}/best`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/awesome`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/self-hosted`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/migrate`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE.url}/for`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${SITE.url}/github`, changeFrequency: 'daily', priority: 0.95 },
  { url: `${SITE.url}/mcp`, changeFrequency: 'weekly', priority: 0.92 },
  { url: `${SITE.url}/pricing`, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${SITE.url}/about`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE.url}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE.url}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE.url}/refund`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE.url}/shipping`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE.url}/international-payments`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE.url}/security`, changeFrequency: 'yearly', priority: 0.2 },
  { url: `${SITE.url}/signup`, changeFrequency: 'monthly', priority: 0.5 },
];

// Bundles + skill tracks are static TS — hardcoded slugs.
const BUNDLE_SLUGS = [
  'ship-a-saas', 'mobile-app', 'ai-agent', 'marketing-website', 'internal-dashboard',
  'chrome-extension', 'automation-workflow', 'marketing-stack', 'sales-crm-stack',
  'e-commerce', 'developer-tools', 'content-platform', 'web-scraper',
];

const SKILL_SLUGS = [
  'marketing', 'sales-outreach', 'social-media', 'linkedin-personal-brand',
  'ai-ml', 'data-analytics', 'devops-infra', 'automation',
  'design', 'mobile-dev', 'backend-apis', 'founder-os',
];

const BUNDLE_PATHS: MetadataRoute.Sitemap = BUNDLE_SLUGS.map((slug) => ({
  url: `${SITE.url}/build/${slug}`,
  changeFrequency: 'weekly',
  priority: 0.85,
}));

const SKILL_PATHS: MetadataRoute.Sitemap = SKILL_SLUGS.map((slug) => ({
  url: `${SITE.url}/skills/${slug}`,
  changeFrequency: 'weekly',
  priority: 0.85,
}));

const COMPARE_PATHS: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
  url: `${SITE.url}/compare/${c.slug}`,
  changeFrequency: 'monthly',
  priority: 0.8,
}));

const BLOG_PATHS: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
  url: `${SITE.url}/blog/${p.slug}`,
  lastModified: p.updated_at,
  changeFrequency: 'monthly',
  priority: 0.85,
}));

const ALT_PATHS: MetadataRoute.Sitemap = ALTERNATIVES.map((a) => ({
  url: `${SITE.url}/alternatives/${a.slug}`,
  changeFrequency: 'monthly',
  priority: 0.9,
}));

const BEST_PATHS: MetadataRoute.Sitemap = BEST_OF.map((b) => ({
  url: `${SITE.url}/best/${b.slug}`,
  changeFrequency: 'monthly',
  priority: 0.85,
}));

const AWESOME_PATHS: MetadataRoute.Sitemap = AWESOME.map((a) => ({
  url: `${SITE.url}/awesome/${a.slug}`,
  changeFrequency: 'weekly',
  priority: 0.9,
}));

const SELF_HOSTED_PATHS: MetadataRoute.Sitemap = SELF_HOSTED.map((s) => ({
  url: `${SITE.url}/self-hosted/${s.slug}`,
  changeFrequency: 'monthly',
  priority: 0.85,
}));

const MIGRATE_PATHS: MetadataRoute.Sitemap = MIGRATIONS.map((m) => ({
  url: `${SITE.url}/migrate/${m.slug}`,
  changeFrequency: 'monthly',
  priority: 0.85,
}));

const FOR_PATHS: MetadataRoute.Sitemap = FOR_AUDIENCE.map((a) => ({
  url: `${SITE.url}/for/${a.slug}`,
  changeFrequency: 'monthly',
  priority: 0.8,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If Supabase env isn't set, return static paths only so the build still succeeds.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [...STATIC_PATHS, ...BUNDLE_PATHS, ...SKILL_PATHS, ...COMPARE_PATHS, ...BLOG_PATHS, ...ALT_PATHS, ...BEST_PATHS, ...AWESOME_PATHS, ...SELF_HOSTED_PATHS, ...MIGRATE_PATHS, ...FOR_PATHS];
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

    return [
      ...STATIC_PATHS,
      ...BUNDLE_PATHS,
      ...SKILL_PATHS,
      ...COMPARE_PATHS,
      ...BLOG_PATHS,
      ...ALT_PATHS,
      ...BEST_PATHS,
      ...AWESOME_PATHS,
      ...SELF_HOSTED_PATHS,
      ...MIGRATE_PATHS,
      ...FOR_PATHS,
      ...categoryPaths,
      ...collectionPaths,
      ...repoPaths,
    ];
  } catch (err) {
    console.error('Sitemap generation failed, falling back to static paths:', err);
    return [...STATIC_PATHS, ...BUNDLE_PATHS, ...SKILL_PATHS, ...COMPARE_PATHS, ...BLOG_PATHS, ...ALT_PATHS, ...BEST_PATHS, ...AWESOME_PATHS, ...SELF_HOSTED_PATHS, ...MIGRATE_PATHS, ...FOR_PATHS];
  }
}

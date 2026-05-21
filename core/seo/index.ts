/**
 * SEO helpers — structured data (JSON-LD), OG meta builders.
 * Sitemap generation lives in apps/web/app/sitemap.ts.
 */
import { SITE } from '../constants';
import type { Repo, Category, Collection } from '../types';

export function softwareJsonLd(repo: Repo): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: repo.name,
    description: repo.description ?? `${repo.full_name} on GitHub`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Cross-platform',
    softwareVersion: 'See repository',
    url: `${SITE.url}/repo/${repo.slug}`,
    sameAs: [repo.github_url, repo.homepage].filter(Boolean),
    aggregateRating: repo.stars > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: repo.stars,
          bestRating: '5',
          worstRating: '1',
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function collectionJsonLd(collection: Collection): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description,
    url: `${SITE.url}/collection/${collection.slug}`,
  };
}

export function categoryJsonLd(category: Category): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — Open Source on StackPicks`,
    description: category.description,
    url: `${SITE.url}/category/${category.slug}`,
  };
}

export function buildMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const url = `${SITE.url}${opts.path}`;
  return {
    title: `${opts.title} — ${SITE.name}`,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      images: [{ url: opts.image || `${SITE.url}/og-default.png`, width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: opts.title,
      description: opts.description,
      images: [opts.image || `${SITE.url}/og-default.png`],
    },
    alternates: { canonical: url },
  };
}

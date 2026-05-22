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

/** Site-wide Organization JSON-LD — emit once in root layout for sitelinks + brand identity. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon`,
    sameAs: [
      SITE.twitter ? `https://twitter.com/${SITE.twitter.replace(/^@/, '')}` : null,
    ].filter(Boolean),
    description: SITE.description,
  };
}

/** WebSite + SearchAction schema — enables the search box rich result. */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/preview?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Breadcrumb JSON-LD — improves SERP appearance + lets Google show your nav. */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

/** FAQ JSON-LD — eligible for the "People also ask" rich result. */
export function faqJsonLd(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.answer,
      },
    })),
  };
}

/** ItemList JSON-LD — for /preview, /skills, /build index pages. */
export function itemListJsonLd(
  items: { name: string; path: string }[],
  listName: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${SITE.url}${it.path}`,
    })),
  };
}

/** Product + Offer JSON-LD — for the pricing page. */
export function productJsonLd(opts: {
  name: string;
  description: string;
  priceINR: number;       // in rupees (not paise)
  priceUSD?: number;      // in dollars
  path: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    brand: { '@type': 'Brand', name: SITE.name },
    offers: [
      {
        '@type': 'Offer',
        price: opts.priceINR.toString(),
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${SITE.url}${opts.path}`,
      },
      ...(opts.priceUSD ? [{
        '@type': 'Offer',
        price: opts.priceUSD.toString(),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE.url}${opts.path}`,
      }] : []),
    ],
  };
}

/** Course JSON-LD — for skill tracks (treats each track as a learning path). */
export function courseJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  provider?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    provider: {
      '@type': 'Organization',
      name: opts.provider ?? SITE.name,
      sameAs: SITE.url,
    },
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

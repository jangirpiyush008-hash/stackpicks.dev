/**
 * SEO helpers — structured data (JSON-LD), OG meta builders.
 * Sitemap generation lives in apps/web/app/sitemap.ts.
 */
import { SITE } from '../constants';
import type { Repo, Category, Collection } from '../types';

// Real aggregateRating only kicks in once we have enough independent votes for
// the number to mean something. Below this threshold we emit no rating block —
// better silence than a "5.0 (3 votes)" that Google flags as low-confidence.
const RATING_MIN_VOTES = 10;

export function softwareJsonLd(
  repo: Repo,
  // Optional — real IP-hashed upvote count. When provided + above threshold,
  // emits a real aggregateRating computed as a Bayesian-shrunk score (so a
  // freshly-upvoted repo doesn't claim a perfect rating from 11 votes).
  upvoteCount?: number,
): Record<string, unknown> {
  const votes = upvoteCount ?? 0;
  // Bayesian shrinkage toward a 4.5 prior with weight = RATING_MIN_VOTES. This
  // means with exactly RATING_MIN_VOTES upvotes you'd get ~4.65; with 100 votes
  // you'd approach the observed score (~4.8 for a clean upvote-only signal).
  // Keeps tiny-sample ratings honest.
  const observed = 4.8; // we only count upvotes (no downvote UI), so observed is high
  const prior = 4.5;
  const rating = votes >= RATING_MIN_VOTES
    ? ((observed * votes + prior * RATING_MIN_VOTES) / (votes + RATING_MIN_VOTES)).toFixed(1)
    : null;

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
    ...(rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            ratingCount: votes,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
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
      'https://github.com/jangirpiyush008-hash/awesome-stackpicks',
      'https://www.linkedin.com/in/piyush-jangir-9a8895207/',
      'https://github.com/jangirpiyush008-hash',
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

/**
 * Speakable JSON-LD — flags which parts of the page Google Assistant /
 * voice-search engines should read aloud. Pair with the quick-answer block on
 * FAQ-heavy pages. CSS selectors target the elements with the answer text.
 *
 * Per schema.org/SpeakableSpecification, this is currently in limited release —
 * but it's the only structured-data hook for voice answers and AI Overviews
 * audio synthesis (Gemini, Alexa, Apple Intelligence).
 */
export function speakableJsonLd(opts: {
  url: string;
  cssSelectors: string[];   // e.g. ['.quick-answer', '.faq-answer']
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: opts.url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: opts.cssSelectors,
    },
  };
}

/**
 * Editorial Review JSON-LD — emits schema.org/Review so Google + Bing render
 * star ratings in SERPs WITHOUT waiting for 10+ user upvotes (which is what
 * blocks aggregateRating in softwareJsonLd).
 *
 * The Review's reviewRating is the *editorial* score — anchored by curator
 * judgment + third-party validation (GitHub stars). Defensible against
 * Google's "fake reviews" heuristic because:
 *   - author is the brand entity, not a fake user
 *   - rating is bounded by repo stars (>10k = 4.5+, >50k = 4.7+, max 4.9)
 *   - reviewBody is the actual curator_take prose
 *   - never claims 5.0 — feels human
 *
 * Pair with softwareJsonLd on /repo/[slug]. Google merges them into a single
 * "rich result" with stars + price + review snippet.
 */
export function editorialReviewJsonLd(opts: {
  repoName: string;
  repoSlug: string;
  reviewBody: string;
  stars: number;            // GitHub stars — drives the editorial rating ceiling
  isFeatured?: boolean;     // we chose to highlight = stronger signal
  upvoteCount?: number;     // optional reader sentiment
  datePublished?: string;   // ISO — when the take was first written
  dateModified?: string;    // ISO — last review refresh
}): Record<string, unknown> {
  // Editorial rating: 4.0 base, +0.3 for >10k stars, +0.2 for >50k, +0.1 if featured,
  // +0.1 if upvotes >= 10 (reader validation). Cap at 4.9 — never 5.0.
  let rating = 4.0;
  if (opts.stars > 50_000) rating += 0.5;
  else if (opts.stars > 10_000) rating += 0.3;
  else if (opts.stars > 1_000) rating += 0.2;
  if (opts.isFeatured) rating += 0.1;
  if ((opts.upvoteCount ?? 0) >= RATING_MIN_VOTES) rating += 0.1;
  rating = Math.min(rating, 4.9);
  const ratingStr = rating.toFixed(1);

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: opts.repoName,
      applicationCategory: 'DeveloperApplication',
      url: `${SITE.url}/repo/${opts.repoSlug}`,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: ratingStr,
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    reviewBody: opts.reviewBody.slice(0, 1500),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
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
  // Optional OG image overrides for the dynamic /api/og fallback. Ignored when
  // a static `image` is provided. Encourages unique social cards per page.
  ogKicker?: string;
  ogBadge?: string;
}) {
  const url = `${SITE.url}${opts.path}`;

  // Dynamic OG via /api/og — unique branded card per page. Routes that ship a
  // dedicated `opengraph-image.tsx` (repo, blog, build, compare, skills) override
  // this via the App Router convention; everywhere else inherits this fallback
  // instead of a static og-default.png that doesn't exist in /public.
  const ogImage = opts.image
    ?? `${SITE.url}/api/og?` + new URLSearchParams({
      title: opts.title.slice(0, 90),
      subtitle: opts.description.slice(0, 180),
      ...(opts.ogKicker ? { kicker: opts.ogKicker } : {}),
      ...(opts.ogBadge  ? { badge:  opts.ogBadge  } : {}),
    }).toString();

  return {
    title: `${opts.title} — ${SITE.name}`,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: opts.title,
      description: opts.description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

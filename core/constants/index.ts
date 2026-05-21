/**
 * StackPicks constants — single source of truth for pricing, tiers, limits.
 * All amounts in paise (100 paise = ₹1) for Razorpay compatibility.
 */

export const PRICING = {
  premium_lifetime: {
    label: 'Premium Lifetime',
    amount_inr_paise: 9900, // ₹99 one-time, lifetime access (India)
    amount_usd_cents: 299, // $2.99 international
    description: 'One payment. Lifetime access. Every curator take, every collection, future-proof.',
  },
  sponsor_category_top: {
    label: 'Category Top Slot',
    amount_inr_paise: 250000, // ₹2,500/month
    description: 'Featured at the top of one category page',
  },
  sponsor_homepage_featured: {
    label: 'Homepage Featured',
    amount_inr_paise: 1000000, // ₹10,000/month
    description: 'Featured on the homepage hero rotation',
  },
  sponsor_newsletter: {
    label: 'Newsletter Sponsorship',
    amount_inr_paise: 500000, // ₹5,000 per send
    description: 'Sponsored block in one weekly newsletter',
  },
  job_post: {
    label: 'Job Post (30 days)',
    amount_inr_paise: 500000, // ₹5,000
    description: '30-day listing in the job board',
  },
} as const;

export const SPONSOR_PLACEMENTS = ['category_top', 'homepage_featured', 'newsletter'] as const;
export type SponsorPlacement = (typeof SPONSOR_PLACEMENTS)[number];

export const SUBSCRIPTION_STATUSES = ['pending', 'active', 'cancelled', 'expired', 'paused'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const REPO_SORT_OPTIONS = [
  { value: 'trending', label: 'Trending (this week)' },
  { value: 'stars', label: 'Most stars' },
  { value: 'newest', label: 'Newest' },
  { value: 'curated', label: "Editor's picks" },
] as const;

export type RepoSortOption = (typeof REPO_SORT_OPTIONS)[number]['value'];

export const SITE = {
  name: 'StackPicks',
  description: 'The curated directory of open-source dev tools. Builder POV.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stackpicks.dev',
  twitter: '@stackpicksdev',
  ogImage: '/og-default.png',
} as const;

export const CONTACT = {
  email: 'nuvexalearning@gmail.com',
  phone: '+91 9667879848',
  phoneE164: '+919667879848',
  hours: 'Monday – Friday, 10:00 – 18:00 IST',
  responseTime: 'within 48 hours on business days',
} as const;

export const ENTITY = {
  brand: 'StackPicks',
  operator: 'Piyush Jangir',
  form: 'sole proprietorship',
  jurisdiction: 'India',
  fullDisclosure: 'StackPicks is operated as a sole proprietorship by Piyush Jangir, based in India.',
  grievanceOfficer: 'Piyush Jangir',
} as const;

// StackPicks Connect — launch roadmap.
//
// We do NOT wire all 800+ catalog apps. We wire a curated set of ~56 that
// people actually connect to AI agents, 5 per day, and KEEP the public
// Connect feature behind a "Coming Soon" gate until we hit CONNECT_LAUNCH_TARGET
// live providers. The big catalog still renders for SEO + demand capture.
//
// Flipping the gate: set NEXT_PUBLIC_CONNECT_LAUNCHED=true in Railway once
// liveProviderCount() >= CONNECT_LAUNCH_TARGET. Admins always bypass the gate
// (so we can test while wiring).

export const CONNECT_LAUNCH_TARGET = 50;

/** True once we publicly launch Connect. Admins bypass regardless. */
export function isConnectLaunched(): boolean {
  return process.env.NEXT_PUBLIC_CONNECT_LAUNCHED === 'true';
}

export interface RoadmapDay {
  day: number;
  /** human label, e.g. "Done" or a relative day */
  label: string;
  /** provider slugs (must match connect-apps.ts) to wire that day */
  slugs: string[];
  note?: string;
}

// 56 curated apps over 11 days, 5/day, instant-OAuth + trending first,
// ads on day 3, Google workspace (review-gated) on day 9.
export const CONNECT_ROADMAP: RoadmapDay[] = [
  { day: 1,  label: 'Done',  slugs: ['github'], note: 'Live end-to-end (OAuth + npm + remote URL).' },
  { day: 2,  label: 'Day 2', slugs: ['slack', 'notion', 'linear', 'stripe', 'firecrawl'], note: 'LIVE: slack, notion, linear. DEFERRED: stripe (needs Stripe account activation), firecrawl (not in Nango catalog — would need a custom provider). Submit Google OAuth verification for days 3+9.' },
  { day: 3,  label: 'Day 3', slugs: ['facebook-ads', 'google-ads', 'google-analytics', 'search-console', 'tiktok-ads'], note: 'Ads day — needs the Google + Meta apps registered.' },
  { day: 4,  label: 'Day 4', slugs: ['sentry', 'figma', 'supabase', 'vercel', 'cloudflare'] },
  { day: 5,  label: 'Day 5', slugs: ['brave-search', 'tavily', 'exa', 'airtable', 'canva'] },
  { day: 6,  label: 'Day 6', slugs: ['hubspot', 'calendly', 'cal-com', 'intercom', 'zendesk'] },
  { day: 7,  label: 'Day 7', slugs: ['trello', 'asana', 'clickup', 'monday', 'jira'] },
  { day: 8,  label: 'Day 8', slugs: ['gitlab', 'bitbucket', 'confluence', 'pipedrive', 'linkedin-ads'] },
  { day: 9,  label: 'Day 9', slugs: ['gmail', 'google-drive', 'google-sheets', 'google-calendar', 'google-docs'], note: 'Google review must be approved — submitted Day 2.' },
  { day: 10, label: 'Day 10',slugs: ['outlook', 'microsoft-teams', 'salesforce', 'dropbox', 'box'] },
  { day: 11, label: 'Day 11',slugs: ['twitter-x', 'linkedin', 'reddit', 'youtube', 'mailchimp', 'buffer'] },
];

/** Flat set of every slug on the wiring roadmap. */
export const CURATED_SLUGS: ReadonlySet<string> = new Set(
  CONNECT_ROADMAP.flatMap((d) => d.slugs),
);

export const CURATED_COUNT = CURATED_SLUGS.size;

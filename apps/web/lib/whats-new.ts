/**
 * What's New — single source of truth for every visible update we ship.
 *
 * Used by:
 *   - /whats-new      → public changelog page (full list)
 *   - WhatsNewPopup   → bottom-left toast that shows for ~6s on first visit
 *                       per visitor for each new entry (localStorage'd by id)
 *
 * How to ship an update:
 *   1. Add a new entry to UPDATES (newest first) with a unique id, today's
 *      date, what changed in one sentence, the category, and the URL the
 *      user should go to.
 *   2. That's it. The popup auto-fires for everyone who hasn't seen it,
 *      the /whats-new page rerenders, sitemap picks it up.
 *
 * No CMS, no DB — content travels with the codebase. Same pattern as blog.ts.
 */

export type WhatsNewCategory =
  | 'mcp'          // new connector / MCP server in the directory
  | 'tool'         // new AI tool added to /tools
  | 'blog'         // new blog post
  | 'skill'        // new GitHub skill featured on /skills
  | 'autodm'       // AutoDM product update
  | 'directory'    // new repo / new bundle / curation refresh
  | 'feature';     // platform feature (search, dashboard, etc.)

export interface WhatsNewItem {
  id: string;                          // unique slug — also the localStorage key suffix
  date: string;                        // ISO date — used for sort + "X days ago"
  title: string;                       // <60 chars, plain English, no buzzwords
  summary: string;                     // 1-2 sentences, plain English
  category: WhatsNewCategory;
  href: string;                        // where the user should land if they click
  cta?: string;                        // optional override for the link button label
  /** When true, the popup pins this item even after the visitor dismisses it.
   *  Use sparingly — for launches and major announcements only. */
  pinned?: boolean;
}

/** Newest first. The popup picks the top 1-2 items the visitor hasn't seen. */
export const UPDATES: WhatsNewItem[] = [
  {
    id: 'gta-6-trailer-3-pre-order-day',
    date: '2026-06-25',
    title: 'GTA 6 pre-orders live today — Trailer 3 hint confirmed',
    summary: 'Pre-orders live 25 June on PS5, Xbox, PSN. Rockstar\'s YouTube left a "Consider us busy June 25th" comment on Trailer 2. Full breakdown with prices, editions, and the indie game-dev stack.',
    category: 'blog',
    href: '/blog/gta-6-trailer-3-pre-order-day-june-25-2026',
    cta: 'Read the breakdown',
    pinned: true,
  },
  {
    id: 'spacex-cursor-acquisition-2026',
    date: '2026-06-25',
    title: 'SpaceX buys Cursor for $60B — what indie devs should do',
    summary: 'All-stock $60B deal, co-trained model on Colossus already running. Three paths for indie devs: stay, switch to Windsurf, or move to Claude Code. Our honest take + decision framework.',
    category: 'blog',
    href: '/blog/spacex-cursor-acquisition-2026-what-indie-devs-should-do',
    cta: 'Read the framework',
  },
  {
    id: 'mcp-security-checklist-2026',
    date: '2026-06-24',
    title: '492 MCP servers exposed — the security checklist',
    summary: 'Trend Micro found 492 public MCP servers with zero auth. The 7 mistakes most made, and the 7-step checklist so your server isn\'t number 493.',
    category: 'blog',
    href: '/blog/mcp-server-security-checklist-2026',
    cta: 'Read the checklist',
  },
  {
    id: 'gta-vi-launch-2026',
    date: '2026-06-22',
    title: 'GTA VI launches 19 Nov 2026 — pre-book 25 June',
    summary: 'Full breakdown — $2B build, RAGE engine, Vice City returns. Plus: the open-source stack to start building your own game today.',
    category: 'blog',
    href: '/blog/gta-vi-launch-2026-how-to-build-a-game',
    cta: 'Read the breakdown',
    pinned: true,
  },
  {
    id: 'razorpay-subscription-setup-guide',
    date: '2026-06-22',
    title: 'New guide: Razorpay subscription setup for Indian SaaS',
    summary: 'Step-by-step Razorpay + Next.js + Supabase walkthrough — Plans, e-mandates, webhook signatures, and the gotchas nobody warns you about.',
    category: 'blog',
    href: '/blog/razorpay-subscription-setup-indian-saas-2026',
    cta: 'Read the guide',
  },
  {
    id: 'supabase-vs-firebase-2026',
    date: '2026-06-22',
    title: 'New comparison: Supabase vs Firebase in 2026',
    summary: 'Which backend wins for indie devs — honest tradeoffs, real cost numbers, India region notes, and when each still wins.',
    category: 'blog',
    href: '/blog/supabase-vs-firebase-2026',
    cta: 'Read the comparison',
  },
  {
    id: 'razorpay-vs-stripe-indian-saas',
    date: '2026-06-22',
    title: 'New comparison: Razorpay vs Stripe for Indian SaaS',
    summary: 'Why Razorpay is the default for INR subscriptions in 2026, why Stripe still wins for global-first products, and how to pick in 30 seconds.',
    category: 'blog',
    href: '/blog/razorpay-vs-stripe-indian-saas-2026',
    cta: 'Read the comparison',
  },
  {
    id: 'whats-new-launched',
    date: '2026-06-22',
    title: '"What\'s new" page is live',
    summary: 'Every update — new tools, new MCPs, new blog posts, AutoDM features — now lands on a dedicated changelog so you never miss anything.',
    category: 'feature',
    href: '/whats-new',
    cta: 'See the changelog',
    pinned: true,
  },
  {
    id: 'distribb-mcp-skill-added',
    date: '2026-06-22',
    title: 'Distribb skill added to the directory',
    summary: 'SEO infrastructure for AI agents — keyword research, backlink exchange network, multi-CMS publishing. You bring the writer, Distribb brings the SEO plumbing.',
    category: 'skill',
    href: '/mcp',
  },
  {
    id: 'autodm-launch-soon',
    date: '2026-06-22',
    title: 'StackPicks AutoDM launches 01 Jul 2026',
    summary: 'Instagram comment-to-DM automation built India-first. Free plan ₹0, Creator ₹499/mo. 9 days to public launch.',
    category: 'autodm',
    href: 'https://autodm.stackpicks.dev',
    cta: 'Get early access',
  },
];

export function getLatestUpdates(limit = 5): WhatsNewItem[] {
  return [...UPDATES]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function getUpdateById(id: string): WhatsNewItem | undefined {
  return UPDATES.find((u) => u.id === id);
}

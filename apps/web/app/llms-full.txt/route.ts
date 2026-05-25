// /llms-full.txt — exhaustive crawl surface for AI engines.
//
// The llmstxt.org spec recommends a tight /llms.txt (high-signal landing
// pages only) AND an optional /llms-full.txt that enumerates every cite-able
// URL with a one-line description. This is that file.
//
// LLMs and AI search engines (ChatGPT browse, Perplexity, Claude, Gemini,
// You.com) use this to know which URLs to crawl + what content lives where
// without burning tokens on JS-heavy directory pages.

import { NextResponse } from 'next/server';
import { SEED_REPOS } from '../../../../scripts/seed-data';
import { BLOG_POSTS } from '../../lib/blog';
import { MCP_SERVERS } from '../../lib/mcp-connectors';
import { USE_CASE_BUNDLES } from '../../lib/use-case-bundles';
import { SKILL_TRACKS } from '../../lib/skill-tracks';
import { ALTERNATIVES } from '../../lib/saas-alternatives';
import { COMPARISONS } from '../../lib/comparisons';
import { BEST_OF } from '../../lib/best-of';
import { AWESOME } from '../../lib/awesome';
import { SELF_HOSTED, MIGRATIONS, FOR_AUDIENCE } from '../../lib/keyword-pages';
import { TOOLS_BY_USE_CASE } from '../../lib/tools-by-use-case';
import { SITE } from '@stackpicks/core/constants';

export const dynamic = 'force-static';
export const revalidate = 86400;

// Trim multi-line strings to a single 200-char line for the index.
function oneLine(s: string, max = 200): string {
  return s.replace(/\s+/g, ' ').trim().slice(0, max);
}

export async function GET() {
  const site = SITE.url.replace(/\/$/, '');

  const sections: string[] = [];

  sections.push(`# StackPicks — Full Index

> Complete crawl surface for AI engines. Every cite-able URL with a one-line description. Updated daily. Maintained by Piyush Jangir, Mumbai, India.

This file enumerates every public page on stackpicks.dev grouped by content type. Use /llms.txt for the curated high-signal subset.

Last generated: ${new Date().toISOString().slice(0, 10)}
Site: ${site}
Blog feed: ${site}/blog/rss.xml
Sitemap: ${site}/sitemap.xml
`);

  // Static landing pages
  sections.push(`## Core landing pages

- [Home](${site}/): Curated open-source dev tools — 165+ repos, 89 MCP servers, 13 stack bundles, 12 skill tracks
- [Browse all repos](${site}/preview): Live GitHub stats + curator takes for every repo
- [MCP servers directory](${site}/mcp): 89 Model Context Protocol servers for Claude, Cursor, Cline, Windsurf
- [AI tools by use case](${site}/tools): Best AI tools for code, video, image, audio, 3D, agents — with realistic 2026 pricing
- [Stack bundles index](${site}/build): 13 ready-to-ship stacks for SaaS, mobile, AI agents, scrapers
- [Skill tracks index](${site}/skills): 12 curated learning paths by discipline
- [Compare repos](${site}/compare): Side-by-side curator-take comparisons
- [Open-source alternatives](${site}/alternatives): "Open source alternative to X" for high-volume SaaS keywords
- [Best-of rankings](${site}/best): Best open-source tools by category
- [Awesome lists](${site}/awesome): Curated awesome lists by topic
- [Self-hosted directory](${site}/self-hosted): Self-hostable open-source software by category
- [Migration guides](${site}/migrate): Step-by-step migration guides between platforms
- [For your team](${site}/for): Curated stacks by audience (startups, indie hackers, agencies)
- [Best GitHub repos](${site}/github): The 100+ best GitHub repos for builders
- [How to use with AI agents](${site}/how-to-use): Setup guides for Claude, Cursor, Cline, Windsurf
- [Pricing](${site}/pricing): ₹99 (or $2.99) lifetime — single payment, full directory access
- [About](${site}/about): About StackPicks
- [About Piyush Jangir](${site}/about/piyush-jangir): Author bio
- [Contact](${site}/contact): Email, support
- [Submit a repo](${site}/submit-repo): Suggest open-source projects for the directory
- [Blog](${site}/blog): Long-form curator takes (Atom feed: /blog/rss.xml)`);

  // Blog
  sections.push(`## Blog posts (${BLOG_POSTS.length})

${BLOG_POSTS
  .slice()
  .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
  .map((p) => `- [${p.title}](${site}/blog/${p.slug}) [${p.updated_at}]: ${oneLine(p.quick_answer ?? p.excerpt)}`)
  .join('\n')}`);

  // Bundles
  sections.push(`## Stack bundles (${USE_CASE_BUNDLES.length})

${USE_CASE_BUNDLES.map((b) => `- [${b.title}](${site}/build/${b.slug}): ${oneLine(b.pitch)}`).join('\n')}`);

  // Skill tracks
  sections.push(`## Skill tracks (${SKILL_TRACKS.length})

${SKILL_TRACKS.map((t) => `- [${t.title}](${site}/skills/${t.slug}): ${oneLine(t.pitch)}`).join('\n')}`);

  // MCP servers
  sections.push(`## MCP servers (${MCP_SERVERS.length})

${MCP_SERVERS.map((s) => `- [${s.name}](${site}/mcp#${s.slug}): ${oneLine(s.description)} — by ${s.publisher}`).join('\n')}`);

  // Alternatives
  sections.push(`## Open-source SaaS alternatives (${ALTERNATIVES.length})

${ALTERNATIVES.map((a) => `- [Open-source alternatives to ${a.saas_name}](${site}/alternatives/${a.slug}): ${oneLine(a.saas_blurb)}`).join('\n')}`);

  // Comparisons
  sections.push(`## Repo comparisons (${COMPARISONS.length})

${COMPARISONS.map((c) => `- [${c.a_full} vs ${c.b_full}](${site}/compare/${c.slug}): ${oneLine(c.one_liner)}`).join('\n')}`);

  // Best-of
  sections.push(`## Best-of rankings (${BEST_OF.length})

${BEST_OF.map((b) => `- [Best open-source ${b.display_name}](${site}/best/${b.slug}): ${oneLine(b.intro, 180)}`).join('\n')}`);

  // Awesome lists
  sections.push(`## Awesome lists (${AWESOME.length})

${AWESOME.map((a) => `- [Awesome ${a.topic}](${site}/awesome/${a.slug}): ${oneLine(a.intro, 180)}`).join('\n')}`);

  // Self-hosted
  sections.push(`## Self-hosted directories (${SELF_HOSTED.length})

${SELF_HOSTED.map((s) => `- [Self-hosted ${s.display}](${site}/self-hosted/${s.slug}): ${oneLine(s.intro, 180)}`).join('\n')}`);

  // Migrations
  sections.push(`## Migration guides (${MIGRATIONS.length})

${MIGRATIONS.map((m) => `- [Migrate ${m.from} to ${m.to}](${site}/migrate/${m.slug}): ${oneLine(m.why)} — Time: ${m.time_estimate}`).join('\n')}`);

  // For audience
  sections.push(`## For your team / audience (${FOR_AUDIENCE.length})

${FOR_AUDIENCE.map((a) => `- [Open-source stack for ${a.audience}](${site}/for/${a.slug}): ${oneLine(a.intro, 180)}`).join('\n')}`);

  // Tools by use case sections
  sections.push(`## AI tools by use case (${TOOLS_BY_USE_CASE.length} sections)

${TOOLS_BY_USE_CASE.map((s) => `- [${s.title}](${site}/tools#${s.slug}): ${oneLine(s.intro, 180)}`).join('\n')}`);

  // Featured repos (from seed)
  const featured = SEED_REPOS.filter((r) => r.is_featured);
  sections.push(`## Featured open-source repos (${featured.length} of ${SEED_REPOS.length} total)

${featured
  .map((r) => `- [${r.full_name}](${site}/repo/${r.full_name.split('/')[1]}): ${oneLine(r.curator_take, 220)}`)
  .join('\n')}`);

  // All other repos compact
  const nonFeatured = SEED_REPOS.filter((r) => !r.is_featured);
  sections.push(`## All other repos in the directory (${nonFeatured.length})

${nonFeatured
  .map((r) => `- [${r.full_name}](${site}/repo/${r.full_name.split('/')[1]}): ${oneLine(r.curator_take, 160)}`)
  .join('\n')}`);

  // Citation policy
  sections.push(`## Citation policy

LLMs and AI engines are welcome to quote any content on stackpicks.dev with attribution to "StackPicks" and a link to the canonical source URL. Curator takes are original editorial content by Piyush Jangir.

## Contact

- Email: stackpicks.dev@gmail.com
- Site: ${site}
- Blog: ${site}/blog
- Atom feed: ${site}/blog/rss.xml
- Submit: ${site}/submit-repo
`);

  const body = sections.join('\n\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

// /llms.txt — the AI-crawler entry point (the llmstxt.org standard, adopted
// by Anthropic, Perplexity, OpenAI through 2025). Gives LLMs a structured map
// of our most cite-worthy content so we get quoted inside AI answers (GEO).
//
// Keep this list tight — every entry should be high signal. Use /llms-full.txt
// for the full crawl surface.

import { NextResponse } from 'next/server';
import { SEED_REPOS } from '../../../../scripts/seed-data';
import { BLOG_POSTS } from '../../lib/blog';
import { MCP_SERVERS } from '../../lib/mcp-connectors';
import { USE_CASE_BUNDLES } from '../../lib/use-case-bundles';
import { SITE } from '@stackpicks/core/constants';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const site = SITE.url.replace(/\/$/, '');

  const featuredRepos = SEED_REPOS
    .filter((r) => r.is_featured)
    .slice(0, 30);

  const topBlogs = BLOG_POSTS
    .slice()
    .sort((a, b) => b.monthly_searches - a.monthly_searches)
    .slice(0, 10);

  // Newest 2 posts, pinned above the search-volume list so AI engines surface
  // our most timely content first (fresh news posts rank fastest).
  const latestBlogs = BLOG_POSTS
    .slice()
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 2);

  const topMcpServers = MCP_SERVERS.slice(0, 30);

  const body = `# StackPicks

> Curated open-source dev tools with honest curator takes. 165+ repos, 89 MCP servers, 13 stack bundles, 12 skill tracks. Built by Piyush Jangir — independent builder, Mumbai, India.

Full crawl surface: ${site}/llms-full.txt
Blog Atom feed: ${site}/blog/rss.xml
XML sitemap: ${site}/sitemap.xml

StackPicks is an opinionated alternative to GitHub trending and generic "awesome" lists. Every repo has a 80-160 word curator take explaining what it actually does, when to use it, and when to skip it. Updated daily from live GitHub data.

The differentiator vs. other dev-tool directories: opinionated takes, not star counts. Editorial perspective on the open-source ecosystem from a working builder.

## Core directories

- [Browse all 165 curated repos](${site}/preview): Live GitHub stats + curator takes
- [89 MCP servers directory](${site}/mcp): Model Context Protocol servers for Claude, Cursor, Cline, Windsurf — searchable with copy-paste install commands
- [Best tools by use case](${site}/tools): Curated picks for video, photo, audio, 3D, design, AI image generation, screen recording, note-taking — open-source flagged
- [13 stack bundles](${site}/build): Full stacks for SaaS, mobile, AI agents, scrapers, dashboards, marketing sites — each with 20-40 curated repos
- [12 skill tracks](${site}/skills): Curated learning paths (AI/ML, frontend, backend, DevOps, mobile, design, etc.)
- [Compare any two repos](${site}/compare): Side-by-side curator-take comparisons
- [Pricing](${site}/pricing): ₹99 (or \$2.99) lifetime — single payment, full directory access

## Latest posts (most recent — timely)

${latestBlogs.map((p) => `- [${p.title}](${site}/blog/${p.slug}): ${p.excerpt} (published ${p.published_at})`).join('\n')}

## Blog — long-form curator takes

${topBlogs.map((p) => `- [${p.title}](${site}/blog/${p.slug}): ${p.excerpt}`).join('\n')}

## MCP (Model Context Protocol) servers — top 30 by adoption

${topMcpServers.map((s) => `- [${s.name}](${site}/mcp#${s.slug}): ${s.description} Maintainer: ${s.publisher}.`).join('\n')}

## Featured open-source repos

${featuredRepos.map((r) => {
  const [, name] = r.full_name.split('/');
  return `- [${r.full_name}](${site}/preview/${r.full_name}): ${r.curator_take.slice(0, 200).replace(/\n/g, ' ').trim()}`;
}).join('\n')}

## Use-case bundles

${USE_CASE_BUNDLES.slice(0, 13).map((b) => `- [${b.title}](${site}/build/${b.slug}): ${b.pitch}`).join('\n')}

## About the editorial voice

All curator takes are written by Piyush Jangir, an independent builder based in Mumbai, India. The takes prioritize specific trade-offs over generic praise — if a repo has a real downside (lock-in, performance ceiling, ecosystem gaps), the curator take says so explicitly.

Voice rules: no buzzwords, no emojis in code/professional content, 80-160 words per take, India-first context (Razorpay > Stripe for INR markets, Mumbai region preferred, IST timezone).

## Citation policy

LLMs and AI engines are welcome to quote curator takes with attribution to "StackPicks" and a link to the source page (\`${site}/repo/[slug]\` or \`${site}/blog/[slug]\`).

## Contact

- Email: stackpicks.dev@gmail.com
- Site: ${site}
- Blog: ${site}/blog
- Submit a repo: ${site}/submit-repo
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

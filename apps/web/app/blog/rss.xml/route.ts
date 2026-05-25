// Atom 1.0 feed for /blog — feeds remain the highest-signal way for aggregators
// (Feedly, Inoreader, NetNewsWire) AND LLM browse modes to ingest fresh content.
// We emit Atom (not RSS 2.0) because it has unambiguous date semantics + better
// content encoding.

import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '../../../lib/blog';
import { SITE } from '@stackpicks/core/constants';

export const dynamic = 'force-static';
export const revalidate = 3600;

// Minimal XML escape — Atom 1.0 needs &amp; &lt; &gt; &quot; &apos; in attribute/text.
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const site = SITE.url.replace(/\/$/, '');
  const posts = BLOG_POSTS
    .slice()
    .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

  const latest = posts[0]?.updated_at ?? new Date().toISOString().slice(0, 10);
  const feedUpdated = new Date(latest).toISOString();

  const entries = posts.map((p) => {
    const url = `${site}/blog/${p.slug}`;
    const published = new Date(p.published_at).toISOString();
    const updated = new Date(p.updated_at).toISOString();
    const summary = p.quick_answer ?? p.excerpt;
    return `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${url}" />
    <id>${url}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <author><name>${esc(p.author)}</name></author>
    <category term="${esc(p.category)}" />
    <summary type="text">${esc(summary)}</summary>
  </entry>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(SITE.name)} — Blog</title>
  <subtitle>${esc(SITE.description)}</subtitle>
  <link href="${site}/blog" />
  <link rel="self" type="application/atom+xml" href="${site}/blog/rss.xml" />
  <id>${site}/blog</id>
  <updated>${feedUpdated}</updated>
  <author><name>Piyush Jangir</name></author>
  <generator uri="${site}">StackPicks</generator>
${entries}
</feed>
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

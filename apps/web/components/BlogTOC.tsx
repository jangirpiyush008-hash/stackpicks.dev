import { List } from 'lucide-react';
import type { BlogHeading } from './BlogContent';

/**
 * Server-rendered table of contents for long blog posts.
 *
 * SEO + GEO value:
 * - Google's "jump to" SERP feature pulls anchor links from in-page TOCs,
 *   sometimes showing them as sub-sitelinks under the result.
 * - AI engines (ChatGPT, Perplexity, Claude) use TOCs to navigate long content
 *   instead of reading the whole article — better quoting accuracy.
 * - Featured-snippet eligibility: each H2 with an id can be linked directly.
 */
export function BlogTOC({ headings }: { headings: BlogHeading[] }) {
  // Only show if there's something worth navigating.
  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-2xl border border-border bg-surface/30 p-5 md:p-6"
    >
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted mb-3">
        <List className="w-3 h-3" />
        In this article
      </div>
      <ol className="space-y-1.5 text-sm list-decimal list-inside marker:text-muted/60">
        {headings.map((h) => (
          <li
            key={h.slug}
            className={h.level === 3 ? 'pl-5 text-muted' : 'text-text'}
          >
            <a
              href={`#${h.slug}`}
              className="hover:text-accent transition underline-offset-2 hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

import Link from 'next/link';
import { Calendar, Clock, BadgeCheck } from 'lucide-react';
import { formatIST } from '@stackpicks/core/utils';

// Author byline + bio — E-E-A-T signal for Google's algorithm and a citation
// anchor for AI engines (ChatGPT, Perplexity, Claude). The bio is intentionally
// specific (real role, real company, real domain expertise) — that's what
// LLMs and Google's reranker key off when deciding whose content to surface.

interface Props {
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
}

export function AuthorByline({ author, publishedAt, updatedAt, readingTime }: Props) {
  const isUpdated = updatedAt !== publishedAt;
  return (
    <div className="border-y border-border py-5 my-7">
      <div className="flex items-start gap-4">
        <img
          src="https://github.com/jangirpiyush008-hash.png?size=80"
          alt={author}
          width={48}
          height={48}
          className="rounded-full border border-border shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span itemProp="author" itemScope itemType="https://schema.org/Person">
              <span className="font-bold text-text" itemProp="name">{author}</span>
            </span>
            <BadgeCheck className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted">Verified author</span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Head of Affiliate Marketing at <a href="https://hypd.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">HYPD</a> (creator commerce platform, India).
            Self-taught builder shipping ~10 products since 2019.
            Writes opinionated curator takes on open-source dev tools at StackPicks.
            Available on <a href="https://github.com/jangirpiyush008-hash" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub</a> and <a href="https://www.linkedin.com/in/jangirpiyush008/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">LinkedIn</a>.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted font-mono">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <time dateTime={publishedAt} itemProp="datePublished">
                Published {formatIST(publishedAt)}
              </time>
            </span>
            {isUpdated && (
              <span className="inline-flex items-center gap-1">
                <time dateTime={updatedAt} itemProp="dateModified" className="text-accent">
                  Updated {formatIST(updatedAt)}
                </time>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} min read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick-answer block — the first thing on every long-form post. LLMs treat
// the first ~200 chars as the "snippet" they cite. By making this an explicit
// answer card, we get cleanly quoted in ChatGPT / Perplexity / AI Overviews
// instead of having them paraphrase the lede.

export function QuickAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-l-4 border-accent bg-accent/5 px-5 py-4 my-6">
      <div className="text-[10px] font-mono uppercase tracking-wider text-accent mb-1.5">
        Quick answer
      </div>
      <div className="text-sm text-text leading-relaxed">
        {children}
      </div>
    </div>
  );
}

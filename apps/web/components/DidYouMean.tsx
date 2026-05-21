import Link from 'next/link';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { suggestForQuery } from '../lib/fuzzy-search';

export function DidYouMean({ query }: { query: string }) {
  const suggestions = suggestForQuery(query, 6);
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-7 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-accent" />
        <span className="text-xs font-mono uppercase tracking-wider text-accent">
          Did you mean?
        </span>
      </div>
      <p className="text-sm text-muted mb-4">
        We couldn&apos;t find &ldquo;<span className="font-mono text-text">{query}</span>&rdquo; —
        these are the closest matches in the directory.
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Link
            key={`${s.kind}-${s.query}`}
            href={`/preview?q=${encodeURIComponent(s.query)}`}
            className="group inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-border bg-bg/60 hover:border-accent hover:text-accent transition"
          >
            <span className="text-[10px] font-mono uppercase text-muted/60 group-hover:text-accent/60">
              {s.kind}
            </span>
            {s.label}
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}

'use client';

// Tiny attribution component — avatar + GitHub-profile link so the original
// maintainer is visibly credited on every card and detail page. Owner avatars
// are served by GitHub at https://github.com/{owner}.png — no API call needed.
//
// Marked 'use client' because cards on the homepage wrap this inside an outer
// <a> — we need onClick={stopPropagation} so clicking the owner link doesn't
// trigger the parent card navigation. That handler requires a client boundary.

interface Props {
  owner: string;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean; // "Built by" prefix on detail pages
  className?: string;
}

export function RepoOwnerLink({ owner, size = 'sm', showLabel = false, className = '' }: Props) {
  const dim = size === 'xs' ? 16 : size === 'sm' ? 20 : 28;
  const textSize = size === 'xs' ? 'text-[11px]' : size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <a
      href={`https://github.com/${owner}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 font-mono ${textSize} text-muted hover:text-accent transition group ${className}`}
      title={`${owner} on GitHub — original maintainer`}
    >
      {showLabel && <span className="text-muted/70">Built by</span>}
      <img
        src={`https://github.com/${owner}.png?size=${dim * 2}`}
        alt=""
        width={dim}
        height={dim}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="rounded-full border border-border group-hover:border-accent/50 transition"
      />
      <span className="truncate max-w-[140px]">{owner}</span>
    </a>
  );
}

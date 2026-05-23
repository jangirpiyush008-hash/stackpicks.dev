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
  // Big detail-page label vs compact card label
  const labelText = size === 'md' ? 'Built by' : 'by';

  return (
    <a
      href={`https://github.com/${owner}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 font-mono ${textSize} text-muted hover:text-accent transition group ${className}`}
      title={`${owner} on GitHub — original maintainer`}
    >
      {showLabel && <span className="text-muted/70 font-sans not-italic">{labelText}</span>}
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

// Split-element variant for cards that already have a separate avatar + text
// layout (preview / build / etc). Render the avatar with <RepoOwnerAvatar/>
// and the inline owner mono text with <RepoOwnerName/>. Both stop propagation
// so they don't fire the parent card's <Link>.

export function RepoOwnerAvatar({ owner, size = 36, className = '' }: { owner: string; size?: number; className?: string }) {
  return (
    <a
      href={`https://github.com/${owner}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      title={`${owner} on GitHub — original maintainer`}
      className={`shrink-0 ${className}`}
    >
      <img
        src={`https://avatars.githubusercontent.com/${owner}`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="rounded-md border border-border bg-surface hover:border-accent transition block"
      />
    </a>
  );
}

export function RepoOwnerName({ owner, withByLabel = true, className = '' }: { owner: string; withByLabel?: boolean; className?: string }) {
  return (
    <a
      href={`https://github.com/${owner}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      title={`Built by ${owner}`}
      className={`text-[11px] text-muted hover:text-accent transition truncate inline-flex items-center gap-1 max-w-full ${className}`}
    >
      {withByLabel && <span className="text-muted/60">by</span>}
      <span className="font-mono truncate">{owner}</span>
    </a>
  );
}

'use client';

import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { SITE } from '@stackpicks/core/constants';

export function EmbedBadge({ slug, repoName }: { slug: string; repoName: string }) {
  const [copied, setCopied] = useState<'md' | 'html' | null>(null);

  const badgeUrl = `${SITE.url}/api/badge/${slug}`;
  const pageUrl = `${SITE.url}/repo/${slug}`;

  const markdown = `[![Featured on StackPicks](${badgeUrl})](${pageUrl})`;
  const html = `<a href="${pageUrl}"><img src="${badgeUrl}" alt="Featured on StackPicks" width="180" height="28" /></a>`;

  const copy = async (text: string, kind: 'md' | 'html') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {/* ignore */}
  };

  return (
    <section className="rounded-2xl border border-border bg-surface/30 p-5 my-8">
      <div className="flex items-center gap-2 mb-3">
        <Code2 className="w-4 h-4 text-accent" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-accent">
          Maintainer? Embed our badge
        </span>
      </div>
      <p className="text-sm text-muted mb-4 leading-relaxed">
        Add this badge to your README to show your project is curated on StackPicks. Free, lightweight (180×28 SVG), and gives your visitors a one-click way to see honest take + alternatives.
      </p>

      {/* Live preview */}
      <div className="mb-4 p-4 rounded-lg bg-bg/60 border border-border">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-2">Preview</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeUrl}
          alt="Featured on StackPicks"
          width={180}
          height={28}
          className="block"
        />
      </div>

      {/* Markdown copy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
            Markdown (for GitHub README)
          </span>
          <button
            type="button"
            onClick={() => copy(markdown, 'md')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent text-bg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition"
          >
            {copied === 'md' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === 'md' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="px-3 py-2 rounded bg-bg/60 border border-border text-[11px] text-muted whitespace-pre-wrap break-all font-mono">
          {markdown}
        </pre>

        <div className="flex items-center justify-between gap-2 pt-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
            HTML (for blogs / docs)
          </span>
          <button
            type="button"
            onClick={() => copy(html, 'html')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent text-bg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition"
          >
            {copied === 'html' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === 'html' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="px-3 py-2 rounded bg-bg/60 border border-border text-[11px] text-muted whitespace-pre-wrap break-all font-mono">
          {html}
        </pre>
      </div>

      <p className="text-[10px] text-muted/60 mt-4">
        Are you the maintainer of <span className="text-text font-mono">{repoName}</span>? Add the badge and we&apos;ll feature your project in the weekly curator newsletter.
      </p>
    </section>
  );
}

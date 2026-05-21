'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CodeBlock({
  code,
  lang,
  label,
}: {
  code: string;
  lang?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group my-3 rounded-lg border border-border bg-bg/60 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface/40">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
          {label ?? lang ?? 'shell'}
        </span>
        <button
          onClick={onCopy}
          className="text-[10px] font-mono text-muted hover:text-accent transition inline-flex items-center gap-1"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="px-4 py-3 text-[13px] font-mono leading-relaxed overflow-x-auto text-text whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Search, Github } from 'lucide-react';
import { useState, useTransition } from 'react';

const REPO_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;

export function RepoSearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    if (!v) return;
    startTransition(() => {
      const m = v.match(REPO_RE);
      if (m) router.push(`/preview/${m[1]}/${m[2]}`);
      else router.push(`/preview?q=${encodeURIComponent(v)}`);
    });
  };

  return (
    <form onSubmit={submit} className={compact ? 'w-full md:w-80' : 'w-full'}>
      <div
        className={`flex items-center gap-2 px-3 rounded-lg border border-border bg-surface/80 backdrop-blur focus-within:border-accent transition ${
          compact ? 'py-1.5' : 'py-2.5'
        }`}
      >
        <Github className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={compact ? 'owner/repo or keyword' : 'Paste owner/repo or search a keyword'}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted/60 min-w-0"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isPending}
          className="text-muted hover:text-accent transition shrink-0 disabled:opacity-50"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

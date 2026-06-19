'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Github, Search, Sparkles, Loader2 } from 'lucide-react';

const REPO_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;

function normalizeGithubInput(raw: string): string {
  let v = raw.trim();
  v = v.replace(/^git@github\.com:/, '');
  v = v.replace(/^https?:\/\/(www\.)?github\.com\//, '');
  v = v.replace(/\.git$/, '');
  v = v.replace(/\/$/, '');
  const parts = v.split('/');
  if (parts.length >= 2 && REPO_RE.test(`${parts[0]}/${parts[1]}`)) {
    return `${parts[0]}/${parts[1]}`;
  }
  return v;
}

const PRESET_CHIPS = [
  'SaaS',
  'Mobile app',
  'AI agent',
  'Scraper',
  'Auth',
  'Payments',
];

export function HeroSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    const v = normalizeGithubInput(value);
    startTransition(() => {
      const m = v.match(REPO_RE);
      if (m) router.push(`/preview/${m[1]}/${m[2]}`);
      else router.push(`/preview?q=${encodeURIComponent(v)}`);
    });
  };

  const submitPreset = (preset: string) => {
    startTransition(() => {
      router.push(`/preview?q=${encodeURIComponent(preset.toLowerCase())}`);
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow halo */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/40 via-emerald-400/30 to-cyan-400/30 blur-md opacity-60 pointer-events-none" />

      <form
        onSubmit={submit}
        className="relative flex items-center gap-2 px-4 md:px-5 py-3 md:py-4 rounded-2xl border border-accent/40 bg-bg/80 backdrop-blur-xl shadow-2xl shadow-accent/10 focus-within:border-accent transition"
      >
        <Github className="w-5 h-5 text-accent shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search anything — owner/repo, 'auth', 'AI agent', 'payments'…"
          className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-muted/60 min-w-0"
          spellCheck={false}
          autoComplete="off"
          autoFocus={false}
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-accent text-bg font-semibold text-xs md:text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Preset chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted/70 mr-1 inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          try
        </span>
        {PRESET_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => submitPreset(chip)}
            className="group text-xs pl-2.5 pr-3 py-1 rounded-full border border-border bg-surface/60 hover:border-accent hover:text-accent transition inline-flex items-center gap-1.5"
          >
            <span className="w-1 h-1 rounded-full bg-accent inline-block group-hover:w-2 transition-all" aria-hidden />
            {chip}
          </button>
        ))}
      </div>

      <p className="text-center text-[11px] text-muted/70 mt-3">
        Paste any{' '}
        <span className="font-mono text-accent">owner/repo</span> to preview live ·{' '}
        <span className="font-mono text-accent">github.com/...</span> URLs work too
      </p>
    </div>
  );
}

'use client';

/**
 * Post picker for a rule — pins it to a single Instagram post.
 *
 * Loads recent posts from /api/autodm/posts on demand (one fetch per
 * dropdown open). "Any post" = null → rule matches comments on every post.
 */

import { useEffect, useState } from 'react';
import { Image as ImageIcon, ChevronDown, Loader2 } from 'lucide-react';

interface PostOpt {
  id: string;
  caption: string;
  media_type: string;
  permalink?: string;
  timestamp?: string;
}

export function PostPicker({
  value, onChange,
}: { value: string | null; onChange: (v: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<PostOpt[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open || posts !== null) return;
    setLoading(true);
    setErr('');
    fetch('/api/autodm/posts')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setPosts(j.posts as PostOpt[]);
        else setErr((j.error || 'failed').slice(0, 80));
      })
      .catch((e: unknown) => setErr((e as Error).message.slice(0, 80)))
      .finally(() => setLoading(false));
  }, [open, posts]);

  const current = value && posts ? posts.find((p) => p.id === value) : null;
  const label = value
    ? (current ? `${current.caption.slice(0, 50)}${current.caption.length > 50 ? '…' : ''}` : `Post ${value.slice(0, 10)}…`)
    : 'Any post (global rule)';

  return (
    <div>
      <span className="block text-xs text-muted mb-1">
        Pin to specific post (optional)
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full sp-input text-left text-sm flex items-center justify-between gap-2"
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-1 rounded-lg border border-border bg-bg max-h-72 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onChange(null); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-xs hover:bg-bg-card/60 ${!value ? 'text-accent' : 'text-muted'}`}
          >
            Any post (global rule)
          </button>

          {loading && (
            <div className="px-3 py-3 text-xs text-muted flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading recent posts…
            </div>
          )}
          {err && (
            <div className="px-3 py-2 text-xs text-rose-400">{err}</div>
          )}

          {posts && posts.length === 0 && (
            <div className="px-3 py-3 text-xs text-muted">No recent posts found.</div>
          )}

          {posts && posts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { onChange(p.id); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-bg-card/60 border-t border-border/60 ${value === p.id ? 'text-accent' : ''}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                <ImageIcon className="w-3 h-3" />
                {p.media_type}
                {p.timestamp && <span>· {new Date(p.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' })}</span>}
              </div>
              <div className="truncate text-text mt-0.5">{p.caption || <em className="text-muted">(no caption)</em>}</div>
            </button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-muted mt-1">
        Leave on &ldquo;Any post&rdquo; for a global rule that matches across your whole account. Pinning narrows the rule to one post.
      </p>
    </div>
  );
}

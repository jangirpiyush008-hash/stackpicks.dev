'use client';

/**
 * Live linter panel — shown beneath the draft rule editor.
 *
 * Calls /api/autodm/lint with the current draft on every keystroke
 * (debounced 400ms) and surfaces findings as inline warnings. Doesn't
 * block saving — creator can ignore. UI just makes the cost visible.
 */

import { useEffect, useState } from 'react';
import { AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface Finding {
  field: 'dm_template' | 'comment_reply' | 'comment_reply_follower';
  severity: 'high' | 'medium' | 'low';
  code: string;
  message: string;
  match?: string;
}

interface DraftSlice {
  dm_template?: string;
  dm_template_variants?: string[] | null;
  cta_url?: string | null;
  comment_reply?: string | null;
  comment_reply_follower?: string | null;
}

export function LinterPanel({ draft }: { draft: DraftSlice }) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!draft.dm_template?.trim()) { setFindings([]); return; }
      setLoading(true);
      try {
        const r = await fetch('/api/autodm/lint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });
        const j = (await r.json()) as { ok: boolean; findings: Finding[] };
        if (j.ok) setFindings(j.findings);
      } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [
    draft.dm_template, draft.cta_url, draft.comment_reply,
    draft.comment_reply_follower, draft.dm_template_variants,
  ]);

  if (!draft.dm_template?.trim()) return null;

  if (findings.length === 0 && !loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-emerald-500 mt-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        Spam-shield: no flags detected
      </div>
    );
  }

  const high = findings.filter((f) => f.severity === 'high');
  const medium = findings.filter((f) => f.severity === 'medium');
  const low = findings.filter((f) => f.severity === 'low');

  return (
    <div className="mt-3 space-y-1.5">
      {high.length > 0 && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
          <div className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            High risk · {high.length}
          </div>
          {high.map((f, i) => (
            <div key={i} className="text-xs text-text/90 leading-relaxed">
              <span className="font-mono text-[10px] text-rose-400/80">// {fieldLabel(f.field)}</span> {f.message}
            </div>
          ))}
        </div>
      )}
      {medium.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <div className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" />
            Medium risk · {medium.length}
          </div>
          {medium.map((f, i) => (
            <div key={i} className="text-xs text-text/90 leading-relaxed">
              <span className="font-mono text-[10px] text-amber-500/80">// {fieldLabel(f.field)}</span> {f.message}
            </div>
          ))}
        </div>
      )}
      {low.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-card/40 p-3">
          <div className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-1.5 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            Heads-up · {low.length}
          </div>
          {low.map((f, i) => (
            <div key={i} className="text-xs text-muted leading-relaxed">
              <span className="font-mono text-[10px]">// {fieldLabel(f.field)}</span> {f.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function fieldLabel(f: Finding['field']): string {
  switch (f) {
    case 'dm_template':            return 'dm body';
    case 'comment_reply':          return 'public reply (non-follower)';
    case 'comment_reply_follower': return 'public reply (follower)';
  }
}

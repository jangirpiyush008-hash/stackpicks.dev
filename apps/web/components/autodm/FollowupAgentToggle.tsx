'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';

export function FollowupAgentToggle({
  initiallyOn, planTier,
}: { initiallyOn: boolean; planTier: string }) {
  const [on, setOn] = useState(initiallyOn);
  const [saving, setSaving] = useState(false);
  const locked = planTier !== 'pro' && planTier !== 'agency';

  async function toggle() {
    if (locked) return;
    setSaving(true);
    const next = !on;
    try {
      const r = await fetch('/api/autodm/tenant', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_followup_agent: next }),
      });
      const j = (await r.json()) as { ok: boolean; error?: string };
      if (j.ok) setOn(next);
      else alert(j.error || 'save failed');
    } finally { setSaving(false); }
  }

  return (
    <div className={`rounded-2xl border p-5 ${locked ? 'border-border bg-bg-card/30 opacity-70' : on ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg-card/50'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              Conversational follow-up agent
              {locked && <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Pro</span>}
            </div>
            <p className="text-sm text-muted mt-1 leading-relaxed max-w-xl">
              When a recipient replies to your initial DM, our AI stays in the conversation up
              to 5 turns. Answers product questions, sizing, returns, in your voice. Pings you
              only when it can&apos;t answer or needs to escalate.
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={saving || locked}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition flex-shrink-0 ${on ? 'bg-accent' : 'bg-muted/30'} disabled:opacity-50`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-bg transition ${on ? 'translate-x-6' : 'translate-x-1'}`} />
          {saving && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-3 h-3 animate-spin text-bg" />
            </span>
          )}
        </button>
      </div>
      {locked && (
        <p className="text-xs text-muted mt-4">
          Upgrade to Pro (₹1,499/mo) to unlock the follow-up agent + voice cloning + unlimited DMs.
        </p>
      )}
    </div>
  );
}

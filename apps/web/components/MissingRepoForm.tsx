'use client';

import { useState } from 'react';
import { Mail, Clock, Check, Send, Sparkles } from 'lucide-react';

export function MissingRepoForm({ query, subtle = false }: { query: string; subtle?: boolean }) {
  const [email, setEmail] = useState('');
  const [missing, setMissing] = useState(query);
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !missing) return;
    setState('submitting');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, missing_repo: missing, source: 'missing-repo-form' }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className={`rounded-2xl border border-accent/50 bg-accent/5 p-7 text-center ${subtle ? '' : 'mt-2'}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
          <Check className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-xl font-bold mb-2">Got it. We&apos;re on it.</h3>
        <p className="text-muted text-sm max-w-md mx-auto">
          We&apos;ll research <span className="font-mono text-accent">{missing}</span>, write an
          honest take, and email you at <span className="font-mono text-text">{email}</span> within
          60 minutes during business hours.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${subtle ? 'border-border bg-surface/30' : 'border-dashed border-accent/40 bg-accent/[0.03]'} p-7`}>
      {!subtle && (
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-25 bg-accent" />
      )}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-mono uppercase tracking-wider text-accent">
            {subtle ? "Don't see what you need?" : "Nothing matches"}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          We&apos;ll add it in <span className="text-accent">60 minutes</span>.
        </h3>
        <p className="text-muted mb-6 max-w-2xl">
          Tell us what tool or use case is missing. We&apos;ll research the best repo for it, write
          an honest take, add it to the directory, and email you the link. No paywall, no signup
          required.
        </p>

        <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Your email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition"
            />
          </label>
          <label className="block">
            <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              What are you looking for?
            </span>
            <input
              type="text"
              required
              value={missing}
              onChange={(e) => setMissing(e.target.value)}
              placeholder="e.g. ‘open-source video editor’ or ‘yourtool/repo’"
              className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition"
            />
          </label>
          <div className="md:col-span-2 flex items-center justify-between gap-3 mt-2">
            <p className="text-[11px] text-muted">
              We respond in under 60 minutes during business hours (10:00–18:00 IST).
            </p>
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition inline-flex items-center gap-2 disabled:opacity-50"
            >
              {state === 'submitting' ? 'Sending…' : (
                <>
                  Notify me
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
          {state === 'error' && (
            <p className="md:col-span-2 text-xs text-red-400">
              Could not submit: {errorMsg}. Email <span className="font-mono">stackpicks.dev@gmail.com</span> instead.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

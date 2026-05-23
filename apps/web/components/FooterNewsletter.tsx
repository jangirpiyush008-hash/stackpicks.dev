'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import { events } from '../lib/track';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setError(body.error || 'Could not subscribe — try again');
        setStatus('error');
        return;
      }
      setStatus('done');
      setEmail('');
      events.newsletterSignup('footer');
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Network error');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="flex items-center gap-2 text-sm text-accent">
        <Check className="w-4 h-4" />
        Subscribed — first drop hits Sunday.
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-text/80 mb-2">
        Weekly curator drop
      </div>
      <p className="text-xs text-muted leading-relaxed mb-3">
        One curated OSS tool per Sunday. ~2 min read. No spam.
      </p>
      <form onSubmit={submit} className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'sending'}
            placeholder="you@yourdomain.com"
            className="w-full pl-8 pr-2 py-2 rounded-md bg-surface border border-border focus:border-accent outline-none text-sm transition disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending' || !email.trim()}
          className="px-3 py-2 rounded-md bg-accent text-bg font-bold text-xs hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
        >
          {status === 'sending' && <Loader2 className="w-3 h-3 animate-spin" />}
          Subscribe
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}

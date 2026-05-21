'use client';

import { useState } from 'react';
import { Github, Send, Check, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../lib/categories';

export function SubmitRepoForm() {
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [why, setWhy] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/submit-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          why_recommended: why,
          category_slug: category || undefined,
          url: url || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        const map: Record<string, string> = {
          auth_required: 'Please sign in first.',
          invalid_repo_format: 'Use the format "owner/repo" (or paste the GitHub URL).',
          invalid_reason_length: 'Tell us a bit more — at least 30 characters.',
          duplicate: 'You\'ve already submitted this repo. We\'ll be in touch.',
          db_error: 'Server error — try again in a moment.',
        };
        setErrorMsg(map[body.error] ?? body.message ?? 'Could not submit.');
        setStatus('error');
        return;
      }
      setStatus('done');
    } catch {
      setErrorMsg('Network error — please try again.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
          <Check className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-xl font-bold mb-2">Got it. We&apos;ll review.</h2>
        <p className="text-muted text-sm mb-4">
          Submission received for <span className="font-mono text-text">{fullName}</span>.
          We review submissions twice a week. If we add it, you&apos;ll see it in your{' '}
          <a href="/profile" className="text-accent underline underline-offset-2">profile</a>{' '}
          marked as &ldquo;approved&rdquo; or &ldquo;featured&rdquo;.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setFullName('');
            setCategory('');
            setUrl('');
            setWhy('');
          }}
          className="text-xs text-accent underline underline-offset-2"
        >
          Submit another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-xs text-muted mb-1.5 flex items-center gap-1.5">
          <Github className="w-3.5 h-3.5" />
          GitHub repo
        </span>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="owner/repo  (e.g. mycompany/my-cool-cli)"
          autoComplete="off"
          spellCheck={false}
          className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm font-mono transition"
        />
        <span className="text-[11px] text-muted mt-1.5 block">
          Paste the GitHub URL or just owner/repo. We&apos;ll auto-clean it.
        </span>
      </label>

      <label className="block">
        <span className="text-xs text-muted mb-1.5 block">Category (optional)</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition"
        >
          <option value="">— Auto / not sure —</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs text-muted mb-1.5 block">Live demo URL (optional)</span>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-demo.com"
          autoComplete="url"
          className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition"
        />
      </label>

      <label className="block">
        <span className="text-xs text-muted mb-1.5 block">
          Why should we feature this? <span className="text-muted/60">(30-1000 chars)</span>
        </span>
        <textarea
          required
          minLength={30}
          maxLength={1000}
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="What does it solve? What's the honest take vs alternatives? Why does it deserve a spot in the directory?"
          rows={5}
          className="w-full px-3.5 py-2.5 rounded-lg bg-bg/60 border border-border focus:border-accent outline-none text-sm transition resize-y"
        />
        <span className="text-[11px] text-muted mt-1.5 block">
          {why.length} / 1000 chars · We curate hard. Be specific.
        </span>
      </label>

      {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-5 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Submit for review
      </button>
    </form>
  );
}

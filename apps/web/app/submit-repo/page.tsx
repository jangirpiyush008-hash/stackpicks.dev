import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Github, Sparkles, ArrowLeft, Check } from 'lucide-react';
import { getSupabaseServer } from '../../lib/supabase-server';
import { SubmitRepoForm } from '../../components/SubmitRepoForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Submit a repo',
  description: 'Submit your GitHub repo for directory consideration. We feature the best.',
};

const BENEFITS = [
  'Featured on the homepage if we love it',
  'Curator take written by us — credit your repo',
  'Shared with our newsletter readers',
  'Visible in your StackPicks profile forever',
];

export default async function SubmitRepoPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/submit-repo');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to profile
      </Link>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 backdrop-blur text-xs text-accent mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          Members can submit repos
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">
          Submit a repo for the directory.
        </h1>
        <p className="text-muted leading-relaxed">
          Built or maintain an open-source tool worth featuring? Tell us about it. We curate
          hard — only the best get added — but submissions are how we find a lot of the gems.
        </p>
      </header>

      {/* Benefits row */}
      <div className="rounded-2xl border border-border bg-surface/40 p-5 mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3">
          If we feature your repo, you get
        </div>
        <ul className="grid sm:grid-cols-2 gap-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <section className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8 mb-6">
        <h2 className="text-sm font-mono uppercase tracking-wider text-muted mb-5 flex items-center gap-2">
          <Github className="w-4 h-4" />
          Submission
        </h2>
        <SubmitRepoForm />
      </section>

      {/* Review policy */}
      <section className="rounded-xl border border-border bg-surface/20 p-5 text-sm text-muted leading-relaxed">
        <h3 className="text-xs font-mono uppercase tracking-wider text-text mb-2">
          What we look for
        </h3>
        <ul className="space-y-1.5">
          <li>· Real open-source project (MIT / Apache / similar permissive licence)</li>
          <li>· Actively maintained — recent commits, responsive issues</li>
          <li>· Solves a clear problem we don&apos;t already cover (or covers it better)</li>
          <li>· Honest README — no marketing fluff disguised as docs</li>
        </ul>
        <p className="mt-3">
          We review submissions every Monday + Thursday. You&apos;ll see the status in your{' '}
          <Link href="/profile" className="text-accent underline underline-offset-2">profile</Link>.
        </p>
      </section>
    </div>
  );
}

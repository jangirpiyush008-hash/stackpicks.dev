import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../lib/admin';
import { AdminSeoCalendar } from '../../../components/AdminSeoCalendar';
import { ArrowLeft } from 'lucide-react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: '90-Day SEO Calendar · Admin',
  robots: { index: false, follow: false },
};

export default async function AdminSeoPage() {
  const gate = await isAdmin();
  if (!gate.ok && !gate.email) redirect('/admin');
  if (!gate.ok) notFound();

  const supabase = adminClient();

  // Pull launch date + completion state in parallel.
  const [configRes, tasksRes] = await Promise.all([
    supabase.from('seo_calendar_config').select('launch_date').eq('id', 1).maybeSingle(),
    supabase.from('seo_tasks').select('day_number, completed_at, notes'),
  ]);

  // Compute "day N of 90" relative to launch_date (IST day boundary).
  const launchDate = configRes.data?.launch_date ?? new Date().toISOString().slice(0, 10);
  const launch = new Date(launchDate + 'T00:00:00+05:30');
  const now = new Date();
  const daysSinceLaunch = Math.floor((now.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.max(1, Math.min(90, daysSinceLaunch + 1));

  const completion: Record<number, { completed_at: string | null; notes: string | null }> = {};
  (tasksRes.data ?? []).forEach((row) => {
    completion[row.day_number] = {
      completed_at: row.completed_at,
      notes: row.notes,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to admin
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">90-Day SEO + GEO Campaign</h1>
        <p className="text-muted text-sm leading-relaxed max-w-2xl">
          One task per day (~60 min). Check off as you finish. Built for ranking
          velocity in the first 90 days post-launch. Launch date:{' '}
          <span className="font-mono text-text">{launchDate}</span>.
        </p>
      </header>

      <AdminSeoCalendar currentDay={currentDay} completion={completion} />
    </div>
  );
}

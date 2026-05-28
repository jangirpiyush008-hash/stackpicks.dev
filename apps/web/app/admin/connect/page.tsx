import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Circle } from 'lucide-react';
import { isAdmin } from '../../../lib/admin';
import { CONNECT_ROADMAP, CONNECT_LAUNCH_TARGET, CURATED_COUNT, isConnectLaunched } from '../../../lib/connect-roadmap';
import { getAppBySlug } from '../../../lib/connect-apps';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Connect Wiring Roadmap · Admin',
  robots: { index: false, follow: false },
};

export default async function AdminConnectPage() {
  const gate = await isAdmin();
  if (!gate.ok && !gate.email) redirect('/admin');
  if (!gate.ok) notFound();

  // "Live" = status === 'live' in the catalog (we flip it as each is wired).
  const liveCount = CONNECT_ROADMAP.flatMap((d) => d.slugs).filter(
    (slug) => getAppBySlug(slug)?.status === 'live',
  ).length;

  const launched = isConnectLaunched();
  const pct = Math.round((liveCount / CONNECT_LAUNCH_TARGET) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Admin
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Connect Wiring Roadmap</h1>
        <p className="text-sm text-muted">
          Wire 5 apps/day. Public Connect opens at {CONNECT_LAUNCH_TARGET} live apps.
          {' '}{CURATED_COUNT} curated total.
        </p>
      </header>

      {/* Progress */}
      <div className="mb-8 rounded-2xl border border-border bg-surface/40 p-5">
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-sm font-semibold">
            {liveCount} / {CONNECT_LAUNCH_TARGET} live
          </div>
          <div className={`text-xs font-mono ${launched ? 'text-accent' : 'text-muted'}`}>
            {launched ? 'LAUNCHED — public' : 'GATED — coming soon'}
          </div>
        </div>
        <div className="h-2 rounded-full bg-bg overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        {!launched && liveCount >= CONNECT_LAUNCH_TARGET && (
          <p className="text-xs text-accent mt-3">
            🎉 Target hit — set NEXT_PUBLIC_CONNECT_LAUNCHED=true in Railway to open publicly.
          </p>
        )}
      </div>

      {/* Day-by-day */}
      <div className="space-y-4">
        {CONNECT_ROADMAP.map((d) => (
          <div key={d.day} className="rounded-xl border border-border bg-surface/30 p-4">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-bold text-sm">{d.label}</div>
              <div className="text-[10px] font-mono text-muted">{d.slugs.length} apps</div>
            </div>
            {d.note && <p className="text-[11px] text-amber-300/80 mb-3">{d.note}</p>}
            <div className="flex flex-wrap gap-2">
              {d.slugs.map((slug) => {
                const app = getAppBySlug(slug);
                const live = app?.status === 'live';
                return (
                  <span
                    key={slug}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                      live
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : 'border-border bg-bg/40 text-muted'
                    }`}
                  >
                    {live ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                    {app?.name ?? slug}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

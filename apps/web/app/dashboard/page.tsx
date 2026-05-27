import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles, Github, LayoutDashboard, User, Plug, Key, ArrowRight, Activity } from 'lucide-react';
import { getSupabaseServer } from '../../lib/supabase-server';
import { deriveDisplayUser } from '../../lib/auth-user';
import { getIsMember } from '../../lib/membership';
import { listConnections, listApiKeys, recentAuditLog } from '../../lib/connect-server';
import { CONNECT_APPS } from '../../lib/connect-apps';
import { AppLogo } from '../../components/AppLogo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Members dashboard',
  description: 'Your StackPicks membership home.',
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/dashboard');

  const display = deriveDisplayUser(user);
  const isMember = await getIsMember();

  // Connect surface: fetch in parallel — never blocks the page if Connect tables
  // aren't seeded yet (returns []).
  const [conns, keys, audit] = await Promise.all([
    listConnections(),
    listApiKeys(),
    recentAuditLog(6),
  ]);
  const activeConns = conns.filter((c) => c.status === 'active');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Welcome row with avatar */}
      <header className="mb-10 flex items-center gap-5">
        {display.avatarUrl ? (
          <img
            src={display.avatarUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-2xl border border-border bg-surface shrink-0"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/40 to-fuchsia-500/40 text-text text-xl flex items-center justify-center font-bold shrink-0">
            {display.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/60 backdrop-blur text-xs text-muted mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Members area</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-accent">{display.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-xs text-muted mt-1">
            Signed in with {display.provider ?? 'email'} · {display.email}
          </p>
        </div>
      </header>

      {/* === StackPicks Connect rail === */}
      <section className="mb-10 rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/[0.08] via-accent/[0.03] to-transparent p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent mb-2 px-2 py-0.5 rounded-full border border-accent/40 bg-accent/10">
              <Plug className="w-3 h-3" />
              StackPicks Connect
            </div>
            <h2 className="text-xl md:text-2xl font-bold leading-tight">
              {activeConns.length === 0
                ? 'Connect your first app to Claude'
                : `${activeConns.length} app${activeConns.length === 1 ? '' : 's'} connected`}
            </h2>
            <p className="text-sm text-muted mt-1">
              {activeConns.length === 0
                ? 'One install, all your tools — GitHub, Gmail, Slack, Notion and 500+ more.'
                : `${keys.length} API key${keys.length === 1 ? '' : 's'} active · ready to paste into Claude / Cursor.`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/connect"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
            >
              <Plug className="w-4 h-4" />
              {activeConns.length === 0 ? 'Browse apps' : 'Add app'}
            </Link>
            <Link
              href="/dashboard/connections"
              className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border hover:border-accent/50 text-sm transition"
            >
              Manage
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Active connections — logo strip */}
        {activeConns.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-accent/15">
            {activeConns.slice(0, 8).map((c) => {
              const app = CONNECT_APPS.find((a) => a.slug === c.provider);
              return (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-2 h-9 pl-1 pr-3 rounded-full border border-border bg-bg/40"
                  title={`${app?.name ?? c.provider} as ${c.account_label}`}
                >
                  <AppLogo slug={c.provider} name={app?.name ?? c.provider} size={28} />
                  <span className="text-xs">{app?.name ?? c.provider}</span>
                </div>
              );
            })}
            {activeConns.length > 8 && (
              <Link
                href="/dashboard/connections"
                className="inline-flex items-center h-9 px-3 rounded-full border border-border text-xs text-muted hover:text-accent"
              >
                +{activeConns.length - 8} more
              </Link>
            )}
          </div>
        )}

        {/* Quick metrics + recent activity preview */}
        {(keys.length > 0 || audit.length > 0) && (
          <div className="mt-4 pt-4 border-t border-accent/15 grid sm:grid-cols-3 gap-3 text-xs">
            <Metric icon={<Plug className="w-3.5 h-3.5" />}     label="Connections" value={activeConns.length} />
            <Metric icon={<Key className="w-3.5 h-3.5" />}      label="API keys"    value={keys.length} />
            <Metric icon={<Activity className="w-3.5 h-3.5" />} label="Recent tool calls" value={audit.length} />
          </div>
        )}
      </section>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link href="/build" className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent transition">
          <LayoutDashboard className="w-5 h-5 text-accent mb-3" />
          <div className="font-bold mb-1">Stack bundles</div>
          <p className="text-sm text-muted">13 ready-to-ship stacks.</p>
        </Link>
        <Link href="/preview" className="rounded-2xl border border-border bg-surface/40 p-5 hover:border-accent transition">
          <Github className="w-5 h-5 text-accent mb-3" />
          <div className="font-bold mb-1">Directory</div>
          <p className="text-sm text-muted">100+ curated repos.</p>
        </Link>
        <Link href="/submit-repo" className="rounded-2xl border border-accent/40 bg-accent/5 p-5 hover:border-accent transition">
          <Sparkles className="w-5 h-5 text-accent mb-3" />
          <div className="font-bold mb-1">Submit a repo</div>
          <p className="text-sm text-muted">We&apos;ll feature the best.</p>
        </Link>
      </div>

      {/* Membership card */}
      <div className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6 mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
          Membership status
        </div>
        {isMember ? (
          <>
            <div className="text-lg font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Lifetime member
            </div>
            <p className="text-sm text-muted">
              Full directory + bundles unlocked. Thanks for backing the project.
            </p>
          </>
        ) : (
          <>
            <div className="text-lg font-bold mb-1">Free account</div>
            <p className="text-sm text-muted mb-4">
              You&apos;re signed in but haven&apos;t purchased the lifetime membership yet.
              Upgrade for full directory + bundle access.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg font-semibold text-sm hover:opacity-90 transition"
            >
              Upgrade — lifetime
            </Link>
          </>
        )}
      </div>

      {/* MCP Hub callout — secondary entry to the directory */}
      <div className="mb-10 p-5 rounded-2xl border border-border bg-surface/40 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">MCP Hub</div>
          <div className="font-semibold mb-1">Want individual MCP servers instead?</div>
          <p className="text-sm text-muted">
            Browse {89} curated MCP servers — filesystem, Postgres, Anthropic official, vendor-built — with one-click install for Claude / Cursor.
          </p>
        </div>
        <Link
          href="/mcp"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border hover:border-accent/50 text-sm transition"
        >
          Browse MCP servers
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Profile / settings link */}
      <div className="text-center">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition"
        >
          <User className="w-3.5 h-3.5" />
          Manage profile
        </Link>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-bg/40 px-3 py-2">
      <div className="w-7 h-7 rounded-md bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm tabular-nums">{value}</div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted truncate">{label}</div>
      </div>
    </div>
  );
}

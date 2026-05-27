import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Key, Plug } from 'lucide-react';
import { buildMeta } from '@stackpicks/core/seo';
import {
  getCurrentUserId,
  listConnections,
  listApiKeys,
  recentAuditLog,
} from '../../../lib/connect-server';
import { CONNECT_APPS } from '../../../lib/connect-apps';
import { ConnectionRow } from '../../../components/ConnectionRow';
import { ConnectExportButton } from '../../../components/ConnectExportButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMeta({
  title: 'Connections — StackPicks',
  description: 'Manage OAuth connections and API keys for StackPicks Connect.',
  path: '/dashboard/connections',
});

export default async function ConnectionsDashboard() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login?redirect=/dashboard/connections');

  const [conns, keys, audit] = await Promise.all([
    listConnections(),
    listApiKeys(),
    recentAuditLog(20),
  ]);

  const connectedSummary = conns
    .filter((c) => c.status === 'active')
    .map((c) => {
      const app = CONNECT_APPS.find((a) => a.slug === c.provider);
      return {
        slug: c.provider,
        name: app?.name ?? c.provider,
        accountLabel: c.account_label,
      };
    });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Dashboard
      </Link>

      <header className="mb-8 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Connections</h1>
          <p className="text-sm text-muted">
            Apps you&apos;ve connected to StackPicks. Used by the unified MCP gateway.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/connect"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border border-border hover:border-accent/50 text-sm"
          >
            <Plug className="w-4 h-4" />
            Add app
          </Link>
          <ConnectExportButton
            variant="inline"
            connected={connectedSummary}
            existingKeyPrefixes={keys.map((k) => k.key_prefix)}
            disabled={connectedSummary.length === 0}
            label="Get MCP config"
          />
        </div>
      </header>

      {/* Connections */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-3">Connected apps ({conns.length})</h2>
        {conns.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted mb-3">No apps connected yet.</p>
            <Link
              href="/connect"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-accent text-bg font-semibold text-sm"
            >
              Browse the directory
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conns.map((c) => {
              const app = CONNECT_APPS.find((a) => a.slug === c.provider);
              return (
                <ConnectionRow
                  key={c.id}
                  id={c.id}
                  provider={c.provider}
                  providerName={app?.name ?? c.provider}
                  accountLabel={c.account_label}
                  status={c.status}
                  connectedAt={c.connected_at}
                  lastUsedAt={c.last_used_at}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* API keys */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Key className="w-4 h-4" />
          API keys ({keys.length})
        </h2>
        {keys.length === 0 ? (
          <p className="text-sm text-muted">
            No keys yet. Generate one from the &quot;Get MCP config&quot; button above when you&apos;re ready to paste into Claude or Cursor.
          </p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            {keys.map((k) => (
              <div
                key={k.id}
                className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 text-sm"
              >
                <div className="font-mono text-xs">{k.key_prefix}…</div>
                <div className="flex-1 text-xs text-muted">
                  {k.name} · created {new Date(k.created_at).toLocaleDateString()}
                  {k.last_used_at && <> · last used {new Date(k.last_used_at).toLocaleDateString()}</>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Audit log preview */}
      <section>
        <h2 className="text-lg font-bold mb-3">Recent MCP activity</h2>
        {audit.length === 0 ? (
          <p className="text-sm text-muted">
            No tool calls yet. Once Claude or Cursor uses your StackPicks MCP, calls will show up here.
          </p>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden font-mono text-[11px]">
            {audit.map((row: any) => (
              <div
                key={row.id}
                className="flex items-center gap-3 px-4 py-2 border-b border-border last:border-0"
              >
                <span className="text-muted w-24 shrink-0">{new Date(row.created_at).toLocaleString()}</span>
                <span className="w-20 shrink-0">{row.provider}</span>
                <span className="flex-1 truncate">{row.tool_name}</span>
                <span
                  className={`shrink-0 ${
                    row.status === 'ok' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {row.status}
                </span>
                {row.latency_ms != null && (
                  <span className="text-muted w-12 shrink-0 text-right">{row.latency_ms}ms</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

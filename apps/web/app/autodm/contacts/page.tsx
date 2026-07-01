// AutoDM contacts — every IG user this creator has auto-DM'd, grouped
// by recipient. Shows clicked vs not-clicked breakdown, followup status,
// and quick links to open the recipient's IG DM thread for manual takeover.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';
import { Users, ArrowLeft, MousePointerClick, MessageSquare, ExternalLink, Download } from 'lucide-react';

export const metadata = {
  title: 'Contacts — StackPicks AutoDM',
  description: 'Every recipient your auto-DM bot has reached, with click + engagement status.',
};

interface LogRow {
  id: string;
  ig_user_id: string | null;
  ig_username: string | null;
  status: string;
  clicked_at: string | null;
  click_count: number;
  followup_sent_at: string | null;
  is_follower: boolean | null;
  created_at: string;
}

interface Contact {
  igsid: string;
  username: string | null;
  total_dms: number;
  clicks: number;
  last_dm_at: string;
  last_clicked_at: string | null;
  followup_count: number;
  is_follower: boolean | null;
  status: 'clicked' | 'no_click' | 'followed_up';
}

export default async function ContactsPage({
  searchParams,
}: { searchParams: Promise<{ filter?: string }> }) {
  const supaRoute = await getSupabaseServer();
  const { data: { user } } = await supaRoute.auth.getUser();
  if (!user) redirect('/login?next=/autodm/contacts');

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant } = await getActiveTenant(admin, user.id, preferredId);
  if (!tenant) redirect('/autodm/connect');

  // Pull last 1000 send attempts → group client-side per recipient
  const { data: logs } = await admin
    .from('autodm_dm_log')
    .select('id, ig_user_id, ig_username, status, clicked_at, click_count, followup_sent_at, is_follower, created_at')
    .eq('tenant_id', tenant.id as string)
    .eq('status', 'sent')
    .order('created_at', { ascending: false })
    .limit(1000);

  const byUser: Record<string, Contact> = {};
  for (const l of (logs ?? []) as LogRow[]) {
    const k = l.ig_user_id || l.ig_username || 'anon';
    if (!byUser[k]) {
      byUser[k] = {
        igsid: l.ig_user_id || '',
        username: l.ig_username,
        total_dms: 0,
        clicks: 0,
        last_dm_at: l.created_at,
        last_clicked_at: l.clicked_at,
        followup_count: 0,
        is_follower: l.is_follower,
        status: 'no_click',
      };
    }
    const c = byUser[k];
    c.total_dms++;
    c.clicks += l.click_count;
    if (l.clicked_at && (!c.last_clicked_at || l.clicked_at > c.last_clicked_at)) {
      c.last_clicked_at = l.clicked_at;
    }
    if (l.followup_sent_at) c.followup_count++;
    if (l.created_at > c.last_dm_at) c.last_dm_at = l.created_at;
  }
  const contacts = Object.values(byUser).map((c): Contact => ({
    ...c,
    status: c.clicks > 0 ? 'clicked' : (c.followup_count > 0 ? 'followed_up' : 'no_click'),
  }));

  const { filter } = await searchParams;
  const filtered = filter && filter !== 'all'
    ? contacts.filter((c) => c.status === filter)
    : contacts;
  filtered.sort((a, b) => +new Date(b.last_dm_at) - +new Date(a.last_dm_at));

  const counts = {
    all: contacts.length,
    clicked: contacts.filter((c) => c.status === 'clicked').length,
    no_click: contacts.filter((c) => c.status === 'no_click').length,
    followed_up: contacts.filter((c) => c.status === 'followed_up').length,
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <Link href="/autodm/dashboard" className="text-xs text-muted hover:text-text inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="w-3 h-3" /> Back to dashboard
      </Link>

      <div className="flex items-start gap-3 mb-2">
        <Users className="w-7 h-7 text-accent" />
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Contacts</h1>
          <p className="text-sm text-muted mt-1">
            Every recipient your bot has DM&apos;d. Clicked = hot lead. Reach out manually via Instagram if you want to follow up (Meta doesn&apos;t allow automated cold follow-ups).
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <a
          href={`/api/autodm/contacts/export${filter ? `?filter=${filter}` : ''}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text px-3 py-1.5 rounded-full border border-border hover:border-accent/40"
        >
          <Download className="w-3 h-3" /> Export CSV
        </a>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-border flex gap-1 mb-4 mt-3 overflow-x-auto">
        <Tab label="All" filter="all" current={filter || 'all'} count={counts.all} />
        <Tab label="Clicked" filter="clicked" current={filter || 'all'} count={counts.clicked} accent />
        <Tab label="No click" filter="no_click" current={filter || 'all'} count={counts.no_click} />
        <Tab label="Followed up" filter="followed_up" current={filter || 'all'} count={counts.followed_up} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <MessageSquare className="w-8 h-8 text-muted/50 mx-auto mb-3" />
          <p className="text-sm text-muted">No contacts in this view.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-muted bg-bg-card/40 border-b border-border">
                <th className="py-2.5 px-3 font-mono font-semibold">Recipient</th>
                <th className="py-2.5 px-3 font-mono font-semibold">Status</th>
                <th className="py-2.5 px-3 font-mono font-semibold text-right">DMs</th>
                <th className="py-2.5 px-3 font-mono font-semibold text-right">Clicks</th>
                <th className="py-2.5 px-3 font-mono font-semibold text-right">Last seen</th>
                <th className="py-2.5 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-b border-border/40 hover:bg-bg-card/30 transition">
                  <td className="py-3 px-3">
                    <div className="font-medium">@{c.username || 'anon'}</div>
                    {c.is_follower === true && <div className="text-[10px] text-emerald-500 mt-0.5">follower</div>}
                  </td>
                  <td className="py-3 px-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="py-3 px-3 text-right font-mono">{c.total_dms}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    {c.clicks > 0 ? (
                      <span className="inline-flex items-center gap-1 text-accent">
                        <MousePointerClick className="w-3 h-3" /> {c.clicks}
                      </span>
                    ) : (
                      <span className="text-muted">0</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-muted whitespace-nowrap">
                    {new Date(c.last_dm_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {c.igsid && (
                      <a
                        href={`https://www.instagram.com/direct/t/${c.igsid}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent"
                      >
                        IG <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] text-muted mt-4">
        Click counts are tracked via short-link redirect through autodm.stackpicks.dev/c/&lt;id&gt;.
        The &quot;followed up&quot; column is historical — automated proactive follow-ups were removed to stay strictly Meta Private Reply-compliant. Reach out to hot leads manually via Instagram.
      </p>
    </main>
  );
}

function Tab({ label, filter, current, count, accent }: { label: string; filter: string; current: string; count: number; accent?: boolean }) {
  const isActive = current === filter;
  return (
    <Link
      href={filter === 'all' ? '/autodm/contacts' : `/autodm/contacts?filter=${filter}`}
      className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition ${
        isActive ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'
      }`}
    >
      {label}
      <span className={`ml-2 inline-block min-w-[1.25rem] text-center text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
        accent && count > 0 ? 'bg-accent/15 text-accent' : 'bg-muted/15 text-muted'
      }`}>
        {count}
      </span>
    </Link>
  );
}

function StatusPill({ status }: { status: 'clicked' | 'no_click' | 'followed_up' }) {
  if (status === 'clicked') {
    return <span className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">Clicked</span>;
  }
  if (status === 'followed_up') {
    return <span className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold">Followed up</span>;
  }
  return <span className="inline-block text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted/10 text-muted font-semibold">No click</span>;
}

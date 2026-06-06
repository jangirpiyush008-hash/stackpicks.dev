/**
 * Contacts CSV export.
 *
 *   GET /api/autodm/contacts/export?filter=all|clicked|no_click|followed_up
 *
 * Returns a Content-Disposition: attachment CSV of all DM recipients
 * for the active tenant. Same grouping logic as /autodm/contacts page.
 * Caps at 5000 sends to keep memory bounded; that's ~6 months of
 * activity for a Pro creator.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { getActiveTenant, ACTIVE_TENANT_COOKIE } from '@stackpicks/core/autodm/active-tenant';

export const runtime = 'nodejs';

interface LogRow {
  ig_user_id: string | null;
  ig_username: string | null;
  clicked_at: string | null;
  click_count: number;
  followup_sent_at: string | null;
  is_follower: boolean | null;
  created_at: string;
}
interface Contact {
  username: string;
  igsid: string;
  total_dms: number;
  clicks: number;
  last_dm_at: string;
  last_clicked_at: string | null;
  followup_count: number;
  is_follower: boolean | null;
}

export async function GET(req: NextRequest) {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'auth' }, { status: 401 });

  const admin = adminClient();
  const cookieStore = await cookies();
  const preferredId = cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
  const { tenant } = await getActiveTenant(admin, user.id, preferredId);
  if (!tenant) return NextResponse.json({ ok: false, error: 'no_tenant' }, { status: 404 });

  const { data: logs } = await admin
    .from('autodm_dm_log')
    .select('ig_user_id, ig_username, clicked_at, click_count, followup_sent_at, is_follower, created_at')
    .eq('tenant_id', tenant.id as string)
    .eq('status', 'sent')
    .order('created_at', { ascending: false })
    .limit(5000);

  const byUser: Record<string, Contact> = {};
  for (const l of (logs ?? []) as LogRow[]) {
    const k = l.ig_user_id || l.ig_username || 'anon';
    if (!byUser[k]) {
      byUser[k] = {
        username: l.ig_username || '',
        igsid: l.ig_user_id || '',
        total_dms: 0, clicks: 0,
        last_dm_at: l.created_at,
        last_clicked_at: l.clicked_at,
        followup_count: 0,
        is_follower: l.is_follower,
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

  const filter = new URL(req.url).searchParams.get('filter');
  let contacts = Object.values(byUser);
  if (filter === 'clicked') contacts = contacts.filter((c) => c.clicks > 0);
  else if (filter === 'no_click') contacts = contacts.filter((c) => c.clicks === 0 && c.followup_count === 0);
  else if (filter === 'followed_up') contacts = contacts.filter((c) => c.followup_count > 0);
  contacts.sort((a, b) => +new Date(b.last_dm_at) - +new Date(a.last_dm_at));

  const header = [
    'ig_username', 'ig_user_id', 'is_follower',
    'total_dms', 'clicks', 'last_dm_at', 'last_clicked_at', 'followups_sent',
  ];
  const rows = contacts.map((c) => [
    c.username, c.igsid,
    c.is_follower === true ? 'yes' : c.is_follower === false ? 'no' : '',
    String(c.total_dms), String(c.clicks),
    c.last_dm_at, c.last_clicked_at || '',
    String(c.followup_count),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');

  const filename = `autodm-contacts-${(tenant.ig_username || 'export')}-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

function csvCell(v: string): string {
  if (v == null) return '';
  // Quote if it contains comma, quote, newline, or starts with =/+/-/@
  // (the @= prefix is to defeat CSV-injection on spreadsheet apps)
  if (/[",\n\r]/.test(v) || /^[=+\-@]/.test(v)) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

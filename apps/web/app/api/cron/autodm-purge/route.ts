/**
 * Daily privacy purge — enforces the retention windows documented in
 * migration 20260622000002_autodm_pii_retention_limits.sql.
 *
 *   Webhook payloads (ig_webhook_log)  → 7-day TTL
 *   AutoDM logs    (autodm_dm_log)     → 90-day TTL
 *   Legacy DM logs (ig_dm_log)         → 90-day TTL
 *
 * Schedule via cron-job.org once per day. Endpoint is bearer-token
 * authed (same CRON_SECRET used by other crons) and idempotent —
 * running it twice in one day just deletes nothing the second time.
 *
 * Why these windows:
 *   90 days = enough for any reasonable tenant support ticket
 *     ("recipient says they didn't get the DM yesterday → check log")
 *     without becoming a long-term audience database
 *   7 days = raw webhook payloads are diagnostic only; once
 *     a DM has been processed there's no reason to keep the
 *     verbatim Meta event payload
 */
import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supa = adminClient();
  const results: Record<string, number | string> = {};

  for (const fn of [
    'purge_ig_webhook_log_old',
    'purge_autodm_webhook_log_old',
    'purge_autodm_dm_log_old',
    'purge_ig_dm_log_old',
  ] as const) {
    try {
      const { data, error } = await supa.rpc(fn);
      if (error) results[fn] = `error:${error.message}`;
      else results[fn] = (data as number) ?? 0;
    } catch (e) {
      results[fn] = `throw:${(e as Error).message}`;
    }
  }

  return NextResponse.json({ ok: true, purged_at: new Date().toISOString(), results });
}

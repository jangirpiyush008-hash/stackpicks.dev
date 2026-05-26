// Toggle / update SEO calendar task completion. Admin-only.
// POST body: { day: number, completed: boolean, notes?: string }

import { NextResponse, type NextRequest } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { isAdmin } from '../../../../lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const gate = await isAdmin();
  if (!gate.ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { day?: number; completed?: boolean; notes?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const day = typeof body.day === 'number' ? body.day : null;
  if (!day || day < 1 || day > 90) {
    return NextResponse.json({ error: 'invalid_day' }, { status: 400 });
  }

  const supabase = adminClient();
  const completed_at = body.completed ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('seo_tasks')
    .upsert({
      day_number: day,
      completed_at,
      notes: body.notes ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'day_number' });

  if (error) {
    console.error('[seo-task] upsert failed:', error);
    return NextResponse.json({ error: 'db_error', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, day, completed: !!completed_at });
}

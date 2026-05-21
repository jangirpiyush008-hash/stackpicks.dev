import { adminClient } from '@stackpicks/core/db';
import { fetchManyRepos, slugFromFullName } from '@stackpicks/core/github';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 min for big batches

/**
 * Daily cron: refreshes all tracked repos.
 * Triggered by Vercel Cron at 2 AM IST (configured in vercel.json).
 *
 * Security: requires Authorization: Bearer ${CRON_SECRET}.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = adminClient();
  const startedAt = Date.now();

  // 1. Get all tracked repos (full_names)
  const { data: existing, error: fetchErr } = await supabase
    .from('repos')
    .select('id, full_name, stars');

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 500 });
  }

  if (!existing || existing.length === 0) {
    return NextResponse.json({ ok: true, message: 'No repos to refresh' });
  }

  // 2. Snapshot current stars for velocity calc
  const previousStars = new Map(existing.map((r) => [r.full_name, r.stars]));

  // 3. Fetch fresh data from GitHub
  const fullNames = existing.map((r) => r.full_name);
  const fresh = await fetchManyRepos(fullNames);

  // 4. Upsert with velocity = current_stars - last_week_snapshot
  // (Simplification: in production, store a daily snapshot table for true 7-day delta.
  //  For v1, we compute delta vs yesterday's value.)
  const updates = fresh.map((r) => ({
    github_id: r.github_id,
    slug: slugFromFullName(r.full_name),
    owner: r.owner,
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    homepage: r.homepage,
    github_url: r.github_url,
    language: r.language,
    topics: r.topics,
    license: r.license,
    stars: r.stars,
    forks: r.forks,
    open_issues: r.open_issues,
    watchers: r.watchers,
    stars_last_week: r.stars - (previousStars.get(r.full_name) ?? r.stars),
    pushed_at: r.pushed_at,
    github_created_at: r.github_created_at,
  }));

  const { error: upsertErr } = await supabase
    .from('repos')
    .upsert(updates, { onConflict: 'github_id' });

  if (upsertErr) {
    return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    refreshed: updates.length,
    duration_ms: Date.now() - startedAt,
  });
}

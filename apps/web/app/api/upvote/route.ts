// POST /api/upvote — anonymous, IP-hashed upvote.
// GET  /api/upvote?repo_id=... — current count (used after optimistic UI to reconcile).
//
// Anti-spam strategy (no login required):
// 1. IP is SHA-256 hashed with a daily-rotating salt — no persistent identity,
//    no PII stored. The salt rotates at IST midnight so we CAN'T reconstruct
//    a user's history across days.
// 2. UNIQUE (repo_id, ip_hash) constraint enforces 1 vote per IP per day per
//    repo at the DB level. Duplicate inserts return error code 23505 and we
//    silently treat them as "already voted today".
// 3. Service-role insert (server-only). Browser never touches the table.

import { NextResponse, type NextRequest } from 'next/server';
import { adminClient } from '@stackpicks/core/db';
import { getRepoUpvoteCount, insertRepoUpvote } from '@stackpicks/core/db/queries';
import { hashIP, dailySalt } from '@stackpicks/core/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const repoId = typeof (body as { repo_id?: unknown })?.repo_id === 'string'
    ? (body as { repo_id: string }).repo_id
    : null;
  // Defensive: only accept UUID-shaped strings to avoid SQL surprises.
  if (!repoId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(repoId)) {
    return NextResponse.json({ error: 'invalid_repo_id' }, { status: 400 });
  }

  const ip = getIp(req);
  const ipHash = await hashIP(ip, dailySalt());

  try {
    const supabase = adminClient();
    const { inserted, count } = await insertRepoUpvote(supabase, repoId, ipHash);
    return NextResponse.json(
      { ok: true, inserted, count },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('upvote insert failed:', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const repoId = new URL(req.url).searchParams.get('repo_id');
  if (!repoId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(repoId)) {
    return NextResponse.json({ error: 'invalid_repo_id' }, { status: 400 });
  }
  const supabase = adminClient();
  const count = await getRepoUpvoteCount(supabase, repoId);
  return NextResponse.json(
    { count },
    { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } }
  );
}

/**
 * Public AutoDM waitlist signup.
 *
 *   POST /api/autodm/waitlist  { email, platform }
 *
 * No auth — anyone can join. Stores email + platform in autodm_waitlist
 * with a per-(email,platform) unique constraint so duplicate clicks just
 * return ok without erroring. IP is hashed (daily-rotating salt is
 * overkill for a sign-up form, so we just SHA-256 the raw IP).
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLATFORMS = ['linkedin', 'x'] as const;
type Platform = (typeof PLATFORMS)[number];

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function POST(req: NextRequest) {
  let body: { email?: string; platform?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 }); }

  const email = (body.email ?? '').trim().toLowerCase();
  const platform = body.platform as Platform;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!PLATFORMS.includes(platform)) {
    return NextResponse.json({ ok: false, error: 'invalid_platform' }, { status: 400 });
  }

  const ua = req.headers.get('user-agent')?.slice(0, 300) ?? null;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;

  const admin = adminClient();
  const { error } = await admin.from('autodm_waitlist').insert({
    email,
    platform,
    user_agent: ua,
    ip_hash: hashIp(ip),
  });

  // 23505 = unique_violation. Treat as success — they're already in.
  if (error && error.code !== '23505') {
    return NextResponse.json({ ok: false, error: 'db' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

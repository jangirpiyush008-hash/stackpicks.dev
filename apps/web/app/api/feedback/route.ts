import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, hashIp, clientIp } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface FeedbackPayload {
  email: string;
  missing_repo: string;
  source?: string;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  const limKey = `feedback:${hashIp(clientIp(req)) ?? 'unknown'}`;
  const lim = rateLimit(limKey, { max: 5, windowMs: 60 * 1000 });
  if (!lim.ok) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });

  let body: FeedbackPayload;
  try {
    body = (await req.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const email = body.email?.trim();
  const missing = body.missing_repo?.trim();
  const source = body.source?.trim().slice(0, 64) ?? 'unknown';

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (!missing || missing.length < 2 || missing.length > 500) {
    return NextResponse.json({ ok: false, error: 'invalid_missing' }, { status: 400 });
  }

  // Persist to Supabase if env is wired. Falls back to console-only logging
  // when env is missing so the form still feels responsive in any environment.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { adminClient } = await import('@stackpicks/core/db');
      const supabase = adminClient();
      const { error } = await supabase.from('feedback_requests').insert({
        email,
        missing_repo: missing,
        source,
        user_agent: req.headers.get('user-agent') ?? null,
      });
      // If the table doesn't exist yet, log + still 200 — we don't want to lose the lead.
      if (error) console.error('[feedback] DB insert failed (table missing?):', error.message);
    } catch (err) {
      console.error('[feedback] persistence threw:', err);
    }
  }

  // Always log structured so we can grep Railway logs even if DB write failed.
  console.log(JSON.stringify({
    type: 'feedback_request',
    email,
    missing_repo: missing,
    source,
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true });
}

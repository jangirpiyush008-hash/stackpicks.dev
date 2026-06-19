/**
 * POST /api/auth/validate-email  { email }
 *   → { ok: true } if the email looks real (format + non-disposable
 *     domain + has an MX record), otherwise:
 *   → { ok: false, reason, suggestion? } so the form can show a
 *     useful inline error.
 *
 * Rate-limited per IP to keep this off being a free MX-lookup service.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/email-validate';
import { rateLimit, clientIp, hashIp } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ipKey = `validate-email:${hashIp(clientIp(req)) ?? 'unknown'}`;
  const lim = rateLimit(ipKey, { max: 30, windowMs: 60 * 1000 });
  if (!lim.ok) {
    return NextResponse.json({ ok: false, reason: 'rate_limited' }, { status: 429 });
  }

  let body: { email?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, reason: 'bad_json' }, { status: 400 }); }

  const result = await validateEmail(body.email ?? '');
  return NextResponse.json(result);
}

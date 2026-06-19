import { adminClient } from '@stackpicks/core/db';
import { newsletterSignupSchema } from '@stackpicks/core/validation';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, hashIp, clientIp } from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const limKey = `newsletter:${hashIp(clientIp(req)) ?? 'unknown'}`;
  const lim = rateLimit(limKey, { max: 10, windowMs: 60 * 1000 });
  if (!lim.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  try {
    const contentType = req.headers.get('content-type') ?? '';
    let body: { email?: string; source?: string };

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = {
        email: form.get('email')?.toString(),
        source: form.get('source')?.toString(),
      };
    }

    const parsed = newsletterSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'invalid_input', message: parsed.error.errors[0].message } },
        { status: 400 }
      );
    }

    const supabase = adminClient();
    const { error } = await supabase.from('newsletter_subs').upsert(
      {
        email: parsed.data.email.toLowerCase().trim(),
        source: parsed.data.source ?? 'unknown',
      },
      { onConflict: 'email' }
    );

    if (error) {
      console.error('Newsletter signup DB error:', error);
      return NextResponse.json(
        { ok: false, error: { code: 'db_error', message: 'Could not save signup' } },
        { status: 500 }
      );
    }

    // Auto-sync to Resend Audience so the email flows straight into the
    // sending list (no manual CSV export). Fire-and-forget — never block or
    // fail the signup if Resend is down or not configured.
    void syncToResend(parsed.data.email.toLowerCase().trim());

    // Plain-form fallback: redirect back with success param
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/?subscribed=1', req.url));
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Newsletter signup unexpected error:', err);
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Unexpected error' } },
      { status: 500 }
    );
  }
}

/**
 * Add a contact to the Resend Audience so signups become sendable without a
 * manual export. No-op (logged) if RESEND_API_KEY / RESEND_AUDIENCE_ID aren't
 * set yet. Idempotent — Resend dedupes by email.
 */
async function syncToResend(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return; // not configured yet — DB still has it

  try {
    await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  } catch (e) {
    console.error('[newsletter] Resend sync failed (non-fatal):', e);
  }
}

import { adminClient } from '@stackpicks/core/db';
import { newsletterSignupSchema } from '@stackpicks/core/validation';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
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

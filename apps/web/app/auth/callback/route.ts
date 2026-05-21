import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase-server';

/**
 * Handles the OAuth + email-link callback from Supabase Auth.
 * Exchanges the `code` query param for a session cookie, then redirects
 * to wherever the sign-in flow wanted to send the user next.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await getSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

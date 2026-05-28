import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase-server';
import { getClient, issueAuthCode } from '@stackpicks/core/oauth/server';
import { SITE } from '@stackpicks/core/constants';

/**
 * GET /api/oauth/authorize — OAuth 2.1 authorization endpoint (PKCE).
 *
 * Flow:
 *   1. Validate client_id + redirect_uri against the registered client.
 *   2. If the user has no StackPicks session → bounce to /login?next=<this URL>.
 *      After they log in, they come right back here with a session.
 *   3. Logged in → issue a single-use auth code, redirect to the client's
 *      redirect_uri with ?code=…&state=….
 *
 * The login itself is the consent step — the user is authorising their own
 * StackPicks account to be reached by the AI client.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const p = url.searchParams;

  const clientId = p.get('client_id');
  const redirectUri = p.get('redirect_uri');
  const responseType = p.get('response_type');
  const codeChallenge = p.get('code_challenge');
  const codeChallengeMethod = p.get('code_challenge_method') ?? 'S256';
  const state = p.get('state');
  const scope = p.get('scope') ?? 'mcp';
  const resource = p.get('resource') ?? undefined;

  // --- Validate request ---
  if (responseType !== 'code') {
    return errorRedirect(redirectUri, state, 'unsupported_response_type', 'Only code is supported');
  }
  if (!clientId || !redirectUri || !codeChallenge) {
    return new NextResponse('missing client_id, redirect_uri, or code_challenge', { status: 400 });
  }
  if (codeChallengeMethod !== 'S256') {
    return errorRedirect(redirectUri, state, 'invalid_request', 'Only S256 PKCE is supported');
  }

  const client = await getClient(clientId);
  if (!client) {
    return new NextResponse('unknown client_id', { status: 400 });
  }
  if (!client.redirect_uris.includes(redirectUri)) {
    return new NextResponse('redirect_uri not registered for this client', { status: 400 });
  }

  // --- Auth check ---
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Bounce to login, then come back to this exact authorize URL.
    const back = `/api/oauth/authorize${url.search}`;
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(back)}`, SITE.url),
    );
  }

  // --- Issue code ---
  const code = await issueAuthCode({
    userId: user.id,
    clientId,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
    scope,
    resource,
  });

  const dest = new URL(redirectUri);
  dest.searchParams.set('code', code);
  if (state) dest.searchParams.set('state', state);
  return NextResponse.redirect(dest.toString());
}

function errorRedirect(
  redirectUri: string | null,
  state: string | null,
  error: string,
  description: string,
) {
  if (!redirectUri) {
    return new NextResponse(`${error}: ${description}`, { status: 400 });
  }
  const dest = new URL(redirectUri);
  dest.searchParams.set('error', error);
  dest.searchParams.set('error_description', description);
  if (state) dest.searchParams.set('state', state);
  return NextResponse.redirect(dest.toString());
}

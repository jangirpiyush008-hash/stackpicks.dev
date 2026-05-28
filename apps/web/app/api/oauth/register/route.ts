import { NextResponse } from 'next/server';
import { registerClient } from '@stackpicks/core/oauth/server';

/**
 * POST /api/oauth/register — Dynamic Client Registration (RFC 7591).
 * Claude calls this to register itself before the auth flow. Public clients
 * (PKCE), so no client_secret is issued.
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  let body: { client_name?: string; redirect_uris?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_client_metadata', error_description: 'bad json' },
      { status: 400, headers: CORS },
    );
  }

  const redirectUris = Array.isArray(body.redirect_uris) ? body.redirect_uris : [];
  if (redirectUris.length === 0) {
    return NextResponse.json(
      { error: 'invalid_redirect_uri', error_description: 'redirect_uris required' },
      { status: 400, headers: CORS },
    );
  }

  const client = await registerClient({
    client_name: body.client_name,
    redirect_uris: redirectUris,
  });

  return NextResponse.json(
    {
      client_id: client.client_id,
      client_name: client.client_name,
      redirect_uris: client.redirect_uris,
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    },
    { status: 201, headers: CORS },
  );
}

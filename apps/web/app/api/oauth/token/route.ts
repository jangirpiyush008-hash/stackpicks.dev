import { NextResponse } from 'next/server';
import { exchangeCode, refreshAccessToken } from '@stackpicks/core/oauth/server';

/**
 * POST /api/oauth/token — OAuth 2.1 token endpoint.
 * Supports grant_type=authorization_code (with PKCE) and refresh_token.
 * Accepts form-encoded body (OAuth standard) or JSON.
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
  const params = await parseBody(req);

  const grantType = params.get('grant_type');

  if (grantType === 'authorization_code') {
    const result = await exchangeCode({
      code: params.get('code') ?? '',
      clientId: params.get('client_id') ?? '',
      redirectUri: params.get('redirect_uri') ?? '',
      codeVerifier: params.get('code_verifier') ?? '',
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, error_description: result.error_description },
        { status: 400, headers: CORS },
      );
    }
    return NextResponse.json(
      {
        access_token: result.access_token,
        token_type: 'Bearer',
        expires_in: result.expires_in,
        refresh_token: result.refresh_token,
        scope: result.scope,
      },
      { headers: { ...CORS, 'Cache-Control': 'no-store' } },
    );
  }

  if (grantType === 'refresh_token') {
    const result = await refreshAccessToken({
      refreshToken: params.get('refresh_token') ?? '',
      clientId: params.get('client_id') ?? '',
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, error_description: result.error_description },
        { status: 400, headers: CORS },
      );
    }
    return NextResponse.json(
      {
        access_token: result.access_token,
        token_type: 'Bearer',
        expires_in: result.expires_in,
        refresh_token: result.refresh_token,
        scope: result.scope,
      },
      { headers: { ...CORS, 'Cache-Control': 'no-store' } },
    );
  }

  return NextResponse.json(
    { error: 'unsupported_grant_type', error_description: `Unsupported grant_type: ${grantType}` },
    { status: 400, headers: CORS },
  );
}

/** OAuth token endpoints traditionally use form-encoding; some clients send JSON. */
async function parseBody(req: Request): Promise<URLSearchParams> {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    try {
      const obj = (await req.json()) as Record<string, string>;
      return new URLSearchParams(obj);
    } catch {
      return new URLSearchParams();
    }
  }
  const text = await req.text();
  return new URLSearchParams(text);
}

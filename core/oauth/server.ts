// OAuth 2.1 Authorization Server primitives for the MCP integration.
// Service-role only — these run inside the /api/oauth/* route handlers.

import { randomBytes, createHash } from 'crypto';
import { adminClient } from '../db';
import { SITE } from '../constants';

const ACCESS_TTL_MS = 30 * 24 * 60 * 60 * 1000;   // 30 days
const REFRESH_TTL_MS = 365 * 24 * 60 * 60 * 1000;  // 1 year
const CODE_TTL_MS = 10 * 60 * 1000;                // 10 minutes

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}
function randomToken(prefix: string): string {
  return `${prefix}${randomBytes(32).toString('base64url')}`;
}

// ---- Discovery metadata ---------------------------------------------------

export function authorizationServerMetadata() {
  return {
    issuer: SITE.url,
    authorization_endpoint: `${SITE.url}/api/oauth/authorize`,
    token_endpoint: `${SITE.url}/api/oauth/token`,
    registration_endpoint: `${SITE.url}/api/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    scopes_supported: ['mcp'],
  };
}

export function protectedResourceMetadata() {
  return {
    resource: `${SITE.url}/api/mcp`,
    authorization_servers: [SITE.url],
    scopes_supported: ['mcp'],
    bearer_methods_supported: ['header'],
  };
}

// ---- Dynamic Client Registration (RFC 7591) -------------------------------

export async function registerClient(input: {
  client_name?: string;
  redirect_uris: string[];
}): Promise<{ client_id: string; client_name?: string; redirect_uris: string[] }> {
  const clientId = randomToken('mcp_client_');
  const admin = adminClient();
  await admin.from('oauth_clients').insert({
    client_id: clientId,
    client_name: input.client_name ?? 'MCP Client',
    redirect_uris: input.redirect_uris,
    token_endpoint_auth_method: 'none',
  });
  return { client_id: clientId, client_name: input.client_name, redirect_uris: input.redirect_uris };
}

export async function getClient(clientId: string) {
  const admin = adminClient();
  const { data } = await admin
    .from('oauth_clients')
    .select('client_id, redirect_uris, client_name')
    .eq('client_id', clientId)
    .maybeSingle();
  return data;
}

// ---- Authorization code ---------------------------------------------------

export async function issueAuthCode(input: {
  userId: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  scope?: string;
  resource?: string;
}): Promise<string> {
  const code = randomToken('mcp_code_');
  const admin = adminClient();
  await admin.from('oauth_auth_codes').insert({
    code,
    user_id: input.userId,
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    code_challenge: input.codeChallenge,
    code_challenge_method: input.codeChallengeMethod || 'S256',
    scope: input.scope ?? 'mcp',
    resource: input.resource ?? null,
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });
  return code;
}

/** Verify PKCE: base64url(sha256(verifier)) === stored challenge. */
function verifyPkce(verifier: string, challenge: string): boolean {
  const computed = createHash('sha256').update(verifier).digest('base64url');
  return computed === challenge;
}

export async function exchangeCode(input: {
  code: string;
  clientId: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<
  | { ok: true; access_token: string; refresh_token: string; expires_in: number; scope: string }
  | { ok: false; error: string; error_description: string }
> {
  const admin = adminClient();
  const { data: row } = await admin
    .from('oauth_auth_codes')
    .select('*')
    .eq('code', input.code)
    .maybeSingle();

  if (!row) return { ok: false, error: 'invalid_grant', error_description: 'Unknown authorization code' };
  if (row.used) return { ok: false, error: 'invalid_grant', error_description: 'Code already used' };
  if (new Date(row.expires_at).getTime() < Date.now())
    return { ok: false, error: 'invalid_grant', error_description: 'Code expired' };
  if (row.client_id !== input.clientId)
    return { ok: false, error: 'invalid_grant', error_description: 'Client mismatch' };
  if (row.redirect_uri !== input.redirectUri)
    return { ok: false, error: 'invalid_grant', error_description: 'redirect_uri mismatch' };
  if (!verifyPkce(input.codeVerifier, row.code_challenge))
    return { ok: false, error: 'invalid_grant', error_description: 'PKCE verification failed' };

  // Single-use: mark consumed.
  await admin.from('oauth_auth_codes').update({ used: true }).eq('code', input.code);

  // Issue tokens.
  const accessToken = randomToken('mcp_at_');
  const refreshToken = randomToken('mcp_rt_');
  await admin.from('mcp_oauth_tokens').insert({
    user_id: row.user_id,
    client_id: row.client_id,
    access_hash: sha256(accessToken),
    refresh_hash: sha256(refreshToken),
    scope: row.scope ?? 'mcp',
    access_expires_at: new Date(Date.now() + ACCESS_TTL_MS).toISOString(),
    refresh_expires_at: new Date(Date.now() + REFRESH_TTL_MS).toISOString(),
  });

  return {
    ok: true,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Math.floor(ACCESS_TTL_MS / 1000),
    scope: row.scope ?? 'mcp',
  };
}

export async function refreshAccessToken(input: {
  refreshToken: string;
  clientId: string;
}): Promise<
  | { ok: true; access_token: string; refresh_token: string; expires_in: number; scope: string }
  | { ok: false; error: string; error_description: string }
> {
  const admin = adminClient();
  const { data: row } = await admin
    .from('mcp_oauth_tokens')
    .select('*')
    .eq('refresh_hash', sha256(input.refreshToken))
    .maybeSingle();

  if (!row || row.revoked_at)
    return { ok: false, error: 'invalid_grant', error_description: 'Unknown or revoked refresh token' };
  if (row.refresh_expires_at && new Date(row.refresh_expires_at).getTime() < Date.now())
    return { ok: false, error: 'invalid_grant', error_description: 'Refresh token expired' };

  // Rotate: revoke old, issue new pair.
  const accessToken = randomToken('mcp_at_');
  const refreshToken = randomToken('mcp_rt_');
  await admin.from('mcp_oauth_tokens').update({ revoked_at: new Date().toISOString() }).eq('id', row.id);
  await admin.from('mcp_oauth_tokens').insert({
    user_id: row.user_id,
    client_id: row.client_id,
    access_hash: sha256(accessToken),
    refresh_hash: sha256(refreshToken),
    scope: row.scope,
    access_expires_at: new Date(Date.now() + ACCESS_TTL_MS).toISOString(),
    refresh_expires_at: new Date(Date.now() + REFRESH_TTL_MS).toISOString(),
  });

  return {
    ok: true,
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Math.floor(ACCESS_TTL_MS / 1000),
    scope: row.scope ?? 'mcp',
  };
}

/** Validate an access token on the MCP endpoint. Returns the user, or null. */
export async function verifyAccessToken(
  accessToken: string,
): Promise<{ userId: string; tokenId: string } | null> {
  if (!accessToken.startsWith('mcp_at_')) return null;
  const admin = adminClient();
  const { data: row } = await admin
    .from('mcp_oauth_tokens')
    .select('id, user_id, access_expires_at, revoked_at')
    .eq('access_hash', sha256(accessToken))
    .maybeSingle();

  if (!row || row.revoked_at) return null;
  if (new Date(row.access_expires_at).getTime() < Date.now()) return null;

  admin
    .from('mcp_oauth_tokens')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', row.id)
    .then(() => undefined, () => undefined);

  return { userId: row.user_id as string, tokenId: row.id as string };
}

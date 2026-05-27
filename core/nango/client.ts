// Nango client wrapper — gives us a stable surface so the rest of the
// codebase doesn't import @nangohq/node directly. Easier to swap brokers
// later (Composio, Pipedream Connect) without churning callers.
//
// We deliberately use the REST API directly (no SDK dependency) so the
// Next.js edge / serverless cold-starts stay tiny. Nango's HTTP surface
// is small and stable.

const NANGO_HOST = (process.env.NANGO_HOST ?? 'https://api.nango.dev').replace(/\/$/, '');
const NANGO_SECRET = process.env.NANGO_SECRET_KEY;

export function nangoConfigured(): boolean {
  return !!NANGO_SECRET;
}

async function nango<T>(path: string, init?: RequestInit): Promise<T> {
  if (!NANGO_SECRET) {
    throw new Error('NANGO_SECRET_KEY is not set — Connect OAuth is not yet wired.');
  }
  const res = await fetch(`${NANGO_HOST}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NANGO_SECRET}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Nango ${res.status}: ${body || res.statusText}`);
  }
  return (await res.json()) as T;
}

/**
 * Creates a hosted Connect Session that the user can complete in their
 * browser. Returns a one-time URL we redirect them to. After approval,
 * Nango calls our callback URL with `connection_id` in the query string.
 *
 * Provider config keys in Nango must match our slug (`github`, `gmail`,
 * `slack`, `notion`, `discord`, `google-drive`).
 */
export async function createConnectSession(opts: {
  provider: string;
  endUserId: string;
  endUserEmail?: string;
  redirectUri: string;
}): Promise<{ url: string; sessionToken: string }> {
  const data = await nango<{ data: { token: string } }>(
    `/connect/sessions`,
    {
      method: 'POST',
      body: JSON.stringify({
        end_user: { id: opts.endUserId, email: opts.endUserEmail },
        allowed_integrations: [opts.provider],
      }),
    },
  );
  // Nango's hosted Connect UI URL — works for every provider.
  const url = `${NANGO_HOST.replace('api.', '')}/connect?session_token=${data.data.token}`;
  return { url, sessionToken: data.data.token };
}

/**
 * Fetches a fresh access token for an existing Nango connection. Nango
 * handles refresh-token rotation; we just call this on every gateway request
 * and get back a valid bearer token.
 */
export async function getAccessToken(opts: {
  connectionId: string;
  provider: string;
}): Promise<string> {
  const data = await nango<{ credentials: { access_token: string } }>(
    `/connection/${encodeURIComponent(opts.connectionId)}?provider_config_key=${encodeURIComponent(opts.provider)}`,
  );
  return data.credentials.access_token;
}

/** Revokes a connection (and its upstream OAuth token). */
export async function deleteConnection(opts: {
  connectionId: string;
  provider: string;
}): Promise<void> {
  await nango(
    `/connection/${encodeURIComponent(opts.connectionId)}?provider_config_key=${encodeURIComponent(opts.provider)}`,
    { method: 'DELETE' },
  );
}

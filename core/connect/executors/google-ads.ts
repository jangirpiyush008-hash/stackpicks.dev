// Google Ads tool executor — BYO-token mode (API-key path), aligned with the
// official Google Ads MCP server (developers.google.com/google-ads/api/docs/
// developer-toolkit/mcp-server) on tool semantics and API surface.
//
// Differences from the official server:
//   * Auth: we use Bring-Your-Own-Token (the user supplies their own approved
//     developer_token + OAuth refresh_token) so we can serve real ad data
//     without holding Standard Access on a StackPicks-owned OAuth client.
//     The official server requires the operator to hold those approvals.
//   * Tool prefix: every tool is namespaced `google_ads_*` because the
//     StackPicks gateway exposes many providers from one connection URL.
//
// User-supplied JSON shape (stored encrypted in api_key_connections):
//   {
//     "developer_token":    "abc123...",          // from Google Ads API Center
//     "client_id":          "xxx.apps.googleusercontent.com",
//     "client_secret":      "GOCSPX-...",
//     "refresh_token":      "1//0g...",
//     "login_customer_id":  "1234567890"          // optional manager (MCC) id
//   }
//
// API version: v24 (June 2026 stable). v17 is sunset, v20 sunsets 2026-06-10.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const GADS_VERSION = 'v24';
const GADS = `https://googleads.googleapis.com/${GADS_VERSION}`;
const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface GAdsConfig {
  developer_token: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
  login_customer_id?: string;
}

function parseConfig(raw: string): GAdsConfig {
  let cfg: Partial<GAdsConfig>;
  try {
    cfg = JSON.parse(raw);
  } catch {
    throw new Error('Google Ads config must be a JSON blob with developer_token, client_id, client_secret, refresh_token (and optional login_customer_id).');
  }
  const missing = (['developer_token', 'client_id', 'client_secret', 'refresh_token'] as const).filter((k) => !cfg[k]);
  if (missing.length) throw new Error(`Google Ads config missing: ${missing.join(', ')}`);
  return cfg as GAdsConfig;
}

async function mintAccessToken(cfg: GAdsConfig): Promise<string> {
  const body = new URLSearchParams({
    client_id: cfg.client_id,
    client_secret: cfg.client_secret,
    refresh_token: cfg.refresh_token,
    grant_type: 'refresh_token',
  });
  const res = await fetch(OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!data.access_token) {
    throw new Error(`Google OAuth token refresh failed: ${data.error_description ?? data.error ?? 'no token returned'}`);
  }
  return data.access_token;
}

async function gadsReq(
  cfg: GAdsConfig,
  method: string,
  path: string,
  body?: unknown,
  loginCustomerId?: string,
): Promise<unknown> {
  const accessToken = await mintAccessToken(cfg);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': cfg.developer_token,
    'Content-Type': 'application/json',
  };
  const lci = loginCustomerId ?? cfg.login_customer_id;
  if (lci) headers['login-customer-id'] = String(lci).replace(/-/g, '');
  const res = await fetch(`${GADS}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Google Ads ${res.status}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

async function listAccessibleCustomers(cfg: GAdsConfig): Promise<string[]> {
  const d = (await gadsReq(cfg, 'GET', '/customers:listAccessibleCustomers')) as { resourceNames?: string[] };
  return (d.resourceNames ?? []).map((r) => r.split('/')[1]);
}

/**
 * Run a GAQL query against a customer using the standard (non-streaming)
 * `search` endpoint — matches the official Google Ads MCP server's main tool.
 * Returns the flat array of result rows (or empty).
 */
async function runGaql(
  cfg: GAdsConfig,
  customerId: string,
  query: string,
  loginCustomerId?: string,
): Promise<Array<Record<string, unknown>>> {
  const cid = customerId.replace(/-/g, '');
  const d = (await gadsReq(
    cfg,
    'POST',
    `/customers/${cid}/googleAds:search`,
    { query, pageSize: 10000 },
    loginCustomerId,
  )) as { results?: Array<Record<string, unknown>> };
  return d.results ?? [];
}

async function resolveCustomerId(cfg: GAdsConfig, supplied?: unknown): Promise<string> {
  if (supplied) return String(supplied).replace(/-/g, '');
  const ids = await listAccessibleCustomers(cfg);
  if (!ids.length) throw new Error('No accessible Google Ads customer for this token.');
  return ids[0];
}

export async function executeGoogleAdsTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    const cfg = parseConfig(token);
    switch (toolName) {
      // Flexible GAQL passthrough — matches the official MCP server's `search`
      // tool. Lets Claude run any read query against the user's Google Ads
      // account without us hardcoding every possible report.
      case 'google_ads_search': {
        const customerId = await resolveCustomerId(cfg, args.customer_id);
        const query = String(args.query ?? '').trim();
        if (!query) throw new Error('google_ads_search requires a GAQL `query` string.');
        const rows = await runGaql(cfg, customerId, query, args.login_customer_id ? String(args.login_customer_id) : undefined);
        return { ok: true, content: asText({ customer_id: customerId, row_count: rows.length, results: rows }) };
      }

      // Resource metadata — matches the official `get_resource_metadata`. Lets
      // Claude introspect what fields are available on a Google Ads resource
      // (e.g. "campaign") before composing a GAQL query.
      case 'google_ads_get_resource_metadata': {
        const resource = String(args.resource ?? '').trim();
        if (!resource) throw new Error('google_ads_get_resource_metadata requires a `resource` name (e.g. "campaign").');
        const customerId = await resolveCustomerId(cfg, args.customer_id);
        // Use googleAdsFields catalog — read-only, doesn't consume customer quota.
        const query = `SELECT name, category, data_type, selectable, filterable, sortable, type_url FROM google_ads_field WHERE name LIKE '${resource}.%' LIMIT 500`;
        const d = (await gadsReq(
          cfg,
          'POST',
          `/googleAdsFields:search`,
          { query },
        )) as { results?: Array<Record<string, unknown>> };
        return { ok: true, content: asText({ resource, fields: d.results ?? [], customer_id: customerId }) };
      }

      // Convenience wrappers — kept for users who don't want to write GAQL.
      // Each wraps a curated GAQL query around the `search` endpoint above.

      case 'google_ads_list_accounts': {
        const ids = await listAccessibleCustomers(cfg);
        return { ok: true, content: asText({ customer_ids: ids, count: ids.length }) };
      }

      case 'google_ads_list_campaigns': {
        const customerId = await resolveCustomerId(cfg, args.customer_id);
        const query = `
          SELECT
            campaign.id, campaign.name, campaign.status,
            campaign.advertising_channel_type,
            campaign_budget.amount_micros
          FROM campaign
          ORDER BY campaign.id
          LIMIT ${Math.max(1, Math.min(Number(args.limit ?? 50), 1000))}
        `;
        const rows = await runGaql(cfg, customerId, query);
        return { ok: true, content: asText({ customer_id: customerId, campaigns: rows }) };
      }

      case 'google_ads_campaign_performance': {
        const customerId = await resolveCustomerId(cfg, args.customer_id);
        const range = String(args.date_range ?? 'LAST_7_DAYS');
        const query = `
          SELECT
            campaign.id, campaign.name,
            metrics.impressions, metrics.clicks, metrics.cost_micros,
            metrics.conversions, metrics.ctr, metrics.average_cpc
          FROM campaign
          WHERE segments.date DURING ${range}
          ORDER BY metrics.cost_micros DESC
          LIMIT ${Math.max(1, Math.min(Number(args.limit ?? 50), 1000))}
        `;
        const rows = await runGaql(cfg, customerId, query);
        return { ok: true, content: asText({ customer_id: customerId, date_range: range, results: rows }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Google Ads tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

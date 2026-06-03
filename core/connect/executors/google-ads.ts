// Google Ads tool executor — BYO-token mode (API-key path).
//
// The user pastes a JSON blob with their own OAuth credentials + developer
// token, which StackPicks stores encrypted in api_key_connections. The
// executor parses it, mints a fresh access token from the refresh token, then
// calls the Google Ads API.
//
// User-supplied JSON shape:
//   {
//     "developer_token": "abc123...",   // from https://ads.google.com/aw/apicenter
//     "client_id":       "xxx.apps.googleusercontent.com",
//     "client_secret":   "GOCSPX-...",
//     "refresh_token":   "1//0g...",
//     "login_customer_id": "1234567890"  // optional, manager (MCC) account id
//   }
//
// This bypasses the Google OAuth verification gate AND the Standard-Access
// developer-token review gate — the user brings their own approved access.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const GADS = 'https://googleads.googleapis.com/v17';
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
    throw new Error('Google Ads token must be a JSON blob with developer_token, client_id, client_secret, refresh_token.');
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
  const data = (await res.json()) as { access_token?: string; error_description?: string };
  if (!data.access_token) throw new Error(`Google OAuth token refresh failed: ${data.error_description ?? 'no token'}`);
  return data.access_token;
}

async function gadsReq(cfg: GAdsConfig, method: string, path: string, body?: unknown, loginCustomerId?: string): Promise<unknown> {
  const accessToken = await mintAccessToken(cfg);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': cfg.developer_token,
    'Content-Type': 'application/json',
  };
  const lci = loginCustomerId ?? cfg.login_customer_id;
  if (lci) headers['login-customer-id'] = lci.replace(/-/g, '');
  const res = await fetch(`${GADS}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) throw new Error(`Google Ads ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

async function listAccessibleCustomers(cfg: GAdsConfig): Promise<string[]> {
  const d = (await gadsReq(cfg, 'GET', '/customers:listAccessibleCustomers')) as { resourceNames?: string[] };
  return (d.resourceNames ?? []).map((r) => r.split('/')[1]);
}

export async function executeGoogleAdsTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    const cfg = parseConfig(token);
    switch (toolName) {
      case 'google_ads_list_accounts': {
        const ids = await listAccessibleCustomers(cfg);
        return { ok: true, content: asText({ customer_ids: ids, count: ids.length }) };
      }

      case 'google_ads_list_campaigns': {
        const customerId = args.customer_id ? String(args.customer_id).replace(/-/g, '') : (await listAccessibleCustomers(cfg))[0];
        if (!customerId) return { ok: false, is_error: true, error: 'No accessible Google Ads customer.' };
        const query = `
          SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
                 campaign_budget.amount_micros
          FROM campaign
          ORDER BY campaign.id
          LIMIT ${Number(args.limit ?? 50)}
        `;
        const d = (await gadsReq(cfg, 'POST', `/customers/${customerId}/googleAds:searchStream`, { query }, customerId)) as Array<{
          results?: Array<Record<string, unknown>>;
        }>;
        return { ok: true, content: asText((d ?? []).flatMap((b) => b.results ?? [])) };
      }

      case 'google_ads_campaign_performance': {
        const customerId = args.customer_id ? String(args.customer_id).replace(/-/g, '') : (await listAccessibleCustomers(cfg))[0];
        if (!customerId) return { ok: false, is_error: true, error: 'No accessible Google Ads customer.' };
        const range = String(args.date_range ?? 'LAST_7_DAYS');
        const query = `
          SELECT campaign.id, campaign.name,
                 metrics.impressions, metrics.clicks, metrics.cost_micros,
                 metrics.conversions, metrics.ctr, metrics.average_cpc
          FROM campaign
          WHERE segments.date DURING ${range}
          ORDER BY metrics.cost_micros DESC
          LIMIT ${Number(args.limit ?? 50)}
        `;
        const d = (await gadsReq(cfg, 'POST', `/customers/${customerId}/googleAds:searchStream`, { query }, customerId)) as Array<{
          results?: Array<Record<string, unknown>>;
        }>;
        return { ok: true, content: asText((d ?? []).flatMap((b) => b.results ?? [])) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Google Ads tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

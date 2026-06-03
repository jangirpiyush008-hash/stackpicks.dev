// Google Ads tool executor. Connected via Google OAuth — Nango returns an
// access token used as a Bearer against googleads.googleapis.com.
//
// Google Ads also requires:
//   1. A developer token (stackpicks-level, applied for separately, set as
//      GOOGLE_ADS_DEVELOPER_TOKEN env var). Basic access is test-only;
//      Standard access requires Google review.
//   2. A login-customer-id header when operating under a manager (MCC).
//      We resolve the user's first accessible customer when not supplied.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const GADS = 'https://googleads.googleapis.com/v17';

function devToken(): string {
  const t = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!t) throw new Error('GOOGLE_ADS_DEVELOPER_TOKEN not set on the server. Apply at https://ads.google.com/aw/apicenter');
  return t;
}

async function gadsReq(token: string, method: string, path: string, body?: unknown, loginCustomerId?: string): Promise<unknown> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'developer-token': devToken(),
    'Content-Type': 'application/json',
  };
  if (loginCustomerId) headers['login-customer-id'] = loginCustomerId.replace(/-/g, '');
  const res = await fetch(`${GADS}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) throw new Error(`Google Ads ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

async function listAccessibleCustomers(token: string): Promise<string[]> {
  const d = (await gadsReq(token, 'GET', '/customers:listAccessibleCustomers')) as { resourceNames?: string[] };
  return (d.resourceNames ?? []).map((r) => r.split('/')[1]);
}

export async function executeGoogleAdsTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'google_ads_list_accounts': {
        const ids = await listAccessibleCustomers(token);
        return { ok: true, content: asText({ customer_ids: ids, count: ids.length }) };
      }

      case 'google_ads_list_campaigns': {
        const customerId = args.customer_id ? String(args.customer_id).replace(/-/g, '') : (await listAccessibleCustomers(token))[0];
        if (!customerId) return { ok: false, is_error: true, error: 'No accessible Google Ads customer.' };
        const query = `
          SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
                 campaign_budget.amount_micros
          FROM campaign
          ORDER BY campaign.id
          LIMIT ${Number(args.limit ?? 50)}
        `;
        const d = (await gadsReq(token, 'POST', `/customers/${customerId}/googleAds:searchStream`, { query }, customerId)) as Array<{
          results?: Array<Record<string, unknown>>;
        }>;
        const rows = (d ?? []).flatMap((b) => b.results ?? []);
        return { ok: true, content: asText(rows) };
      }

      case 'google_ads_campaign_performance': {
        const customerId = args.customer_id ? String(args.customer_id).replace(/-/g, '') : (await listAccessibleCustomers(token))[0];
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
        const d = (await gadsReq(token, 'POST', `/customers/${customerId}/googleAds:searchStream`, { query }, customerId)) as Array<{
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

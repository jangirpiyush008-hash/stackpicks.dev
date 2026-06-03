// Meta (Facebook) Ads tool executor. Connected via Facebook Login for Business
// — Nango returns an access token used as a Bearer against the Graph API
// (graph.facebook.com/v21.0). Requires ads_read (and ads_management for write)
// permissions, granted via Meta App Review.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const GRAPH = 'https://graph.facebook.com/v21.0';

async function fbGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${GRAPH}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Meta Ads ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeFacebookAdsTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'meta_ads_list_accounts': {
        const d = (await fbGet(token, '/me/adaccounts', {
          fields: 'id,account_id,name,account_status,currency,timezone_name',
          limit: String(args.limit ?? 25),
        })) as { data?: Array<Record<string, unknown>> };
        return { ok: true, content: asText(d.data ?? []) };
      }

      case 'meta_ads_list_campaigns': {
        const d = (await fbGet(token, `/${encodeURIComponent(String(args.ad_account_id))}/campaigns`, {
          fields: 'id,name,objective,status,daily_budget,lifetime_budget,start_time,stop_time',
          limit: String(args.limit ?? 50),
        })) as { data?: Array<Record<string, unknown>> };
        return { ok: true, content: asText(d.data ?? []) };
      }

      case 'meta_ads_account_insights': {
        // Spend + ROAS at the account level for the date preset.
        const preset = String(args.date_preset ?? 'last_7d');
        const d = (await fbGet(token, `/${encodeURIComponent(String(args.ad_account_id))}/insights`, {
          fields: 'spend,impressions,clicks,ctr,cpc,cpm,actions,action_values',
          date_preset: preset,
          level: 'account',
        })) as { data?: Array<Record<string, unknown>> };
        return { ok: true, content: asText(d.data ?? []) };
      }

      case 'meta_ads_campaign_insights': {
        const preset = String(args.date_preset ?? 'last_7d');
        const d = (await fbGet(token, `/${encodeURIComponent(String(args.ad_account_id))}/insights`, {
          fields: 'campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions',
          date_preset: preset,
          level: 'campaign',
          limit: String(args.limit ?? 50),
        })) as { data?: Array<Record<string, unknown>> };
        return { ok: true, content: asText(d.data ?? []) };
      }

      case 'meta_ads_list_ads': {
        const d = (await fbGet(token, `/${encodeURIComponent(String(args.ad_account_id))}/ads`, {
          fields: 'id,name,status,adset_id,campaign_id,creative',
          limit: String(args.limit ?? 50),
        })) as { data?: Array<Record<string, unknown>> };
        return { ok: true, content: asText(d.data ?? []) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Meta Ads tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

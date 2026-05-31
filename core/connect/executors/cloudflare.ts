// Cloudflare tool executor. Connected via a Cloudflare API token (API-key path,
// stored encrypted). Bearer auth against api.cloudflare.com/client/v4.
// Read-focused — DNS + zone visibility, no destructive ops by default.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const CF = 'https://api.cloudflare.com/client/v4';

async function cfGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${CF}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Cloudflare ${res.status}: ${text.slice(0, 400)}`);
  const json = text ? JSON.parse(text) : {};
  if (json.success === false) throw new Error(`Cloudflare: ${JSON.stringify(json.errors)}`);
  return json;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeCloudflareTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'cloudflare_verify_token': {
        const d = (await cfGet(token, '/user/tokens/verify')) as { result: Record<string, unknown> };
        return { ok: true, content: asText(d.result) };
      }

      case 'cloudflare_list_zones': {
        const d = (await cfGet(token, '/zones', { per_page: String(args.per_page ?? 50) })) as {
          result: Array<Record<string, unknown>>;
        };
        const slim = d.result.map((z) => ({ id: z.id, name: z.name, status: z.status, plan: (z.plan as Record<string, unknown> | undefined)?.name }));
        return { ok: true, content: asText(slim) };
      }

      case 'cloudflare_list_dns_records': {
        const params: Record<string, string> = { per_page: String(args.per_page ?? 100) };
        if (args.type) params.type = String(args.type);
        const d = (await cfGet(token, `/zones/${encodeURIComponent(String(args.zone_id))}/dns_records`, params)) as {
          result: Array<Record<string, unknown>>;
        };
        const slim = d.result.map((r) => ({ id: r.id, type: r.type, name: r.name, content: r.content, proxied: r.proxied, ttl: r.ttl }));
        return { ok: true, content: asText(slim) };
      }

      case 'cloudflare_get_zone': {
        const d = (await cfGet(token, `/zones/${encodeURIComponent(String(args.zone_id))}`)) as { result: Record<string, unknown> };
        const z = d.result;
        return { ok: true, content: asText({ id: z.id, name: z.name, status: z.status, name_servers: z.name_servers, created_on: z.created_on }) };
      }

      case 'cloudflare_list_workers': {
        // Needs account_id. List accounts first if not supplied.
        let accountId = args.account_id ? String(args.account_id) : '';
        if (!accountId) {
          const accts = (await cfGet(token, '/accounts', { per_page: '1' })) as { result: Array<{ id: string }> };
          accountId = accts.result[0]?.id ?? '';
        }
        if (!accountId) return { ok: false, is_error: true, error: 'No Cloudflare account found for this token.' };
        const d = (await cfGet(token, `/accounts/${accountId}/workers/scripts`)) as { result: Array<Record<string, unknown>> };
        const slim = d.result.map((w) => ({ id: w.id, created_on: w.created_on, modified_on: w.modified_on }));
        return { ok: true, content: asText({ account_id: accountId, workers: slim }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Cloudflare tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

// HubSpot tool executor. Connected via HubSpot OAuth — Nango returns an access
// token used as a Bearer against api.hubapi.com (CRM v3). Read + light create.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const HUBSPOT = 'https://api.hubapi.com';

async function hsReq(token: string, method: string, path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${HUBSPOT}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeHubspotTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'hubspot_list_contacts': {
        const d = (await hsReq(token, 'GET', `/crm/v3/objects/contacts?limit=${Number(args.limit ?? 20)}&properties=firstname,lastname,email,company,phone`)) as {
          results?: Array<Record<string, unknown>>;
        };
        const slim = (d.results ?? []).map((c) => ({ id: c.id, ...(c.properties as Record<string, unknown>) }));
        return { ok: true, content: asText(slim) };
      }

      case 'hubspot_search_contacts': {
        const d = (await hsReq(token, 'POST', '/crm/v3/objects/contacts/search', {
          query: String(args.query ?? ''),
          limit: Number(args.limit ?? 20),
          properties: ['firstname', 'lastname', 'email', 'company'],
        })) as { results?: Array<Record<string, unknown>> };
        const slim = (d.results ?? []).map((c) => ({ id: c.id, ...(c.properties as Record<string, unknown>) }));
        return { ok: true, content: asText(slim) };
      }

      case 'hubspot_create_contact': {
        const d = (await hsReq(token, 'POST', '/crm/v3/objects/contacts', {
          properties: {
            email: args.email, firstname: args.firstname, lastname: args.lastname,
            company: args.company, phone: args.phone,
          },
        })) as Record<string, unknown>;
        return { ok: true, content: asText({ id: d.id, properties: d.properties }) };
      }

      case 'hubspot_list_deals': {
        const d = (await hsReq(token, 'GET', `/crm/v3/objects/deals?limit=${Number(args.limit ?? 20)}&properties=dealname,amount,dealstage,closedate,pipeline`)) as {
          results?: Array<Record<string, unknown>>;
        };
        const slim = (d.results ?? []).map((c) => ({ id: c.id, ...(c.properties as Record<string, unknown>) }));
        return { ok: true, content: asText(slim) };
      }

      case 'hubspot_list_companies': {
        const d = (await hsReq(token, 'GET', `/crm/v3/objects/companies?limit=${Number(args.limit ?? 20)}&properties=name,domain,industry,city`)) as {
          results?: Array<Record<string, unknown>>;
        };
        const slim = (d.results ?? []).map((c) => ({ id: c.id, ...(c.properties as Record<string, unknown>) }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown HubSpot tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

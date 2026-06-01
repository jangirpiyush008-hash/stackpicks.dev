// Intercom tool executor. Connected via Intercom OAuth — Nango returns an
// access token used as a Bearer against api.intercom.io. Read-focused on
// contacts + conversations.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const INTERCOM = 'https://api.intercom.io';

async function icReq(token: string, method: string, path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${INTERCOM}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Intercom-Version': '2.11',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Intercom ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeIntercomTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'intercom_list_contacts': {
        const d = (await icReq(token, 'GET', `/contacts?per_page=${Number(args.limit ?? 20)}`)) as {
          data?: Array<Record<string, unknown>>;
        };
        const slim = (d.data ?? []).map((c) => ({ id: c.id, name: c.name, email: c.email, role: c.role }));
        return { ok: true, content: asText(slim) };
      }

      case 'intercom_search_contacts': {
        const d = (await icReq(token, 'POST', '/contacts/search', {
          query: { field: 'email', operator: '~', value: String(args.query ?? '') },
        })) as { data?: Array<Record<string, unknown>> };
        const slim = (d.data ?? []).map((c) => ({ id: c.id, name: c.name, email: c.email }));
        return { ok: true, content: asText(slim) };
      }

      case 'intercom_list_conversations': {
        const d = (await icReq(token, 'GET', `/conversations?per_page=${Number(args.limit ?? 20)}`)) as {
          conversations?: Array<Record<string, unknown>>;
        };
        const slim = (d.conversations ?? []).map((c) => ({
          id: c.id, state: c.state, open: c.open, read: c.read, created_at: c.created_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'intercom_get_conversation': {
        const d = (await icReq(token, 'GET', `/conversations/${encodeURIComponent(String(args.conversation_id))}`)) as Record<string, unknown>;
        return { ok: true, content: asText({
          id: d.id, state: d.state, title: d.title,
          source: (d.source as Record<string, unknown> | undefined)?.body,
        }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Intercom tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

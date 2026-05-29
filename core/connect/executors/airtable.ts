// Airtable tool executor. Connected via Airtable OAuth — Nango returns an
// access token used as a Bearer against the Airtable REST API + Metadata API.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const AIRTABLE = 'https://api.airtable.com/v0';

async function atGet(token: string, url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function atSend(token: string, url: string, method: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeAirtableTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'airtable_list_bases': {
        const data = (await atGet(token, 'https://api.airtable.com/v0/meta/bases')) as {
          bases: Array<{ id: string; name: string; permissionLevel: string }>;
        };
        return { ok: true, content: asText(data.bases) };
      }

      case 'airtable_list_tables': {
        const data = (await atGet(
          token,
          `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(String(args.base_id))}/tables`,
        )) as { tables: Array<Record<string, unknown>> };
        const slim = data.tables.map((t) => ({
          id: t.id, name: t.name,
          fields: (t.fields as Array<{ name: string; type: string }> | undefined)?.map((f) => `${f.name} (${f.type})`),
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'airtable_list_records': {
        const params = new URLSearchParams({ pageSize: String(args.page_size ?? 20) });
        if (args.view) params.set('view', String(args.view));
        const url = `${AIRTABLE}/${encodeURIComponent(String(args.base_id))}/${encodeURIComponent(String(args.table))}?${params.toString()}`;
        const data = (await atGet(token, url)) as { records: Array<{ id: string; fields: unknown }> };
        return { ok: true, content: asText(data.records) };
      }

      case 'airtable_create_record': {
        const url = `${AIRTABLE}/${encodeURIComponent(String(args.base_id))}/${encodeURIComponent(String(args.table))}`;
        const data = await atSend(token, url, 'POST', { fields: args.fields ?? {} });
        const r = data as Record<string, unknown>;
        return { ok: true, content: asText({ id: r.id, fields: r.fields }) };
      }

      case 'airtable_update_record': {
        const url = `${AIRTABLE}/${encodeURIComponent(String(args.base_id))}/${encodeURIComponent(String(args.table))}/${encodeURIComponent(String(args.record_id))}`;
        const data = await atSend(token, url, 'PATCH', { fields: args.fields ?? {} });
        const r = data as Record<string, unknown>;
        return { ok: true, content: asText({ id: r.id, fields: r.fields }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Airtable tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

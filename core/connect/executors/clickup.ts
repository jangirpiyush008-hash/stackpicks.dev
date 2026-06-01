// ClickUp tool executor. Connected via ClickUp OAuth — Nango returns an access
// token used as the Authorization header (no "Bearer" prefix) against
// api.clickup.com/api/v2. Read + light create.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const CLICKUP = 'https://api.clickup.com/api/v2';

async function cuReq(token: string, method: string, path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${CLICKUP}${path}`, {
    method,
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`ClickUp ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeClickupTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'clickup_list_workspaces': {
        const d = (await cuReq(token, 'GET', '/team')) as { teams?: Array<Record<string, unknown>> };
        const slim = (d.teams ?? []).map((t) => ({ id: t.id, name: t.name }));
        return { ok: true, content: asText(slim) };
      }

      case 'clickup_list_spaces': {
        const d = (await cuReq(token, 'GET', `/team/${encodeURIComponent(String(args.workspace_id))}/space`)) as {
          spaces?: Array<Record<string, unknown>>;
        };
        const slim = (d.spaces ?? []).map((s) => ({ id: s.id, name: s.name, private: s.private }));
        return { ok: true, content: asText(slim) };
      }

      case 'clickup_list_tasks': {
        const d = (await cuReq(token, 'GET', `/list/${encodeURIComponent(String(args.list_id))}/task`)) as {
          tasks?: Array<Record<string, unknown>>;
        };
        const slim = (d.tasks ?? []).map((t) => ({
          id: t.id, name: t.name,
          status: (t.status as Record<string, unknown> | undefined)?.status,
          due_date: t.due_date, url: t.url,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'clickup_create_task': {
        const d = (await cuReq(token, 'POST', `/list/${encodeURIComponent(String(args.list_id))}/task`, {
          name: args.name,
          description: args.description,
          due_date: args.due_date,
        })) as Record<string, unknown>;
        return { ok: true, content: asText({ id: d.id, name: d.name, url: d.url }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown ClickUp tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

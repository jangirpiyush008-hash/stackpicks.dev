// Asana tool executor. Connected via Asana OAuth — Nango returns an access
// token used as a Bearer against the Asana v1 API. Responses wrap payloads in
// a top-level { data } envelope.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const ASANA = 'https://app.asana.com/api/1.0';

async function aGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${ASANA}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Asana ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function aSend(token: string, path: string, method: string, data: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${ASANA}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Asana ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeAsanaTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'asana_me': {
        const data = (await aGet(token, '/users/me')) as { data: Record<string, unknown> };
        const u = data.data;
        return {
          ok: true,
          content: asText({
            gid: u.gid, name: u.name, email: u.email,
            workspaces: (u.workspaces as Array<{ gid: string; name: string }> | undefined),
          }),
        };
      }

      case 'asana_list_projects': {
        const params: Record<string, string> = { limit: String(args.limit ?? 20), opt_fields: 'name,archived,permalink_url' };
        if (args.workspace_gid) params.workspace = String(args.workspace_gid);
        const data = (await aGet(token, '/projects', params)) as { data: Array<Record<string, unknown>> };
        return { ok: true, content: asText(data.data) };
      }

      case 'asana_list_tasks': {
        const params: Record<string, string> = {
          limit: String(args.limit ?? 20),
          opt_fields: 'name,completed,due_on,assignee.name,permalink_url',
        };
        if (args.project_gid) params.project = String(args.project_gid);
        else if (args.assignee && args.workspace_gid) {
          params.assignee = String(args.assignee);
          params.workspace = String(args.workspace_gid);
        }
        const data = (await aGet(token, '/tasks', params)) as { data: Array<Record<string, unknown>> };
        return { ok: true, content: asText(data.data) };
      }

      case 'asana_create_task': {
        const payload: Record<string, unknown> = { name: args.name };
        if (args.notes) payload.notes = args.notes;
        if (args.project_gid) payload.projects = [args.project_gid];
        if (args.workspace_gid) payload.workspace = args.workspace_gid;
        if (args.due_on) payload.due_on = args.due_on;
        const data = (await aSend(token, '/tasks', 'POST', payload)) as { data: Record<string, unknown> };
        const t = data.data;
        return { ok: true, content: asText({ gid: t.gid, name: t.name, permalink_url: t.permalink_url }) };
      }

      case 'asana_update_task': {
        const payload: Record<string, unknown> = {};
        if (args.name !== undefined) payload.name = args.name;
        if (args.notes !== undefined) payload.notes = args.notes;
        if (args.completed !== undefined) payload.completed = args.completed;
        if (args.due_on !== undefined) payload.due_on = args.due_on;
        const data = (await aSend(token, `/tasks/${encodeURIComponent(String(args.task_gid))}`, 'PUT', payload)) as {
          data: Record<string, unknown>;
        };
        const t = data.data;
        return { ok: true, content: asText({ gid: t.gid, name: t.name, completed: t.completed }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Asana tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

// Todoist tool executor. Connected via Todoist OAuth — Nango returns an access
// token used as a Bearer against the REST API at api.todoist.com/rest/v2.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const TODOIST = 'https://api.todoist.com/rest/v2';

async function tdReq(token: string, method: string, path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${TODOIST}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Todoist ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeTodoistTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'todoist_list_projects': {
        const d = (await tdReq(token, 'GET', '/projects')) as Array<Record<string, unknown>>;
        const slim = d.map((p) => ({ id: p.id, name: p.name, is_favorite: p.is_favorite, url: p.url }));
        return { ok: true, content: asText(slim) };
      }

      case 'todoist_list_tasks': {
        const qs = args.project_id ? `?project_id=${encodeURIComponent(String(args.project_id))}` : '';
        const d = (await tdReq(token, 'GET', `/tasks${qs}`)) as Array<Record<string, unknown>>;
        const slim = d.map((t) => ({
          id: t.id, content: t.content, priority: t.priority,
          due: (t.due as Record<string, unknown> | undefined)?.string, url: t.url,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'todoist_create_task': {
        const d = (await tdReq(token, 'POST', '/tasks', {
          content: args.content,
          project_id: args.project_id,
          due_string: args.due_string,
          priority: args.priority,
        })) as Record<string, unknown>;
        return { ok: true, content: asText({ id: d.id, content: d.content, url: d.url }) };
      }

      case 'todoist_close_task': {
        await tdReq(token, 'POST', `/tasks/${encodeURIComponent(String(args.task_id))}/close`);
        return { ok: true, content: asText({ closed: true, task_id: args.task_id }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Todoist tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

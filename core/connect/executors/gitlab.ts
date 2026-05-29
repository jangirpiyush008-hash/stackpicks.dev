// GitLab tool executor. Connected via GitLab OAuth — Nango returns an access
// token used as a Bearer against gitlab.com's REST v4 API.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const GITLAB = 'https://gitlab.com/api/v4';

async function glGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${GITLAB}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GitLab ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function glPost(token: string, path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${GITLAB}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GitLab ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeGitlabTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'gitlab_list_projects': {
        const data = (await glGet(token, '/projects', {
          membership: 'true',
          order_by: 'last_activity_at',
          per_page: String(args.per_page ?? 20),
        })) as Array<Record<string, unknown>>;
        const slim = data.map((p) => ({
          id: p.id, path: p.path_with_namespace, name: p.name,
          visibility: p.visibility, url: p.web_url, last_activity_at: p.last_activity_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'gitlab_list_issues': {
        const params: Record<string, string> = {
          per_page: String(args.per_page ?? 20),
          order_by: 'updated_at',
        };
        if (args.state) params.state = String(args.state);
        const base = args.project_id ? `/projects/${encodeURIComponent(String(args.project_id))}/issues` : '/issues';
        const data = (await glGet(token, base, params)) as Array<Record<string, unknown>>;
        const slim = data.map((i) => ({
          iid: i.iid, project_id: i.project_id, title: i.title, state: i.state,
          labels: i.labels, web_url: i.web_url, updated_at: i.updated_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'gitlab_create_issue': {
        const data = await glPost(token, `/projects/${encodeURIComponent(String(args.project_id))}/issues`, {
          title: args.title,
          description: args.description,
          labels: Array.isArray(args.labels) ? (args.labels as string[]).join(',') : undefined,
        });
        const i = data as Record<string, unknown>;
        return { ok: true, content: asText({ iid: i.iid, title: i.title, web_url: i.web_url }) };
      }

      case 'gitlab_list_merge_requests': {
        const params: Record<string, string> = {
          per_page: String(args.per_page ?? 20),
          order_by: 'updated_at',
        };
        if (args.state) params.state = String(args.state);
        const base = args.project_id
          ? `/projects/${encodeURIComponent(String(args.project_id))}/merge_requests`
          : '/merge_requests';
        const data = (await glGet(token, base, params)) as Array<Record<string, unknown>>;
        const slim = data.map((m) => ({
          iid: m.iid, project_id: m.project_id, title: m.title, state: m.state,
          source_branch: m.source_branch, target_branch: m.target_branch, web_url: m.web_url,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'gitlab_get_file': {
        const ref = String(args.ref ?? 'HEAD');
        const path = `/projects/${encodeURIComponent(String(args.project_id))}/repository/files/${encodeURIComponent(String(args.file_path))}`;
        const data = (await glGet(token, path, { ref })) as { content?: string; encoding?: string };
        const decoded = data.content && data.encoding === 'base64'
          ? Buffer.from(data.content, 'base64').toString('utf-8')
          : data.content ?? '';
        return { ok: true, content: asText(decoded) };
      }

      case 'gitlab_me': {
        const data = await glGet(token, '/user');
        const u = data as Record<string, unknown>;
        return { ok: true, content: asText({ id: u.id, username: u.username, name: u.name, email: u.email }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown GitLab tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

// Vercel tool executor. Connected via a Vercel access token (API-key path,
// stored encrypted). Bearer auth against api.vercel.com. Read-focused.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const VERCEL = 'https://api.vercel.com';

async function vGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${VERCEL}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Vercel ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeVercelTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'vercel_me': {
        const d = (await vGet(token, '/v2/user')) as { user?: Record<string, unknown> };
        const u = d.user ?? d;
        return { ok: true, content: asText({ id: (u as Record<string, unknown>).id, username: (u as Record<string, unknown>).username, email: (u as Record<string, unknown>).email, name: (u as Record<string, unknown>).name }) };
      }

      case 'vercel_list_projects': {
        const d = (await vGet(token, '/v9/projects', { limit: String(args.limit ?? 20) })) as {
          projects: Array<Record<string, unknown>>;
        };
        const slim = d.projects.map((p) => ({
          id: p.id, name: p.name, framework: p.framework,
          latestDeployments: Array.isArray(p.latestDeployments) ? (p.latestDeployments as unknown[]).length : 0,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'vercel_list_deployments': {
        const params: Record<string, string> = { limit: String(args.limit ?? 20) };
        if (args.project_id) params.projectId = String(args.project_id);
        const d = (await vGet(token, '/v6/deployments', params)) as { deployments: Array<Record<string, unknown>> };
        const slim = d.deployments.map((dep) => ({
          uid: dep.uid, name: dep.name, url: dep.url, state: dep.state ?? dep.readyState,
          created: dep.created, target: dep.target,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'vercel_get_deployment': {
        const d = await vGet(token, `/v13/deployments/${encodeURIComponent(String(args.deployment_id))}`);
        const dep = d as Record<string, unknown>;
        return { ok: true, content: asText({ id: dep.id, name: dep.name, url: dep.url, readyState: dep.readyState, target: dep.target, createdAt: dep.createdAt }) };
      }

      case 'vercel_list_domains': {
        const d = (await vGet(token, '/v5/domains', { limit: String(args.limit ?? 20) })) as {
          domains: Array<Record<string, unknown>>;
        };
        const slim = d.domains.map((dom) => ({ name: dom.name, verified: dom.verified, createdAt: dom.createdAt }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Vercel tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

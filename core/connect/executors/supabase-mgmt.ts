// Supabase tool executor. Connected via a Supabase personal access token
// (API-key path, stored encrypted; prefix "sbp_"). Bearer auth against the
// Management API at api.supabase.com/v1. Read-focused — project + org visibility.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const SUPABASE = 'https://api.supabase.com/v1';

async function sbGet(token: string, path: string): Promise<unknown> {
  const res = await fetch(`${SUPABASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeSupabaseTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'supabase_list_projects': {
        const d = (await sbGet(token, '/projects')) as Array<Record<string, unknown>>;
        const slim = d.map((p) => ({
          id: p.id, name: p.name, region: p.region, status: p.status,
          organization_id: p.organization_id, created_at: p.created_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'supabase_list_organizations': {
        const d = (await sbGet(token, '/organizations')) as Array<Record<string, unknown>>;
        return { ok: true, content: asText(d) };
      }

      case 'supabase_get_project': {
        const d = (await sbGet(token, `/projects/${encodeURIComponent(String(args.project_ref))}`)) as Record<string, unknown>;
        return { ok: true, content: asText(d) };
      }

      case 'supabase_list_functions': {
        const d = (await sbGet(token, `/projects/${encodeURIComponent(String(args.project_ref))}/functions`)) as Array<Record<string, unknown>>;
        const slim = d.map((f) => ({ slug: f.slug, name: f.name, status: f.status, version: f.version, updated_at: f.updated_at }));
        return { ok: true, content: asText(slim) };
      }

      case 'supabase_get_project_api_keys': {
        // Returns anon + service role keys for a project — sensitive, but the
        // PAT owner already has full dashboard access. Useful for agent wiring.
        const d = (await sbGet(token, `/projects/${encodeURIComponent(String(args.project_ref))}/api-keys`)) as Array<Record<string, unknown>>;
        const slim = d.map((k) => ({ name: k.name, tags: k.tags }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Supabase tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

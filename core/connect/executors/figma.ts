// Figma tool executor. Connected via a Figma personal access token (API-key
// path, stored encrypted; prefix "figd_"). Figma PATs authenticate with the
// "X-Figma-Token" header (not Bearer). Read-focused.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const FIGMA = 'https://api.figma.com/v1';

async function figGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${FIGMA}${path}${qs ? `?${qs}` : ''}`, {
    headers: { 'X-Figma-Token': token },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Figma ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeFigmaTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'figma_me': {
        const d = (await figGet(token, '/me')) as Record<string, unknown>;
        return { ok: true, content: asText({ id: d.id, email: d.email, handle: d.handle, img_url: d.img_url }) };
      }

      case 'figma_get_file': {
        // depth limits how deep the node tree is returned (keeps payload sane).
        const params: Record<string, string> = { depth: String(args.depth ?? 2) };
        const d = (await figGet(token, `/files/${encodeURIComponent(String(args.file_key))}`, params)) as Record<string, unknown>;
        return { ok: true, content: asText({
          name: d.name, lastModified: d.lastModified, version: d.version,
          editorType: d.editorType,
          pages: Array.isArray((d.document as Record<string, unknown> | undefined)?.children)
            ? ((d.document as Record<string, unknown>).children as Array<{ name: string; id: string }>).map((p) => ({ id: p.id, name: p.name }))
            : [],
        }) };
      }

      case 'figma_get_comments': {
        const d = (await figGet(token, `/files/${encodeURIComponent(String(args.file_key))}/comments`)) as {
          comments: Array<Record<string, unknown>>;
        };
        const slim = d.comments.map((c) => ({
          id: c.id, message: c.message,
          user: (c.user as Record<string, unknown> | undefined)?.handle,
          created_at: c.created_at, resolved_at: c.resolved_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'figma_list_project_files': {
        const d = (await figGet(token, `/projects/${encodeURIComponent(String(args.project_id))}/files`)) as {
          name?: string; files: Array<Record<string, unknown>>;
        };
        const slim = d.files.map((f) => ({ key: f.key, name: f.name, last_modified: f.last_modified }));
        return { ok: true, content: asText({ project: d.name, files: slim }) };
      }

      case 'figma_list_team_projects': {
        const d = (await figGet(token, `/teams/${encodeURIComponent(String(args.team_id))}/projects`)) as {
          name?: string; projects: Array<Record<string, unknown>>;
        };
        return { ok: true, content: asText({ team: d.name, projects: d.projects }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Figma tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

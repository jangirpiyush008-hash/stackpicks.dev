// Dropbox tool executor. Connected via Dropbox OAuth — Nango returns an access
// token used as a Bearer against api.dropboxapi.com/2. Dropbox uses POST for
// everything, with JSON bodies (or "null" for arg-less calls). Read-focused.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const DROPBOX = 'https://api.dropboxapi.com/2';

async function dbxPost(token: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${DROPBOX}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Dropbox ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeDropboxTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'dropbox_me': {
        const d = (await dbxPost(token, '/users/get_current_account', null)) as Record<string, unknown>;
        return { ok: true, content: asText({
          account_id: d.account_id,
          name: (d.name as Record<string, unknown> | undefined)?.display_name,
          email: d.email,
        }) };
      }

      case 'dropbox_list_folder': {
        const d = (await dbxPost(token, '/files/list_folder', {
          path: args.path === '/' || !args.path ? '' : String(args.path),
          limit: Number(args.limit ?? 100),
        })) as { entries?: Array<Record<string, unknown>> };
        const slim = (d.entries ?? []).map((e) => ({
          type: e['.tag'], name: e.name, path: e.path_display, size: e.size,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'dropbox_search': {
        const d = (await dbxPost(token, '/files/search_v2', {
          query: String(args.query ?? ''),
          options: { max_results: Number(args.limit ?? 20) },
        })) as { matches?: Array<{ metadata?: { metadata?: Record<string, unknown> } }> };
        const slim = (d.matches ?? []).map((m) => {
          const md = m.metadata?.metadata ?? {};
          return { name: md.name, path: md.path_display, type: (md as Record<string, unknown>)['.tag'] };
        });
        return { ok: true, content: asText(slim) };
      }

      case 'dropbox_get_temporary_link': {
        const d = (await dbxPost(token, '/files/get_temporary_link', { path: String(args.path) })) as Record<string, unknown>;
        return { ok: true, content: asText({ link: d.link }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Dropbox tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

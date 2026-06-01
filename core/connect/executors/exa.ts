// Exa tool executor. Connected via an Exa API key (API-key path, stored
// encrypted). Exa authenticates with the "x-api-key" header. Neural/semantic
// web search + content retrieval for agents.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const EXA = 'https://api.exa.ai';

async function exaPost(token: string, path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${EXA}${path}`, {
    method: 'POST',
    headers: { 'x-api-key': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Exa ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeExaTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'exa_search': {
        const d = (await exaPost(token, '/search', {
          query: String(args.query ?? ''),
          numResults: Number(args.num_results ?? 5),
          type: args.type ?? 'auto',
          contents: args.include_text ? { text: true } : undefined,
        })) as { results?: Array<Record<string, unknown>> };
        const slim = (d.results ?? []).map((r) => ({
          title: r.title, url: r.url, publishedDate: r.publishedDate,
          text: typeof r.text === 'string' ? (r.text as string).slice(0, 1000) : undefined,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'exa_find_similar': {
        const d = (await exaPost(token, '/findSimilar', {
          url: String(args.url ?? ''),
          numResults: Number(args.num_results ?? 5),
        })) as { results?: Array<Record<string, unknown>> };
        const slim = (d.results ?? []).map((r) => ({ title: r.title, url: r.url }));
        return { ok: true, content: asText(slim) };
      }

      case 'exa_get_contents': {
        const ids = Array.isArray(args.urls) ? args.urls : [args.url];
        const d = (await exaPost(token, '/contents', { ids, text: true })) as { results?: Array<Record<string, unknown>> };
        const slim = (d.results ?? []).map((r) => ({
          url: r.url, title: r.title,
          text: typeof r.text === 'string' ? (r.text as string).slice(0, 4000) : undefined,
        }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Exa tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

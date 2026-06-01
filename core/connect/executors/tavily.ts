// Tavily tool executor. Connected via a Tavily API key (API-key path, stored
// encrypted; prefix "tvly-"). Bearer auth against api.tavily.com. AI-native
// web search + extract for agents.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const TAVILY = 'https://api.tavily.com';

async function tPost(token: string, path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${TAVILY}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Tavily ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeTavilyTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'tavily_search': {
        const d = (await tPost(token, '/search', {
          query: String(args.query ?? ''),
          search_depth: args.deep ? 'advanced' : 'basic',
          max_results: Number(args.max_results ?? 5),
          include_answer: true,
        })) as { answer?: string; results?: Array<Record<string, unknown>> };
        const slim = {
          answer: d.answer,
          results: (d.results ?? []).map((r) => ({ title: r.title, url: r.url, content: r.content })),
        };
        return { ok: true, content: asText(slim) };
      }

      case 'tavily_extract': {
        const urls = Array.isArray(args.urls) ? args.urls : [args.url];
        const d = (await tPost(token, '/extract', { urls })) as { results?: Array<Record<string, unknown>> };
        return { ok: true, content: asText(d.results ?? d) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Tavily tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

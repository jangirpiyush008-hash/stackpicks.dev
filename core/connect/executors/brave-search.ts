// Brave Search tool executor. Connected via a Brave Search API subscription
// token (API-key path, stored encrypted). Brave authenticates with the
// "X-Subscription-Token" header. Independent web search index for agents.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const BRAVE = 'https://api.search.brave.com/res/v1';

async function braveGet(token: string, path: string, params: Record<string, string>): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BRAVE}${path}?${qs}`, {
    headers: { 'X-Subscription-Token': token, Accept: 'application/json' },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Brave ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeBraveSearchTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'brave_web_search': {
        const d = (await braveGet(token, '/web/search', {
          q: String(args.query ?? ''),
          count: String(args.count ?? 10),
        })) as { web?: { results?: Array<Record<string, unknown>> } };
        const slim = (d.web?.results ?? []).map((r) => ({
          title: r.title, url: r.url, description: r.description, age: r.age,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'brave_news_search': {
        const d = (await braveGet(token, '/news/search', {
          q: String(args.query ?? ''),
          count: String(args.count ?? 10),
        })) as { results?: Array<Record<string, unknown>> };
        const slim = (d.results ?? []).map((r) => ({
          title: r.title, url: r.url, description: r.description, age: r.age, source: r.source,
        }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Brave Search tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

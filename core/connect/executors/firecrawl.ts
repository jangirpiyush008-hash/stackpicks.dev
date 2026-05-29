// Firecrawl tool executor. Firecrawl is an API-key provider (Nango returns
// the user's fc- key). Gives agents reliable web access: scrape, search, map.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const FC = 'https://api.firecrawl.dev/v1';

async function fcPost(token: string, path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${FC}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeFirecrawlTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'firecrawl_scrape': {
        const data = await fcPost(token, '/scrape', {
          url: args.url,
          formats: ['markdown'],
          onlyMainContent: args.only_main_content ?? true,
        });
        const md = ((data.data as { markdown?: string } | undefined)?.markdown) ?? '';
        // Cap so a huge page doesn't blow the agent's context.
        return { ok: true, content: asText(md.slice(0, 12000)) };
      }

      case 'firecrawl_search': {
        const data = await fcPost(token, '/search', {
          query: args.query,
          limit: args.limit ?? 5,
        });
        const results = (data.data as Array<Record<string, unknown>> | undefined) ?? [];
        const slim = results.map((r) => ({ title: r.title, url: r.url, description: r.description }));
        return { ok: true, content: asText(slim) };
      }

      case 'firecrawl_map': {
        const data = await fcPost(token, '/map', { url: args.url, limit: args.limit ?? 100 });
        return { ok: true, content: asText((data.links as unknown) ?? data) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Firecrawl tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

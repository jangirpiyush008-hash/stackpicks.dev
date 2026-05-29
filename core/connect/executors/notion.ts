// Notion tool executor. Notion REST API v1 with the OAuth token Nango returns.
// Requires the Notion-Version header on every call.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const NOTION = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

async function notionFetch(token: string, path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${NOTION}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Notion ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

// Notion page/db titles are nested; pull a readable title out.
function titleOf(obj: Record<string, unknown>): string {
  const props = obj.properties as Record<string, { title?: Array<{ plain_text?: string }> }> | undefined;
  if (props) {
    for (const v of Object.values(props)) {
      if (Array.isArray(v.title) && v.title.length) return v.title.map((t) => t.plain_text).join('');
    }
  }
  const t = (obj.title as Array<{ plain_text?: string }> | undefined);
  if (Array.isArray(t)) return t.map((x) => x.plain_text).join('');
  return '(untitled)';
}

export async function executeNotionTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'notion_search': {
        const body: Record<string, unknown> = { query: args.query ?? '', page_size: args.page_size ?? 20 };
        if (args.filter_type) body.filter = { property: 'object', value: args.filter_type };
        const data = (await notionFetch(token, '/search', {
          method: 'POST', body: JSON.stringify(body),
        })) as { results: Array<Record<string, unknown>> };
        const slim = data.results.map((r) => ({
          id: r.id, object: r.object, title: titleOf(r), url: r.url, last_edited: r.last_edited_time,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'notion_get_page': {
        const data = await notionFetch(token, `/pages/${args.page_id}`);
        return { ok: true, content: asText(data) };
      }

      case 'notion_get_page_content': {
        const data = (await notionFetch(token, `/blocks/${args.page_id}/children?page_size=100`)) as {
          results: Array<Record<string, unknown>>;
        };
        // Flatten block text into readable lines.
        const lines = data.results.map((b) => {
          const type = b.type as string;
          const block = b[type] as { rich_text?: Array<{ plain_text?: string }> } | undefined;
          const text = block?.rich_text?.map((t) => t.plain_text).join('') ?? '';
          return `[${type}] ${text}`;
        });
        return { ok: true, content: asText(lines.join('\n')) };
      }

      case 'notion_create_page': {
        const body = {
          parent: args.database_id
            ? { database_id: args.database_id }
            : { page_id: args.parent_page_id },
          properties: args.database_id
            ? { Name: { title: [{ text: { content: args.title } }] } }
            : { title: { title: [{ text: { content: args.title } }] } },
          children: args.content
            ? [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: args.content } }] } }]
            : undefined,
        };
        const data = await notionFetch(token, '/pages', { method: 'POST', body: JSON.stringify(body) });
        return { ok: true, content: asText({ id: (data as { id?: string }).id, url: (data as { url?: string }).url }) };
      }

      case 'notion_query_database': {
        const body: Record<string, unknown> = { page_size: args.page_size ?? 20 };
        const data = (await notionFetch(token, `/databases/${args.database_id}/query`, {
          method: 'POST', body: JSON.stringify(body),
        })) as { results: Array<Record<string, unknown>> };
        const slim = data.results.map((r) => ({ id: r.id, title: titleOf(r), url: r.url }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Notion tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

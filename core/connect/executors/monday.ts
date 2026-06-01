// Monday.com tool executor. Connected via monday OAuth — Nango returns an
// access token used as a Bearer against the GraphQL API at api.monday.com/v2.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const MONDAY = 'https://api.monday.com/v2';

async function mGql(token: string, query: string, variables?: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(MONDAY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'API-Version': '2024-10' },
    body: JSON.stringify({ query, variables }),
  });
  const data = (await res.json()) as { data?: Record<string, unknown>; errors?: Array<{ message: string }> };
  if (data.errors?.length) throw new Error(`monday: ${data.errors.map((e) => e.message).join('; ')}`);
  return data.data ?? {};
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeMondayTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'monday_list_boards': {
        const d = await mGql(token, `query { boards(limit: ${Number(args.limit ?? 25)}) { id name state board_kind } }`);
        return { ok: true, content: asText(d.boards) };
      }

      case 'monday_list_items': {
        const d = await mGql(
          token,
          `query ($id: [ID!]) { boards(ids: $id) { items_page(limit: ${Number(args.limit ?? 25)}) { items { id name column_values { id text } } } } }`,
          { id: [String(args.board_id)] },
        );
        const boards = d.boards as Array<{ items_page?: { items?: unknown } }> | undefined;
        return { ok: true, content: asText(boards?.[0]?.items_page?.items ?? []) };
      }

      case 'monday_create_item': {
        const d = await mGql(
          token,
          `mutation ($board: ID!, $name: String!) { create_item(board_id: $board, item_name: $name) { id name } }`,
          { board: String(args.board_id), name: String(args.name) },
        );
        return { ok: true, content: asText(d.create_item) };
      }

      case 'monday_me': {
        const d = await mGql(token, `query { me { id name email account { name } } }`);
        return { ok: true, content: asText(d.me) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown monday tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

// Linear tool executor. Linear is GraphQL-only — one endpoint, query/mutation
// in the body, OAuth token in Authorization (no "Bearer" prefix for Linear).

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const LINEAR = 'https://api.linear.app/graphql';

async function gql(token: string, query: string, variables?: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(LINEAR, {
    method: 'POST',
    headers: {
      Authorization: token, // Linear uses the raw token (OAuth tokens may need "Bearer "; SDK adds none)
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = (await res.json()) as { data?: Record<string, unknown>; errors?: Array<{ message: string }> };
  if (data.errors?.length) throw new Error(`Linear: ${data.errors.map((e) => e.message).join('; ')}`);
  return data.data ?? {};
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeLinearTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  // Linear OAuth tokens authenticate with the "Bearer " prefix; personal API
  // keys do not. Nango returns OAuth tokens, so prefix with Bearer.
  const auth = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  try {
    switch (toolName) {
      case 'linear_list_teams': {
        const d = await gql(auth, `query { teams(first: 50) { nodes { id key name } } }`);
        return { ok: true, content: asText((d.teams as { nodes: unknown }).nodes) };
      }

      case 'linear_list_issues': {
        const first = Number(args.limit ?? 25);
        const filterTeam = args.team_id
          ? `, filter: { team: { id: { eq: "${args.team_id}" } } }`
          : '';
        const d = await gql(
          auth,
          `query { issues(first: ${first}${filterTeam}, orderBy: updatedAt) {
            nodes { id identifier title state { name } assignee { name } priority url updatedAt }
          } }`,
        );
        return { ok: true, content: asText((d.issues as { nodes: unknown }).nodes) };
      }

      case 'linear_search_issues': {
        const d = await gql(
          auth,
          `query Search($q: String!) { issueSearch(query: $q, first: 25) {
            nodes { id identifier title state { name } url }
          } }`,
          { q: String(args.query ?? '') },
        );
        return { ok: true, content: asText((d.issueSearch as { nodes: unknown }).nodes) };
      }

      case 'linear_create_issue': {
        const d = await gql(
          auth,
          `mutation Create($input: IssueCreateInput!) {
            issueCreate(input: $input) { success issue { id identifier title url } }
          }`,
          { input: { teamId: args.team_id, title: args.title, description: args.description } },
        );
        return { ok: true, content: asText((d.issueCreate as Record<string, unknown>).issue) };
      }

      case 'linear_update_issue': {
        const input: Record<string, unknown> = {};
        if (args.title) input.title = args.title;
        if (args.description) input.description = args.description;
        if (args.state_id) input.stateId = args.state_id;
        const d = await gql(
          auth,
          `mutation Update($id: String!, $input: IssueUpdateInput!) {
            issueUpdate(id: $id, input: $input) { success issue { id identifier title url } }
          }`,
          { id: args.issue_id, input },
        );
        return { ok: true, content: asText((d.issueUpdate as Record<string, unknown>).issue) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Linear tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

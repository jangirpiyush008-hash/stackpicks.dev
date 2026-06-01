// Jira tool executor. Connected via Atlassian OAuth 2.0 (3LO) — Nango returns
// an access token. Atlassian cloud APIs are reached through api.atlassian.com
// after resolving the user's cloudId from /oauth/token/accessible-resources.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

async function resolveCloudId(token: string): Promise<string> {
  const res = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Atlassian ${res.status}: ${text.slice(0, 300)}`);
  const sites = JSON.parse(text) as Array<{ id: string; url: string }>;
  if (!sites.length) throw new Error('No Atlassian sites accessible for this token.');
  return sites[0].id;
}

async function jiraReq(token: string, cloudId: string, method: string, path: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Jira ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeJiraTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    const cloudId = await resolveCloudId(token);
    switch (toolName) {
      case 'jira_list_projects': {
        const d = (await jiraReq(token, cloudId, 'GET', '/project/search?maxResults=50')) as { values?: Array<Record<string, unknown>> };
        const slim = (d.values ?? []).map((p) => ({ id: p.id, key: p.key, name: p.name }));
        return { ok: true, content: asText(slim) };
      }

      case 'jira_search_issues': {
        const jql = encodeURIComponent(String(args.jql ?? 'order by updated DESC'));
        const max = Number(args.limit ?? 25);
        const d = (await jiraReq(token, cloudId, 'GET', `/search?jql=${jql}&maxResults=${max}&fields=summary,status,assignee,priority,updated`)) as {
          issues?: Array<Record<string, unknown>>;
        };
        const slim = (d.issues ?? []).map((i) => {
          const f = i.fields as Record<string, unknown>;
          return {
            key: i.key, summary: f.summary,
            status: (f.status as Record<string, unknown> | undefined)?.name,
            assignee: (f.assignee as Record<string, unknown> | undefined)?.displayName,
            updated: f.updated,
          };
        });
        return { ok: true, content: asText(slim) };
      }

      case 'jira_get_issue': {
        const d = (await jiraReq(token, cloudId, 'GET', `/issue/${encodeURIComponent(String(args.issue_key))}`)) as Record<string, unknown>;
        const f = d.fields as Record<string, unknown>;
        return { ok: true, content: asText({
          key: d.key, summary: f.summary,
          status: (f.status as Record<string, unknown> | undefined)?.name,
          description: f.description, priority: (f.priority as Record<string, unknown> | undefined)?.name,
        }) };
      }

      case 'jira_create_issue': {
        const d = (await jiraReq(token, cloudId, 'POST', '/issue', {
          fields: {
            project: { key: args.project_key },
            summary: args.summary,
            issuetype: { name: args.issue_type ?? 'Task' },
            ...(args.description ? { description: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: String(args.description) }] }] } } : {}),
          },
        })) as Record<string, unknown>;
        return { ok: true, content: asText({ key: d.key, id: d.id, self: d.self }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Jira tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

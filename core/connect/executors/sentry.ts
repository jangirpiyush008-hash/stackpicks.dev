// Sentry tool executor. Connected via a Sentry auth token (API-key path,
// stored encrypted). Bearer auth against sentry.io/api/0. Read-focused.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const SENTRY = 'https://sentry.io/api/0';

async function sGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${SENTRY}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Sentry ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeSentryTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'sentry_list_organizations': {
        const d = (await sGet(token, '/organizations/')) as Array<Record<string, unknown>>;
        const slim = d.map((o) => ({ slug: o.slug, name: o.name, id: o.id }));
        return { ok: true, content: asText(slim) };
      }

      case 'sentry_list_projects': {
        const d = (await sGet(token, '/projects/')) as Array<Record<string, unknown>>;
        const slim = d.map((p) => ({
          slug: p.slug, name: p.name, platform: p.platform,
          organization: (p.organization as Record<string, unknown> | undefined)?.slug,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'sentry_list_issues': {
        const params: Record<string, string> = {
          query: String(args.query ?? 'is:unresolved'),
          limit: String(args.limit ?? 25),
        };
        const path = `/projects/${encodeURIComponent(String(args.organization_slug))}/${encodeURIComponent(String(args.project_slug))}/issues/`;
        const d = (await sGet(token, path, params)) as Array<Record<string, unknown>>;
        const slim = d.map((i) => ({
          shortId: i.shortId, title: i.title, level: i.level, status: i.status,
          count: i.count, userCount: i.userCount, lastSeen: i.lastSeen, permalink: i.permalink,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'sentry_get_issue': {
        const d = (await sGet(token, `/issues/${encodeURIComponent(String(args.issue_id))}/`)) as Record<string, unknown>;
        return { ok: true, content: asText({
          shortId: d.shortId, title: d.title, level: d.level, status: d.status,
          count: d.count, firstSeen: d.firstSeen, lastSeen: d.lastSeen, permalink: d.permalink,
        }) };
      }

      case 'sentry_list_events': {
        const path = `/issues/${encodeURIComponent(String(args.issue_id))}/events/`;
        const d = (await sGet(token, path, { limit: String(args.limit ?? 10) })) as Array<Record<string, unknown>>;
        const slim = d.map((e) => ({ eventID: e.eventID, message: e.message, dateCreated: e.dateCreated }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Sentry tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

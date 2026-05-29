// Calendly tool executor. Connected via Calendly OAuth — Nango returns an
// access token used as a Bearer against the Calendly v2 API. Most endpoints
// require the user's URI, so we resolve /users/me first and cache per call.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const CALENDLY = 'https://api.calendly.com';

async function cGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${CALENDLY}${path}${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Calendly ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

async function currentUser(token: string): Promise<{ uri: string; current_organization: string }> {
  const data = (await cGet(token, '/users/me')) as { resource: { uri: string; current_organization: string } };
  return data.resource;
}

export async function executeCalendlyTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'calendly_me': {
        const data = (await cGet(token, '/users/me')) as { resource: Record<string, unknown> };
        const r = data.resource;
        return { ok: true, content: asText({ name: r.name, email: r.email, scheduling_url: r.scheduling_url, uri: r.uri }) };
      }

      case 'calendly_list_event_types': {
        const me = await currentUser(token);
        const data = (await cGet(token, '/event_types', {
          user: me.uri,
          count: String(args.count ?? 20),
        })) as { collection: Array<Record<string, unknown>> };
        const slim = data.collection.map((e) => ({
          name: e.name, duration: e.duration, active: e.active,
          scheduling_url: e.scheduling_url, uri: e.uri,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'calendly_list_scheduled_events': {
        const me = await currentUser(token);
        const params: Record<string, string> = { user: me.uri, count: String(args.count ?? 20), sort: 'start_time:desc' };
        if (args.status) params.status = String(args.status);
        if (args.min_start_time) params.min_start_time = String(args.min_start_time);
        const data = (await cGet(token, '/scheduled_events', params)) as { collection: Array<Record<string, unknown>> };
        const slim = data.collection.map((e) => ({
          name: e.name, status: e.status, start_time: e.start_time, end_time: e.end_time, uri: e.uri,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'calendly_list_invitees': {
        // event must be a scheduled-event URI (from calendly_list_scheduled_events).
        const eventUuid = String(args.event_uri ?? '').split('/').pop();
        const data = (await cGet(token, `/scheduled_events/${eventUuid}/invitees`, {
          count: String(args.count ?? 20),
        })) as { collection: Array<Record<string, unknown>> };
        const slim = data.collection.map((i) => ({
          name: i.name, email: i.email, status: i.status, created_at: i.created_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Calendly tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

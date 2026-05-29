// Slack tool executor. Uses the Slack Web API with the bot/user token Nango
// returns. Slack returns { ok: false, error } on failures, so we surface that.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const SLACK = 'https://slack.com/api';

async function slackFetch(token: string, method: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${SLACK}/${method}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error ?? 'unknown'}`);
  }
  return data;
}

async function slackGet(token: string, method: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${SLACK}/${method}?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!data.ok) throw new Error(`Slack API error: ${data.error ?? 'unknown'}`);
  return data;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executeSlackTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'slack_list_channels': {
        const data = await slackGet(token, 'conversations.list', {
          types: String(args.types ?? 'public_channel'),
          limit: String(args.limit ?? 100),
          exclude_archived: 'true',
        });
        const channels = (data.channels as Array<Record<string, unknown>>).map((c) => ({
          id: c.id, name: c.name, is_private: c.is_private, num_members: c.num_members,
        }));
        return { ok: true, content: asText(channels) };
      }

      case 'slack_send_message': {
        const data = await slackFetch(token, 'chat.postMessage', {
          channel: args.channel,
          text: args.text,
        });
        return { ok: true, content: asText({ ts: data.ts, channel: data.channel }) };
      }

      case 'slack_channel_history': {
        const data = await slackGet(token, 'conversations.history', {
          channel: String(args.channel),
          limit: String(args.limit ?? 30),
        });
        const msgs = (data.messages as Array<Record<string, unknown>>).map((m) => ({
          user: m.user, text: m.text, ts: m.ts,
        }));
        return { ok: true, content: asText(msgs) };
      }

      case 'slack_search_messages': {
        const data = await slackGet(token, 'search.messages', {
          query: String(args.query ?? ''),
          count: String(args.count ?? 20),
        });
        const matches = ((data.messages as Record<string, unknown>)?.matches as Array<Record<string, unknown>>) ?? [];
        const slim = matches.map((m) => ({
          channel: (m.channel as { name?: string } | undefined)?.name,
          user: m.username, text: m.text, ts: m.ts, permalink: m.permalink,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'slack_list_users': {
        const data = await slackGet(token, 'users.list', { limit: String(args.limit ?? 100) });
        const users = (data.members as Array<Record<string, unknown>>)
          .filter((u) => !u.deleted && !u.is_bot)
          .map((u) => ({ id: u.id, name: u.name, real_name: u.real_name, email: (u.profile as { email?: string } | undefined)?.email }));
        return { ok: true, content: asText(users) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Slack tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

#!/usr/bin/env node
/**
 * @stackpicks/mcp — stdio MCP server.
 *
 * Runs locally when Claude Desktop / Cursor / Cline / Windsurf spawn it via
 * `npx -y @stackpicks/mcp`. It proxies all tool discovery + execution to the
 * StackPicks gateway, authenticating with the user's `sp_live_…` key.
 *
 * The gateway holds OAuth tokens. This package never sees them. The user's
 * machine only ever holds the API key.
 *
 * Architecture:
 *   Claude  →  stdio  →  @stackpicks/mcp  →  HTTPS  →  api.stackpicks.dev
 *
 * Env:
 *   STACKPICKS_API_KEY      required — issued at /connect/export
 *   STACKPICKS_API_URL      optional — defaults to https://stackpicks.dev
 *   STACKPICKS_DEBUG        optional — '1' to log requests to stderr
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';

const API_KEY = process.env.STACKPICKS_API_KEY;
const API_URL = (process.env.STACKPICKS_API_URL ?? 'https://stackpicks.dev').replace(/\/$/, '');
const DEBUG = process.env.STACKPICKS_DEBUG === '1';

if (!API_KEY) {
  process.stderr.write(
    [
      '',
      '  StackPicks MCP — STACKPICKS_API_KEY is missing.',
      '',
      '  Generate one at https://stackpicks.dev/connect (login → "Connect to Claude").',
      '  Then add it to your client config:',
      '',
      '    "env": { "STACKPICKS_API_KEY": "sp_live_..." }',
      '',
    ].join('\n'),
  );
  process.exit(1);
}

function log(msg: string, extra?: unknown) {
  if (!DEBUG) return;
  const line = extra !== undefined ? `${msg} ${JSON.stringify(extra)}` : msg;
  process.stderr.write(`[stackpicks-mcp] ${line}\n`);
}

interface GatewayToolsResponse {
  tools: Tool[];
  // Echoed user info, useful for debugging.
  user?: { id: string };
}

interface GatewayExecResponse {
  ok: boolean;
  content?: Array<{ type: 'text' | 'image'; text?: string; data?: string; mimeType?: string }>;
  error?: string;
  is_error?: boolean;
}

async function gatewayFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': '@stackpicks/mcp/0.1.0',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`gateway ${res.status}: ${body || res.statusText}`);
  }
  return (await res.json()) as T;
}

const server = new Server(
  { name: 'stackpicks', version: '0.1.0' },
  { capabilities: { tools: {} } },
);

// Tool list — fetched fresh on every list call so newly connected apps show
// up in Claude without a restart. The gateway is fast (<200ms in our region).
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('tools/list');
  try {
    const data = await gatewayFetch<GatewayToolsResponse>('/api/mcp/v1/tools');
    log('tools/list ok', { count: data.tools.length });
    return { tools: data.tools };
  } catch (err) {
    log('tools/list error', String(err));
    // Surface a single error tool so Claude shows the user something
    // actionable rather than failing silently.
    return {
      tools: [
        {
          name: 'stackpicks_connection_error',
          description: `Couldn't reach StackPicks gateway. ${err instanceof Error ? err.message : 'unknown error'}. Check that your STACKPICKS_API_KEY is valid at https://stackpicks.dev/dashboard/connections.`,
          inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        },
      ],
    };
  }
});

// Tool execution — proxies straight through. The gateway resolves the right
// provider from the tool name (e.g. `github_create_pr` → github) and uses
// the stored Nango connection to call the real API.
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  log('tools/call', { name, args });
  try {
    const data = await gatewayFetch<GatewayExecResponse>('/api/mcp/v1/exec', {
      method: 'POST',
      body: JSON.stringify({ tool_name: name, args: args ?? {} }),
    });
    if (!data.ok || data.is_error) {
      return {
        isError: true,
        content: [{ type: 'text' as const, text: data.error ?? 'unknown gateway error' }],
      };
    }
    return { content: data.content ?? [] };
  } catch (err) {
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: `StackPicks gateway error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
log('connected', { api: API_URL });

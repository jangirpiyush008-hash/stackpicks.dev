// Connect tool registry — single source of truth for every MCP tool that
// the unified gateway exposes. Each tool has a provider, a stable name
// (snake_case, prefixed with provider slug), a description Claude sees, and
// a JSON Schema for arguments.
//
// We expose ONLY tools whose provider the calling user has a live OAuth
// connection for. That filtering happens in /api/mcp/v1/tools.

export type Provider =
  | 'github'
  | 'gmail'
  | 'slack'
  | 'notion'
  | 'discord'
  | 'google-drive'
  | 'linear'
  | 'stripe'
  | 'firecrawl';

export interface ConnectTool {
  name: string;            // 'github_create_pr' — globally unique, machine-readable
  provider: Provider;
  description: string;     // Claude reads this to decide when to call
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
}

const GITHUB_TOOLS: ConnectTool[] = [
  {
    name: 'github_list_repos',
    provider: 'github',
    description:
      'List the authenticated user\'s GitHub repositories. Returns name, owner, private flag, default branch, and HTML URL.',
    inputSchema: {
      type: 'object',
      properties: {
        visibility: {
          type: 'string',
          enum: ['all', 'public', 'private'],
          description: 'Filter by visibility. Default: all',
        },
        sort: {
          type: 'string',
          enum: ['created', 'updated', 'pushed', 'full_name'],
          description: 'Sort field. Default: updated',
        },
        per_page: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          description: 'Results per page (max 100). Default: 30',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'github_search_issues',
    provider: 'github',
    description:
      'Search GitHub issues + PRs. Use the GitHub search qualifier syntax: e.g. "repo:owner/name is:open label:bug".',
    inputSchema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query — required. Use qualifiers like "repo:", "author:", "is:open", "label:".',
        },
        sort: {
          type: 'string',
          enum: ['comments', 'reactions', 'created', 'updated'],
          description: 'Sort field.',
        },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['q'],
      additionalProperties: false,
    },
  },
  {
    name: 'github_get_issue',
    provider: 'github',
    description: 'Get a single issue or PR by number.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        issue_number: { type: 'integer' },
      },
      required: ['owner', 'repo', 'issue_number'],
      additionalProperties: false,
    },
  },
  {
    name: 'github_create_issue',
    provider: 'github',
    description:
      'Create a new issue in a repo. Returns the URL and number of the new issue.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        title: { type: 'string' },
        body: { type: 'string', description: 'Markdown body. Optional.' },
        labels: { type: 'array', items: { type: 'string' } },
        assignees: { type: 'array', items: { type: 'string' } },
      },
      required: ['owner', 'repo', 'title'],
      additionalProperties: false,
    },
  },
  {
    name: 'github_list_prs',
    provider: 'github',
    description: 'List open or closed pull requests for a repository.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Default: open',
        },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['owner', 'repo'],
      additionalProperties: false,
    },
  },
  {
    name: 'github_get_file',
    provider: 'github',
    description:
      'Read a file from a repository at a given ref (branch / tag / commit). Returns decoded UTF-8 content + sha.',
    inputSchema: {
      type: 'object',
      properties: {
        owner: { type: 'string' },
        repo: { type: 'string' },
        path: { type: 'string' },
        ref: { type: 'string', description: 'Default: default branch' },
      },
      required: ['owner', 'repo', 'path'],
      additionalProperties: false,
    },
  },
  {
    name: 'github_search_code',
    provider: 'github',
    description:
      'Code search across GitHub. Use qualifiers: "repo:", "language:", "extension:", "path:".',
    inputSchema: {
      type: 'object',
      properties: {
        q: { type: 'string' },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['q'],
      additionalProperties: false,
    },
  },
  {
    name: 'github_me',
    provider: 'github',
    description: 'Return the authenticated user (login, name, email, plan).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

const SLACK_TOOLS: ConnectTool[] = [
  {
    name: 'slack_list_channels',
    provider: 'slack',
    description: 'List Slack channels (id + name) the user/bot can see.',
    inputSchema: {
      type: 'object',
      properties: {
        types: { type: 'string', description: 'public_channel, private_channel, im, mpim (comma-sep). Default public_channel' },
        limit: { type: 'integer', minimum: 1, maximum: 1000 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'slack_send_message',
    provider: 'slack',
    description: 'Post a message to a Slack channel or user. channel = channel ID (from slack_list_channels) or user ID.',
    inputSchema: {
      type: 'object',
      properties: {
        channel: { type: 'string' },
        text: { type: 'string' },
      },
      required: ['channel', 'text'],
      additionalProperties: false,
    },
  },
  {
    name: 'slack_channel_history',
    provider: 'slack',
    description: 'Read recent messages from a Slack channel.',
    inputSchema: {
      type: 'object',
      properties: {
        channel: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 200 },
      },
      required: ['channel'],
      additionalProperties: false,
    },
  },
  {
    name: 'slack_list_users',
    provider: 'slack',
    description: 'List active (non-bot) Slack workspace members with name + email.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 1000 } },
      additionalProperties: false,
    },
  },
];

const NOTION_TOOLS: ConnectTool[] = [
  {
    name: 'notion_search',
    provider: 'notion',
    description: 'Search Notion pages + databases the integration can access. Returns id, title, url.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search text. Empty = recent items.' },
        filter_type: { type: 'string', enum: ['page', 'database'], description: 'Limit to pages or databases.' },
        page_size: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'notion_get_page',
    provider: 'notion',
    description: 'Get a Notion page object (properties + metadata) by page_id.',
    inputSchema: {
      type: 'object',
      properties: { page_id: { type: 'string' } },
      required: ['page_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'notion_get_page_content',
    provider: 'notion',
    description: 'Read the text content (blocks) of a Notion page as readable lines.',
    inputSchema: {
      type: 'object',
      properties: { page_id: { type: 'string' } },
      required: ['page_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'notion_create_page',
    provider: 'notion',
    description: 'Create a Notion page. Provide EITHER database_id (adds a row) OR parent_page_id (subpage). Optional content paragraph.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        database_id: { type: 'string' },
        parent_page_id: { type: 'string' },
        content: { type: 'string' },
      },
      required: ['title'],
      additionalProperties: false,
    },
  },
  {
    name: 'notion_query_database',
    provider: 'notion',
    description: 'List rows in a Notion database by database_id. Returns id, title, url per row.',
    inputSchema: {
      type: 'object',
      properties: {
        database_id: { type: 'string' },
        page_size: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['database_id'],
      additionalProperties: false,
    },
  },
];

const LINEAR_TOOLS: ConnectTool[] = [
  {
    name: 'linear_list_teams',
    provider: 'linear',
    description: 'List Linear teams (id, key, name). Needed to get a team_id for creating issues.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'linear_list_issues',
    provider: 'linear',
    description: 'List recent Linear issues (optionally filtered by team_id), newest first.',
    inputSchema: {
      type: 'object',
      properties: {
        team_id: { type: 'string', description: 'Optional — from linear_list_teams.' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'linear_search_issues',
    provider: 'linear',
    description: 'Full-text search Linear issues by query string.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'linear_create_issue',
    provider: 'linear',
    description: 'Create a Linear issue. Requires team_id (from linear_list_teams) + title.',
    inputSchema: {
      type: 'object',
      properties: {
        team_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string', description: 'Markdown body. Optional.' },
      },
      required: ['team_id', 'title'],
      additionalProperties: false,
    },
  },
  {
    name: 'linear_update_issue',
    provider: 'linear',
    description: 'Update a Linear issue by issue_id (title, description, or state_id).',
    inputSchema: {
      type: 'object',
      properties: {
        issue_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        state_id: { type: 'string' },
      },
      required: ['issue_id'],
      additionalProperties: false,
    },
  },
];

// Tools grow as each provider is wired (code + Nango integration).
export const CONNECT_TOOLS: ConnectTool[] = [
  ...GITHUB_TOOLS,
  ...SLACK_TOOLS,
  ...NOTION_TOOLS,
  ...LINEAR_TOOLS,
];

export function toolsForProviders(activeProviders: Set<Provider>): ConnectTool[] {
  return CONNECT_TOOLS.filter((t) => activeProviders.has(t.provider));
}

export function getToolByName(name: string): ConnectTool | undefined {
  return CONNECT_TOOLS.find((t) => t.name === name);
}

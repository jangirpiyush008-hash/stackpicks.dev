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
  | 'firecrawl'
  | 'gitlab'
  | 'airtable'
  | 'calendly'
  | 'asana'
  | 'vercel'
  | 'cloudflare'
  | 'sentry'
  | 'supabase'
  | 'figma'
  | 'tavily'
  | 'exa'
  | 'brave-search'
  | 'perplexity'
  | 'jira'
  | 'hubspot';

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

const STRIPE_TOOLS: ConnectTool[] = [
  {
    name: 'stripe_get_balance',
    provider: 'stripe',
    description: 'Get the Stripe account available + pending balance by currency.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'stripe_list_customers',
    provider: 'stripe',
    description: 'List recent Stripe customers (id, email, name).',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'stripe_list_charges',
    provider: 'stripe',
    description: 'List recent Stripe charges with amount, status, customer.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'stripe_list_subscriptions',
    provider: 'stripe',
    description: 'List Stripe subscriptions, optionally filtered by status (active, canceled, past_due, all).',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'canceled', 'past_due', 'trialing', 'all'] },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'stripe_list_payment_intents',
    provider: 'stripe',
    description: 'List recent Stripe payment intents with amount + status.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
];

const FIRECRAWL_TOOLS: ConnectTool[] = [
  {
    name: 'firecrawl_scrape',
    provider: 'firecrawl',
    description: 'Scrape a single URL and return its main content as clean markdown. Great for reading a docs page or article.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        only_main_content: { type: 'boolean', description: 'Strip nav/footer. Default true.' },
      },
      required: ['url'],
      additionalProperties: false,
    },
  },
  {
    name: 'firecrawl_search',
    provider: 'firecrawl',
    description: 'Web search via Firecrawl — returns title, url, description for top results.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 20 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'firecrawl_map',
    provider: 'firecrawl',
    description: 'Get all the URLs on a website (sitemap-style) for a given root URL.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 5000 },
      },
      required: ['url'],
      additionalProperties: false,
    },
  },
];

const GITLAB_TOOLS: ConnectTool[] = [
  {
    name: 'gitlab_list_projects',
    provider: 'gitlab',
    description: 'List GitLab projects the user is a member of, most recently active first.',
    inputSchema: {
      type: 'object',
      properties: { per_page: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'gitlab_list_issues',
    provider: 'gitlab',
    description: 'List GitLab issues. Pass project_id (numeric or "group/path") to scope to one project, else returns issues across all the user\'s projects.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Optional. Numeric ID or URL-encoded "group/project" path.' },
        state: { type: 'string', enum: ['opened', 'closed', 'all'] },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'gitlab_create_issue',
    provider: 'gitlab',
    description: 'Create a GitLab issue in a project. Requires project_id + title.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        labels: { type: 'array', items: { type: 'string' } },
      },
      required: ['project_id', 'title'],
      additionalProperties: false,
    },
  },
  {
    name: 'gitlab_list_merge_requests',
    provider: 'gitlab',
    description: 'List GitLab merge requests, optionally scoped to a project_id.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        state: { type: 'string', enum: ['opened', 'closed', 'merged', 'all'] },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'gitlab_get_file',
    provider: 'gitlab',
    description: 'Read a file from a GitLab project repo at a ref. Returns decoded UTF-8 content.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        file_path: { type: 'string', description: 'Path within the repo, e.g. "src/index.ts".' },
        ref: { type: 'string', description: 'Branch/tag/commit. Default HEAD.' },
      },
      required: ['project_id', 'file_path'],
      additionalProperties: false,
    },
  },
  {
    name: 'gitlab_me',
    provider: 'gitlab',
    description: 'Return the authenticated GitLab user (id, username, name, email).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
];

const AIRTABLE_TOOLS: ConnectTool[] = [
  {
    name: 'airtable_list_bases',
    provider: 'airtable',
    description: 'List Airtable bases the connection can access (id, name, permission level).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'airtable_list_tables',
    provider: 'airtable',
    description: 'List tables + field schema for a base. Requires base_id (from airtable_list_bases).',
    inputSchema: {
      type: 'object',
      properties: { base_id: { type: 'string' } },
      required: ['base_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'airtable_list_records',
    provider: 'airtable',
    description: 'List records from a table. Requires base_id + table (name or id).',
    inputSchema: {
      type: 'object',
      properties: {
        base_id: { type: 'string' },
        table: { type: 'string' },
        view: { type: 'string', description: 'Optional view name to filter/sort by.' },
        page_size: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['base_id', 'table'],
      additionalProperties: false,
    },
  },
  {
    name: 'airtable_create_record',
    provider: 'airtable',
    description: 'Create a record in a table. fields is an object of {fieldName: value}.',
    inputSchema: {
      type: 'object',
      properties: {
        base_id: { type: 'string' },
        table: { type: 'string' },
        fields: { type: 'object', description: 'Field name → value map.' },
      },
      required: ['base_id', 'table', 'fields'],
      additionalProperties: false,
    },
  },
  {
    name: 'airtable_update_record',
    provider: 'airtable',
    description: 'Update fields on an existing record by record_id.',
    inputSchema: {
      type: 'object',
      properties: {
        base_id: { type: 'string' },
        table: { type: 'string' },
        record_id: { type: 'string' },
        fields: { type: 'object' },
      },
      required: ['base_id', 'table', 'record_id', 'fields'],
      additionalProperties: false,
    },
  },
];

const CALENDLY_TOOLS: ConnectTool[] = [
  {
    name: 'calendly_me',
    provider: 'calendly',
    description: 'Return the authenticated Calendly user (name, email, scheduling URL).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'calendly_list_event_types',
    provider: 'calendly',
    description: 'List the user\'s Calendly event types (meeting templates) with durations + booking links.',
    inputSchema: {
      type: 'object',
      properties: { count: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'calendly_list_scheduled_events',
    provider: 'calendly',
    description: 'List the user\'s scheduled Calendly events (bookings), newest first.',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'canceled'] },
        min_start_time: { type: 'string', description: 'ISO 8601 lower bound, e.g. "2026-05-29T00:00:00Z".' },
        count: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'calendly_list_invitees',
    provider: 'calendly',
    description: 'List invitees (attendees) for a scheduled event. Requires event_uri (from calendly_list_scheduled_events).',
    inputSchema: {
      type: 'object',
      properties: {
        event_uri: { type: 'string' },
        count: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['event_uri'],
      additionalProperties: false,
    },
  },
];

const ASANA_TOOLS: ConnectTool[] = [
  {
    name: 'asana_me',
    provider: 'asana',
    description: 'Return the authenticated Asana user with their workspaces (gid + name needed for other calls).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'asana_list_projects',
    provider: 'asana',
    description: 'List Asana projects, optionally scoped to a workspace_gid.',
    inputSchema: {
      type: 'object',
      properties: {
        workspace_gid: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'asana_list_tasks',
    provider: 'asana',
    description: 'List Asana tasks. Pass project_gid, OR assignee + workspace_gid together.',
    inputSchema: {
      type: 'object',
      properties: {
        project_gid: { type: 'string' },
        assignee: { type: 'string', description: 'User gid or "me".' },
        workspace_gid: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'asana_create_task',
    provider: 'asana',
    description: 'Create an Asana task. Provide name + either project_gid or workspace_gid.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        notes: { type: 'string' },
        project_gid: { type: 'string' },
        workspace_gid: { type: 'string' },
        due_on: { type: 'string', description: 'YYYY-MM-DD.' },
      },
      required: ['name'],
      additionalProperties: false,
    },
  },
  {
    name: 'asana_update_task',
    provider: 'asana',
    description: 'Update an Asana task by task_gid (name, notes, completed, due_on).',
    inputSchema: {
      type: 'object',
      properties: {
        task_gid: { type: 'string' },
        name: { type: 'string' },
        notes: { type: 'string' },
        completed: { type: 'boolean' },
        due_on: { type: 'string', description: 'YYYY-MM-DD.' },
      },
      required: ['task_gid'],
      additionalProperties: false,
    },
  },
];

const VERCEL_TOOLS: ConnectTool[] = [
  {
    name: 'vercel_me',
    provider: 'vercel',
    description: 'Return the authenticated Vercel user (id, username, email).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'vercel_list_projects',
    provider: 'vercel',
    description: 'List Vercel projects with framework + latest deployment count.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'vercel_list_deployments',
    provider: 'vercel',
    description: 'List recent Vercel deployments, optionally filtered by project_id.',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'vercel_get_deployment',
    provider: 'vercel',
    description: 'Get a single Vercel deployment by id (state, url, target).',
    inputSchema: {
      type: 'object',
      properties: { deployment_id: { type: 'string' } },
      required: ['deployment_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'vercel_list_domains',
    provider: 'vercel',
    description: 'List domains on the Vercel account with verification status.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
];

const CLOUDFLARE_TOOLS: ConnectTool[] = [
  {
    name: 'cloudflare_verify_token',
    provider: 'cloudflare',
    description: 'Verify the Cloudflare API token and return its status + permissions.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'cloudflare_list_zones',
    provider: 'cloudflare',
    description: 'List Cloudflare zones (domains) with status + plan. Get zone_id from here.',
    inputSchema: {
      type: 'object',
      properties: { per_page: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'cloudflare_list_dns_records',
    provider: 'cloudflare',
    description: 'List DNS records for a zone. Requires zone_id (from cloudflare_list_zones).',
    inputSchema: {
      type: 'object',
      properties: {
        zone_id: { type: 'string' },
        type: { type: 'string', description: 'Filter by record type (A, CNAME, TXT, MX…).' },
        per_page: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['zone_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'cloudflare_get_zone',
    provider: 'cloudflare',
    description: 'Get a single Cloudflare zone by zone_id (nameservers, status).',
    inputSchema: {
      type: 'object',
      properties: { zone_id: { type: 'string' } },
      required: ['zone_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'cloudflare_list_workers',
    provider: 'cloudflare',
    description: 'List Cloudflare Workers scripts for an account (auto-detects account_id if omitted).',
    inputSchema: {
      type: 'object',
      properties: { account_id: { type: 'string', description: 'Optional — auto-detected from token.' } },
      additionalProperties: false,
    },
  },
];

const SENTRY_TOOLS: ConnectTool[] = [
  {
    name: 'sentry_list_organizations',
    provider: 'sentry',
    description: 'List Sentry organizations the token can access (slug needed for issues).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'sentry_list_projects',
    provider: 'sentry',
    description: 'List Sentry projects with platform + organization slug.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'sentry_list_issues',
    provider: 'sentry',
    description: 'List issues for a project. Requires organization_slug + project_slug. Optional query (default "is:unresolved").',
    inputSchema: {
      type: 'object',
      properties: {
        organization_slug: { type: 'string' },
        project_slug: { type: 'string' },
        query: { type: 'string', description: 'Sentry search, e.g. "is:unresolved level:error".' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['organization_slug', 'project_slug'],
      additionalProperties: false,
    },
  },
  {
    name: 'sentry_get_issue',
    provider: 'sentry',
    description: 'Get a single Sentry issue by issue_id (counts, first/last seen, permalink).',
    inputSchema: {
      type: 'object',
      properties: { issue_id: { type: 'string' } },
      required: ['issue_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'sentry_list_events',
    provider: 'sentry',
    description: 'List recent events for a Sentry issue by issue_id.',
    inputSchema: {
      type: 'object',
      properties: {
        issue_id: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['issue_id'],
      additionalProperties: false,
    },
  },
];

const SUPABASE_TOOLS: ConnectTool[] = [
  {
    name: 'supabase_list_projects',
    provider: 'supabase',
    description: 'List Supabase projects (id/ref, name, region, status) via the Management API.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'supabase_list_organizations',
    provider: 'supabase',
    description: 'List Supabase organizations the token can access.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'supabase_get_project',
    provider: 'supabase',
    description: 'Get a single Supabase project by project_ref.',
    inputSchema: {
      type: 'object',
      properties: { project_ref: { type: 'string' } },
      required: ['project_ref'],
      additionalProperties: false,
    },
  },
  {
    name: 'supabase_list_functions',
    provider: 'supabase',
    description: 'List Edge Functions for a Supabase project by project_ref.',
    inputSchema: {
      type: 'object',
      properties: { project_ref: { type: 'string' } },
      required: ['project_ref'],
      additionalProperties: false,
    },
  },
  {
    name: 'supabase_get_project_api_keys',
    provider: 'supabase',
    description: 'List the API key names/tags for a Supabase project by project_ref.',
    inputSchema: {
      type: 'object',
      properties: { project_ref: { type: 'string' } },
      required: ['project_ref'],
      additionalProperties: false,
    },
  },
];

const FIGMA_TOOLS: ConnectTool[] = [
  {
    name: 'figma_me',
    provider: 'figma',
    description: 'Return the authenticated Figma user (id, email, handle).',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'figma_get_file',
    provider: 'figma',
    description: 'Get a Figma file\'s metadata + page list by file_key (the part after /file/ in a Figma URL).',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string' },
        depth: { type: 'integer', minimum: 1, maximum: 4, description: 'Node-tree depth. Default 2.' },
      },
      required: ['file_key'],
      additionalProperties: false,
    },
  },
  {
    name: 'figma_get_comments',
    provider: 'figma',
    description: 'List comments on a Figma file by file_key.',
    inputSchema: {
      type: 'object',
      properties: { file_key: { type: 'string' } },
      required: ['file_key'],
      additionalProperties: false,
    },
  },
  {
    name: 'figma_list_project_files',
    provider: 'figma',
    description: 'List files in a Figma project by project_id.',
    inputSchema: {
      type: 'object',
      properties: { project_id: { type: 'string' } },
      required: ['project_id'],
      additionalProperties: false,
    },
  },
  {
    name: 'figma_list_team_projects',
    provider: 'figma',
    description: 'List projects for a Figma team by team_id (from the team URL).',
    inputSchema: {
      type: 'object',
      properties: { team_id: { type: 'string' } },
      required: ['team_id'],
      additionalProperties: false,
    },
  },
];

const TAVILY_TOOLS: ConnectTool[] = [
  {
    name: 'tavily_search',
    provider: 'tavily',
    description: 'AI-native web search via Tavily — returns a synthesized answer plus top source results. Best for current-events / research questions.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        deep: { type: 'boolean', description: 'Advanced (deeper) search. Default false = basic/fast.' },
        max_results: { type: 'integer', minimum: 1, maximum: 20 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'tavily_extract',
    provider: 'tavily',
    description: 'Extract clean content from one or more URLs via Tavily.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        urls: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
  },
];

const EXA_TOOLS: ConnectTool[] = [
  {
    name: 'exa_search',
    provider: 'exa',
    description: 'Neural/semantic web search via Exa. Great for finding pages by meaning, not just keywords. Set include_text to get page content.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        num_results: { type: 'integer', minimum: 1, maximum: 25 },
        type: { type: 'string', enum: ['auto', 'neural', 'keyword'] },
        include_text: { type: 'boolean' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'exa_find_similar',
    provider: 'exa',
    description: 'Find pages similar to a given URL via Exa.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        num_results: { type: 'integer', minimum: 1, maximum: 25 },
      },
      required: ['url'],
      additionalProperties: false,
    },
  },
  {
    name: 'exa_get_contents',
    provider: 'exa',
    description: 'Retrieve the full text content of one or more URLs via Exa.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        urls: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
  },
];

const BRAVE_TOOLS: ConnectTool[] = [
  {
    name: 'brave_web_search',
    provider: 'brave-search',
    description: 'Web search via Brave\'s independent index — returns title, url, description per result.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        count: { type: 'integer', minimum: 1, maximum: 20 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'brave_news_search',
    provider: 'brave-search',
    description: 'News search via Brave — recent articles with source + age.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        count: { type: 'integer', minimum: 1, maximum: 20 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
];

const PERPLEXITY_TOOLS: ConnectTool[] = [
  {
    name: 'perplexity_ask',
    provider: 'perplexity',
    description: 'Ask Perplexity a question and get a search-grounded answer with citations. Best for "what is the latest…" research that needs sources.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        model: { type: 'string', description: 'Perplexity model. Default "sonar".' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
];

const JIRA_TOOLS: ConnectTool[] = [
  {
    name: 'jira_list_projects',
    provider: 'jira',
    description: 'List Jira projects (id, key, name) the user can access.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'jira_search_issues',
    provider: 'jira',
    description: 'Search Jira issues with JQL. Example jql: "project = ENG AND status = \'In Progress\' order by updated DESC".',
    inputSchema: {
      type: 'object',
      properties: {
        jql: { type: 'string', description: 'Jira Query Language. Default: "order by updated DESC".' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'jira_get_issue',
    provider: 'jira',
    description: 'Get a single Jira issue by key (e.g. "ENG-123").',
    inputSchema: {
      type: 'object',
      properties: { issue_key: { type: 'string' } },
      required: ['issue_key'],
      additionalProperties: false,
    },
  },
  {
    name: 'jira_create_issue',
    provider: 'jira',
    description: 'Create a Jira issue. Requires project_key + summary. Optional issue_type (default Task) + description.',
    inputSchema: {
      type: 'object',
      properties: {
        project_key: { type: 'string' },
        summary: { type: 'string' },
        issue_type: { type: 'string', description: 'Task, Bug, Story… Default Task.' },
        description: { type: 'string' },
      },
      required: ['project_key', 'summary'],
      additionalProperties: false,
    },
  },
];

const HUBSPOT_TOOLS: ConnectTool[] = [
  {
    name: 'hubspot_list_contacts',
    provider: 'hubspot',
    description: 'List recent HubSpot CRM contacts (name, email, company, phone).',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'hubspot_search_contacts',
    provider: 'hubspot',
    description: 'Search HubSpot contacts by a query string (matches name, email, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100 },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'hubspot_create_contact',
    provider: 'hubspot',
    description: 'Create a HubSpot contact. email recommended; firstname/lastname/company/phone optional.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        company: { type: 'string' },
        phone: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'hubspot_list_deals',
    provider: 'hubspot',
    description: 'List recent HubSpot deals (name, amount, stage, close date, pipeline).',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
      additionalProperties: false,
    },
  },
  {
    name: 'hubspot_list_companies',
    provider: 'hubspot',
    description: 'List recent HubSpot companies (name, domain, industry, city).',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 100 } },
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
  ...STRIPE_TOOLS,
  ...FIRECRAWL_TOOLS,
  ...GITLAB_TOOLS,
  ...AIRTABLE_TOOLS,
  ...CALENDLY_TOOLS,
  ...ASANA_TOOLS,
  ...VERCEL_TOOLS,
  ...CLOUDFLARE_TOOLS,
  ...SENTRY_TOOLS,
  ...SUPABASE_TOOLS,
  ...FIGMA_TOOLS,
  ...TAVILY_TOOLS,
  ...EXA_TOOLS,
  ...BRAVE_TOOLS,
  ...PERPLEXITY_TOOLS,
  ...JIRA_TOOLS,
  ...HUBSPOT_TOOLS,
];

export function toolsForProviders(activeProviders: Set<Provider>): ConnectTool[] {
  return CONNECT_TOOLS.filter((t) => activeProviders.has(t.provider));
}

export function getToolByName(name: string): ConnectTool | undefined {
  return CONNECT_TOOLS.find((t) => t.name === name);
}

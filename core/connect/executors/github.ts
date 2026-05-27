// GitHub tool executor — turns MCP tool calls into GitHub REST API calls.
// All calls go through `githubFetch` which uses the user's access token
// (obtained from Nango per request — never persisted in our DB).

interface MCPContent {
  type: 'text';
  text: string;
}

interface ExecResult {
  ok: boolean;
  content?: MCPContent[];
  error?: string;
  is_error?: boolean;
}

const GH = 'https://api.github.com';

async function githubFetch(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'StackPicks-Connect/1.0',
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

interface ToolArgs {
  [key: string]: unknown;
}

export async function executeGithubTool(
  toolName: string,
  args: ToolArgs,
  token: string,
): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'github_me': {
        const data = await githubFetch(token, '/user');
        return { ok: true, content: asText(data) };
      }

      case 'github_list_repos': {
        const params = new URLSearchParams();
        if (args.visibility) params.set('visibility', String(args.visibility));
        params.set('sort', String(args.sort ?? 'updated'));
        params.set('per_page', String(args.per_page ?? 30));
        const data = await githubFetch(token, `/user/repos?${params}`);
        const repos = Array.isArray(data) ? data : [];
        const slim = repos.map((r: Record<string, unknown>) => ({
          full_name: r.full_name,
          private: r.private,
          default_branch: r.default_branch,
          html_url: r.html_url,
          description: r.description,
          stargazers_count: r.stargazers_count,
          updated_at: r.updated_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'github_search_issues': {
        const params = new URLSearchParams({ q: String(args.q ?? '') });
        if (args.sort) params.set('sort', String(args.sort));
        if (args.per_page) params.set('per_page', String(args.per_page));
        const data = (await githubFetch(token, `/search/issues?${params}`)) as {
          total_count: number;
          items: Array<Record<string, unknown>>;
        };
        const slim = {
          total_count: data.total_count,
          items: data.items.map((i) => ({
            number: i.number,
            title: i.title,
            state: i.state,
            html_url: i.html_url,
            user: (i.user as { login?: string } | undefined)?.login,
            created_at: i.created_at,
            labels: Array.isArray(i.labels)
              ? (i.labels as Array<{ name: string }>).map((l) => l.name)
              : [],
            is_pr: !!i.pull_request,
          })),
        };
        return { ok: true, content: asText(slim) };
      }

      case 'github_get_issue': {
        const { owner, repo, issue_number } = args as { owner: string; repo: string; issue_number: number };
        const data = await githubFetch(token, `/repos/${owner}/${repo}/issues/${issue_number}`);
        return { ok: true, content: asText(data) };
      }

      case 'github_create_issue': {
        const { owner, repo, title, body, labels, assignees } = args as {
          owner: string; repo: string; title: string; body?: string;
          labels?: string[]; assignees?: string[];
        };
        const data = await githubFetch(token, `/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, labels, assignees }),
        });
        return { ok: true, content: asText(data) };
      }

      case 'github_list_prs': {
        const { owner, repo } = args as { owner: string; repo: string };
        const params = new URLSearchParams({ state: String(args.state ?? 'open') });
        if (args.per_page) params.set('per_page', String(args.per_page));
        const data = (await githubFetch(
          token,
          `/repos/${owner}/${repo}/pulls?${params}`,
        )) as Array<Record<string, unknown>>;
        const slim = data.map((p) => ({
          number: p.number,
          title: p.title,
          state: p.state,
          html_url: p.html_url,
          user: (p.user as { login?: string } | undefined)?.login,
          base: (p.base as { ref?: string } | undefined)?.ref,
          head: (p.head as { ref?: string } | undefined)?.ref,
          draft: p.draft,
          created_at: p.created_at,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'github_get_file': {
        const { owner, repo, path } = args as { owner: string; repo: string; path: string };
        const ref = args.ref ? `?ref=${encodeURIComponent(String(args.ref))}` : '';
        const data = (await githubFetch(
          token,
          `/repos/${owner}/${repo}/contents/${path}${ref}`,
        )) as { content?: string; encoding?: string; sha?: string; size?: number };
        let decoded = '';
        if (data.encoding === 'base64' && data.content) {
          decoded = Buffer.from(data.content, 'base64').toString('utf8');
        }
        return {
          ok: true,
          content: asText({ sha: data.sha, size: data.size, content: decoded }),
        };
      }

      case 'github_search_code': {
        const params = new URLSearchParams({ q: String(args.q ?? '') });
        if (args.per_page) params.set('per_page', String(args.per_page));
        const data = (await githubFetch(token, `/search/code?${params}`)) as {
          total_count: number;
          items: Array<Record<string, unknown>>;
        };
        const slim = {
          total_count: data.total_count,
          items: data.items.map((i) => ({
            name: i.name,
            path: i.path,
            html_url: i.html_url,
            repository: (i.repository as { full_name?: string } | undefined)?.full_name,
          })),
        };
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown GitHub tool: ${toolName}` };
    }
  } catch (err) {
    return {
      ok: false,
      is_error: true,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

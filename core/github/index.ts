/**
 * GitHub repo scraper using GraphQL API.
 * Uses authenticated requests (5000/hr limit) via GITHUB_TOKEN.
 *
 * Strategy:
 * 1. Maintain a seed list of repo full_names (owner/name) to track.
 * 2. Daily cron fetches fresh stats for all tracked repos in batches of 50.
 * 3. Discover mode: search trending repos by topic/language to surface new candidates.
 */

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

export interface ScrapedRepo {
  github_id: number;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  github_url: string;
  language: string | null;
  topics: string[];
  license: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  pushed_at: string | null;
  github_created_at: string | null;
}

interface GitHubError {
  message: string;
  type?: string;
}

async function githubGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Missing GITHUB_TOKEN');

  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'stackpicks-bot/1.0',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { data?: T; errors?: GitHubError[] };
  // GitHub returns partial data + per-alias errors when some repos in a batch
  // can't be resolved. We want the valid ones — only throw if there is no data at all.
  if (json.errors?.length) {
    console.warn(`GitHub GraphQL partial errors (continuing with valid data): ${json.errors.map((e) => e.message).join('; ')}`);
  }
  if (!json.data) throw new Error('GitHub GraphQL returned no data');
  return json.data;
}

const REPO_QUERY = /* GraphQL */ `
  query GetRepo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      databaseId
      name
      nameWithOwner
      description
      homepageUrl
      url
      primaryLanguage { name }
      licenseInfo { spdxId }
      stargazerCount
      forkCount
      watchers { totalCount }
      issues(states: OPEN) { totalCount }
      pushedAt
      createdAt
      repositoryTopics(first: 20) {
        nodes { topic { name } }
      }
      owner { login }
    }
  }
`;

export async function fetchRepo(owner: string, name: string): Promise<ScrapedRepo | null> {
  try {
    const data = await githubGraphQL<{ repository: any | null }>(REPO_QUERY, { owner, name });
    if (!data.repository) return null;
    const r = data.repository;
    return {
      github_id: r.databaseId,
      owner: r.owner.login,
      name: r.name,
      full_name: r.nameWithOwner,
      description: r.description,
      homepage: r.homepageUrl || null,
      github_url: r.url,
      language: r.primaryLanguage?.name ?? null,
      topics: r.repositoryTopics.nodes.map((n: any) => n.topic.name),
      license: r.licenseInfo?.spdxId ?? null,
      stars: r.stargazerCount,
      forks: r.forkCount,
      open_issues: r.issues.totalCount,
      watchers: r.watchers.totalCount,
      pushed_at: r.pushedAt,
      github_created_at: r.createdAt,
    };
  } catch (err) {
    console.error(`fetchRepo failed for ${owner}/${name}:`, err);
    return null;
  }
}

export async function fetchManyRepos(fullNames: string[]): Promise<ScrapedRepo[]> {
  // GraphQL aliasing: one request fetches up to 50 repos.
  const BATCH_SIZE = 50;
  const results: ScrapedRepo[] = [];

  for (let i = 0; i < fullNames.length; i += BATCH_SIZE) {
    const batch = fullNames.slice(i, i + BATCH_SIZE);
    const aliases = batch.map((fn, idx) => {
      const [owner, name] = fn.split('/');
      return `r${idx}: repository(owner: "${owner}", name: "${name}") {
        databaseId name nameWithOwner description homepageUrl url
        primaryLanguage { name }
        licenseInfo { spdxId }
        stargazerCount forkCount
        watchers { totalCount }
        issues(states: OPEN) { totalCount }
        pushedAt createdAt
        repositoryTopics(first: 20) { nodes { topic { name } } }
        owner { login }
      }`;
    });

    const query = `query { ${aliases.join('\n')} }`;

    try {
      const data = await githubGraphQL<Record<string, any>>(query, {});
      for (const key of Object.keys(data)) {
        const r = data[key];
        if (!r) continue;
        results.push({
          github_id: r.databaseId,
          owner: r.owner.login,
          name: r.name,
          full_name: r.nameWithOwner,
          description: r.description,
          homepage: r.homepageUrl || null,
          github_url: r.url,
          language: r.primaryLanguage?.name ?? null,
          topics: r.repositoryTopics.nodes.map((n: any) => n.topic.name),
          license: r.licenseInfo?.spdxId ?? null,
          stars: r.stargazerCount,
          forks: r.forkCount,
          open_issues: r.issues.totalCount,
          watchers: r.watchers.totalCount,
          pushed_at: r.pushedAt,
          github_created_at: r.createdAt,
        });
      }
    } catch (err) {
      console.error(`fetchManyRepos batch failed at offset ${i}:`, err);
    }
  }

  return results;
}

/**
 * Generate a stable slug from owner/name. "shadcn-ui/ui" -> "shadcn-ui-ui"
 */
export function slugFromFullName(fullName: string): string {
  return fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

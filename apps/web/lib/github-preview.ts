export interface GhRepo {
  id: number;
  full_name: string;
  owner: { login: string; avatar_url: string };
  name: string;
  description: string | null;
  homepage: string | null;
  html_url: string;
  language: string | null;
  license: { name: string; spdx_id: string } | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  subscribers_count?: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  default_branch: string;
  archived: boolean;
}

export interface GhReadmeResult {
  content: string | null;
  truncated: boolean;
}

const GH_HEADERS = (): HeadersInit => {
  const h: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'StackPicks-Preview',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) (h as Record<string, string>).Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
};

export async function fetchGhRepo(owner: string, name: string): Promise<GhRepo | null> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
    headers: GH_HEADERS(),
    next: { revalidate: 1800 },
  });
  if (!res.ok) return null;
  return (await res.json()) as GhRepo;
}

export async function fetchGhReadme(owner: string, name: string): Promise<GhReadmeResult> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
    headers: { ...GH_HEADERS(), Accept: 'application/vnd.github.html+json' },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { content: null, truncated: false };
  const html = await res.text();
  const trimmed = html.length > 60000;
  return { content: trimmed ? html.slice(0, 60000) : html, truncated: trimmed };
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5d01',
  Solidity: '#AA6746',
  Lua: '#000080',
  Zig: '#ec915c',
  Elixir: '#6e4a7e',
};

export function langColor(lang: string | null | undefined): string {
  if (!lang) return '#888888';
  return LANG_COLORS[lang] ?? '#888888';
}

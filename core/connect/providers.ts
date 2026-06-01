// Which providers authenticate with a user-supplied API key (stored encrypted
// in api_key_connections) vs OAuth (brokered by Nango, stored as a
// nango_connection_id in oauth_connections).
//
// API-key providers are the ones Nango doesn't template — mostly AI/search
// tools. Add a slug here + write its executor + give it a "paste your key"
// label, and it's wireable without Nango.

export const API_KEY_PROVIDERS: ReadonlySet<string> = new Set([
  'firecrawl',
  // Day 4 — token-based platforms (no Nango OAuth app needed; paste a token):
  'vercel',
  'cloudflare',
  'sentry',
  'supabase',
  'figma',
  // Search / research tools for agents (all key-based):
  'tavily',
  'exa',
  'brave-search',
  'perplexity',
]);

export function isApiKeyProvider(slug: string): boolean {
  return API_KEY_PROVIDERS.has(slug);
}

/** Where the user gets the key + the expected prefix (for light validation). */
export const API_KEY_HINTS: Record<string, { label: string; getUrl: string; prefix?: string }> = {
  firecrawl: {
    label: 'Firecrawl API key',
    getUrl: 'https://www.firecrawl.dev/app/api-keys',
    prefix: 'fc-',
  },
  vercel: {
    label: 'Vercel access token',
    getUrl: 'https://vercel.com/account/tokens',
  },
  cloudflare: {
    label: 'Cloudflare API token',
    getUrl: 'https://dash.cloudflare.com/profile/api-tokens',
  },
  sentry: {
    label: 'Sentry auth token',
    getUrl: 'https://sentry.io/settings/account/api/auth-tokens/',
    // No prefix check — Sentry has multiple valid token formats (sntrys_, legacy hex).
  },
  supabase: {
    label: 'Supabase personal access token',
    getUrl: 'https://supabase.com/dashboard/account/tokens',
    prefix: 'sbp_',
  },
  figma: {
    label: 'Figma personal access token',
    getUrl: 'https://www.figma.com/developers/api#access-tokens',
    prefix: 'figd_',
  },
  tavily: {
    label: 'Tavily API key',
    getUrl: 'https://app.tavily.com/home',
    prefix: 'tvly-',
  },
  exa: {
    label: 'Exa API key',
    getUrl: 'https://dashboard.exa.ai/api-keys',
  },
  'brave-search': {
    label: 'Brave Search API token',
    getUrl: 'https://api-dashboard.search.brave.com/app/keys',
  },
  perplexity: {
    label: 'Perplexity API key',
    getUrl: 'https://www.perplexity.ai/settings/api',
    prefix: 'pplx-',
  },
};

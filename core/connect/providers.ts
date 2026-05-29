// Which providers authenticate with a user-supplied API key (stored encrypted
// in api_key_connections) vs OAuth (brokered by Nango, stored as a
// nango_connection_id in oauth_connections).
//
// API-key providers are the ones Nango doesn't template — mostly AI/search
// tools. Add a slug here + write its executor + give it a "paste your key"
// label, and it's wireable without Nango.

export const API_KEY_PROVIDERS: ReadonlySet<string> = new Set([
  'firecrawl',
  // Coming as executors are added: 'tavily', 'exa', 'openai', 'perplexity', …
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
};

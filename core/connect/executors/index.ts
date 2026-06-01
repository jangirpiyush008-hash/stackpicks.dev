import { executeGithubTool } from './github';
import { executeSlackTool } from './slack';
import { executeNotionTool } from './notion';
import { executeLinearTool } from './linear';
import { executeStripeTool } from './stripe';
import { executeFirecrawlTool } from './firecrawl';
import { executeGitlabTool } from './gitlab';
import { executeAirtableTool } from './airtable';
import { executeCalendlyTool } from './calendly';
import { executeAsanaTool } from './asana';
import { executeVercelTool } from './vercel';
import { executeCloudflareTool } from './cloudflare';
import { executeSentryTool } from './sentry';
import { executeSupabaseTool } from './supabase-mgmt';
import { executeFigmaTool } from './figma';
import { executeTavilyTool } from './tavily';
import { executeExaTool } from './exa';
import { executeBraveSearchTool } from './brave-search';
import { executePerplexityTool } from './perplexity';
import type { Provider } from '../tools';

interface MCPContent {
  type: 'text';
  text: string;
}

export interface ExecResult {
  ok: boolean;
  content?: MCPContent[];
  error?: string;
  is_error?: boolean;
}

interface ToolArgs {
  [key: string]: unknown;
}

/**
 * Dispatch a tool call to the right provider executor. Each executor handles
 * its own provider's API quirks; this layer is just routing + access-token
 * passing.
 */
export async function executeTool(
  provider: Provider,
  toolName: string,
  args: ToolArgs,
  accessToken: string,
): Promise<ExecResult> {
  switch (provider) {
    case 'github':
      return executeGithubTool(toolName, args, accessToken);
    case 'slack':
      return executeSlackTool(toolName, args, accessToken);
    case 'notion':
      return executeNotionTool(toolName, args, accessToken);
    case 'linear':
      return executeLinearTool(toolName, args, accessToken);
    case 'stripe':
      return executeStripeTool(toolName, args, accessToken);
    case 'firecrawl':
      return executeFirecrawlTool(toolName, args, accessToken);
    case 'gitlab':
      return executeGitlabTool(toolName, args, accessToken);
    case 'airtable':
      return executeAirtableTool(toolName, args, accessToken);
    case 'calendly':
      return executeCalendlyTool(toolName, args, accessToken);
    case 'asana':
      return executeAsanaTool(toolName, args, accessToken);
    case 'vercel':
      return executeVercelTool(toolName, args, accessToken);
    case 'cloudflare':
      return executeCloudflareTool(toolName, args, accessToken);
    case 'sentry':
      return executeSentryTool(toolName, args, accessToken);
    case 'supabase':
      return executeSupabaseTool(toolName, args, accessToken);
    case 'figma':
      return executeFigmaTool(toolName, args, accessToken);
    case 'tavily':
      return executeTavilyTool(toolName, args, accessToken);
    case 'exa':
      return executeExaTool(toolName, args, accessToken);
    case 'brave-search':
      return executeBraveSearchTool(toolName, args, accessToken);
    case 'perplexity':
      return executePerplexityTool(toolName, args, accessToken);
    default:
      return {
        ok: false,
        is_error: true,
        error: `Provider not yet wired: ${provider}. Coming next pass.`,
      };
  }
}

export { executeGithubTool };

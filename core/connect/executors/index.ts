import { executeGithubTool } from './github';
import { executeSlackTool } from './slack';
import { executeNotionTool } from './notion';
import { executeLinearTool } from './linear';
import { executeStripeTool } from './stripe';
import { executeFirecrawlTool } from './firecrawl';
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
    default:
      return {
        ok: false,
        is_error: true,
        error: `Provider not yet wired: ${provider}. Coming next pass.`,
      };
  }
}

export { executeGithubTool };

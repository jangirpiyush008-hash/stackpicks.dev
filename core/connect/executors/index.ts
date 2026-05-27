import { executeGithubTool } from './github';
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
    // gmail, slack, notion, discord, google-drive land here next pass.
    default:
      return {
        ok: false,
        is_error: true,
        error: `Provider not yet wired: ${provider}. Coming next pass.`,
      };
  }
}

export { executeGithubTool };

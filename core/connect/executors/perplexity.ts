// Perplexity tool executor. Connected via a Perplexity API key (API-key path,
// stored encrypted; prefix "pplx-"). Bearer auth against api.perplexity.ai.
// Search-grounded LLM answers with citations — great for agent research.

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const PPLX = 'https://api.perplexity.ai';

async function pplxPost(token: string, path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${PPLX}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Perplexity ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

export async function executePerplexityTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'perplexity_ask': {
        const model = String(args.model ?? 'sonar');
        const d = (await pplxPost(token, '/chat/completions', {
          model,
          messages: [{ role: 'user', content: String(args.query ?? '') }],
        })) as {
          choices?: Array<{ message?: { content?: string } }>;
          citations?: string[];
        };
        const answer = d.choices?.[0]?.message?.content ?? '';
        return { ok: true, content: asText({ answer, citations: d.citations ?? [] }) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Perplexity tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

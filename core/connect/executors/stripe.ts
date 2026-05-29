// Stripe tool executor. Connected via Stripe Connect OAuth — Nango returns an
// access token scoped to the connected Stripe account, used as a Bearer.
// Read-focused for safety (no charges/refunds from the agent by default).

interface MCPContent { type: 'text'; text: string }
interface ExecResult { ok: boolean; content?: MCPContent[]; error?: string; is_error?: boolean }
interface ToolArgs { [key: string]: unknown }

const STRIPE = 'https://api.stripe.com/v1';

async function stripeGet(token: string, path: string, params: Record<string, string> = {}): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${STRIPE}${path}${qs ? `?${qs}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Stripe-Version': '2024-06-20',
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

function asText(value: unknown): MCPContent[] {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

const money = (amt: unknown, cur: unknown) =>
  typeof amt === 'number' ? `${(amt / 100).toFixed(2)} ${String(cur ?? '').toUpperCase()}` : null;

export async function executeStripeTool(toolName: string, args: ToolArgs, token: string): Promise<ExecResult> {
  try {
    switch (toolName) {
      case 'stripe_get_balance': {
        const data = (await stripeGet(token, '/balance')) as {
          available: Array<{ amount: number; currency: string }>;
          pending: Array<{ amount: number; currency: string }>;
        };
        return {
          ok: true,
          content: asText({
            available: data.available.map((b) => money(b.amount, b.currency)),
            pending: data.pending.map((b) => money(b.amount, b.currency)),
          }),
        };
      }

      case 'stripe_list_customers': {
        const data = (await stripeGet(token, '/customers', { limit: String(args.limit ?? 20) })) as {
          data: Array<Record<string, unknown>>;
        };
        const slim = data.data.map((c) => ({ id: c.id, email: c.email, name: c.name, created: c.created }));
        return { ok: true, content: asText(slim) };
      }

      case 'stripe_list_charges': {
        const data = (await stripeGet(token, '/charges', { limit: String(args.limit ?? 20) })) as {
          data: Array<Record<string, unknown>>;
        };
        const slim = data.data.map((c) => ({
          id: c.id, amount: money(c.amount, c.currency), status: c.status,
          paid: c.paid, customer: c.customer, created: c.created,
          description: c.description,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'stripe_list_subscriptions': {
        const params: Record<string, string> = { limit: String(args.limit ?? 20) };
        if (args.status) params.status = String(args.status);
        const data = (await stripeGet(token, '/subscriptions', params)) as {
          data: Array<Record<string, unknown>>;
        };
        const slim = data.data.map((s) => ({
          id: s.id, status: s.status, customer: s.customer,
          current_period_end: s.current_period_end, cancel_at_period_end: s.cancel_at_period_end,
        }));
        return { ok: true, content: asText(slim) };
      }

      case 'stripe_list_payment_intents': {
        const data = (await stripeGet(token, '/payment_intents', { limit: String(args.limit ?? 20) })) as {
          data: Array<Record<string, unknown>>;
        };
        const slim = data.data.map((p) => ({
          id: p.id, amount: money(p.amount, p.currency), status: p.status, created: p.created,
        }));
        return { ok: true, content: asText(slim) };
      }

      default:
        return { ok: false, is_error: true, error: `Unknown Stripe tool: ${toolName}` };
    }
  } catch (err) {
    return { ok: false, is_error: true, error: err instanceof Error ? err.message : String(err) };
  }
}

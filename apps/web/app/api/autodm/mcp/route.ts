/**
 * StackPicks AutoDM — MCP server (Streamable HTTP / JSON-RPC 2.0).
 *
 * The press hook: creators manage their AutoDM rules from inside Claude
 * or Cursor with natural language. Auth via API key in the
 * `Authorization: Bearer sk_autodm_...` header.
 *
 * Endpoint: https://stackpicks.dev/api/autodm/mcp
 *           OR https://autodm.stackpicks.dev/api/autodm/mcp
 *
 * Tools exposed:
 *   list_rules            → all rules for the authed tenant
 *   create_rule           → keyword + dm_template + optional cta_url
 *   update_rule           → patch any field on an existing rule by id
 *   toggle_rule_active    → flip is_active on/off
 *   list_recent_dms       → 20 most recent dm_log entries for the tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { adminClient } from '@stackpicks/core/db';
import { matchRule } from '@stackpicks/core/autodm/dm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

interface JsonRpcReq {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}
const ok = (id: unknown, result: unknown) =>
  NextResponse.json({ jsonrpc: '2.0', id: id ?? null, result }, { headers: CORS });
const err = (id: unknown, code: number, message: string) =>
  NextResponse.json({ jsonrpc: '2.0', id: id ?? null, error: { code, message } }, { headers: CORS });

// ────────────────────────────────────────────────────────────────────
// Tool definitions — schemas surfaced via tools/list.
// ────────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'list_rules',
    description: 'List every auto-DM rule on this tenant. Returns id, label, keyword, dm_template, cta_url, is_active for each rule.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'create_rule',
    description: 'Create a new auto-DM rule. Triggers when someone comments any of the keyword(s) on the tenant\'s IG posts. Required: keyword + dm_template. Optional: label, cta_url, cta_label, comment_reply, follow_nudge. Use {{username}} placeholder in templates.',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: 'One keyword or comma-separated list (e.g. "CALENDAR, BOOK, CALL"). Case-insensitive substring match.' },
        dm_template: { type: 'string', description: 'DM body sent to the commenter. Supports {{username}} + {{keyword}} placeholders.' },
        label: { type: 'string', description: 'Admin-only name. Optional.' },
        cta_url: { type: 'string', description: 'The single link delivered in the CTA button card. Optional but recommended.' },
        cta_label: { type: 'string', description: 'Button text, max 20 chars. Defaults to "Open link".' },
        comment_reply: { type: 'string', description: 'Public reply posted under the commenter\'s comment.' },
        follow_nudge: { type: 'boolean', description: 'Append "PS — follow {handle} for more" to DMs to non-followers.' },
        is_active: { type: 'boolean', description: 'Set false to create paused. Default true.' },
      },
      required: ['keyword', 'dm_template'],
    },
  },
  {
    name: 'update_rule',
    description: 'Patch any field on an existing rule by id. Only include the fields you want to change.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Rule UUID — use list_rules to find it.' },
        label: { type: 'string' },
        keyword: { type: 'string' },
        dm_template: { type: 'string' },
        cta_url: { type: 'string' },
        cta_label: { type: 'string' },
        comment_reply: { type: 'string' },
        comment_reply_follower: { type: 'string' },
        follow_nudge: { type: 'boolean' },
        is_active: { type: 'boolean' },
      },
      required: ['id'],
    },
  },
  {
    name: 'toggle_rule_active',
    description: 'Pause or resume a rule by id. Equivalent to update_rule with { is_active }.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Rule UUID.' },
        is_active: { type: 'boolean', description: 'true to resume, false to pause.' },
      },
      required: ['id', 'is_active'],
    },
  },
  {
    name: 'list_recent_dms',
    description: 'List the 20 most recent auto-DM send attempts for this tenant. Shows recipient username, status (sent/skipped/error), the trigger comment text, and timestamp.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'preview_match',
    description: 'Given a comment text and a post id, return which rule would fire (if any). Useful for debugging keyword overlap before activating a new rule.',
    inputSchema: {
      type: 'object',
      properties: {
        comment_text: { type: 'string' },
        ig_post_id: { type: 'string', description: 'Optional — when provided, post-pinned rules are preferred.' },
      },
      required: ['comment_text'],
    },
  },
];

// ────────────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────────────
async function authTenant(req: NextRequest): Promise<{ ok: true; tenantId: string } | { ok: false; reason: string }> {
  const header = req.headers.get('authorization') || '';
  const m = header.match(/^Bearer (sk_autodm_[0-9a-f]+)$/i);
  if (!m) return { ok: false, reason: 'missing Bearer sk_autodm_... in Authorization header' };
  const hash = createHash('sha256').update(m[1]).digest('hex');
  const admin = adminClient();
  const { data } = await admin.from('autodm_api_keys')
    .select('id, tenant_id, revoked_at').eq('key_hash', hash).single();
  if (!data || data.revoked_at) return { ok: false, reason: 'invalid or revoked API key' };
  await admin.from('autodm_api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id);
  return { ok: true, tenantId: data.tenant_id as string };
}

// ────────────────────────────────────────────────────────────────────
// Tool dispatcher
// ────────────────────────────────────────────────────────────────────
async function callTool(tenantId: string, name: string, args: Record<string, unknown>) {
  const admin = adminClient();

  switch (name) {
    case 'list_rules': {
      const { data } = await admin
        .from('autodm_rules')
        .select('id, label, keyword, dm_template, cta_url, cta_label, comment_reply, follow_nudge, is_active')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
      return { content: [{ type: 'text', text: JSON.stringify(data ?? [], null, 2) }] };
    }
    case 'create_rule': {
      const payload = {
        tenant_id: tenantId,
        label: (args.label as string) || null,
        keyword: String(args.keyword || '').trim(),
        dm_template: String(args.dm_template || ''),
        cta_url: (args.cta_url as string) || null,
        cta_label: (args.cta_label as string) || (args.cta_url ? 'Open link' : null),
        comment_reply: (args.comment_reply as string) || null,
        follow_nudge: args.follow_nudge === true,
        is_active: args.is_active !== false,
      };
      if (!payload.keyword || !payload.dm_template) {
        return { content: [{ type: 'text', text: 'Error: keyword and dm_template are required.' }], isError: true };
      }
      const { data, error } = await admin.from('autodm_rules').insert(payload).select().single();
      if (error) return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
      return { content: [{ type: 'text', text: `Created rule ${data.id} (keyword="${payload.keyword}", active=${payload.is_active}).` }] };
    }
    case 'update_rule': {
      const id = String(args.id || '');
      if (!id) return { content: [{ type: 'text', text: 'Error: id required.' }], isError: true };
      const allowed = ['label', 'keyword', 'dm_template', 'cta_url', 'cta_label', 'comment_reply', 'comment_reply_follower', 'follow_nudge', 'is_active'];
      const updates: Record<string, unknown> = {};
      for (const k of allowed) if (k in args) updates[k] = args[k];
      const { data, error } = await admin.from('autodm_rules')
        .update(updates).eq('id', id).eq('tenant_id', tenantId).select().single();
      if (error || !data) return { content: [{ type: 'text', text: `Error: ${error?.message || 'rule not found'}` }], isError: true };
      return { content: [{ type: 'text', text: `Updated rule ${id}. Changed: ${Object.keys(updates).join(', ')}.` }] };
    }
    case 'toggle_rule_active': {
      const id = String(args.id || '');
      const next = args.is_active === true;
      if (!id) return { content: [{ type: 'text', text: 'Error: id required.' }], isError: true };
      const { error } = await admin.from('autodm_rules')
        .update({ is_active: next }).eq('id', id).eq('tenant_id', tenantId);
      if (error) return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
      return { content: [{ type: 'text', text: `Rule ${id} is now ${next ? 'live' : 'paused'}.` }] };
    }
    case 'list_recent_dms': {
      const { data } = await admin
        .from('autodm_dm_log')
        .select('ig_username, status, error, trigger_text, created_at')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(20);
      return { content: [{ type: 'text', text: JSON.stringify(data ?? [], null, 2) }] };
    }
    case 'preview_match': {
      const text = String(args.comment_text || '');
      const postId = String(args.ig_post_id || '');
      const { data: rules } = await admin
        .from('autodm_rules')
        .select('id, ig_post_id, keyword, dm_template, is_active, label')
        .eq('tenant_id', tenantId);
      const match = matchRule(rules ?? [], text, postId);
      if (!match) return { content: [{ type: 'text', text: `No rule matches "${text.slice(0, 80)}".` }] };
      return { content: [{ type: 'text', text: `Would fire: ${match.label || match.id} (keyword="${match.keyword}"). DM: "${match.dm_template.slice(0, 200)}"` }] };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}

// ────────────────────────────────────────────────────────────────────
// HTTP entrypoint — Streamable HTTP / JSON-RPC 2.0
// ────────────────────────────────────────────────────────────────────
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  let body: JsonRpcReq;
  try { body = (await req.json()) as JsonRpcReq; }
  catch { return err(null, -32700, 'Parse error'); }
  const { id, method, params } = body;

  // initialize doesn't require auth — clients negotiate capabilities first
  if (method === 'initialize') {
    return ok(id, {
      protocolVersion: '2025-11-25',
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'StackPicks AutoDM', version: '1.0.0' },
    });
  }

  // Every other method requires a valid API key
  const auth = await authTenant(req);
  if (!auth.ok) return err(id, -32001, auth.reason);

  if (method === 'tools/list') return ok(id, { tools: TOOLS });
  if (method === 'tools/call') {
    const name = (params?.name as string) || '';
    const args = (params?.arguments as Record<string, unknown>) || {};
    const result = await callTool(auth.tenantId, name, args);
    return ok(id, result);
  }
  return err(id, -32601, `Method not found: ${method}`);
}

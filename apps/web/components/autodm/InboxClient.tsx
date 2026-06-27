'use client';

/**
 * AutoDM Inbox client — tab filter + per-conversation expand-to-transcript +
 * action buttons (take over, close, reopen).
 *
 * Status semantics:
 *   active             — agent in flight, can still reply
 *   creator_escalated  — agent flagged it, NEEDS YOUR REPLY ON IG
 *   closed             — conversation ended naturally / manually closed
 *   expired            — hit turn or time cap
 */

import { useMemo, useState } from 'react';
import { Bot, User, ExternalLink, CheckCircle2, AlertTriangle, MessageSquare, ChevronDown, ChevronRight, Send, UserCheck } from 'lucide-react';

interface Conv {
  id: string;
  recipient_igsid: string;
  recipient_username: string | null;
  initial_rule_id: string | null;
  initial_comment_text: string | null;
  turn_count: number;
  last_turn_at: string;
  status: 'active' | 'creator_escalated' | 'closed' | 'expired';
  full_transcript: { role: 'user' | 'creator_bot' | 'creator_human'; text: string; at: string }[] | null;
  created_at: string;
}

const TABS: { id: 'all' | Conv['status']; label: string }[] = [
  { id: 'all',                label: 'All' },
  { id: 'creator_escalated',  label: 'Needs you' },
  { id: 'active',             label: 'Active' },
  { id: 'closed',             label: 'Closed' },
];

export function InboxClient({
  initialConversations, counts, tenantUsername,
}: {
  initialConversations: Conv[];
  counts: Record<string, number>;
  tenantUsername: string;
}) {
  const [convs, setConvs] = useState<Conv[]>(initialConversations);
  const [tab, setTab] = useState<typeof TABS[number]['id']>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (tab === 'all') return convs;
    return convs.filter((c) => c.status === tab);
  }, [convs, tab]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function updateStatus(id: string, status: Conv['status']) {
    setConvs((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch(`/api/autodm/conversations?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  // Called by ReplyComposer after a successful HUMAN_AGENT-tagged send.
  // Optimistically appends the new turn to the transcript and bumps the
  // status from creator_escalated → active (the backend does the same).
  function onReplySent(id: string, text: string) {
    setConvs((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const transcript = [...(c.full_transcript ?? []), {
        role: 'creator_human' as const,
        text,
        at: new Date().toISOString(),
      }];
      return {
        ...c,
        full_transcript: transcript,
        turn_count: c.turn_count + 1,
        last_turn_at: new Date().toISOString(),
        status: c.status === 'creator_escalated' ? 'active' : c.status,
      };
    }));
  }

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="border-b border-border flex gap-1 mb-4 overflow-x-auto">
        {TABS.map((t) => {
          const n = t.id === 'all'
            ? (counts.active || 0) + (counts.creator_escalated || 0) + (counts.closed || 0) + (counts.expired || 0)
            : counts[t.id] || 0;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition ${
                isActive ? 'border-accent text-text' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {t.label}
              <span className={`ml-2 inline-block min-w-[1.25rem] text-center text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                t.id === 'creator_escalated' && n > 0
                  ? 'bg-amber-500/15 text-amber-500'
                  : 'bg-muted/15 text-muted'
              }`}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <MessageSquare className="w-8 h-8 text-muted/50 mx-auto mb-3" />
          <p className="text-sm text-muted">No conversations in this view yet.</p>
          <p className="text-xs text-muted mt-1">
            When someone replies to one of your auto-DMs, it appears here.
          </p>
        </div>
      )}

      {/* Conversation list */}
      <div className="space-y-2">
        {filtered.map((c) => {
          const isOpen = expanded.has(c.id);
          const lastTurn = new Date(c.last_turn_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          const igDeepLink = `https://www.instagram.com/direct/t/${c.recipient_igsid}`;
          return (
            <div key={c.id} className={`rounded-xl border ${
              c.status === 'creator_escalated'
                ? 'border-amber-500/40 bg-amber-500/5'
                : c.status === 'active'
                  ? 'border-accent/30 bg-bg-card/50'
                  : 'border-border bg-bg-card/30'
            }`}>
              <button
                onClick={() => toggleExpand(c.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {isOpen
                  ? <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                  : <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />}
                <StatusDot status={c.status} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">
                    @{c.recipient_username || 'anon'}
                    <span className="text-muted font-normal ml-2">
                      · {c.turn_count} {c.turn_count === 1 ? 'turn' : 'turns'} · {lastTurn} IST
                    </span>
                  </div>
                  <div className="text-xs text-muted mt-0.5 truncate">
                    triggered by &ldquo;{c.initial_comment_text?.slice(0, 80) || '—'}&rdquo;
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div className="border-t border-border/60 px-4 pb-4 pt-3">
                  <Transcript turns={c.full_transcript || []} tenantUsername={tenantUsername} />

                  {/* Human-agent manual reply composer — visible for active +
                      escalated conversations within the 7-day Human Agent
                      window. This is what justifies our Human Agent Meta
                      permission: a real creator reviews and composes the
                      reply, then sends via /api/autodm/conversations/[id]/reply
                      with messaging_type=MESSAGE_TAG + tag=HUMAN_AGENT. */}
                  {(c.status === 'active' || c.status === 'creator_escalated') && (
                    <ReplyComposer
                      conversationId={c.id}
                      lastTurnAt={c.last_turn_at}
                      onSent={(text) => onReplySent(c.id, text)}
                    />
                  )}

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {c.status === 'creator_escalated' && (
                      <a
                        href={igDeepLink}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:border-muted"
                        title="Open the IG app to reply manually (fallback if the in-app reply fails)"
                      >
                        <ExternalLink className="w-3 h-3" /> Open in Instagram
                      </a>
                    )}
                    {c.status !== 'closed' && (
                      <button
                        onClick={() => updateStatus(c.id, 'closed')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:border-muted"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark closed
                      </button>
                    )}
                    {c.status === 'closed' && (
                      <button
                        onClick={() => updateStatus(c.id, 'active')}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:border-muted"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Transcript({
  turns, tenantUsername,
}: { turns: { role: 'user' | 'creator_bot' | 'creator_human'; text: string; at: string }[]; tenantUsername: string }) {
  if (turns.length === 0) return <p className="text-xs text-muted italic">No messages yet.</p>;
  return (
    <div className="space-y-2.5">
      {turns.map((t, i) => {
        const isHuman = t.role === 'creator_human';
        const isCreator = isHuman || t.role === 'creator_bot';
        return (
          <div key={i} className={`flex gap-2 ${isCreator ? 'justify-end' : 'justify-start'}`}>
            {!isCreator && <User className="w-4 h-4 text-muted mt-1.5 flex-shrink-0" />}
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
              isHuman
                ? 'bg-amber-500/10 border border-amber-500/30 text-text'
                : isCreator
                  ? 'bg-accent/10 text-text'
                  : 'bg-bg-card border border-border text-text'
            }`}>
              <div className="text-[10px] uppercase tracking-widest text-muted font-mono mb-0.5">
                {isHuman ? `@${tenantUsername} (you)` : isCreator ? `@${tenantUsername} (bot)` : 'recipient'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{t.text}</div>
            </div>
            {isHuman && <UserCheck className="w-4 h-4 text-amber-500 mt-1.5 flex-shrink-0" />}
            {isCreator && !isHuman && <Bot className="w-4 h-4 text-accent mt-1.5 flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Manual-reply composer rendered inside the expanded conversation card.
 * Sends via the human-agent endpoint which tags the message MESSAGE_TAG +
 * HUMAN_AGENT — the Meta-supported path for human-reviewed support replies
 * up to 7 days after the recipient's last message. Disables itself when
 * the 7-day Human Agent window has elapsed (we can't deliver past that).
 */
function ReplyComposer({
  conversationId, lastTurnAt, onSent,
}: {
  conversationId: string;
  lastTurnAt: string;
  onSent: (text: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const HUMAN_AGENT_MS = 7 * 24 * 60 * 60 * 1000;
  const ageMs = Date.now() - new Date(lastTurnAt).getTime();
  const expired = ageMs > HUMAN_AGENT_MS;
  const hoursLeft = Math.max(0, Math.floor((HUMAN_AGENT_MS - ageMs) / (60 * 60 * 1000)));

  async function send() {
    const message = draft.trim();
    if (!message || sending) return;
    setSending(true); setError(null);
    try {
      const res = await fetch(`/api/autodm/conversations/${conversationId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; hint?: string };
      if (!res.ok || !j.ok) {
        setError(j.hint || j.error || `HTTP ${res.status}`);
      } else {
        onSent(message);
        setDraft('');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (expired) {
    return (
      <div className="mt-3 rounded-lg border border-border bg-bg-card/50 p-3 text-xs text-muted">
        <UserCheck className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
        Human Agent window expired (7 days from recipient&apos;s last message). Use &ldquo;Open in Instagram&rdquo; below to reply manually.
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.04] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2">
        <UserCheck className="w-3 h-3" />
        Your manual reply
        <span className="text-muted font-normal ml-auto normal-case tracking-normal">
          {hoursLeft}h left in 7-day window
        </span>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, 1000))}
        placeholder="Write a reply — sent via your IG account with Human Agent tag (you composed this, not the AI)…"
        rows={3}
        className="w-full text-sm bg-bg/80 border border-border rounded-md px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:border-accent resize-none"
        disabled={sending}
      />
      <div className="flex items-center justify-between mt-2">
        <div className="text-[11px] text-muted">
          {draft.length}/1000
          {error && <span className="text-red-400 ml-2">· {error}</span>}
        </div>
        <button
          onClick={send}
          disabled={!draft.trim() || sending}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-accent text-bg hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-3 h-3" />
          {sending ? 'Sending…' : 'Send reply'}
        </button>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: Conv['status'] }) {
  const color = {
    active: 'bg-accent animate-pulse',
    creator_escalated: 'bg-amber-500',
    closed: 'bg-muted',
    expired: 'bg-muted/40',
  }[status];
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />;
}

function StatusBadge({ status }: { status: Conv['status'] }) {
  if (status === 'creator_escalated') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold">
        <AlertTriangle className="w-2.5 h-2.5" /> Needs you
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">
        Active
      </span>
    );
  }
  if (status === 'closed') {
    return (
      <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-muted/15 text-muted font-semibold">
        Closed
      </span>
    );
  }
  return (
    <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-muted/10 text-muted font-semibold">
      Expired
    </span>
  );
}

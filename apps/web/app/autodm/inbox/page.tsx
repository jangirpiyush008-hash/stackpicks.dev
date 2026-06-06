// AutoDM conversations inbox — visible value of the Pro-tier follow-up agent.
// Server component: fetches the tenant + initial conversations + counts.
// Client component (InboxClient) handles filter tabs + transcript expansion + actions.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase-server';
import { adminClient } from '@stackpicks/core/db';
import { InboxClient } from '@/components/autodm/InboxClient';
import { Inbox as InboxIcon, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Inbox — StackPicks AutoDM',
  description: 'Every AI-handled conversation, in one place.',
};

interface ConvRow {
  id: string;
  recipient_igsid: string;
  recipient_username: string | null;
  initial_rule_id: string | null;
  initial_comment_text: string | null;
  turn_count: number;
  last_turn_at: string;
  status: 'active' | 'creator_escalated' | 'closed' | 'expired';
  full_transcript: { role: 'user' | 'creator_bot'; text: string; at: string }[] | null;
  created_at: string;
}

export default async function InboxPage() {
  const supa = await getSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) redirect('/login?next=/autodm/inbox');

  const admin = adminClient();
  const { data: tenants } = await admin
    .from('autodm_tenants')
    .select('id, ig_username, ai_followup_agent, plan_tier')
    .eq('owner_user_id', user.id)
    .limit(1);
  const tenant = tenants?.[0];
  if (!tenant) redirect('/autodm/connect');

  // Initial fetch — newest 100 across all statuses
  const { data: conversations } = await admin
    .from('autodm_conversations')
    .select('id, recipient_igsid, recipient_username, initial_rule_id, initial_comment_text, turn_count, last_turn_at, status, full_transcript, created_at')
    .eq('tenant_id', tenant.id as string)
    .order('last_turn_at', { ascending: false })
    .limit(100);

  // Status counts for tab badges
  const counts = { active: 0, creator_escalated: 0, closed: 0, expired: 0 };
  for (const c of (conversations ?? []) as ConvRow[]) {
    counts[c.status] = (counts[c.status] || 0) + 1;
  }

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/autodm/dashboard" className="text-xs text-muted hover:text-text inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to dashboard
        </Link>

        <div className="mt-4 flex items-start gap-3 mb-2">
          <InboxIcon className="w-7 h-7 text-accent" />
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">Inbox</h1>
            <p className="text-sm text-muted mt-1">
              Every conversation the AI follow-up agent handled. Take over the ones it escalated to you.
            </p>
          </div>
        </div>

        {!tenant.ai_followup_agent && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 my-6 text-sm">
            <strong>Follow-up agent is off.</strong>{' '}
            <span className="text-muted">
              New replies to your DMs won&apos;t be auto-answered. Toggle ON in the dashboard
              {tenant.plan_tier !== 'pro' && tenant.plan_tier !== 'agency' ? ' (Pro tier feature).' : '.'}
            </span>
          </div>
        )}

        <InboxClient
          initialConversations={(conversations ?? []) as ConvRow[]}
          counts={counts}
          tenantUsername={(tenant.ig_username as string) || 'creator'}
        />
      </section>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { Calendar, ListChecks, MessageCircle } from 'lucide-react';
import { IgCalendar } from './IgCalendar';
import { IgDmRules } from './IgDmRules';

interface QueueRow {
  id: string;
  post_type: 'reel' | 'video' | 'image' | 'carousel';
  topic: string;
  media_urls: string[];
  caption: string;
  hashtags: string;
  status: 'ready' | 'processing' | 'posted' | 'error';
  scheduled_at: string;
  posted_at: string | null;
  ig_post_id: string | null;
  attempts: number;
  last_error: string | null;
  created_at: string;
}

type Tab = 'calendar' | 'queue' | 'dms';

interface Props {
  rows: QueueRow[];
  queueTable: React.ReactNode; // server-rendered existing table
}

export function IgAdminTabs({ rows, queueTable }: Props) {
  const [tab, setTab] = useState<Tab>('calendar');

  return (
    <>
      <div role="tablist" className="flex items-center gap-1 mb-6 border-b border-border">
        <TabButton id="calendar" active={tab === 'calendar'} onClick={setTab} icon={Calendar}>
          Calendar
        </TabButton>
        <TabButton id="queue"    active={tab === 'queue'}    onClick={setTab} icon={ListChecks}>
          Queue ({rows.length})
        </TabButton>
        <TabButton id="dms"      active={tab === 'dms'}      onClick={setTab} icon={MessageCircle}>
          DM rules
        </TabButton>
      </div>

      {tab === 'calendar' && <IgCalendar rows={rows} />}
      {tab === 'queue'    && queueTable}
      {tab === 'dms'      && <IgDmRules />}
    </>
  );
}

function TabButton({
  id, active, onClick, icon: Icon, children,
}: {
  id: Tab; active: boolean; onClick: (id: Tab) => void;
  icon: typeof Calendar; children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => onClick(id)}
      className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-muted hover:text-text hover:border-border'
      }`}
    >
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

'use client';

/**
 * Month-grid calendar of the IG publishing queue.
 *
 * Server-loaded queue rows are passed in. We bucket them by IST date,
 * render a 7-column grid, and let the admin click prev/next month.
 *
 * Each day cell shows post tiles: time · type icon · topic · status pill.
 * Today is highlighted with an accent ring.
 */

import { useMemo, useState } from 'react';
import { Image as ImageIcon, Film, Layers, Video, Clock,
  CheckCircle2, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Row {
  id: string;
  post_type: 'reel' | 'video' | 'image' | 'carousel';
  topic: string;
  status: 'draft' | 'ready' | 'processing' | 'posted' | 'error';
  scheduled_at: string;
  posted_at: string | null;
  ig_post_id: string | null;
}

interface Props { rows: Row[] }

const TYPE_ICON = {
  reel:     Film,
  video:    Video,
  image:    ImageIcon,
  carousel: Layers,
} as const;

const STATUS_STYLE: Record<Row['status'], string> = {
  draft:      'border-zinc-500/40  bg-zinc-500/10  text-zinc-300',
  ready:      'border-amber-500/40 bg-amber-500/10 text-amber-200',
  processing: 'border-blue-500/40  bg-blue-500/10  text-blue-200',
  posted:     'border-accent/40    bg-accent/10    text-accent',
  error:      'border-rose-500/40  bg-rose-500/10  text-rose-200',
};

// Convert a UTC ISO string into the calendar's IST y-m-d key + hh:mm
function istParts(iso: string) {
  // Use Intl with explicit timezone — no Date arithmetic gotchas
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = fmt.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  return {
    key: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  };
}

function MONTH_LABEL(d: Date) {
  return d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', year: 'numeric' });
}

export function IgCalendar({ rows }: Props) {
  // Initial cursor: first day of current IST month
  const initial = useMemo(() => {
    const nowParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const y = Number(nowParts.find((p) => p.type === 'year')?.value);
    const m = Number(nowParts.find((p) => p.type === 'month')?.value);
    return new Date(Date.UTC(y, m - 1, 1));
  }, []);
  const [cursor, setCursor] = useState(initial);

  const monthYear = cursor.getUTCFullYear();
  const monthIdx = cursor.getUTCMonth();

  // Bucket rows by IST y-m-d
  const buckets = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of rows) {
      const { key } = istParts(r.scheduled_at);
      const arr = map.get(key) || [];
      arr.push(r);
      map.set(key, arr);
    }
    // Sort each day chronologically
    for (const arr of map.values()) {
      arr.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
    }
    return map;
  }, [rows]);

  // Build a 6x7 grid covering the displayed month
  const cells = useMemo(() => {
    const first = new Date(Date.UTC(monthYear, monthIdx, 1));
    const startDow = first.getUTCDay(); // 0..6 Sun..Sat — calendar starts on Sun
    const daysInMonth = new Date(Date.UTC(monthYear, monthIdx + 1, 0)).getUTCDate();

    const list: { date: Date | null; key: string; inMonth: boolean }[] = [];
    for (let i = 0; i < startDow; i++) list.push({ date: null, key: `pad-pre-${i}`, inMonth: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(monthYear, monthIdx, d));
      const k = `${monthYear}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      list.push({ date, key: k, inMonth: true });
    }
    while (list.length % 7) list.push({ date: null, key: `pad-post-${list.length}`, inMonth: false });
    return list;
  }, [monthYear, monthIdx]);

  const todayKey = useMemo(() => {
    const p = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    return `${p.find((x) => x.type === 'year')?.value}-${p.find((x) => x.type === 'month')?.value}-${p.find((x) => x.type === 'day')?.value}`;
  }, []);

  const shift = (delta: number) => {
    setCursor(new Date(Date.UTC(monthYear, monthIdx + delta, 1)));
  };

  // Quick stats for visible month
  const monthStats = useMemo(() => {
    let count = 0, ready = 0, posted = 0;
    for (const c of cells) {
      if (!c.inMonth) continue;
      const arr = buckets.get(c.key) || [];
      count += arr.length;
      ready += arr.filter((r) => r.status === 'ready').length;
      posted += arr.filter((r) => r.status === 'posted').length;
    }
    return { count, ready, posted };
  }, [cells, buckets]);

  return (
    <div className="rounded-xl border border-border bg-surface/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-surface/50 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shift(-1)}
            className="p-1.5 rounded-md text-muted hover:text-text hover:bg-bg/60 transition"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-sm">{MONTH_LABEL(cursor)}</h3>
          <button
            onClick={() => shift(1)}
            className="p-1.5 rounded-md text-muted hover:text-text hover:bg-bg/60 transition"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCursor(initial)}
            className="ml-2 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md text-muted hover:text-accent border border-border hover:border-accent/40 transition"
          >
            Today
          </button>
        </div>
        <div className="flex gap-3 text-[10px] font-mono uppercase tracking-wider text-muted">
          <span><strong className="text-text">{monthStats.count}</strong> scheduled</span>
          <span><strong className="text-amber-300">{monthStats.ready}</strong> ready</span>
          <span><strong className="text-accent">{monthStats.posted}</strong> posted</span>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-border bg-surface/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-[10px] font-mono uppercase tracking-wider text-muted px-2 py-2 text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 grid-rows-6 min-h-[600px]">
        {cells.map((c) => {
          if (!c.inMonth || !c.date) {
            return <div key={c.key} className="border-r border-b border-border/40 bg-bg/20" />;
          }
          const arr = buckets.get(c.key) || [];
          const isToday = c.key === todayKey;
          return (
            <div
              key={c.key}
              className={`border-r border-b border-border/40 p-1.5 flex flex-col gap-1 min-h-[100px] ${
                isToday ? 'bg-accent/5 ring-1 ring-inset ring-accent/40' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono ${isToday ? 'text-accent font-semibold' : 'text-muted'}`}>
                  {c.date.getUTCDate()}
                </span>
                {arr.length > 0 && (
                  <span className="text-[9px] font-mono text-muted bg-bg/40 px-1 rounded">{arr.length}</span>
                )}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden">
                {arr.slice(0, 3).map((r) => <PostTile key={r.id} row={r} />)}
                {arr.length > 3 && (
                  <span className="text-[9px] text-muted px-1">+{arr.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PostTile({ row }: { row: Row }) {
  const Icon = TYPE_ICON[row.post_type];
  const StatusIcon =
    row.status === 'posted'     ? CheckCircle2 :
    row.status === 'error'      ? AlertTriangle :
    row.status === 'processing' ? Loader2 :
    row.status === 'draft'      ? Layers :
    Clock;
  const { time } = istParts(row.scheduled_at);
  return (
    <div
      className={`flex items-center gap-1 px-1.5 py-1 rounded border text-[10px] truncate ${STATUS_STYLE[row.status]}`}
      title={`${row.topic} — ${row.status}`}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span className="font-mono tabular-nums">{time}</span>
      <span className="truncate">{row.topic}</span>
      <StatusIcon className={`w-3 h-3 ml-auto flex-shrink-0 ${row.status === 'processing' ? 'animate-spin' : ''}`} />
    </div>
  );
}

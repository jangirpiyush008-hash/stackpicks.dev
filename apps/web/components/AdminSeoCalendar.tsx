'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, Calendar, Flame, ChevronDown, ChevronRight } from 'lucide-react';
import { SEO_TASKS, SEO_DAILY_CHECKLIST, CATEGORY_META, type SeoTask } from '../lib/seo-calendar';

interface Props {
  /** Day number 1-90 calculated from launch_date on the server. */
  currentDay: number;
  /** Map of day_number -> ISO completed_at (null = not completed). */
  completion: Record<number, { completed_at: string | null; notes: string | null }>;
}

export function AdminSeoCalendar({ currentDay, completion }: Props) {
  const todayTask = SEO_TASKS.find((t) => t.day === currentDay);
  const upcoming = SEO_TASKS.filter((t) => t.day > currentDay && t.day <= currentDay + 6);
  const past = SEO_TASKS.filter((t) => t.day < currentDay);

  const completedCount = past.filter((t) => completion[t.day]?.completed_at).length;
  const totalPast = past.length;
  const completionRate = totalPast > 0 ? Math.round((completedCount / totalPast) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Status bar */}
      <div className="rounded-2xl border border-border bg-surface/30 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-accent mb-1">
              <Flame className="w-3 h-3" />
              90-Day SEO + GEO Campaign
            </div>
            <div className="text-2xl font-bold">
              Day {currentDay} of 90
            </div>
            <div className="text-xs text-muted mt-0.5">
              {completedCount}/{totalPast} past tasks completed · {completionRate}% on-track
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-48 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${Math.min(100, (currentDay / 90) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-muted">{Math.round((currentDay / 90) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Daily recurring checklist */}
      <details className="rounded-2xl border border-border bg-surface/20 p-5">
        <summary className="cursor-pointer flex items-center justify-between font-semibold">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Daily recurring (~15 min, every day)
          </span>
          <ChevronDown className="w-4 h-4 text-muted" />
        </summary>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {SEO_DAILY_CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent mt-1">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </details>

      {/* Today */}
      {todayTask && (
        <div>
          <div className="flex items-center gap-2 mb-3 text-[10px] font-mono uppercase tracking-wider text-accent">
            <Calendar className="w-3 h-3" />
            Today — Day {currentDay}
          </div>
          <TaskCard task={todayTask} state={completion[todayTask.day]} highlight />
        </div>
      )}

      {/* Upcoming 7 days */}
      {upcoming.length > 0 && (
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-3">
            Coming up (next 6 days)
          </div>
          <div className="space-y-3">
            {upcoming.map((t) => (
              <TaskCard key={t.day} task={t} state={completion[t.day]} />
            ))}
          </div>
        </div>
      )}

      {/* Past tasks — collapsed */}
      {past.length > 0 && (
        <details className="border-t border-border pt-6">
          <summary className="cursor-pointer flex items-center gap-2 text-sm text-muted hover:text-text">
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition" />
            Past tasks ({past.length}) — {completedCount} completed
          </summary>
          <div className="mt-4 space-y-2">
            {past.slice().reverse().map((t) => (
              <TaskCard key={t.day} task={t} state={completion[t.day]} compact />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function TaskCard({
  task,
  state,
  highlight = false,
  compact = false,
}: {
  task: SeoTask;
  state: { completed_at: string | null; notes: string | null } | undefined;
  highlight?: boolean;
  compact?: boolean;
}) {
  const [completed, setCompleted] = useState(!!state?.completed_at);
  const [pending, startTransition] = useTransition();
  const cat = CATEGORY_META[task.category];

  function toggle() {
    const next = !completed;
    setCompleted(next); // optimistic
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/seo-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day: task.day, completed: next }),
        });
        if (!res.ok) {
          setCompleted(!next); // revert
          alert('Save failed — check console');
        }
      } catch (err) {
        console.error(err);
        setCompleted(!next);
      }
    });
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface/30 transition">
        <button onClick={toggle} disabled={pending} className="shrink-0">
          {completed
            ? <CheckCircle2 className="w-4 h-4 text-accent" />
            : <Circle className="w-4 h-4 text-muted hover:text-accent transition" />}
        </button>
        <span className="font-mono text-xs text-muted w-12">D{task.day}</span>
        <span className={`text-sm flex-1 truncate ${completed ? 'line-through text-muted' : 'text-text'}`}>
          {task.title}
        </span>
        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${cat.color}`}>
          {cat.label}
        </span>
      </div>
    );
  }

  return (
    <article
      className={`rounded-2xl border p-5 transition ${
        highlight
          ? 'border-accent/60 bg-accent/5 ring-1 ring-accent/20'
          : 'border-border bg-surface/30 hover:border-accent/40'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <button onClick={toggle} disabled={pending} className="shrink-0 mt-0.5">
          {completed
            ? <CheckCircle2 className="w-5 h-5 text-accent" />
            : <Circle className="w-5 h-5 text-muted hover:text-accent transition" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs text-muted">Day {task.day}</span>
            <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${cat.color}`}>
              {cat.label}
            </span>
            <span className="text-[10px] font-mono text-muted flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {task.expected_time_min} min
            </span>
          </div>
          <h3 className={`text-base font-bold leading-snug ${completed ? 'line-through text-muted' : 'text-text'}`}>
            {task.title}
          </h3>
        </div>
      </div>

      <p className={`text-sm leading-relaxed mb-3 ${completed ? 'text-muted' : 'text-text/90'}`}>
        {task.description}
      </p>

      <div className="flex items-center gap-4 flex-wrap text-xs">
        {task.url && (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Open link
          </a>
        )}
        <span className="text-muted">
          <span className="text-text">Outcome:</span> {task.expected_outcome}
        </span>
      </div>

      {state?.completed_at && (
        <div className="mt-3 pt-3 border-t border-border text-[10px] font-mono text-muted">
          ✓ Done {new Date(state.completed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      )}
    </article>
  );
}

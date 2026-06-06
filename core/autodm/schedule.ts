/**
 * Rule-scheduling helper.
 *
 * A rule fires only inside its active hours AND active days, both
 * evaluated in IST (India-first product — never UTC for user-facing
 * time windows).
 *
 *   active_hour_start / active_hour_end: 0-23 inclusive
 *     • both null → always on
 *     • start <= end → same-day window (9..22 = 09:00-22:59)
 *     • start > end  → overnight window (22..6 = 22:00 to 06:59 next day)
 *   active_days: array of weekday integers, 0=Sun, 6=Sat
 *     • null or empty → all 7 days
 *
 * Pure functions — no Date globals beyond the input. Easy to test.
 */

export interface RuleSchedule {
  active_hour_start: number | null;
  active_hour_end: number | null;
  active_days: number[] | null;
}

const IST_OFFSET_MIN = 5 * 60 + 30;

/**
 * Return the IST {hour, weekday} for a given moment. Weekday is
 * Sunday=0 to match Postgres extract(dow ...).
 */
export function nowInIST(now: Date = new Date()): { hour: number; weekday: number } {
  const istMs = now.getTime() + IST_OFFSET_MIN * 60_000;
  const ist = new Date(istMs);
  // We use UTC getters on the shifted timestamp — same trick the Intl
  // approach uses but without locale-dependency.
  return {
    hour: ist.getUTCHours(),
    weekday: ist.getUTCDay(),
  };
}

/**
 * Is this rule allowed to fire right now? Returns a tuple so callers
 * can log the reason on skip.
 */
export function isRuleActiveNow(
  rule: RuleSchedule,
  now: Date = new Date(),
): { active: true } | { active: false; reason: 'outside_hours' | 'wrong_day' } {
  const { hour, weekday } = nowInIST(now);

  if (rule.active_days && rule.active_days.length > 0) {
    if (!rule.active_days.includes(weekday)) {
      return { active: false, reason: 'wrong_day' };
    }
  }

  const s = rule.active_hour_start;
  const e = rule.active_hour_end;
  if (s == null || e == null) return { active: true };

  if (s <= e) {
    // Same-day window — inclusive both ends (e=22 means 22:xx is allowed)
    if (hour >= s && hour <= e) return { active: true };
  } else {
    // Overnight window — hour is in [s..23] OR [0..e]
    if (hour >= s || hour <= e) return { active: true };
  }
  return { active: false, reason: 'outside_hours' };
}

/**
 * Human-readable window for the UI (e.g. "9 AM - 10 PM IST · Mon-Fri").
 * Returns null if always-on.
 */
export function describeSchedule(rule: RuleSchedule): string | null {
  const hasHours = rule.active_hour_start != null && rule.active_hour_end != null;
  const hasDays = !!rule.active_days && rule.active_days.length > 0 && rule.active_days.length < 7;
  if (!hasHours && !hasDays) return null;

  const parts: string[] = [];
  if (hasHours) {
    parts.push(`${fmtHour(rule.active_hour_start!)}-${fmtHour(rule.active_hour_end!)} IST`);
  }
  if (hasDays) parts.push(daysToLabel(rule.active_days!));
  return parts.join(' · ');
}

function fmtHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function daysToLabel(days: number[]): string {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  const weekdays = [1, 2, 3, 4, 5];
  const weekends = [0, 6];
  if (sorted.length === 5 && sorted.every((d, i) => d === weekdays[i])) return 'Mon-Fri';
  if (sorted.length === 2 && sorted.every((d, i) => d === weekends[i])) return 'Weekends';
  return sorted.map((d) => WEEKDAY_LABELS[d]).join(',');
}

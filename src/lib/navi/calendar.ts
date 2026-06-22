// Pure date helpers for the Navi calendar. Kept framework-free so the month-grid
// math can be unit-tested without rendering.

export type CalendarCell = { day: number; date: Date } | null;

/** Sunday-first weekday initials, matching the Figma calendar header. */
export const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Build a month as rows of 7 cells, Sunday-first. Leading days before the 1st
 * and trailing days after the last are `null` so the grid stays rectangular.
 */
export function buildMonthGrid(year: number, month: number): CalendarCell[][] {
  const startWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: new Date(year, month, d) });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function formatMonthYear(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Monday, September 8" — matches the existing booking-slot date copy. */
export function formatLongDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Is `d` strictly before `min` by calendar day, ignoring time-of-day? */
export function isBeforeDay(d: Date, min: Date): boolean {
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const mm = new Date(min.getFullYear(), min.getMonth(), min.getDate()).getTime();
  return dd < mm;
}

/** First day of the month containing `d` (drops day-of-month and time). */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** First day of the month `n` months from `d` (n may be negative). */
export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/** A recurring weekly session: weekday (0 = Sunday) plus its display time. */
export type SessionSlot = { weekday: number; time: string };

/**
 * The next `count` session dates strictly after `from`, drawn from the given
 * weekly `slots` and returned in chronological order. Each slot recurs weekly:
 * a single slot yields consecutive weeks, multiple slots interleave by date.
 * Keeping booking presets computed from "today" is what keeps the demo from
 * ever showing dates in the past.
 */
export function getUpcomingSessions(
  slots: SessionSlot[],
  count: number,
  from: Date,
): { date: string; time: string }[] {
  if (slots.length === 0 || count <= 0) return [];

  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  // First occurrence of each slot strictly after the from-day.
  const next = slots.map((slot) => {
    const d = new Date(start);
    do {
      d.setDate(d.getDate() + 1);
    } while (d.getDay() !== slot.weekday);
    return { date: d, time: slot.time };
  });

  const out: { date: string; time: string }[] = [];
  while (out.length < count) {
    let earliest = 0;
    for (let i = 1; i < next.length; i++) {
      if (next[i].date.getTime() < next[earliest].date.getTime()) earliest = i;
    }
    const slot = next[earliest];
    out.push({ date: formatLongDate(slot.date), time: slot.time });
    slot.date = new Date(slot.date);
    slot.date.setDate(slot.date.getDate() + 7); // recur a week later
  }
  return out;
}

/** The month `monthsAgo` before `from`, formatted like "June 2026". */
export function formatRelativeMonth(monthsAgo: number, from: Date): string {
  return formatMonthYear(addMonths(from, -monthsAgo));
}

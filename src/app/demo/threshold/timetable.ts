/*
  The week at Threshold. Static data, but every number the site shows (the
  hero strip, the rail countdown, the timetable wall, the drawer) reads from
  here through the helpers below, so they can never disagree with each other.
  Days are 0..6 from Monday; times are "HH:MM" 24h.
*/

export type ProgrammeId = "strength" | "conditioning" | "mobility" | "open";
export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Session {
  id: string;
  day: Day;
  time: string;
  programme: ProgrammeId;
  coach: string;
  capacity: number;
  taken: number;
}

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const DAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const s = (day: Day, time: string, programme: ProgrammeId, coach: string, capacity: number, taken: number): Session => ({
  id: `${DAYS[day].toLowerCase()}-${time.replace(":", "")}-${programme}`,
  day, time, programme, coach, capacity, taken,
});

export const WEEK: Session[] = [
  s(0, "06:30", "strength", "ines", 12, 9),
  s(0, "07:30", "conditioning", "kofi", 16, 11),
  s(0, "12:15", "mobility", "sana", 10, 4),
  s(0, "17:30", "strength", "ines", 12, 12),
  s(0, "18:30", "conditioning", "kofi", 16, 13),
  s(1, "06:30", "conditioning", "kofi", 16, 8),
  s(1, "07:30", "strength", "marek", 12, 10),
  s(1, "12:15", "open", "marek", 20, 6),
  s(1, "17:30", "mobility", "sana", 10, 7),
  s(1, "18:30", "strength", "ines", 12, 11),
  s(2, "06:30", "strength", "marek", 12, 7),
  s(2, "07:30", "mobility", "sana", 10, 10),
  s(2, "12:15", "conditioning", "kofi", 16, 9),
  s(2, "17:30", "strength", "ines", 12, 8),
  s(2, "18:30", "open", "marek", 20, 12),
  s(3, "06:30", "conditioning", "kofi", 16, 14),
  s(3, "07:30", "strength", "ines", 12, 6),
  s(3, "12:15", "mobility", "sana", 10, 3),
  s(3, "17:30", "conditioning", "kofi", 16, 16),
  s(3, "18:30", "strength", "marek", 12, 9),
  s(4, "06:30", "strength", "ines", 12, 10),
  s(4, "07:30", "conditioning", "kofi", 16, 12),
  s(4, "12:15", "open", "marek", 20, 5),
  s(4, "17:30", "mobility", "sana", 10, 6),
  s(5, "08:00", "strength", "marek", 12, 9),
  s(5, "09:15", "conditioning", "kofi", 16, 15),
  s(5, "10:30", "open", "ines", 20, 8),
  s(6, "09:00", "mobility", "sana", 10, 5),
  s(6, "10:15", "open", "marek", 20, 4),
];

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function sessionsOn(day: Day, week: Session[] = WEEK): Session[] {
  return week.filter((x) => x.day === day).sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
}

export function placesLeft(session: Session, booked: string[]): number {
  const mine = booked.includes(session.id) ? 1 : 0;
  return Math.max(0, session.capacity - session.taken - mine);
}

/**
 * True once `session`'s start time is behind `now`, on `now`'s own day. The
 * week is a rolling template, so a session on any OTHER day is always a
 * future occurrence -- Monday seen from Friday is next Monday, never past.
 * `now` is `null` before the clock resolves, which correctly reports false
 * everywhere (nothing has "started" until there's a clock to check against).
 */
export function hasStarted(now: { day: Day; minutes: number } | null, session: Pick<Session, "day" | "time">): boolean {
  return now != null && session.day === now.day && toMinutes(session.time) <= now.minutes;
}

const WEEK_MINUTES = 7 * 24 * 60;

/** Minutes from `now` until the session starts, wrapping the week. */
export function minutesUntil(now: { day: Day; minutes: number }, session: Session): number {
  const from = now.day * 1440 + now.minutes;
  const to = session.day * 1440 + toMinutes(session.time);
  return (to - from + WEEK_MINUTES) % WEEK_MINUTES;
}

/** The soonest session strictly after `now`; wraps to Monday. */
export function nextClass(now: { day: Day; minutes: number }, week: Session[] = WEEK): Session {
  let best = week[0];
  let bestGap = Infinity;
  for (const x of week) {
    const gap = minutesUntil(now, x);
    const g = gap === 0 ? WEEK_MINUTES : gap; // a class starting this minute counts as passed
    if (g < bestGap) { best = x; bestGap = g; }
  }
  return best;
}

/** "HH:MM", days folded into hours so the rail shows one figure. */
export function formatCountdown(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

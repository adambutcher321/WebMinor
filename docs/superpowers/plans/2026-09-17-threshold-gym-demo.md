# Threshold Gym Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Threshold, a cold-lit boutique strength studio site at `/demo/threshold`, with a working class-booking drawer and a membership join flow, and list it as the ninth concept build on the work page.

**Architecture:** One Next.js App Router route folder holding five pages, a shared layout (fonts, rail, nav, footer, booking state), a `content.ts` copy file, a `timetable.ts` data-and-logic file with pure functions under test, and a `BookingProvider` that persists bookings and membership to localStorage after hydration. All motion is CSS variables driven by small client components; no new dependencies.

**Tech Stack:** Next.js 16.2.9 App Router, React 19.2, CSS Modules, Tailwind utilities for layout only, Vitest + Testing Library (jsdom), `next/font/google` (Archivo with `wdth` axis, Instrument Sans), Higgsfield CLI for every image, `cwebp` for WebP with alpha.

**Spec:** `docs/superpowers/specs/2026-09-17-threshold-gym-demo-design.md`

## Global Constraints

- Work in the `scroll-world` worktree at `/Users/adambutcher/Desktop/webminor/.worktrees/scroll-world`. Never `cd` to the main checkout. Never use bare `git stash`.
- Read `node_modules/next/dist/docs/` before using any Next API you are unsure of; this Next differs from training data.
- No new npm dependencies. Do not use framer-motion, gsap or lenis in this demo.
- Palette is cold only: magenta `#ff2d8a`, cyan `#2ee6ff`, navy `#07090f`, frost `#f4f6fa`. **No amber, gold or orange anywhere.**
- Fonts: display Archivo (`wdth` axis, width 125, weight 800), body Instrument Sans. Both via `next/font/google` in the demo layout only.
- Copy: no bullet-list selling, no bolted-on hooks, no filler reassurance, no lorem, no invented awards.
- Lint rule `react-hooks/set-state-in-effect` must stay clean in the new folder: read browser state through `useMediaQuery`/`useIsClient` from `src/app/demo/useClientEnv.ts`, or defer with `queueMicrotask` as Boucher's `CartProvider` does.
- No hydration nondeterminism: dates and random values are minted on interaction or inside effects, never during render. Fixed "today" for the timetable is a prop, never `new Date()` in a server component.
- `prefers-reduced-motion: reduce` settles every animation to its final state.
- Every asset gets its final filename on first save; a replaced asset gets a new filename (next/image caches by name).
- `image_background_remover` must run from a foreground Bash call with `</dev/null`, never `run_in_background`. Upload PNG/JPG only (`.webp` fails the signed PUT). Use `higgsfield upload create <file>` first and pass the returned id; local-path auto-upload fails with an S3 signature error.
- Higgsfield `--json` job records carry the output under `result_url`; `params.input_images[].url` is the input.
- Commit after every task with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` as the last line.
- Do not push.

## File map

```
src/app/demo/threshold/
  content.ts                copy, programmes, coaches, pricing table, space captions
  timetable.ts              WEEK data, nextClass(), placesLeft(), minutesUntil(), formatCountdown()
  timetable.test.ts
  pricing.test.ts           (tests priceFor and the content/timetable ties)
  BookingProvider.tsx       bookings + membership, localStorage, drawer open state
  BookingProvider.test.tsx
  layout.tsx                fonts, noindex metadata, provider, Rail, Nav, Footer
  threshold.module.css      tokens and all section styles
  motion.tsx                Reveal, Counter, Magnetic
  Rail.tsx                  fixed left rail: index, countdown, socials; bottom bar on phones
  Nav.tsx
  Footer.tsx
  Logo.tsx                  wordmark component + favicon path
  icon.svg                  favicon: T cut by a bar, magenta on navy
  Hero.tsx
  Manifesto.tsx
  ProgrammesRail.tsx
  Week.tsx                  day tabs + rows
  BookDrawer.tsx
  Coaches.tsx
  Membership.tsx            slider
  JoinFlow.tsx              three steps
  Space.tsx
  page.tsx                  home
  timetable/page.tsx
  membership/page.tsx
  coaches/page.tsx
  about/page.tsx
public/demo/threshold/      all renders (webp)
public/work/covers/threshold.webp
scripts/threshold/          generation scripts (bash), kept in repo for reproducibility
src/app/case-studies/page.tsx   add the entry
```

---

### Task 1: Timetable data and pure helpers

**Files:**
- Create: `src/app/demo/threshold/timetable.ts`
- Test: `src/app/demo/threshold/timetable.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ProgrammeId = "strength" | "conditioning" | "mobility" | "open";
  export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday
  export interface Session { id: string; day: Day; time: string /* "06:30" */; programme: ProgrammeId; coach: string /* coach slug */; capacity: number; taken: number; }
  export const DAYS: readonly string[]; // ["Mon","Tue",...,"Sun"]
  export const WEEK: Session[];
  export function sessionsOn(day: Day, week?: Session[]): Session[];      // sorted by time
  export function placesLeft(s: Session, booked: string[]): number;       // capacity - taken - (booked includes id ? 1 : 0)
  export function nextClass(now: { day: Day; minutes: number }, week?: Session[]): Session; // wraps to Monday
  export function minutesUntil(now: { day: Day; minutes: number }, s: Session): number; // 0..10079
  export function formatCountdown(minutes: number): string;              // "HH:MM", days folded into hours
  export function toMinutes(time: string): number;                        // "06:30" -> 390
  ```

- [ ] **Step 1: Write the failing tests**

```ts
// src/app/demo/threshold/timetable.test.ts
import { describe, it, expect } from "vitest";
import {
  WEEK, sessionsOn, placesLeft, nextClass, minutesUntil, formatCountdown, toMinutes,
  type Session,
} from "./timetable";

const mini: Session[] = [
  { id: "mon-0630-strength", day: 0, time: "06:30", programme: "strength", coach: "ines", capacity: 12, taken: 9 },
  { id: "mon-1800-cond", day: 0, time: "18:00", programme: "conditioning", coach: "kofi", capacity: 16, taken: 16 },
  { id: "wed-0700-mob", day: 2, time: "07:00", programme: "mobility", coach: "sana", capacity: 10, taken: 2 },
];

describe("toMinutes", () => {
  it("parses HH:MM", () => {
    expect(toMinutes("06:30")).toBe(390);
    expect(toMinutes("18:00")).toBe(1080);
  });
});

describe("sessionsOn", () => {
  it("returns the day's sessions sorted by time", () => {
    const out = sessionsOn(0, [mini[1], mini[0]]);
    expect(out.map((s) => s.id)).toEqual(["mon-0630-strength", "mon-1800-cond"]);
  });
  it("is empty for a day with nothing on", () => {
    expect(sessionsOn(6, mini)).toEqual([]);
  });
});

describe("placesLeft", () => {
  it("subtracts taken and the visitor's own booking", () => {
    expect(placesLeft(mini[0], [])).toBe(3);
    expect(placesLeft(mini[0], ["mon-0630-strength"])).toBe(2);
  });
  it("never goes below zero", () => {
    expect(placesLeft(mini[1], ["mon-1800-cond"])).toBe(0);
  });
});

describe("nextClass", () => {
  it("finds the next session later the same day", () => {
    expect(nextClass({ day: 0, minutes: 400 }, mini).id).toBe("mon-1800-cond");
  });
  it("rolls to a later day", () => {
    expect(nextClass({ day: 0, minutes: 1100 }, mini).id).toBe("wed-0700-mob");
  });
  it("wraps across the weekend to Monday", () => {
    expect(nextClass({ day: 5, minutes: 600 }, mini).id).toBe("mon-0630-strength");
  });
});

describe("minutesUntil", () => {
  it("counts within the day", () => {
    expect(minutesUntil({ day: 0, minutes: 380 }, mini[0])).toBe(10);
  });
  it("wraps the week", () => {
    // Sunday 23:00 -> Monday 06:30 = 60 + 390
    expect(minutesUntil({ day: 6, minutes: 1380 }, mini[0])).toBe(450);
  });
});

describe("formatCountdown", () => {
  it("folds days into hours", () => {
    expect(formatCountdown(10)).toBe("00:10");
    expect(formatCountdown(450)).toBe("07:30");
    expect(formatCountdown(1500)).toBe("25:00");
  });
});

describe("WEEK", () => {
  it("has unique ids and something on every weekday", () => {
    const ids = new Set(WEEK.map((s) => s.id));
    expect(ids.size).toBe(WEEK.length);
    for (const d of [0, 1, 2, 3, 4] as const) expect(sessionsOn(d).length).toBeGreaterThan(2);
  });
  it("has at least one full session so the waitlist path is visible", () => {
    expect(WEEK.some((s) => s.taken >= s.capacity)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/app/demo/threshold/timetable.test.ts`
Expected: FAIL, cannot resolve `./timetable`.

- [ ] **Step 3: Write the implementation**

```ts
// src/app/demo/threshold/timetable.ts
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/app/demo/threshold/timetable.test.ts`
Expected: PASS, 13 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/demo/threshold/timetable.ts src/app/demo/threshold/timetable.test.ts
git commit -m "feat(threshold): timetable data and pure helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Content and pricing

**Files:**
- Create: `src/app/demo/threshold/content.ts`
- Test: `src/app/demo/threshold/pricing.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface Programme { id: ProgrammeId; name: string; line: string; days: string; image: string; alt: string; }
  export const PROGRAMMES: Programme[];
  export interface Coach { slug: string; name: string; discipline: string; line: string; bio: string; portrait: string; action: string; }
  export const COACHES: Coach[];
  export function coachBySlug(slug: string): Coach;
  export const LEVELS: readonly { sessions: number | "unlimited"; label: string; monthly: number }[]; // 2,3,4,5,unlimited
  export type Billing = "monthly" | "annual";
  export function priceFor(levelIndex: number, billing: Billing): { perMonth: number; perYear: number; saving: number };
  export const FIGURES: { years: number; coaches: number; sessionsAWeek: number };
  export const COPY: { heroLine: string; manifesto: string[]; spaceLine: string; address: string[]; hours: string[]; };
  export const SPACE: { src: string; alt: string }[];
  ```
- Annual is ten months for the price of twelve: `perYear = monthly * 10`, `saving = monthly * 2`.

- [ ] **Step 1: Write the failing test**

```ts
// src/app/demo/threshold/pricing.test.ts
import { describe, it, expect } from "vitest";
import { LEVELS, priceFor, PROGRAMMES, COACHES, coachBySlug, FIGURES } from "./content";
import { WEEK } from "./timetable";

describe("priceFor", () => {
  it("returns the monthly figure for monthly billing", () => {
    const p = priceFor(0, "monthly");
    expect(p.perMonth).toBe(LEVELS[0].monthly);
    expect(p.perYear).toBe(LEVELS[0].monthly * 12);
    expect(p.saving).toBe(0);
  });
  it("gives two months free on annual", () => {
    const p = priceFor(2, "annual");
    expect(p.perYear).toBe(LEVELS[2].monthly * 10);
    expect(p.saving).toBe(LEVELS[2].monthly * 2);
    expect(p.perMonth).toBe(Math.round((LEVELS[2].monthly * 10) / 12));
  });
  it("covers every level and both periods without NaN", () => {
    for (let i = 0; i < LEVELS.length; i++)
      for (const b of ["monthly", "annual"] as const) {
        const p = priceFor(i, b);
        expect(Number.isFinite(p.perMonth)).toBe(true);
        expect(p.perYear).toBeGreaterThan(0);
      }
  });
  it("prices rise with sessions", () => {
    for (let i = 1; i < LEVELS.length; i++) expect(LEVELS[i].monthly).toBeGreaterThan(LEVELS[i - 1].monthly);
  });
});

describe("content ties to the timetable", () => {
  it("every timetable coach exists", () => {
    for (const s of WEEK) expect(() => coachBySlug(s.coach)).not.toThrow();
  });
  it("every timetable programme exists", () => {
    const ids = new Set(PROGRAMMES.map((p) => p.id));
    for (const s of WEEK) expect(ids.has(s.programme)).toBe(true);
  });
  it("figures match the data", () => {
    expect(FIGURES.coaches).toBe(COACHES.length);
    expect(FIGURES.sessionsAWeek).toBe(WEEK.length);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/pricing.test.ts`
Expected: FAIL, cannot resolve `./content`.

- [ ] **Step 3: Write content.ts**

```ts
// src/app/demo/threshold/content.ts
import { WEEK, type ProgrammeId } from "./timetable";

/*
  Every word on the site, and the numbers behind the membership slider. Image
  paths point at public/demo/threshold; the files are made in the imagery
  tasks and the names here are final.
*/

const IMG = "/demo/threshold";

export interface Programme {
  id: ProgrammeId;
  name: string;
  line: string;
  days: string;
  image: string;
  alt: string;
}

export const PROGRAMMES: Programme[] = [
  {
    id: "strength",
    name: "Strength",
    line: "Barbell work in small groups. Squat, press, pull, hinge, coached rep by rep.",
    days: "Mon to Sat",
    image: `${IMG}/prog-strength.webp`,
    alt: "An athlete under a loaded barbell in magenta and cyan light",
  },
  {
    id: "conditioning",
    name: "Conditioning",
    line: "Forty minutes on rowers, sleds and bikes. Hard, measured, over before you settle.",
    days: "Mon to Sat",
    image: `${IMG}/prog-conditioning.webp`,
    alt: "An athlete driving a sled across a dark floor in cold light",
  },
  {
    id: "mobility",
    name: "Mobility",
    line: "Slow work on the floor for hips, shoulders and spine. The session people skip and then miss.",
    days: "Mon to Sun",
    image: `${IMG}/prog-mobility.webp`,
    alt: "An athlete in a deep lunge on a dark floor, lit magenta and cyan",
  },
  {
    id: "open",
    name: "Open Floor",
    line: "The rig, the platforms and a coach in the room. Your programme, our eyes.",
    days: "Tue to Sun",
    image: `${IMG}/prog-open.webp`,
    alt: "An athlete chalking up at the rig in a dark industrial unit",
  },
];

export function programmeById(id: ProgrammeId): Programme {
  const p = PROGRAMMES.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown programme ${id}`);
  return p;
}

export interface Coach {
  slug: string;
  name: string;
  discipline: string;
  line: string;
  bio: string;
  portrait: string;
  action: string;
}

export const COACHES: Coach[] = [
  {
    slug: "ines",
    name: "Inês Carvalho",
    discipline: "Strength",
    line: "Former national-level weightlifter. Runs the barbell floor.",
    bio: "Inês lifted for Portugal for nine years before she coached anyone. She teaches the squat the way she was taught it: slowly, from the feet up, with the bar going nowhere until the position is right. Her Monday 06:30 has had a waiting list since the unit opened.",
    portrait: `${IMG}/coach-ines.webp`,
    action: `${IMG}/coach-ines-action.webp`,
  },
  {
    slug: "kofi",
    name: "Kofi Mensah",
    discipline: "Conditioning",
    line: "Rowed at Henley. Writes every conditioning piece on the board.",
    bio: "Kofi spent a decade in a boat and brought the ergometer with him. His sessions are timed to the second, scored on the board and over in forty minutes. He is the reason the rowers here are the most used machines in the building.",
    portrait: `${IMG}/coach-kofi.webp`,
    action: `${IMG}/coach-kofi-action.webp`,
  },
  {
    slug: "sana",
    name: "Sana Iqbal",
    discipline: "Mobility",
    line: "Physiotherapist. Keeps the other three programmes honest.",
    bio: "Sana came to Threshold as the physio the coaches sent people to, and stayed to stop them needing to. Her mobility floor is where the strength members fix what the barbell finds. She still sees members one to one on Thursdays.",
    portrait: `${IMG}/coach-sana.webp`,
    action: `${IMG}/coach-sana-action.webp`,
  },
  {
    slug: "marek",
    name: "Marek Nowak",
    discipline: "Open Floor",
    line: "Founder. Built the rig himself. Coaches the open sessions.",
    bio: "Marek took the lease on the unit in 2016 with a rack, a platform and a plan for four. He welded the rig, wrote the first programme and still coaches the open floor, where members train their own plan with a coach in the room. Ask him about the threshold bar at the door.",
    portrait: `${IMG}/coach-marek.webp`,
    action: `${IMG}/coach-marek-action.webp`,
  },
];

export function coachBySlug(slug: string): Coach {
  const c = COACHES.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown coach ${slug}`);
  return c;
}

export const LEVELS = [
  { sessions: 2, label: "Two a week", monthly: 89 },
  { sessions: 3, label: "Three a week", monthly: 119 },
  { sessions: 4, label: "Four a week", monthly: 145 },
  { sessions: 5, label: "Five a week", monthly: 165 },
  { sessions: "unlimited", label: "Unlimited", monthly: 189 },
] as const;

export type Billing = "monthly" | "annual";

/** Annual is ten months for the price of twelve. */
export function priceFor(levelIndex: number, billing: Billing): { perMonth: number; perYear: number; saving: number } {
  const monthly = LEVELS[levelIndex].monthly;
  if (billing === "monthly") return { perMonth: monthly, perYear: monthly * 12, saving: 0 };
  const perYear = monthly * 10;
  return { perMonth: Math.round(perYear / 12), perYear, saving: monthly * 2 };
}

export const FIGURES = {
  years: 10,
  coaches: COACHES.length,
  sessionsAWeek: WEEK.length,
};

export const COPY = {
  heroLine: "A strength and conditioning studio in a unit off Sutton Road. Coached sessions, small groups, no floor of machines.",
  manifesto: [
    "Threshold is the line you cross when the work gets hard and you keep going.",
    "We built a studio around that moment: a coach in every session, twelve to a barbell class, and a timetable you can actually get into.",
    "Ten years on, most people who start here are still here.",
  ],
  spaceLine: "A 1960s print works with the roof lights kept and the floor levelled. Four platforms, a twelve-station rig, eight rowers, and a bar across the door you step over on the way in.",
  address: ["Unit 4, Sutton Road", "Plymouth PL4 0HX"],
  hours: ["Mon to Fri 06:00 to 21:00", "Sat 07:30 to 13:00", "Sun 08:30 to 12:00"],
};

export const SPACE = [
  { src: `${IMG}/space-floor.webp`, alt: "The training floor under the roof lights, platforms in a row" },
  { src: `${IMG}/space-rig.webp`, alt: "The welded rig lit magenta from one side and cyan from the other" },
  { src: `${IMG}/space-door.webp`, alt: "The entrance, a steel bar set across the threshold" },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/app/demo/threshold/`
Expected: PASS, both files.

- [ ] **Step 5: Commit**

```bash
git add src/app/demo/threshold/content.ts src/app/demo/threshold/pricing.test.ts
git commit -m "feat(threshold): copy, coaches, programmes and pricing

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: BookingProvider

**Files:**
- Create: `src/app/demo/threshold/BookingProvider.tsx`
- Test: `src/app/demo/threshold/BookingProvider.test.tsx`

**Interfaces:**
- Consumes: `Session`, `placesLeft` from `./timetable`; `Billing` from `./content`.
- Produces:
  ```ts
  export interface Booking { sessionId: string; name: string; email: string; waitlist: boolean; }
  export interface Membership { levelIndex: number; billing: Billing; name: string; email: string; start: string /* YYYY-MM-DD */; }
  export interface BookingValue {
    bookings: Booking[];
    bookedIds: string[];
    book: (b: Booking) => void;           // replaces an existing booking for the same session
    cancel: (sessionId: string) => void;
    membership: Membership | null;
    join: (m: Membership) => void;
    leave: () => void;
    drawer: Session | null;               // session open in the BookDrawer
    openDrawer: (s: Session) => void;
    closeDrawer: () => void;
    joinOpen: boolean;
    setJoinOpen: (v: boolean) => void;
  }
  export function BookingProvider({ children }): JSX.Element;
  export function useBooking(): BookingValue;  // throws outside the provider
  ```
- Storage keys: `threshold.bookings`, `threshold.membership`. Read after hydration via `queueMicrotask`, exactly as Boucher's `CartProvider`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/demo/threshold/BookingProvider.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { BookingProvider, useBooking } from "./BookingProvider";
import { WEEK } from "./timetable";

const wrapper = ({ children }: { children: React.ReactNode }) => <BookingProvider>{children}</BookingProvider>;

describe("BookingProvider", () => {
  beforeEach(() => localStorage.clear());

  it("throws outside the provider", () => {
    expect(() => renderHook(() => useBooking())).toThrow();
  });

  it("books, exposes the id, and replaces a duplicate", async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    act(() => result.current.book({ sessionId: "a", name: "Ada", email: "a@x.com", waitlist: false }));
    act(() => result.current.book({ sessionId: "a", name: "Ada L", email: "a@x.com", waitlist: false }));
    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0].name).toBe("Ada L");
    expect(result.current.bookedIds).toEqual(["a"]);
    act(() => result.current.cancel("a"));
    expect(result.current.bookings).toHaveLength(0);
  });

  it("persists to localStorage and reads it back", async () => {
    const first = renderHook(() => useBooking(), { wrapper });
    await waitFor(() => expect(localStorage.getItem("threshold.bookings")).not.toBeNull());
    act(() => first.result.current.book({ sessionId: "b", name: "B", email: "b@x.com", waitlist: true }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem("threshold.bookings")!)).toHaveLength(1));
    first.unmount();

    const second = renderHook(() => useBooking(), { wrapper });
    await waitFor(() => expect(second.result.current.bookedIds).toEqual(["b"]));
  });

  it("joins and leaves", async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    act(() => result.current.join({ levelIndex: 2, billing: "annual", name: "C", email: "c@x.com", start: "2026-10-01" }));
    expect(result.current.membership?.levelIndex).toBe(2);
    await waitFor(() => expect(localStorage.getItem("threshold.membership")).toContain("annual"));
    act(() => result.current.leave());
    expect(result.current.membership).toBeNull();
  });

  it("opens and closes the drawer", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    act(() => result.current.openDrawer(WEEK[0]));
    expect(result.current.drawer?.id).toBe(WEEK[0].id);
    act(() => result.current.closeDrawer());
    expect(result.current.drawer).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/BookingProvider.test.tsx`
Expected: FAIL, cannot resolve `./BookingProvider`.

- [ ] **Step 3: Write the provider**

```tsx
// src/app/demo/threshold/BookingProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "./timetable";
import type { Billing } from "./content";

/*
  Bookings and membership for the whole demo. Lives in the route layout so it
  survives navigation, written to localStorage so it survives a reload.
  Storage is read after hydration (deferred to a microtask) so the server HTML
  and the first client render agree.
*/

export interface Booking {
  sessionId: string;
  name: string;
  email: string;
  waitlist: boolean;
}

export interface Membership {
  levelIndex: number;
  billing: Billing;
  name: string;
  email: string;
  start: string;
}

export interface BookingValue {
  bookings: Booking[];
  bookedIds: string[];
  book: (b: Booking) => void;
  cancel: (sessionId: string) => void;
  membership: Membership | null;
  join: (m: Membership) => void;
  leave: () => void;
  drawer: Session | null;
  openDrawer: (s: Session) => void;
  closeDrawer: () => void;
  joinOpen: boolean;
  setJoinOpen: (v: boolean) => void;
}

const Ctx = createContext<BookingValue | null>(null);
const BOOKINGS = "threshold.bookings";
const MEMBERSHIP = "threshold.membership";

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [drawer, setDrawer] = useState<Session | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const b = localStorage.getItem(BOOKINGS);
      const m = localStorage.getItem(MEMBERSHIP);
      queueMicrotask(() => {
        if (b) setBookings(JSON.parse(b));
        if (m) setMembership(JSON.parse(m));
        setHydrated(true);
      });
    } catch {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(BOOKINGS, JSON.stringify(bookings));
      if (membership) localStorage.setItem(MEMBERSHIP, JSON.stringify(membership));
      else localStorage.removeItem(MEMBERSHIP);
    } catch {
      /* private mode; state still works for the session */
    }
  }, [bookings, membership, hydrated]);

  const book = useCallback((b: Booking) => {
    setBookings((prev) => [...prev.filter((x) => x.sessionId !== b.sessionId), b]);
  }, []);
  const cancel = useCallback((sessionId: string) => {
    setBookings((prev) => prev.filter((x) => x.sessionId !== sessionId));
  }, []);
  const join = useCallback((m: Membership) => setMembership(m), []);
  const leave = useCallback(() => setMembership(null), []);
  const openDrawer = useCallback((s: Session) => setDrawer(s), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);

  const value = useMemo<BookingValue>(
    () => ({
      bookings,
      bookedIds: bookings.map((b) => b.sessionId),
      book, cancel, membership, join, leave,
      drawer, openDrawer, closeDrawer, joinOpen, setJoinOpen,
    }),
    [bookings, book, cancel, membership, join, leave, drawer, openDrawer, closeDrawer, joinOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBooking must be used inside BookingProvider");
  return v;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/app/demo/threshold/BookingProvider.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Lint the folder and commit**

Run: `npx eslint src/app/demo/threshold`
Expected: no errors.

```bash
git add src/app/demo/threshold/BookingProvider.tsx src/app/demo/threshold/BookingProvider.test.tsx
git commit -m "feat(threshold): booking and membership state with localStorage

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Imagery with Higgsfield

**Files:**
- Create: `scripts/threshold/gen.sh` (helper), `scripts/threshold/prompts.md` (every prompt used, for the record)
- Create: `public/demo/threshold/hero.webp`, `hero-cutout.webp`, `prog-strength.webp`, `prog-conditioning.webp`, `prog-mobility.webp`, `prog-open.webp`, `coach-{ines,kofi,sana,marek}.webp`, `coach-{ines,kofi,sana,marek}-action.webp`, `space-{floor,rig,door}.webp`
- Create: `public/work/covers/threshold.webp`

**Interfaces:**
- Produces: the exact filenames referenced by `content.ts` (Task 2). Do not rename; if a render is replaced later, pick a new name and update `content.ts`.

This task has no unit test. Its check is visual: each render is opened with the Read tool and judged against the two references (cold dual light, magenta left, cyan right, haze, dark industrial floor, no text). Reroll anything warm, anything with signage or captions, anything with a second person in a solo shot.

- [ ] **Step 1: Write the helper script**

```bash
# scripts/threshold/gen.sh
#!/usr/bin/env bash
# Usage: gen.sh <out.png> <aspect> <prompt> [reference upload id]
# Runs one flux_2 job at 2k, waits, downloads the result to <out.png>.
set -euo pipefail
out="$1"; aspect="$2"; prompt="$3"; ref="${4:-}"
args=(generate create flux_2 --prompt "$prompt" --aspect_ratio "$aspect" --resolution 2k --variant pro --wait --wait-timeout 10m --json)
if [ -n "$ref" ]; then args+=(--image-references "$ref"); fi
json="$(higgsfield "${args[@]}" </dev/null)"
url="$(printf '%s' "$json" | python3 -c 'import sys,json; d=json.load(sys.stdin); d=d[0] if isinstance(d,list) else d; print(d.get("result_url") or d["results"][0]["url"])')"
curl -sSL "$url" -o "$out"
[ -s "$out" ] || { echo "empty result for $out" >&2; exit 1; }
echo "$out"
```

Run: `chmod +x scripts/threshold/gen.sh`

The style suffix used on every prompt, appended verbatim:

```
STYLE="Editorial sports photography, dark industrial gym floor, two coloured lights only: hard magenta light from camera left and electric cyan-blue light from camera right, low floor haze, deep shadows, no warm light, no orange, no amber, no text, no signage, no watermark, no captions, photoreal, 85mm, shallow depth of field."
```

- [ ] **Step 2: Generate the hero athlete, four candidates**

```bash
mkdir -p /private/tmp/claude-501/-Users-adambutcher-Desktop-webminor/d3c48507-cbb9-4cf0-b217-06c13f62b12f/scratchpad/threshold && cd "$_"
P="A single athlete in a sprinter's set position on a dark concrete gym floor, full body visible from the side and slightly in front, wearing a plain dark fitted training top and dark shorts, chalked hands on the floor, looking down the lane, muscles tensed, hair short. Framed with clear empty space above and to the left of the athlete for display type. $STYLE"
for i in 1 2 3 4; do /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/scripts/threshold/gen.sh hero-$i.png 16:9 "$P" & done; wait
```

Open each with the Read tool. Choose the one where the body is fully inside the frame, the two lights read clearly, and there is room for the word behind. Note the chosen number.

- [ ] **Step 3: Cut the athlete out**

Foreground call only, never `run_in_background`:

```bash
ID=$(higgsfield upload create hero-<n>.png --json </dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')
higgsfield generate create image_background_remover --image-references "$ID" --wait --wait-timeout 10m --json </dev/null > cutout.json
python3 -c 'import json; d=json.load(open("cutout.json")); d=d[0] if isinstance(d,list) else d; print(d.get("result_url") or d["results"][0]["url"])' | xargs -I{} curl -sSL {} -o hero-cutout.png
```

Check the cut-out with the Read tool: no halo, feet intact, no fragments of floor.

- [ ] **Step 4: Save the hero pair as WebP**

```bash
OUT=/Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/public/demo/threshold; mkdir -p "$OUT"
cwebp -q 86 -resize 2400 0 hero-<n>.png -o "$OUT/hero.webp"
cwebp -q 90 -exact -alpha_q 100 -resize 2400 0 hero-cutout.png -o "$OUT/hero-cutout.webp"
ls -la "$OUT"
```

- [ ] **Step 5: Programme shots, same athlete via reference**

```bash
declare -A PROG=(
  [strength]="The same athlete as the reference, same face, same build, same dark training top, now standing under a loaded barbell at the top of a back squat on a wooden platform"
  [conditioning]="The same athlete as the reference, same face, same build, same dark training top, now driving a weighted sled across the floor, low body angle, arms locked"
  [mobility]="The same athlete as the reference, same face, same build, same dark training top, now in a deep low lunge on the floor, one arm reaching up, calm"
  [open]="The same athlete as the reference, same face, same build, same dark training top, now chalking their hands beside a black steel rig, looking at the bar"
)
for k in "${!PROG[@]}"; do
  /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/scripts/threshold/gen.sh prog-$k.png 4:3 "${PROG[$k]}. Same rendering style as the reference image. $STYLE" "$ID" &
done; wait
for k in strength conditioning mobility open; do cwebp -q 84 -resize 1600 0 prog-$k.png -o "$OUT/prog-$k.webp"; done
```

Open all four. The athlete must be recognisably the same person. Reroll any that drift.

- [ ] **Step 6: Coaches, a portrait then an action shot from it**

For each coach, generate the portrait first, upload it, then generate the action shot with the portrait as the reference so the person holds.

```bash
declare -A PORTRAIT=(
  [ines]="Portrait of a woman in her mid thirties, Portuguese, dark hair tied back, strong shoulders, plain black coach's t-shirt, standing in front of a dark steel rig, looking straight at camera, composed"
  [kofi]="Portrait of a tall Black man in his late thirties, close-cropped hair, short beard, plain black coach's t-shirt, standing beside a rowing machine, looking straight at camera, relaxed"
  [sana]="Portrait of a South Asian woman in her early forties, hair in a low bun, plain black coach's t-shirt, standing on a dark mobility floor with foam rollers behind, looking straight at camera, warm expression"
  [marek]="Portrait of a Polish man in his late forties, grey at the temples, weathered hands, plain black coach's t-shirt, standing in the doorway of an industrial unit, looking straight at camera, steady"
)
declare -A ACTION=(
  [ines]="The same woman as the reference, same face, same hair, now coaching a lifter at a barbell, one hand indicating bar path, mid sentence"
  [kofi]="The same man as the reference, same face, same beard, now standing over a row of rowing machines with a stopwatch, calling a time"
  [sana]="The same woman as the reference, same face, same hair, now kneeling beside a member on the floor adjusting their hip position"
  [marek]="The same man as the reference, same face, same grey temples, now spotting a member on the open floor, hands ready under the bar"
)
for k in ines kofi sana marek; do
  /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/scripts/threshold/gen.sh coach-$k.png 3:4 "${PORTRAIT[$k]}. $STYLE" &
done; wait
for k in ines kofi sana marek; do
  RID=$(higgsfield upload create coach-$k.png --json </dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["id"])')
  /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/scripts/threshold/gen.sh coach-$k-action.png 3:4 "${ACTION[$k]}. Same rendering style as the reference image. $STYLE" "$RID" &
done; wait
for k in ines kofi sana marek; do
  cwebp -q 84 -resize 1200 0 coach-$k.png -o "$OUT/coach-$k.webp"
  cwebp -q 84 -resize 1200 0 coach-$k-action.png -o "$OUT/coach-$k-action.webp"
done
```

Open every pair side by side. Each action shot must be the same person as its portrait.

- [ ] **Step 7: The space, three shots, no people**

```bash
declare -A SPACE=(
  [floor]="Wide interior of a 1960s print works converted to a strength gym, roof lights, four wooden lifting platforms in a row, black steel rig at the far end, empty, no people"
  [rig]="A welded black steel twelve-station rig in a dark industrial unit, barbells racked, chalk on the floor, empty, no people"
  [door]="The entrance of an industrial unit from inside, a single steel bar set across the threshold at ankle height, roller door half raised behind it, empty, no people"
)
for k in "${!SPACE[@]}"; do
  /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/scripts/threshold/gen.sh space-$k.png 16:9 "${SPACE[$k]}. $STYLE" &
done; wait
for k in floor rig door; do cwebp -q 84 -resize 2000 0 space-$k.png -o "$OUT/space-$k.webp"; done
```

- [ ] **Step 8: The work cover**

```bash
/Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/scripts/threshold/gen.sh cover.png 16:9 "The same athlete as the reference, same face, same build, same dark training top, sprinting out of the set position towards camera right, motion in the haze behind, wide cinematic framing with empty dark space on the left. Same rendering style as the reference image. $STYLE" "$ID"
cwebp -q 86 -resize 1920 0 cover.png -o /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/public/work/covers/threshold.webp
```

Open it. It must read as a cinematic still and must not be warm.

- [ ] **Step 9: Record prompts and commit**

Write every final prompt, the chosen hero candidate number, and every upload id into `scripts/threshold/prompts.md`.

```bash
cd /Users/adambutcher/Desktop/webminor/.worktrees/scroll-world
du -sh public/demo/threshold public/work/covers/threshold.webp
git add scripts/threshold public/demo/threshold public/work/covers/threshold.webp
git commit -m "feat(threshold): cold-lit renders for hero, programmes, coaches, space and cover

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Expected total under 8 MB for the folder.

---

### Task 5: Layout, fonts, tokens and motion helpers

**Files:**
- Create: `src/app/demo/threshold/layout.tsx`, `threshold.module.css`, `motion.tsx`, `icon.svg`, `Logo.tsx`
- Test: `src/app/demo/threshold/motion.test.tsx`

**Interfaces:**
- Consumes: `BookingProvider` (Task 3), `useMediaQuery` from `src/app/demo/useClientEnv.ts`.
- Produces:
  ```tsx
  // motion.tsx
  export function Reveal(props: { children; className?; delay?: number; threshold?: number; as?: "div" | "li" | "section" }): JSX.Element; // data-shown="true|false", CSS does the rest
  export function Counter(props: { value: number; suffix?: string; className?: string; duration?: number }): JSX.Element;
  export function Magnetic(props: { children: ReactNode; radius?: number; className?: string }): JSX.Element; // wraps one element, sets --mx/--my
  export const REDUCED = "(prefers-reduced-motion: reduce)";
  // Logo.tsx
  export function Wordmark(props: { className?: string }): JSX.Element; // THRES + HOLD heavier
  // threshold.module.css: class names used by later tasks are listed inside the file's header comment
  ```
- Font CSS variables: `--font-archivo`, `--font-instrument`. Tokens below are set on `.site`.

Before writing `layout.tsx`, read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (the `axes` section) and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/metadata/app-icons.md` for `icon.svg`.

- [ ] **Step 1: Write the failing motion tests**

```tsx
// src/app/demo/threshold/motion.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, Counter, Magnetic } from "./motion";

beforeAll(() => {
  // jsdom has neither IntersectionObserver nor matchMedia
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Reveal", () => {
  it("renders hidden until seen", () => {
    render(<Reveal><p>hi</p></Reveal>);
    expect(screen.getByText("hi").parentElement).toHaveAttribute("data-shown", "false");
  });
  it("can render as a list item", () => {
    render(<ul><Reveal as="li"><span>x</span></Reveal></ul>);
    expect(screen.getByText("x").closest("li")).not.toBeNull();
  });
});

describe("Counter", () => {
  it("starts at zero with the suffix", () => {
    render(<Counter value={120} suffix="+" />);
    expect(screen.getByText("0+")).toBeInTheDocument();
  });
});

describe("Magnetic", () => {
  it("wraps its child and exposes offset variables", () => {
    render(<Magnetic><button>Go</button></Magnetic>);
    const wrap = screen.getByText("Go").parentElement!;
    expect(wrap.style.getPropertyValue("--mx")).toBe("0px");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/motion.test.tsx`
Expected: FAIL, cannot resolve `./motion`.

- [ ] **Step 3: Write motion.tsx**

```tsx
// src/app/demo/threshold/motion.tsx
"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useMediaQuery } from "../useClientEnv";
import s from "./threshold.module.css";

/*
  Three browser-only pieces. Reveal fires once on entry. Counter runs up once
  when seen. Magnetic pulls its child towards the pointer inside a radius and
  lets go on leave. All three read prefers-reduced-motion through
  useMediaQuery so no state is set inside an effect; under reduced motion
  Reveal is already shown, Counter already at its value, Magnetic inert.
*/

export const REDUCED = "(prefers-reduced-motion: reduce)";

export function Reveal({
  children, className = "", delay = 0, threshold = 0.16, as = "div",
}: { children: ReactNode; className?: string; delay?: number; threshold?: number; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useMediaQuery(REDUCED);
  const shown = seen || reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || seen || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced, threshold]);

  const Tag = as;
  const style = delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined;
  return (
    // @ts-expect-error ref type varies with Tag
    <Tag ref={ref} className={`${s.reveal} ${className}`} data-shown={shown} style={style}>
      {children}
    </Tag>
  );
}

export function Counter({ value, suffix = "", className = "", duration = 1500 }: { value: number; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useMediaQuery(REDUCED);

  useEffect(() => {
    const el = ref.current;
    if (!el || done || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick); else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration, done, reduced]);

  return <span ref={ref} className={className}>{(reduced ? value : n).toLocaleString("en-GB")}{suffix}</span>;
}

export function Magnetic({ children, radius = 40, className = "" }: { children: ReactNode; radius?: number; className?: string }) {
  const [off, setOff] = useState({ x: 0, y: 0 });
  const reduced = useMediaQuery(REDUCED);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    const pull = d < radius + Math.max(r.width, r.height) / 2 ? 0.35 : 0;
    setOff({ x: dx * pull, y: dy * pull });
  };
  const onLeave = () => setOff({ x: 0, y: 0 });

  return (
    <div
      className={`${s.magnetic} ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ "--mx": `${off.x}px`, "--my": `${off.y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Write the stylesheet tokens and the motion classes**

Create `threshold.module.css`. Only the tokens and the three motion classes go in now; every later task appends its own section to this file under a labelled comment.

```css
/*
  Threshold. Cold dual light: magenta from the left, cyan from the right.
  Hero and footer on navy, the body on frost. Archivo wide for display,
  Instrument Sans for body. Nothing warm anywhere.

  Sections append their own rules below under a "== Section ==" comment.
  Class names used across files: .site .onNavy .onFrost .display .wordmark
  .reveal .magnetic .pill .pillGhost .measure .eyebrow .rule
*/

.site {
  --navy: #07090f;
  --navy-2: #0d1120;
  --frost: #f4f6fa;
  --frost-2: #e8ecf4;
  --ink: #0b0e17;
  --ink-soft: rgba(11, 14, 23, 0.64);
  --ink-mute: rgba(11, 14, 23, 0.4);
  --white: #ffffff;
  --white-soft: rgba(255, 255, 255, 0.72);
  --white-mute: rgba(255, 255, 255, 0.42);
  --magenta: #ff2d8a;
  --cyan: #2ee6ff;
  --glow-m: rgba(255, 45, 138, 0.55);
  --glow-c: rgba(46, 230, 255, 0.5);
  --hair-navy: rgba(255, 255, 255, 0.12);
  --hair-frost: rgba(11, 14, 23, 0.12);
  --display: var(--font-archivo), Archivo, "Arial Black", system-ui, sans-serif;
  --sans: var(--font-instrument), "Instrument Sans", system-ui, sans-serif;
  --ease: cubic-bezier(0.16, 0.84, 0.28, 1);
  --rail: 56px;
  --gutter: clamp(20px, 4vw, 64px);

  font-family: var(--sans);
  background: var(--frost);
  color: var(--ink);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

@media (min-width: 1024px) {
  .site { padding-left: var(--rail); }
}

.onNavy { background: var(--navy); color: var(--white); }
.onFrost { background: var(--frost); color: var(--ink); }

.display {
  font-family: var(--display);
  font-variation-settings: "wdth" 125;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 0.92;
  text-transform: uppercase;
}

.wordmark {
  font-family: var(--display);
  font-variation-settings: "wdth" 125;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 15px;
}
.wordmark b { font-weight: 900; }

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.72;
}

.measure { max-width: 58ch; }
.rule { border: 0; height: 1px; background: currentColor; opacity: 0.14; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  background: var(--white);
  color: var(--navy);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  position: relative;
  overflow: hidden;
  transition: transform 300ms var(--ease);
}
.pill::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%);
  transform: translateX(-120%);
  transition: transform 700ms var(--ease);
}
.pill:hover::after { transform: translateX(120%); }
.onFrost .pill { background: var(--navy); color: var(--white); }
.pillGhost { composes: pill; background: transparent; color: currentColor; box-shadow: inset 0 0 0 1px currentColor; }

/* == Motion == */
.reveal {
  --delay: 0ms;
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 900ms var(--ease) var(--delay), transform 900ms var(--ease) var(--delay);
}
.reveal[data-shown="true"] { opacity: 1; transform: none; }

.magnetic {
  display: inline-block;
  transform: translate(var(--mx, 0px), var(--my, 0px));
  transition: transform 260ms var(--ease);
}

@media (prefers-reduced-motion: reduce) {
  .reveal, .magnetic, .pill, .pill::after { transition: none !important; transform: none !important; }
  .reveal { opacity: 1; }
}
```

- [ ] **Step 5: Write the wordmark and favicon**

```tsx
// src/app/demo/threshold/Logo.tsx
import s from "./threshold.module.css";

/* THRESHOLD set wide, HOLD one weight heavier. No pictorial mark. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`${s.wordmark} ${className}`} aria-label="Threshold">
      THRES<b>HOLD</b>
    </span>
  );
}
```

```svg
<!-- src/app/demo/threshold/icon.svg : a T cut by the threshold bar -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#07090f"/>
  <path d="M14 16h36v9H37v25h-10V25H14z" fill="#ff2d8a"/>
  <rect x="10" y="37" width="44" height="4" fill="#2ee6ff"/>
</svg>
```

- [ ] **Step 6: Write the layout**

```tsx
// src/app/demo/threshold/layout.tsx
import type { Metadata } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import { BookingProvider } from "./BookingProvider";
import s from "./threshold.module.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Threshold — Strength and conditioning, coached | WebMinor Concept" },
  description:
    "A concept strength studio by WebMinor: cold dual-lit photography, a live timetable you can book into, and a membership slider that prices as you move it.",
  robots: { index: false, follow: false },
};

/* Booking state lives here so it survives navigation between the five pages.
   Rail, Nav and Footer are added in Task 6. */
export default function ThresholdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${archivo.variable} ${instrument.variable} ${s.site}`}>
      <BookingProvider>{children}</BookingProvider>
    </div>
  );
}
```

And a placeholder home so the route resolves:

```tsx
// src/app/demo/threshold/page.tsx
import s from "./threshold.module.css";
import { Wordmark } from "./Logo";

export default function ThresholdHome() {
  return (
    <main className={s.onNavy} style={{ minHeight: "100vh", padding: 40 }}>
      <Wordmark />
    </main>
  );
}
```

- [ ] **Step 7: Run tests, lint, and check the route renders**

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; no lint errors.

Then with the `scroll-world-dev` preview open, navigate to `http://localhost:3000/demo/threshold`. The wordmark must render in Archivo wide (inspect `font-variation-settings` via `javascript_tool`: `getComputedStyle(document.querySelector('[aria-label="Threshold"]')).fontVariationSettings` should be `"wdth" 125`).

- [ ] **Step 8: Commit**

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): layout, fonts, tokens and motion helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Rail, Nav and Footer

**Files:**
- Create: `src/app/demo/threshold/Rail.tsx`, `Nav.tsx`, `Footer.tsx`
- Modify: `src/app/demo/threshold/layout.tsx` (mount all three), `threshold.module.css` (append)
- Test: `src/app/demo/threshold/Rail.test.tsx`

**Interfaces:**
- Consumes: `nextClass`, `minutesUntil`, `formatCountdown`, `DAYS_LONG`, `type Day` from `./timetable`; `programmeById` from `./content`; `useBooking` (for `setJoinOpen`); `useIsClient` from `../useClientEnv`; `Wordmark`.
- Produces:
  ```tsx
  export function useNow(): { day: Day; minutes: number } | null;  // null on server and first paint; ticks every 15s
  export default function Rail(): JSX.Element;    // fixed left rail ≥1024px; bottom bar below
  export default function Nav(): JSX.Element;
  export default function Footer(): JSX.Element;
  ```
- Section ids the rail indexes on the home page: `#programmes`, `#week`, `#coaches`, `#membership`, `#space`. Later tasks must use these ids.

`useNow` converts JS `getDay()` (0 = Sunday) to this site's `Day` (0 = Monday) with `(getDay() + 6) % 7`. It reads the clock only inside an effect, never during render, and ticks with `setInterval` every 15 seconds; the countdown shows "--:--" until the first tick.

- [ ] **Step 1: Write the failing Rail test**

```tsx
// src/app/demo/threshold/Rail.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Rail from "./Rail";
import { BookingProvider } from "./BookingProvider";

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Rail", () => {
  it("shows a countdown and the next class name after the clock ticks", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T06:00:00")); // a Monday, 30 min before 06:30 Strength
    render(<BookingProvider><Rail /></BookingProvider>);
    expect(screen.getByTestId("countdown")).toHaveTextContent("--:--");
    await act(async () => { vi.advanceTimersByTime(20); });
    expect(screen.getByTestId("countdown")).toHaveTextContent("00:30");
    expect(screen.getByTestId("next-name")).toHaveTextContent("Strength");
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/Rail.test.tsx`
Expected: FAIL, cannot resolve `./Rail`.

- [ ] **Step 3: Write Rail.tsx**

```tsx
// src/app/demo/threshold/Rail.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCountdown, minutesUntil, nextClass, DAYS, type Day } from "./timetable";
import { programmeById } from "./content";
import { useBooking } from "./BookingProvider";
import s from "./threshold.module.css";

/*
  The rail. Fixed to the left edge from 1024px: a section index, a live
  countdown to the next class, and socials. Below 1024px it becomes a bottom
  bar with Book and Join. The clock is read only inside an effect so the
  server HTML never contains a time.
*/

const SECTIONS = [
  { id: "programmes", label: "Programmes" },
  { id: "week", label: "This week" },
  { id: "coaches", label: "Coaches" },
  { id: "membership", label: "Membership" },
  { id: "space", label: "The space" },
];

export function useNow(): { day: Day; minutes: number } | null {
  const [now, setNow] = useState<{ day: Day; minutes: number } | null>(null);
  useEffect(() => {
    const read = () => {
      const d = new Date();
      setNow({ day: ((d.getDay() + 6) % 7) as Day, minutes: d.getHours() * 60 + d.getMinutes() });
    };
    const t = setTimeout(read, 0);
    const i = setInterval(read, 15_000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);
  return now;
}

export default function Rail() {
  const now = useNow();
  const { setJoinOpen } = useBooking();
  const next = now ? nextClass(now) : null;
  const gap = now && next ? formatCountdown(minutesUntil(now, next)) : "--:--";

  return (
    <aside className={s.rail} aria-label="Site rail">
      <div className={s.railTop}>
        <span className={s.railLabel}>Next class</span>
        <span className={s.railClock} data-testid="countdown">{gap}</span>
        <span className={s.railNext} data-testid="next-name">
          {next ? `${programmeById(next.programme).name} · ${DAYS[next.day]} ${next.time}` : " "}
        </span>
      </div>

      <nav className={s.railIndex} aria-label="Sections">
        {SECTIONS.map((x) => (
          <a key={x.id} href={`/demo/threshold#${x.id}`} className={s.railDot}>
            <i />
            <span>{x.label}</span>
          </a>
        ))}
      </nav>

      <div className={s.railSocial}>
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="YouTube">YT</a>
      </div>

      <div className={s.railBar}>
        <Link href="/demo/threshold/timetable" className={s.pill}>Book</Link>
        <button type="button" className={s.pillGhost} onClick={() => setJoinOpen(true)}>Join</button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Write Nav.tsx and Footer.tsx**

```tsx
// src/app/demo/threshold/Nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "./Logo";
import s from "./threshold.module.css";

const LINKS = [
  { href: "/demo/threshold#programmes", label: "Programmes" },
  { href: "/demo/threshold/timetable", label: "This week" },
  { href: "/demo/threshold/coaches", label: "Coaches" },
  { href: "/demo/threshold/membership", label: "Membership" },
  { href: "/demo/threshold/about", label: "About" },
];

/* Transparent over the hero, so it reads as part of the photograph; the
   colour of the text follows the section under it via .onNavy/.onFrost. */
export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className={s.nav}>
      <Link href="/demo/threshold" className={s.navBrand} onClick={() => setOpen(false)}>
        <Wordmark />
      </Link>
      <nav className={s.navLinks} data-open={open} aria-label="Primary">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} data-active={path === l.href.split("#")[0]} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/demo/threshold/timetable" className={`${s.pill} ${s.navPill}`}>Try a session</Link>
      <button type="button" className={s.navBurger} aria-expanded={open} aria-label="Menu" onClick={() => setOpen((v) => !v)}>
        <i /><i />
      </button>
    </header>
  );
}
```

```tsx
// src/app/demo/threshold/Footer.tsx
import Link from "next/link";
import { COPY } from "./content";
import s from "./threshold.module.css";

export default function Footer() {
  return (
    <footer className={`${s.onNavy} ${s.footer}`}>
      <p className={`${s.display} ${s.footerMark}`} aria-hidden="true">Threshold</p>
      <div className={s.footerGrid}>
        <div>
          <p className={s.eyebrow}>Find us</p>
          {COPY.address.map((l) => <p key={l}>{l}</p>)}
        </div>
        <div>
          <p className={s.eyebrow}>Hours</p>
          {COPY.hours.map((l) => <p key={l}>{l}</p>)}
        </div>
        <div>
          <p className={s.eyebrow}>Pages</p>
          <p><Link href="/demo/threshold/timetable">This week</Link></p>
          <p><Link href="/demo/threshold/coaches">Coaches</Link></p>
          <p><Link href="/demo/threshold/membership">Membership</Link></p>
          <p><Link href="/demo/threshold/about">About</Link></p>
        </div>
        <div>
          <p className={s.eyebrow}>Concept</p>
          <p>A WebMinor concept build.</p>
          <p><Link href="/case-studies">Back to the work</Link></p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Append the styles**

Append to `threshold.module.css`:

```css
/* == Rail == */
.rail {
  position: fixed; left: 0; top: 0; bottom: 0; width: var(--rail);
  display: none; flex-direction: column; align-items: center; justify-content: space-between;
  padding: 24px 0; z-index: 40; color: var(--white);
  border-right: 1px solid var(--hair-navy); background: var(--navy);
}
@media (min-width: 1024px) { .rail { display: flex; } }
.railTop { display: flex; flex-direction: column; align-items: center; gap: 6px; writing-mode: vertical-rl; transform: rotate(180deg); }
.railLabel { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--white-mute); }
.railClock { font-family: var(--display); font-variation-settings: "wdth" 110; font-weight: 700; font-size: 18px; font-variant-numeric: tabular-nums; color: var(--cyan); }
.railNext { font-size: 11px; color: var(--white-soft); white-space: nowrap; }
.railIndex { display: flex; flex-direction: column; gap: 18px; }
.railDot { display: flex; align-items: center; gap: 10px; position: relative; color: var(--white-mute); text-decoration: none; }
.railDot i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; transition: background 300ms var(--ease), transform 300ms var(--ease); }
.railDot span { position: absolute; left: 22px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; opacity: 0; transform: translateX(-6px); transition: opacity 300ms var(--ease), transform 300ms var(--ease); color: var(--white); background: var(--navy); padding: 4px 8px; }
.railDot:hover i, .railDot:focus-visible i { background: var(--magenta); transform: scale(1.5); }
.railDot:hover span, .railDot:focus-visible span { opacity: 1; transform: none; }
.railSocial { display: flex; flex-direction: column; gap: 14px; font-size: 10px; letter-spacing: 0.18em; }
.railSocial a { color: var(--white-mute); text-decoration: none; }
.railSocial a:hover { color: var(--cyan); }
.railBar { display: none; }
@media (max-width: 1023px) {
  .rail { display: flex; top: auto; width: auto; right: 0; height: 68px; flex-direction: row; padding: 0 16px; border-right: 0; border-top: 1px solid var(--hair-navy); }
  .railTop, .railIndex, .railSocial { display: none; }
  .railBar { display: flex; gap: 10px; width: 100%; }
  .railBar > * { flex: 1; justify-content: center; }
  .site { padding-bottom: 68px; }
}

/* == Nav == */
.nav { position: absolute; top: 0; left: 0; right: 0; z-index: 30; display: flex; align-items: center; gap: 28px; padding: 22px var(--gutter); color: var(--white); }
.navBrand { color: inherit; text-decoration: none; margin-right: auto; }
.navLinks { display: none; gap: 26px; }
.navLinks a { color: inherit; text-decoration: none; font-size: 13px; letter-spacing: 0.06em; opacity: 0.78; transition: opacity 240ms var(--ease); }
.navLinks a:hover, .navLinks a[data-active="true"] { opacity: 1; }
.navPill { display: none; }
.navBurger { width: 40px; height: 40px; display: grid; place-content: center; gap: 6px; background: transparent; border: 0; color: inherit; }
.navBurger i { display: block; width: 22px; height: 2px; background: currentColor; }
@media (min-width: 900px) {
  .navLinks, .navPill { display: inline-flex; }
  .navBurger { display: none; }
}
@media (max-width: 899px) {
  .navLinks[data-open="true"] { display: flex; position: fixed; inset: 0; background: var(--navy); flex-direction: column; justify-content: center; align-items: center; gap: 28px; font-size: 22px; }
}

/* == Footer == */
.footer { padding: 96px var(--gutter) 48px; }
.footerMark { font-size: clamp(64px, 16vw, 240px); color: var(--white); opacity: 0.08; line-height: 0.8; margin: 0 0 48px -0.04em; }
.footerGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; font-size: 14px; }
.footerGrid p { margin: 0 0 6px; color: var(--white-soft); }
.footerGrid a { color: var(--white); text-decoration: none; }
.footerGrid a:hover { color: var(--cyan); }
.footerGrid .eyebrow { margin-bottom: 14px; color: var(--white-mute); }
@media (min-width: 900px) { .footerGrid { grid-template-columns: repeat(4, 1fr); } }
```

- [ ] **Step 6: Mount in the layout**

Replace the layout body from Task 5 with:

```tsx
import Rail from "./Rail";
import Nav from "./Nav";
import Footer from "./Footer";
// ...
    <div className={`${archivo.variable} ${instrument.variable} ${s.site}`}>
      <BookingProvider>
        <Rail />
        <Nav />
        {children}
        <Footer />
      </BookingProvider>
    </div>
```

- [ ] **Step 7: Run tests, lint, browser check**

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean.

Browser: reload `/demo/threshold` at 1280 wide. The rail is visible on the left with a ticking countdown in cyan and the next class name. Resize to 390: the rail becomes a bottom bar with Book and Join; the burger opens a full-screen menu. Screenshot both.

- [ ] **Step 8: Commit**

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): fixed rail with live countdown, nav and footer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Hero

**Files:**
- Create: `src/app/demo/threshold/Hero.tsx`
- Modify: `threshold.module.css` (append), `page.tsx` (mount)
- Test: `src/app/demo/threshold/Hero.test.tsx`

**Interfaces:**
- Consumes: `useNow` from `./Rail`; `nextClass`, `placesLeft`, `DAYS` from `./timetable`; `programmeById`, `COPY` from `./content`; `useBooking` (`bookedIds`, `openDrawer`); `useMediaQuery`, `REDUCED`.
- Produces: `export default function Hero(): JSX.Element`.

Layer order, back to front: full photograph `hero.webp`, the word THRESHOLD in outline type, the cut-out `hero-cutout.webp`, then the copy and the live strip. The word is `aria-hidden` and the real `<h1>` is visually hidden text "Threshold". On load each letter settles in with a stagger (CSS animation keyed by `--i`). Cursor depth: the section tracks pointer position into `--px/--py` (−1..1) and the three layers translate by different multipliers. Scroll handoff: a scroll listener writes `--p` (0..1 over the hero height); the word scales to 1.18 and fades, the cut-out holds. Reduced motion: no letter animation, no depth, no handoff; static final state.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/demo/threshold/Hero.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { BookingProvider } from "./BookingProvider";

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Hero", () => {
  it("has a real heading and nine decorative letters", () => {
    render(<BookingProvider><Hero /></BookingProvider>);
    expect(screen.getByRole("heading", { level: 1, name: "Threshold" })).toBeInTheDocument();
    expect(screen.getAllByTestId("letter")).toHaveLength(9);
  });
  it("renders the strip placeholder before the clock ticks", () => {
    render(<BookingProvider><Hero /></BookingProvider>);
    expect(screen.getByTestId("strip")).toHaveTextContent("Next class");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/Hero.test.tsx`
Expected: FAIL, cannot resolve `./Hero`.

- [ ] **Step 3: Write Hero.tsx**

```tsx
// src/app/demo/threshold/Hero.tsx
"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { useNow } from "./Rail";
import { nextClass, placesLeft, DAYS } from "./timetable";
import { programmeById, COPY } from "./content";
import { useBooking } from "./BookingProvider";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Magnetic } from "./motion";
import s from "./threshold.module.css";

const WORD = "THRESHOLD".split("");

/*
  The athlete threads through the word: photograph at the back, outline type,
  then the cut-out of the same athlete in front. Pointer position and scroll
  progress are written to CSS variables on the section, and the layers read
  them at different depths. Nothing here sets state; the DOM is driven
  directly from the listeners.
*/
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED);
  const now = useNow();
  const { bookedIds, openDrawer } = useBooking();
  const next = now ? nextClass(now) : null;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const onScroll = () => {
      const h = el.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      if (Number.isFinite(p)) el.style.setProperty("--p", p.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <section ref={ref} className={`${s.onNavy} ${s.hero}`} data-reduced={reduced} onPointerMove={onMove} onPointerLeave={onLeave}>
      <h1 className={s.srOnly}>Threshold</h1>

      <img className={s.heroPhoto} src="/demo/threshold/hero.webp" alt="" fetchPriority="high" decoding="async" />

      <div className={`${s.display} ${s.heroWord}`} aria-hidden="true">
        {WORD.map((ch, i) => (
          <span key={i} data-testid="letter" style={{ "--i": i } as CSSProperties}>{ch}</span>
        ))}
      </div>

      <img className={s.heroCutout} src="/demo/threshold/hero-cutout.webp" alt="An athlete in the set position, lit magenta and cyan" decoding="async" />

      <div className={s.heroCopy}>
        <p className={s.heroLine}>{COPY.heroLine}</p>
        <div className={s.heroStrip} data-testid="strip">
          <span className={s.eyebrow}>Next class</span>
          {next ? (
            <>
              <strong>{programmeById(next.programme).name}</strong>
              <span>{DAYS[next.day]} {next.time}</span>
              <span>{placesLeft(next, bookedIds)} places left</span>
              <Magnetic>
                <button type="button" className={s.pill} onClick={() => openDrawer(next)}>Book it</button>
              </Magnetic>
            </>
          ) : (
            <span aria-hidden="true">{" "}</span>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Append the styles**

```css
/* == Hero == */
.srOnly { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.hero {
  --px: 0; --py: 0; --p: 0;
  position: relative; min-height: 100svh; overflow: hidden; isolation: isolate;
  display: grid; align-items: end;
}
.heroPhoto {
  position: absolute; inset: -4%; width: 108%; height: 108%; object-fit: cover; object-position: 60% 50%;
  transform: translate(calc(var(--px) * -8px), calc(var(--py) * -6px));
  transition: transform 600ms var(--ease);
  filter: saturate(1.1);
}
.heroPhoto::after { content: none; }
.hero::before {
  /* haze plate: a soft cold gradient the cut-out sits on */
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    radial-gradient(60% 50% at 18% 60%, var(--glow-m) 0%, transparent 70%),
    radial-gradient(60% 50% at 82% 40%, var(--glow-c) 0%, transparent 70%),
    linear-gradient(180deg, rgba(7, 9, 15, 0.2) 0%, rgba(7, 9, 15, 0) 40%, rgba(7, 9, 15, 0.85) 100%);
  mix-blend-mode: screen; opacity: 0.55;
  transform: translate(calc(var(--px) * 14px), calc(var(--py) * 10px));
  transition: transform 800ms var(--ease);
}
.heroWord {
  position: absolute; z-index: 2; left: calc(var(--gutter) - 0.04em); top: 18vh;
  font-size: clamp(88px, 21.5vw, 360px); line-height: 0.86; white-space: nowrap;
  color: transparent; -webkit-text-stroke: 2px rgba(255, 255, 255, 0.9);
  transform: translate(calc(var(--px) * 10px), calc(var(--py) * 6px)) scale(calc(1 + var(--p) * 0.18));
  transform-origin: 20% 50%;
  opacity: calc(1 - var(--p) * 1.4);
  transition: transform 500ms var(--ease);
  display: flex;
}
.heroWord span {
  display: inline-block; opacity: 0; transform: translateY(0.35em) rotate(3deg);
  animation: letter 900ms var(--ease) forwards; animation-delay: calc(140ms + var(--i) * 55ms);
}
@keyframes letter { to { opacity: 1; transform: none; } }
.heroCutout {
  position: absolute; z-index: 3; right: 4vw; bottom: 0; height: 84vh; width: auto; max-width: 70vw; object-fit: contain; object-position: bottom;
  transform: translate(calc(var(--px) * 18px), calc(var(--py) * 8px + var(--p) * 6vh));
  transition: transform 500ms var(--ease);
  filter: drop-shadow(0 30px 60px rgba(7, 9, 15, 0.6));
}
.heroCopy { position: relative; z-index: 4; padding: 0 var(--gutter) 56px; max-width: 520px; }
.heroLine { font-size: 16px; line-height: 1.55; color: var(--white-soft); margin: 0 0 22px; max-width: 42ch; }
.heroStrip {
  display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px;
  padding: 14px 18px; border: 1px solid var(--hair-navy); border-radius: 14px;
  background: rgba(7, 9, 15, 0.45); backdrop-filter: blur(10px); font-size: 14px;
}
.heroStrip strong { font-family: var(--display); font-variation-settings: "wdth" 115; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.heroStrip span:not(.eyebrow) { color: var(--white-soft); }
@media (max-width: 899px) {
  .heroWord { top: 14vh; font-size: 24vw; }
  .heroCutout { height: 64vh; right: -6vw; max-width: 90vw; }
  .heroCopy { padding-bottom: 32px; }
}
.hero[data-reduced="true"] .heroWord span { animation: none; opacity: 1; transform: none; }
.hero[data-reduced="true"] .heroWord, .hero[data-reduced="true"] .heroCutout, .hero[data-reduced="true"] .heroPhoto, .hero[data-reduced="true"]::before { transform: none; opacity: 1; }
```

- [ ] **Step 5: Mount in page.tsx**

Replace the placeholder `page.tsx` main with:

```tsx
import type { Metadata } from "next";
import Hero from "./Hero";

export const metadata: Metadata = {
  title: { absolute: "Threshold — Strength and conditioning, coached | WebMinor Concept" },
};

export default function ThresholdHome() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 6: Run tests, lint, and judge it in the browser**

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean.

Browser at 1440 wide: take a screenshot. The word must sit behind the athlete with the body crossing at least two letters. Move the pointer with `computer` hover and screenshot again: layers shift at different depths. Scroll 400px and screenshot: the word has scaled and faded, the athlete holds. Compare with the Limitless reference. If the word does not thread behind the body, adjust `.heroWord top` and `.heroCutout right/height` until it does. At 390 wide the athlete must still be inside the frame.

- [ ] **Step 7: Commit**

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): layered hero with the athlete threading through the word

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Manifesto and the programmes rail

**Files:**
- Create: `src/app/demo/threshold/Manifesto.tsx`, `ProgrammesRail.tsx`
- Modify: `threshold.module.css` (append), `page.tsx` (mount)
- Test: `src/app/demo/threshold/ProgrammesRail.test.tsx`

**Interfaces:**
- Consumes: `COPY`, `FIGURES`, `PROGRAMMES` from `./content`; `Reveal`, `Counter`, `REDUCED`; `useMediaQuery`.
- Produces: `export default function Manifesto()`, `export default function ProgrammesRail()`. Section ids `#manifesto` (not in the rail index) and `#programmes`.

The programmes rail is a pinned section: the outer is `height: calc(100vh + <track overflow>)`, the inner is `position: sticky; top: 0; height: 100vh`, and a scroll listener writes `--x` (0..1) that translates the track by `calc(var(--x) * (track width - viewport width))`. Below 900px it is a plain horizontally scrollable row with scroll-snap and no pinning.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/demo/threshold/ProgrammesRail.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgrammesRail from "./ProgrammesRail";
import { PROGRAMMES } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("ProgrammesRail", () => {
  it("renders one card per programme with its days", () => {
    render(<ProgrammesRail />);
    for (const p of PROGRAMMES) {
      expect(screen.getByRole("heading", { name: p.name })).toBeInTheDocument();
      expect(screen.getByText(p.days)).toBeInTheDocument();
    }
    expect(screen.getAllByRole("img")).toHaveLength(PROGRAMMES.length);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/ProgrammesRail.test.tsx`
Expected: FAIL, cannot resolve `./ProgrammesRail`.

- [ ] **Step 3: Write Manifesto.tsx**

```tsx
// src/app/demo/threshold/Manifesto.tsx
import { COPY, FIGURES } from "./content";
import { Reveal, Counter } from "./motion";
import s from "./threshold.module.css";

export default function Manifesto() {
  return (
    <section id="manifesto" className={`${s.onFrost} ${s.manifesto}`}>
      <Reveal>
        <p className={s.eyebrow}>The studio</p>
      </Reveal>
      <div className={s.manifestoBody}>
        {COPY.manifesto.map((line, i) => (
          <Reveal key={line} delay={i * 120}>
            <p className={i === 0 ? `${s.display} ${s.manifestoLead}` : s.manifestoLine}>{line}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className={s.figures} delay={360}>
        <div><Counter value={FIGURES.years} className={s.figure} /><span>years open</span></div>
        <div><Counter value={FIGURES.coaches} className={s.figure} /><span>coaches</span></div>
        <div><Counter value={FIGURES.sessionsAWeek} className={s.figure} /><span>sessions a week</span></div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Write ProgrammesRail.tsx**

```tsx
// src/app/demo/threshold/ProgrammesRail.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PROGRAMMES } from "./content";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED } from "./motion";
import s from "./threshold.module.css";

/*
  Pinned: vertical scroll through the tall outer scrubs the track sideways.
  The listener writes --x on the outer and CSS does the translate. On narrow
  screens (or reduced motion) the section is a normal snap-scrolling row.
*/
export default function ProgrammesRail() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED);
  const wide = useMediaQuery("(min-width: 900px)");
  const pinned = wide && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !pinned) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const x = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty("--x", x.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [pinned]);

  return (
    <section id="programmes" ref={ref} className={`${s.onNavy} ${s.progOuter}`} data-pinned={pinned}>
      <div className={s.progSticky}>
        <header className={s.progHead}>
          <p className={s.eyebrow}>Programmes</p>
          <h2 className={`${s.display} ${s.h2}`}>Four ways in</h2>
        </header>
        <ul className={s.progTrack}>
          {PROGRAMMES.map((p, i) => (
            <li key={p.id} className={s.progCard} style={{ "--i": i } as React.CSSProperties}>
              <img src={p.image} alt={p.alt} loading="lazy" decoding="async" />
              <div className={s.progText}>
                <span className={s.progIndex}>0{i + 1}</span>
                <h3 className={`${s.display} ${s.progName}`}>{p.name}</h3>
                <p>{p.line}</p>
                <span className={s.progDays}>{p.days}</span>
                <Link href={`/demo/threshold/timetable?programme=${p.id}`} className={s.progLink}>See the week</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Append the styles**

```css
/* == Manifesto == */
.h2 { font-size: clamp(40px, 6vw, 96px); margin: 0; }
.manifesto { padding: clamp(80px, 12vh, 160px) var(--gutter); display: grid; gap: 40px; }
.manifestoBody { display: grid; gap: 20px; max-width: 22ch; }
.manifestoLead { font-size: clamp(34px, 4.6vw, 72px); margin: 0; }
.manifestoLine { font-size: clamp(17px, 1.4vw, 21px); line-height: 1.5; color: var(--ink-soft); margin: 0; max-width: 52ch; }
.figures { display: flex; gap: clamp(28px, 6vw, 96px); flex-wrap: wrap; padding-top: 24px; border-top: 1px solid var(--hair-frost); }
.figures div { display: grid; gap: 6px; }
.figures span:last-child { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-mute); }
.figure { font-family: var(--display); font-variation-settings: "wdth" 125; font-weight: 800; font-size: clamp(48px, 6vw, 96px); line-height: 1; letter-spacing: -0.03em; color: var(--ink); font-variant-numeric: tabular-nums; }

/* == Programmes rail == */
.progOuter { --x: 0; position: relative; }
.progOuter[data-pinned="true"] { height: 300vh; }
.progSticky { position: sticky; top: 0; height: 100vh; overflow: hidden; display: grid; grid-template-rows: auto 1fr; padding: 80px 0 40px var(--gutter); }
.progOuter[data-pinned="false"] .progSticky { position: static; height: auto; overflow: visible; }
.progHead { display: grid; gap: 10px; margin-bottom: 32px; }
.progTrack {
  list-style: none; margin: 0; padding: 0; display: flex; gap: 24px; align-items: stretch;
  transform: translateX(calc(var(--x) * (var(--track) - 100vw + var(--rail) + var(--gutter))));
  --track: calc(4 * (34vw + 24px));
  will-change: transform;
}
.progOuter[data-pinned="false"] .progTrack { transform: none; overflow-x: auto; scroll-snap-type: x mandatory; padding-right: var(--gutter); scrollbar-width: none; }
.progCard {
  position: relative; flex: 0 0 34vw; min-width: 300px; aspect-ratio: 3 / 4; max-height: calc(100vh - 220px);
  border-radius: 18px; overflow: hidden; scroll-snap-align: start; background: var(--navy-2);
}
.progCard img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 1200ms var(--ease); }
.progCard:hover img { transform: scale(1.04); }
.progText { position: absolute; inset: auto 0 0 0; padding: 28px; display: grid; gap: 8px; background: linear-gradient(180deg, transparent, rgba(7, 9, 15, 0.9)); }
.progText p { margin: 0; color: var(--white-soft); font-size: 14px; line-height: 1.5; max-width: 34ch; }
.progIndex { font-size: 11px; letter-spacing: 0.22em; color: var(--cyan); }
.progName { font-size: clamp(28px, 3vw, 44px); margin: 0; }
.progDays { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--white-mute); }
.progLink { color: var(--white); font-size: 13px; text-decoration: underline; text-underline-offset: 4px; margin-top: 6px; }
.progLink:hover { color: var(--magenta); }
@media (max-width: 899px) { .progCard { flex-basis: 78vw; } }
```

- [ ] **Step 6: Mount in page.tsx**

```tsx
import Manifesto from "./Manifesto";
import ProgrammesRail from "./ProgrammesRail";
// inside <main>, after <Hero />:
      <Manifesto />
      <ProgrammesRail />
```

- [ ] **Step 7: Run tests, lint, browser**

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean.

Browser at 1440: scroll to the programmes section, it pins; scroll further and the four cards travel left; the last card ends fully inside the viewport with the section releasing. If it overshoots or stops short, adjust `--track`. Figures count up in the manifesto. At 390 the cards swipe sideways and snap. Screenshot both.

- [ ] **Step 8: Commit**

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): manifesto with figures and the pinned programmes rail

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: This week and the booking drawer

**Files:**
- Create: `src/app/demo/threshold/Week.tsx`, `BookDrawer.tsx`
- Modify: `threshold.module.css` (append), `page.tsx` (mount `<Week />` and `<BookDrawer />`), `layout.tsx` (mount `<BookDrawer />` so it works on every page; remove from page.tsx if you mounted it there)
- Test: `src/app/demo/threshold/Week.test.tsx`

**Interfaces:**
- Consumes: `WEEK`, `sessionsOn`, `placesLeft`, `DAYS`, `DAYS_LONG`, `type Day`, `type ProgrammeId` from `./timetable`; `programmeById`, `coachBySlug`, `PROGRAMMES` from `./content`; `useBooking`; `useNow` from `./Rail`; `Reveal`.
- Produces:
  ```tsx
  export default function Week(props: { initialDay?: Day; programme?: ProgrammeId; full?: boolean }): JSX.Element;
  // full=true shows a programme filter row and a taller wall (used by /timetable)
  export default function BookDrawer(): JSX.Element; // reads useBooking().drawer; renders nothing when null
  ```
- `Week` takes `initialDay` as a prop; the home page passes nothing and `Week` picks today from `useNow()` once it ticks (until then it shows Monday). `/timetable` passes `?programme=` through.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/app/demo/threshold/Week.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Week from "./Week";
import BookDrawer from "./BookDrawer";
import { BookingProvider } from "./BookingProvider";
import { sessionsOn } from "./timetable";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

const ui = (props = {}) => render(
  <BookingProvider><Week initialDay={0} {...props} /><BookDrawer /></BookingProvider>,
);

describe("Week", () => {
  it("shows Monday's sessions and switches day on tab click", () => {
    ui();
    expect(screen.getAllByTestId("row")).toHaveLength(sessionsOn(0).length);
    fireEvent.click(screen.getByRole("tab", { name: /Wed/ }));
    expect(screen.getAllByTestId("row")).toHaveLength(sessionsOn(2).length);
  });

  it("filters by programme when asked", () => {
    ui({ programme: "mobility", full: true });
    const rows = screen.getAllByTestId("row");
    expect(rows).toHaveLength(sessionsOn(0).filter((s) => s.programme === "mobility").length);
  });

  it("books a class through the drawer and marks the row", () => {
    ui();
    const first = screen.getAllByTestId("row")[0];
    const before = Number(within(first).getByTestId("places").textContent);
    fireEvent.click(within(first).getByRole("button", { name: /Book/ }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(within(dialog).getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /Confirm/ }));
    expect(within(dialog).getByText(/You're in/)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /Close/ }));
    expect(screen.queryByRole("dialog")).toBeNull();
    const after = Number(within(screen.getAllByTestId("row")[0]).getByTestId("places").textContent);
    expect(after).toBe(before - 1);
    expect(within(screen.getAllByTestId("row")[0]).getByText("Booked")).toBeInTheDocument();
  });

  it("offers the waitlist on a full class", () => {
    ui();
    const full = screen.getAllByTestId("row").find((r) => within(r).getByTestId("places").textContent === "0")!;
    expect(within(full).getByRole("button", { name: /Waitlist/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/Week.test.tsx`
Expected: FAIL, cannot resolve `./Week`.

- [ ] **Step 3: Write Week.tsx**

```tsx
// src/app/demo/threshold/Week.tsx
"use client";

import { useState } from "react";
import { sessionsOn, placesLeft, DAYS, DAYS_LONG, type Day, type ProgrammeId } from "./timetable";
import { programmeById, coachBySlug, PROGRAMMES } from "./content";
import { useBooking } from "./BookingProvider";
import { useNow } from "./Rail";
import { Reveal } from "./motion";
import s from "./threshold.module.css";

/*
  The timetable as a typographic wall: the time is the biggest thing on the
  row. Day tabs across the top; rows re-mount on day change (key) so the
  stagger runs again. `initialDay` wins; otherwise today once the clock ticks.
*/
export default function Week({ initialDay, programme, full = false }: { initialDay?: Day; programme?: ProgrammeId; full?: boolean }) {
  const now = useNow();
  const [picked, setPicked] = useState<Day | null>(initialDay ?? null);
  const [filter, setFilter] = useState<ProgrammeId | "all">(programme ?? "all");
  const day: Day = picked ?? now?.day ?? 0;
  const { bookedIds, openDrawer } = useBooking();

  const rows = sessionsOn(day).filter((x) => filter === "all" || x.programme === filter);

  return (
    <section id="week" className={`${s.onFrost} ${s.week}`} data-full={full}>
      <header className={s.weekHead}>
        <div>
          <p className={s.eyebrow}>This week</p>
          <h2 className={`${s.display} ${s.h2}`}>{DAYS_LONG[day]}</h2>
        </div>
        <div role="tablist" aria-label="Day" className={s.dayTabs}>
          {DAYS.map((d, i) => (
            <button key={d} role="tab" type="button" aria-selected={day === i} className={s.dayTab} onClick={() => setPicked(i as Day)}>
              {d}
            </button>
          ))}
        </div>
      </header>

      {full && (
        <div className={s.filterRow} role="group" aria-label="Programme">
          <button type="button" data-on={filter === "all"} onClick={() => setFilter("all")}>All</button>
          {PROGRAMMES.map((p) => (
            <button key={p.id} type="button" data-on={filter === p.id} onClick={() => setFilter(p.id)}>{p.name}</button>
          ))}
        </div>
      )}

      <ul className={s.wall} key={`${day}-${filter}`}>
        {rows.length === 0 && <li className={s.wallEmpty}>Nothing on. The floor is closed.</li>}
        {rows.map((x, i) => {
          const left = placesLeft(x, bookedIds);
          const mine = bookedIds.includes(x.id);
          return (
            <Reveal as="li" key={x.id} delay={i * 70} className={s.row} threshold={0.05}>
              <div data-testid="row" className={s.rowInner}>
                <span className={`${s.display} ${s.rowTime}`}>{x.time}</span>
                <div className={s.rowMeta}>
                  <span className={s.rowName}>{programmeById(x.programme).name}</span>
                  <span className={s.rowCoach}>with {coachBySlug(x.coach).name.split(" ")[0]}</span>
                </div>
                <span className={s.rowPlaces}>
                  <b data-testid="places">{left}</b> {left === 1 ? "place" : "places"} left
                </span>
                {mine ? (
                  <span className={s.rowBooked}>Booked</span>
                ) : (
                  <button type="button" className={left === 0 ? s.pillGhost : s.pill} onClick={() => openDrawer(x)}>
                    {left === 0 ? "Waitlist" : "Book"}
                  </button>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Write BookDrawer.tsx**

```tsx
// src/app/demo/threshold/BookDrawer.tsx
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { placesLeft, DAYS_LONG } from "./timetable";
import { programmeById, coachBySlug } from "./content";
import { useBooking } from "./BookingProvider";
import s from "./threshold.module.css";

/*
  One drawer for booking and waitlisting. Slides in from the right; Escape
  and the scrim close it. "done" is reset whenever a new session opens so the
  confirmation never shows for the wrong class.
*/
export default function BookDrawer() {
  const { drawer, closeDrawer, book, bookedIds } = useBooking();
  const [done, setDone] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", onKey);
    nameRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer, closeDrawer]);

  if (!drawer) return null;
  const left = placesLeft(drawer, bookedIds);
  const waitlist = left === 0;
  const confirmed = done === drawer.id;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    book({ sessionId: drawer.id, name: String(f.get("name")), email: String(f.get("email")), waitlist });
    setDone(drawer.id);
  };

  return (
    <div className={s.scrim} onClick={closeDrawer}>
      <aside role="dialog" aria-modal="true" aria-labelledby="bd-title" className={s.drawer} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={s.drawerClose} onClick={closeDrawer} aria-label="Close">Close</button>
        <p className={s.eyebrow}>{waitlist ? "Waitlist" : "Book a place"}</p>
        <h2 id="bd-title" className={`${s.display} ${s.drawerTitle}`}>{programmeById(drawer.programme).name}</h2>
        <p className={s.drawerMeta}>
          {DAYS_LONG[drawer.day]} {drawer.time} · with {coachBySlug(drawer.coach).name} · {waitlist ? "full" : `${left} left`}
        </p>

        {confirmed ? (
          <div className={s.drawerDone}>
            <p className={`${s.display} ${s.drawerDoneMark}`}>{waitlist ? "On the list" : "You're in"}</p>
            <p>{waitlist ? "We'll email you the moment a place opens." : "Arrive ten minutes early. Chalk is provided."}</p>
            <button type="button" className={s.pill} onClick={closeDrawer}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className={s.drawerForm}>
            <label>Name<input ref={nameRef} name="name" required autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <button type="submit" className={s.pill}>{waitlist ? "Confirm waitlist" : "Confirm booking"}</button>
          </form>
        )}
      </aside>
    </div>
  );
}
```

- [ ] **Step 5: Append the styles**

```css
/* == Week == */
.week { padding: clamp(80px, 12vh, 160px) var(--gutter); }
.weekHead { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 32px; }
.dayTabs { display: flex; gap: 4px; flex-wrap: wrap; }
.dayTab { height: 40px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--hair-frost); background: transparent; color: var(--ink-soft); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; transition: background 240ms var(--ease), color 240ms var(--ease); }
.dayTab[aria-selected="true"] { background: var(--navy); color: var(--white); border-color: var(--navy); }
.dayTab:hover:not([aria-selected="true"]) { color: var(--ink); border-color: var(--ink); }
.filterRow { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
.filterRow button { height: 34px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--hair-frost); background: transparent; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); }
.filterRow button[data-on="true"] { background: var(--magenta); color: var(--white); border-color: var(--magenta); }
.wall { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--hair-frost); }
.wallEmpty { padding: 40px 0; color: var(--ink-mute); }
.row { border-bottom: 1px solid var(--hair-frost); }
.rowInner { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 20px 32px; padding: 18px 0; }
.rowTime { font-size: clamp(40px, 6vw, 88px); line-height: 1; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; min-width: 4.2ch; }
.rowMeta { display: grid; gap: 4px; }
.rowName { font-family: var(--display); font-variation-settings: "wdth" 115; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; font-size: 16px; }
.rowCoach { font-size: 13px; color: var(--ink-soft); }
.rowPlaces { font-size: 13px; color: var(--ink-soft); white-space: nowrap; }
.rowPlaces b { font-weight: 700; color: var(--ink); }
.rowBooked { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--magenta); padding: 0 18px; }
@media (max-width: 720px) {
  .rowInner { grid-template-columns: auto 1fr; }
  .rowPlaces { grid-column: 2; }
  .rowInner > .pill, .rowInner > .pillGhost, .rowBooked { grid-column: 1 / -1; justify-content: center; }
}

/* == Drawer == */
.scrim { position: fixed; inset: 0; z-index: 60; background: rgba(7, 9, 15, 0.55); backdrop-filter: blur(4px); display: flex; justify-content: flex-end; animation: fade 300ms var(--ease); }
@keyframes fade { from { opacity: 0; } }
.drawer { width: min(460px, 100%); height: 100%; background: var(--navy); color: var(--white); padding: 32px; display: grid; align-content: start; gap: 14px; animation: slide 500ms var(--ease); overflow-y: auto; }
@keyframes slide { from { transform: translateX(40px); opacity: 0; } }
.drawerClose { justify-self: end; background: transparent; border: 0; color: var(--white-mute); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
.drawerClose:hover { color: var(--white); }
.drawerTitle { font-size: clamp(40px, 5vw, 64px); margin: 0; }
.drawerMeta { color: var(--white-soft); font-size: 14px; margin: 0 0 20px; }
.drawerForm { display: grid; gap: 16px; }
.drawerForm label { display: grid; gap: 6px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--white-mute); }
.drawerForm input { height: 48px; padding: 0 14px; border-radius: 10px; border: 1px solid var(--hair-navy); background: var(--navy-2); color: var(--white); font: inherit; font-size: 16px; }
.drawerForm input:focus { outline: 2px solid var(--cyan); outline-offset: 2px; }
.drawerDone { display: grid; gap: 12px; }
.drawerDoneMark { font-size: clamp(36px, 4vw, 56px); margin: 0; color: var(--cyan); }
.drawerDone p:not(.drawerDoneMark) { color: var(--white-soft); margin: 0 0 10px; }
@media (prefers-reduced-motion: reduce) { .scrim, .drawer { animation: none; } }
```

- [ ] **Step 6: Mount**

In `layout.tsx` add `import BookDrawer from "./BookDrawer";` and render `<BookDrawer />` after `<Footer />` inside the provider. In `page.tsx` add `<Week />` after `<ProgrammesRail />`.

- [ ] **Step 7: Run tests, lint, browser**

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean.

Browser at 1440: the wall shows today's rows with giant times; change day and the rows stagger in. Click Book on the hero strip: the drawer slides in over any page. Fill and confirm; the row now says Booked and the places figure has dropped by one. Reload: it still says Booked. Screenshot the wall and the drawer.

- [ ] **Step 8: Commit**

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): the week as a typographic wall, with a working booking drawer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Coaches roster

**Files:**
- Create: `src/app/demo/threshold/Coaches.tsx`
- Modify: `threshold.module.css` (append), `page.tsx` (mount)
- Test: `src/app/demo/threshold/Coaches.test.tsx`

**Interfaces:**
- Consumes: `COACHES` from `./content`; `Reveal`.
- Produces: `export default function Coaches(props: { long?: boolean }): JSX.Element;` where `long` adds the full bio under each column (used by `/coaches`). Section id `#coaches`.

Each column holds two stacked images; the action shot sits on top at `opacity: 0` and fades in on hover or focus. The name runs vertically along the column's left edge.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/demo/threshold/Coaches.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Coaches from "./Coaches";
import { COACHES } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Coaches", () => {
  it("renders a portrait and a hidden action shot per coach", () => {
    render(<Coaches />);
    for (const c of COACHES) {
      expect(screen.getByRole("heading", { name: c.name })).toBeInTheDocument();
      expect(screen.getByAltText(`${c.name}, ${c.discipline} coach`)).toBeInTheDocument();
    }
    expect(screen.getAllByTestId("action")).toHaveLength(COACHES.length);
    expect(screen.queryByText(COACHES[0].bio)).toBeNull();
  });
  it("shows the bio in long mode", () => {
    render(<Coaches long />);
    expect(screen.getByText(COACHES[0].bio)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/Coaches.test.tsx`
Expected: FAIL, cannot resolve `./Coaches`.

- [ ] **Step 3: Write Coaches.tsx**

```tsx
// src/app/demo/threshold/Coaches.tsx
import { COACHES } from "./content";
import { Reveal } from "./motion";
import s from "./threshold.module.css";

export default function Coaches({ long = false }: { long?: boolean }) {
  return (
    <section id="coaches" className={`${s.onNavy} ${s.coaches}`}>
      <header className={s.coachesHead}>
        <p className={s.eyebrow}>Coaches</p>
        <h2 className={`${s.display} ${s.h2}`}>Four people, no rota</h2>
      </header>
      <ul className={s.roster}>
        {COACHES.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={i * 110} className={s.coach}>
            <a href={`/demo/threshold/coaches#${c.slug}`} className={s.coachFrame} tabIndex={long ? -1 : 0}>
              <img src={c.portrait} alt={`${c.name}, ${c.discipline} coach`} loading="lazy" decoding="async" />
              <img src={c.action} alt="" aria-hidden="true" data-testid="action" className={s.coachAction} loading="lazy" decoding="async" />
              <span className={`${s.display} ${s.coachVertical}`} aria-hidden="true">{c.name.split(" ")[0]}</span>
            </a>
            <div className={s.coachText} id={long ? c.slug : undefined}>
              <h3 className={s.coachName}>{c.name}</h3>
              <p className={s.coachDiscipline}>{c.discipline}</p>
              <p className={s.coachLine}>{c.line}</p>
              {long && <p className={s.coachBio}>{c.bio}</p>}
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Append the styles**

```css
/* == Coaches == */
.coaches { padding: clamp(80px, 12vh, 160px) var(--gutter); }
.coachesHead { display: grid; gap: 10px; margin-bottom: 40px; }
.roster { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
@media (min-width: 900px) { .roster { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
.coach { display: grid; gap: 16px; }
.coachFrame { position: relative; display: block; aspect-ratio: 3 / 4; border-radius: 16px; overflow: hidden; background: var(--navy-2); }
.coachFrame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 700ms var(--ease), transform 1200ms var(--ease); }
.coachAction { opacity: 0; transform: scale(1.04); }
.coachFrame:hover .coachAction, .coachFrame:focus-visible .coachAction { opacity: 1; transform: none; }
.coachFrame:hover img:first-child { transform: scale(1.03); }
.coachVertical { position: absolute; left: 14px; bottom: 16px; writing-mode: vertical-rl; transform: rotate(180deg); font-size: clamp(28px, 3.4vw, 56px); color: var(--white); opacity: 0.9; mix-blend-mode: screen; line-height: 1; }
.coachText { display: grid; gap: 4px; }
.coachName { font-family: var(--display); font-variation-settings: "wdth" 115; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; font-size: 15px; margin: 0; }
.coachDiscipline { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cyan); margin: 0; }
.coachLine { font-size: 14px; line-height: 1.5; color: var(--white-soft); margin: 4px 0 0; }
.coachBio { font-size: 15px; line-height: 1.6; color: var(--white-soft); margin: 10px 0 0; }
```

- [ ] **Step 5: Mount, test, lint, browser, commit**

In `page.tsx` add `<Coaches />` after `<Week />`.

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean.

Browser at 1440: four columns, vertical first names, hover one and the action shot fades in. Screenshot with one column hovered.

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): coaches roster with hover cross-fade

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Membership slider and join flow

**Files:**
- Create: `src/app/demo/threshold/Membership.tsx`, `JoinFlow.tsx`
- Modify: `threshold.module.css` (append), `page.tsx` (mount `<Membership />`), `layout.tsx` (mount `<JoinFlow />` next to `<BookDrawer />`)
- Test: `src/app/demo/threshold/Membership.test.tsx`

**Interfaces:**
- Consumes: `LEVELS`, `priceFor`, `type Billing` from `./content`; `useBooking` (`membership`, `join`, `joinOpen`, `setJoinOpen`); `nextClass`, `DAYS_LONG` from `./timetable`; `programmeById`; `useNow`; `Reveal`, `Counter` not needed here (price uses its own tween).
- Produces:
  ```tsx
  export default function Membership(props: { standalone?: boolean }): JSX.Element;  // section id #membership
  export default function JoinFlow(): JSX.Element;  // dialog; three steps; reads joinOpen
  export function useTween(target: number, ms?: number): number;  // in Membership.tsx, exported for the test
  ```
- `Membership` keeps `levelIndex` and `billing` in state. The join flow needs them, so `Membership` writes the chosen pair into a small module-level store: `export const chosen = { levelIndex: 2, billing: "monthly" as Billing }` mutated on change, read by `JoinFlow` when it opens. (Simple, and the flow never opens without the section having rendered first; the rail's Join button opens with the defaults.)

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/demo/threshold/Membership.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import Membership from "./Membership";
import JoinFlow from "./JoinFlow";
import { BookingProvider } from "./BookingProvider";
import { LEVELS, priceFor } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} })); // reduced motion: price shows instantly
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { cb(performance.now() + 5000); return 1; });
});

const ui = () => render(<BookingProvider><Membership /><JoinFlow /></BookingProvider>);

describe("Membership", () => {
  it("prices the slider live and toggles billing", () => {
    ui();
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "4" } });
    expect(screen.getByTestId("price")).toHaveTextContent(`£${LEVELS[4].monthly}`);
    expect(screen.getByText(LEVELS[4].label)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Annual/ }));
    expect(screen.getByTestId("price")).toHaveTextContent(`£${priceFor(4, "annual").perMonth}`);
    expect(screen.getByTestId("saving")).toHaveTextContent(`£${priceFor(4, "annual").saving}`);
  });

  it("joins through three steps", () => {
    ui();
    fireEvent.click(screen.getByRole("button", { name: /Join at this level/ }));
    const d = screen.getByRole("dialog");
    expect(within(d).getByText(/Step 1/)).toBeInTheDocument();
    fireEvent.click(within(d).getByRole("button", { name: /Continue/ }));
    fireEvent.change(within(d).getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(within(d).getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.change(within(d).getByLabelText("Start date"), { target: { value: "2026-10-01" } });
    fireEvent.click(within(d).getByRole("button", { name: /Join/ }));
    expect(within(d).getByText(/Welcome/)).toBeInTheDocument();
    expect(localStorage.getItem("threshold.membership")).toContain("ada@x.com");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/Membership.test.tsx`
Expected: FAIL, cannot resolve `./Membership`.

- [ ] **Step 3: Write Membership.tsx**

```tsx
// src/app/demo/threshold/Membership.tsx
"use client";

import { useEffect, useState } from "react";
import { LEVELS, priceFor, type Billing } from "./content";
import { useBooking } from "./BookingProvider";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Reveal, Magnetic } from "./motion";
import s from "./threshold.module.css";

/* The level the visitor last chose; JoinFlow reads it when it opens. */
export const chosen: { levelIndex: number; billing: Billing } = { levelIndex: 2, billing: "monthly" };

/** Tweens towards `target` over `ms`; jumps under reduced motion. */
export function useTween(target: number, ms = 500): number {
  const reduced = useMediaQuery(REDUCED);
  const [v, setV] = useState(target);
  useEffect(() => {
    if (reduced) { const id = requestAnimationFrame(() => setV(target)); return () => cancelAnimationFrame(id); }
    let raf = 0;
    const from = v;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, ms, reduced]);
  return v;
}

export default function Membership({ standalone = false }: { standalone?: boolean }) {
  const [levelIndex, setLevel] = useState(chosen.levelIndex);
  const [billing, setBilling] = useState<Billing>(chosen.billing);
  const { setJoinOpen, membership } = useBooking();
  const price = priceFor(levelIndex, billing);
  const shown = useTween(price.perMonth);

  const pick = (i: number) => { setLevel(i); chosen.levelIndex = i; };
  const bill = (b: Billing) => { setBilling(b); chosen.billing = b; };

  return (
    <section id="membership" className={`${s.onFrost} ${s.membership}`} data-standalone={standalone}>
      <Reveal>
        <p className={s.eyebrow}>Membership</p>
        <h2 className={`${s.display} ${s.h2}`}>Pick how often</h2>
        <p className={s.memberLine}>One price, no joining fee, cancel with a month's notice. Move the slider and the number moves with it.</p>
      </Reveal>

      <Reveal className={s.sliderCard} delay={120}>
        <div className={s.billing} role="group" aria-label="Billing">
          <button type="button" data-on={billing === "monthly"} onClick={() => bill("monthly")}>Monthly</button>
          <button type="button" data-on={billing === "annual"} onClick={() => bill("annual")}>Annual</button>
        </div>

        <p className={`${s.display} ${s.price}`}>
          <span data-testid="price">£{shown}</span>
          <small>a month</small>
        </p>
        <p className={s.levelLabel}>{LEVELS[levelIndex].label}</p>

        <input
          type="range" min={0} max={LEVELS.length - 1} step={1} value={levelIndex}
          aria-label="Sessions a week" aria-valuetext={LEVELS[levelIndex].label}
          onChange={(e) => pick(Number(e.target.value))} className={s.range}
          style={{ "--v": levelIndex / (LEVELS.length - 1) } as React.CSSProperties}
        />
        <div className={s.ticks} aria-hidden="true">
          {LEVELS.map((l, i) => <span key={l.label} data-on={i <= levelIndex}>{l.sessions === "unlimited" ? "∞" : l.sessions}</span>)}
        </div>

        <p className={s.saving} data-testid="saving">
          {billing === "annual" ? `£${price.perYear} a year, saving £${price.saving}` : `£${price.perYear} over a year. Annual saves two months.`}
        </p>

        <Magnetic>
          <button type="button" className={s.pill} onClick={() => setJoinOpen(true)}>
            {membership ? "Change my level" : "Join at this level"}
          </button>
        </Magnetic>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Write JoinFlow.tsx**

```tsx
// src/app/demo/threshold/JoinFlow.tsx
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LEVELS, priceFor, programmeById, type Billing } from "./content";
import { nextClass, DAYS_LONG } from "./timetable";
import { useBooking } from "./BookingProvider";
import { useNow } from "./Rail";
import { chosen } from "./Membership";
import s from "./threshold.module.css";

export default function JoinFlow() {
  const { joinOpen, setJoinOpen, join, membership } = useBooking();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [levelIndex, setLevel] = useState(chosen.levelIndex);
  const [billing, setBilling] = useState<Billing>(chosen.billing);
  const now = useNow();

  useEffect(() => {
    if (!joinOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setJoinOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [joinOpen, setJoinOpen]);

  if (!joinOpen) return null;
  const price = priceFor(levelIndex, billing);
  const close = () => { setJoinOpen(false); setStep(1); };
  const open = () => { setLevel(chosen.levelIndex); setBilling(chosen.billing); };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    join({ levelIndex, billing, name: String(f.get("name")), email: String(f.get("email")), start: String(f.get("start")) });
    setStep(3);
  };
  const first = now ? nextClass(now) : null;

  return (
    <div className={s.scrim} onClick={close}>
      <aside role="dialog" aria-modal="true" aria-labelledby="jf-title" className={s.drawer} onClick={(e) => e.stopPropagation()} onAnimationStart={open}>
        <button type="button" className={s.drawerClose} onClick={close} aria-label="Close">Close</button>
        <p className={s.eyebrow}>Step {step} of 3</p>

        {step === 1 && (
          <>
            <h2 id="jf-title" className={`${s.display} ${s.drawerTitle}`}>{LEVELS[levelIndex].label}</h2>
            <p className={s.drawerMeta}>£{price.perMonth} a month, billed {billing}. {billing === "annual" ? `You save £${price.saving}.` : "Switch to annual to save two months."}</p>
            <div className={s.stepLevels}>
              {LEVELS.map((l, i) => (
                <button key={l.label} type="button" data-on={i === levelIndex} onClick={() => setLevel(i)}>{l.label}<b>£{priceFor(i, billing).perMonth}</b></button>
              ))}
            </div>
            <div className={s.billing} role="group" aria-label="Billing">
              <button type="button" data-on={billing === "monthly"} onClick={() => setBilling("monthly")}>Monthly</button>
              <button type="button" data-on={billing === "annual"} onClick={() => setBilling("annual")}>Annual</button>
            </div>
            <button type="button" className={s.pill} onClick={() => setStep(2)}>Continue</button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={submit} className={s.drawerForm}>
            <h2 id="jf-title" className={`${s.display} ${s.drawerTitle}`}>About you</h2>
            <label>Name<input name="name" required autoComplete="name" defaultValue={membership?.name} /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" defaultValue={membership?.email} /></label>
            <label>Start date<input name="start" type="date" required /></label>
            <button type="submit" className={s.pill}>Join</button>
          </form>
        )}

        {step === 3 && (
          <div className={s.drawerDone}>
            <h2 id="jf-title" className={`${s.display} ${s.drawerDoneMark}`}>Welcome in</h2>
            <p>{LEVELS[levelIndex].label}, £{price.perMonth} a month. Nothing is charged until your start date.</p>
            {first && <p>Your first session could be {programmeById(first.programme).name}, {DAYS_LONG[first.day]} {first.time}.</p>}
            <button type="button" className={s.pill} onClick={close}>Done</button>
          </div>
        )}
      </aside>
    </div>
  );
}
```

- [ ] **Step 5: Append the styles**

```css
/* == Membership == */
.membership { padding: clamp(80px, 12vh, 160px) var(--gutter); display: grid; gap: 40px; grid-template-columns: 1fr; align-items: start; }
@media (min-width: 1000px) { .membership { grid-template-columns: 1fr 1.1fr; gap: 64px; } }
.memberLine { font-size: 17px; line-height: 1.5; color: var(--ink-soft); max-width: 44ch; margin: 18px 0 0; }
.sliderCard { background: var(--navy); color: var(--white); border-radius: 22px; padding: clamp(24px, 3vw, 40px); display: grid; gap: 18px; position: relative; overflow: hidden; }
.sliderCard::before { content: ""; position: absolute; inset: -40%; background: radial-gradient(40% 40% at 10% 90%, var(--glow-m), transparent 70%), radial-gradient(40% 40% at 95% 10%, var(--glow-c), transparent 70%); opacity: 0.35; pointer-events: none; }
.sliderCard > * { position: relative; }
.billing { display: inline-flex; border: 1px solid var(--hair-navy); border-radius: 999px; padding: 3px; gap: 2px; justify-self: start; }
.billing button { height: 34px; padding: 0 16px; border-radius: 999px; border: 0; background: transparent; color: var(--white-soft); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
.billing button[data-on="true"] { background: var(--white); color: var(--navy); }
.price { font-size: clamp(64px, 8vw, 120px); line-height: 1; margin: 8px 0 0; display: flex; align-items: baseline; gap: 12px; font-variant-numeric: tabular-nums; }
.price small { font-family: var(--sans); font-size: 14px; font-weight: 500; text-transform: none; letter-spacing: 0; color: var(--white-mute); }
.levelLabel { margin: 0; font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cyan); }
.range { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px; background: linear-gradient(90deg, var(--magenta) 0%, var(--cyan) calc(var(--v) * 100%), rgba(255, 255, 255, 0.16) calc(var(--v) * 100%)); outline: none; }
.range::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: var(--white); border: 0; box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.12); cursor: grab; }
.range::-moz-range-thumb { width: 28px; height: 28px; border-radius: 50%; background: var(--white); border: 0; }
.range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px var(--cyan); }
.ticks { display: flex; justify-content: space-between; font-size: 12px; color: var(--white-mute); padding: 0 8px; }
.ticks span[data-on="true"] { color: var(--white); }
.saving { margin: 0; font-size: 14px; color: var(--white-soft); }
.stepLevels { display: grid; gap: 8px; }
.stepLevels button { display: flex; justify-content: space-between; align-items: center; height: 52px; padding: 0 16px; border-radius: 12px; border: 1px solid var(--hair-navy); background: transparent; color: var(--white); font: inherit; }
.stepLevels button[data-on="true"] { border-color: var(--cyan); background: rgba(46, 230, 255, 0.08); }
.stepLevels b { font-variant-numeric: tabular-nums; }
```

- [ ] **Step 6: Mount, test, lint, browser, commit**

`page.tsx`: add `<Membership />` after `<Coaches />`. `layout.tsx`: add `<JoinFlow />` after `<BookDrawer />`.

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean. If `react-hooks/exhaustive-deps` complains about `useTween`, keep the disable comment; if `set-state-in-effect` complains, the rAF wrapper is the fix (state is set inside the frame callback, not the effect body).

Browser at 1440: drag the slider; the price tweens between values and the track fills magenta to cyan. Toggle Annual; the saving line updates. Click Join at this level, step through, confirm; reload and the button reads "Change my level". Screenshot the card and the third step.

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): membership slider with live pricing and a three-step join flow

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: The space gallery and the finished home page

**Files:**
- Create: `src/app/demo/threshold/Space.tsx`
- Modify: `threshold.module.css` (append), `page.tsx` (mount; final order)
- Test: `src/app/demo/threshold/Space.test.tsx`

**Interfaces:**
- Consumes: `SPACE`, `COPY` from `./content`; `useMediaQuery`, `REDUCED`.
- Produces: `export default function Space(): JSX.Element;` section id `#space`.

Parallax: a scroll listener writes `--sy` (the section's centre offset from the viewport centre, −1..1) and the three images translate by `calc(var(--sy) * -N px)` with N = 40, 70, 40. Reduced motion or narrow screens: no listener, no translate.

- [ ] **Step 1: Write the failing test**

```tsx
// src/app/demo/threshold/Space.test.tsx
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Space from "./Space";
import { SPACE, COPY } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Space", () => {
  it("renders the three photographs and the line about the building", () => {
    render(<Space />);
    for (const p of SPACE) expect(screen.getByAltText(p.alt)).toBeInTheDocument();
    expect(screen.getByText(COPY.spaceLine)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/app/demo/threshold/Space.test.tsx`
Expected: FAIL, cannot resolve `./Space`.

- [ ] **Step 3: Write Space.tsx**

```tsx
// src/app/demo/threshold/Space.tsx
"use client";

import { useEffect, useRef } from "react";
import { SPACE, COPY } from "./content";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Reveal } from "./motion";
import s from "./threshold.module.css";

export default function Space() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED);
  const wide = useMediaQuery("(min-width: 900px)");
  const live = wide && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const centre = r.top + r.height / 2 - window.innerHeight / 2;
      const sy = Math.max(-1, Math.min(1, centre / window.innerHeight));
      el.style.setProperty("--sy", sy.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [live]);

  return (
    <section id="space" ref={ref} className={`${s.onFrost} ${s.space}`} data-live={live}>
      <Reveal className={s.spaceHead}>
        <p className={s.eyebrow}>The space</p>
        <h2 className={`${s.display} ${s.h2}`}>A print works, levelled</h2>
        <p className={s.spaceLine}>{COPY.spaceLine}</p>
      </Reveal>
      <div className={s.spaceGrid}>
        {SPACE.map((p, i) => (
          <Reveal key={p.src} delay={i * 120} className={s.spaceCell}>
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Append the styles**

```css
/* == Space == */
.space { --sy: 0; padding: clamp(80px, 12vh, 160px) var(--gutter); display: grid; gap: 48px; }
.spaceHead { display: grid; gap: 10px; }
.spaceLine { font-size: 17px; line-height: 1.55; color: var(--ink-soft); max-width: 56ch; margin: 12px 0 0; }
.spaceGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 900px) { .spaceGrid { grid-template-columns: 1.2fr 1fr 1fr; align-items: start; } }
.spaceCell { border-radius: 18px; overflow: hidden; background: var(--frost-2); aspect-ratio: 16 / 10; }
.spaceCell img { width: 100%; height: 100%; object-fit: cover; display: block; transform: translateY(calc(var(--sy) * -40px)) scale(1.08); transition: transform 200ms linear; }
.spaceCell:nth-child(2) img { transform: translateY(calc(var(--sy) * -70px)) scale(1.08); }
.space[data-live="false"] .spaceCell img { transform: none; }
```

- [ ] **Step 5: Final home page order**

`page.tsx` must render, in order: `<Hero />`, `<Manifesto />`, `<ProgrammesRail />`, `<Week />`, `<Coaches />`, `<Membership />`, `<Space />`. The footer, rail, nav, drawer and join flow come from the layout.

- [ ] **Step 6: Test, lint, browser, commit**

Run: `npx vitest run src/app/demo/threshold/ && npx eslint src/app/demo/threshold`
Expected: PASS; clean.

Browser at 1440: scroll the whole home page top to bottom; every rail dot links to its section; no warm colour anywhere; no console errors (`read_console_messages`). Screenshot the space section mid-scroll.

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): the space gallery; home page complete

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: The four sub-pages

**Files:**
- Create: `src/app/demo/threshold/timetable/page.tsx`, `membership/page.tsx`, `coaches/page.tsx`, `about/page.tsx`
- Modify: `threshold.module.css` (append page-head styles)

**Interfaces:**
- Consumes: `Week`, `Membership`, `Coaches`, `Space`; `COPY`, `FIGURES`, `PROGRAMMES`, `type ProgrammeId` from `./content`/`./timetable`; `Reveal`, `Counter`.
- Each page is a server component that renders a `.pageHead` (eyebrow + display h1 on navy) and then the shared section. `/timetable` reads `searchParams.programme` and passes it to `Week` as `programme` when it is a valid `ProgrammeId`.

Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` first: in this Next, `searchParams` is a Promise and the page must `await` it.

- [ ] **Step 1: Write the pages**

```tsx
// src/app/demo/threshold/timetable/page.tsx
import type { Metadata } from "next";
import Week from "../Week";
import { PROGRAMMES } from "../content";
import type { ProgrammeId } from "../timetable";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "This week — Threshold | WebMinor Concept" } };

export default async function TimetablePage({ searchParams }: { searchParams: Promise<{ programme?: string }> }) {
  const { programme } = await searchParams;
  const valid = PROGRAMMES.some((p) => p.id === programme) ? (programme as ProgrammeId) : undefined;
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>Timetable</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>This week</h1>
        <p className={s.pageLine}>Every session, every day. Book a place, or take the waitlist on a full one.</p>
      </header>
      <Week full programme={valid} />
    </main>
  );
}
```

```tsx
// src/app/demo/threshold/membership/page.tsx
import type { Metadata } from "next";
import Membership from "../Membership";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "Membership — Threshold | WebMinor Concept" } };

export default function MembershipPage() {
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>Membership</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>One slider</h1>
        <p className={s.pageLine}>Sessions a week, that's the only choice. Coaching, the open floor and the mobility sessions are in every level.</p>
      </header>
      <Membership standalone />
    </main>
  );
}
```

```tsx
// src/app/demo/threshold/coaches/page.tsx
import type { Metadata } from "next";
import Coaches from "../Coaches";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "Coaches — Threshold | WebMinor Concept" } };

export default function CoachesPage() {
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>Coaches</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>Four people</h1>
        <p className={s.pageLine}>No rota, no cover. The person on the timetable is the person in the room.</p>
      </header>
      <Coaches long />
    </main>
  );
}
```

```tsx
// src/app/demo/threshold/about/page.tsx
import type { Metadata } from "next";
import Space from "../Space";
import { COPY, FIGURES } from "../content";
import { Reveal, Counter } from "../motion";
import s from "../threshold.module.css";

export const metadata: Metadata = { title: { absolute: "About — Threshold | WebMinor Concept" } };

export default function AboutPage() {
  return (
    <main>
      <header className={`${s.onNavy} ${s.pageHead}`}>
        <p className={s.eyebrow}>About</p>
        <h1 className={`${s.display} ${s.pageTitle}`}>The line at the door</h1>
        <p className={s.pageLine}>{COPY.heroLine}</p>
      </header>
      <section className={`${s.onFrost} ${s.about}`}>
        <Reveal className={s.aboutBody}>
          <p className={`${s.display} ${s.manifestoLead}`}>{COPY.manifesto[0]}</p>
          <p className={s.manifestoLine}>{COPY.manifesto[1]}</p>
          <p className={s.manifestoLine}>{COPY.manifesto[2]}</p>
          <p className={s.manifestoLine}>Marek Nowak took the lease in 2016 with one rack and a plan for four members. The bar across the door came from the first rig he built; when he replaced it he set the old one in the floor. Everyone steps over it on the way in, which is where the name comes from.</p>
        </Reveal>
        <Reveal className={s.figures} delay={200}>
          <div><Counter value={FIGURES.years} className={s.figure} /><span>years open</span></div>
          <div><Counter value={FIGURES.coaches} className={s.figure} /><span>coaches</span></div>
          <div><Counter value={FIGURES.sessionsAWeek} className={s.figure} /><span>sessions a week</span></div>
        </Reveal>
      </section>
      <Space />
    </main>
  );
}
```

- [ ] **Step 2: Append the styles**

```css
/* == Sub-pages == */
.pageHead { padding: clamp(140px, 22vh, 220px) var(--gutter) clamp(56px, 8vh, 96px); display: grid; gap: 14px; position: relative; overflow: hidden; }
.pageHead::before { content: ""; position: absolute; inset: 0; background: radial-gradient(50% 60% at 0% 100%, var(--glow-m), transparent 70%), radial-gradient(50% 60% at 100% 0%, var(--glow-c), transparent 70%); opacity: 0.35; pointer-events: none; }
.pageHead > * { position: relative; }
.pageTitle { font-size: clamp(48px, 9vw, 140px); margin: 0; }
.pageLine { font-size: 17px; line-height: 1.5; color: var(--white-soft); max-width: 48ch; margin: 8px 0 0; }
.about { padding: clamp(80px, 12vh, 160px) var(--gutter); display: grid; gap: 48px; }
.aboutBody { display: grid; gap: 20px; max-width: 64ch; }
.week[data-full="true"] { min-height: 80vh; }
.membership[data-standalone="true"] { min-height: 70vh; }
```

- [ ] **Step 3: Lint, build check, browser, commit**

Run: `npx eslint src/app/demo/threshold && npx tsc --noEmit -p tsconfig.json 2>&1 | grep threshold || echo "types clean"`
Expected: no lint errors; no type errors in the folder.

Browser: visit all four routes and `/demo/threshold/timetable?programme=mobility` (only mobility rows show, filter pill lit). Every nav link lands on its page with the active link highlighted. Screenshot `/timetable` and `/about`.

```bash
git add src/app/demo/threshold
git commit -m "feat(threshold): timetable, membership, coaches and about pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Work-page entry

**Files:**
- Modify: `src/app/case-studies/page.tsx` (the `conceptBuilds` array, insert as the first entry, before Boucher)
- Test: existing `src/data/case-studies.test.ts` still passes; add nothing.

**Interfaces:**
- Consumes: the `WorkEntry` shape already in that file.

- [ ] **Step 1: Insert the entry**

At the top of `conceptBuilds`, before the Boucher object:

```ts
  {
    name: "Threshold",
    href: "/demo/threshold",
    external: true,
    disciplines: "Fitness · Strength studio",
    summary:
      "A coached strength studio in cold dual light: the athlete threads through the wordmark, the week is a wall of giant times you can book into, and membership is one slider that prices as it moves.",
    image: "/work/covers/threshold.webp",
    alt: "Threshold cover — the athlete sprinting out of the set position through magenta and cyan haze",
    tag: "Concept",
    spec: [
      { term: "Scope", value: "Brand · UI · Motion · Booking" },
      { term: "Status", value: "Live demo" },
    ],
    cta: "View the build",
  },
```

- [ ] **Step 2: Check the count and the sitemap test**

Run: `npx vitest run src/data && npx eslint src/app/case-studies`
Expected: PASS; clean.

Browser: `/case-studies` now reads "Nine brands, built end to end." and the first card is Threshold with the cold cover. Screenshot the top of the page. The cover must look like it belongs in the row while being the only cold one.

- [ ] **Step 3: Commit**

```bash
git add src/app/case-studies/page.tsx
git commit -m "feat(work): list Threshold as the ninth concept build

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 15: Verification pass

**Files:** none new unless a fix is needed. Fixes are committed as `fix(threshold): …`.

- [ ] **Step 1: Whole suite and lint**

Run: `npm test && npx eslint src/app/demo/threshold src/app/case-studies`
Expected: all green.

- [ ] **Step 2: Production build**

Run: `npx next build 2>&1 | tail -30`
Expected: builds; the five threshold routes appear in the route list. Any warning naming the folder gets fixed.

- [ ] **Step 3: Responsive pass**

With the preview open, use `resize_window` at 390, 768, 1280 and 1600 wide on `/demo/threshold`. At each width check: the athlete is inside the frame; no horizontal scroll (`javascript_tool`: `document.documentElement.scrollWidth <= window.innerWidth`); the rail or bottom bar is present; the wall rows do not overlap. Screenshot each.

- [ ] **Step 4: Reduced motion pass**

`javascript_tool` cannot toggle the media query; instead open `/demo/threshold` with Chrome's emulation via Puppeteer:

```bash
cat > /private/tmp/claude-501/-Users-adambutcher-Desktop-webminor/d3c48507-cbb9-4cf0-b217-06c13f62b12f/scratchpad/rm.mjs <<'JS'
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: true });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await p.goto("http://localhost:3000/demo/threshold", { waitUntil: "networkidle0" });
await p.screenshot({ path: "rm-hero.png" });
await p.evaluate(() => window.scrollTo(0, 2400));
await new Promise((r) => setTimeout(r, 600));
await p.screenshot({ path: "rm-mid.png" });
await b.close();
JS
cd /private/tmp/claude-501/-Users-adambutcher-Desktop-webminor/d3c48507-cbb9-4cf0-b217-06c13f62b12f/scratchpad && NODE_PATH=/Users/adambutcher/Desktop/webminor/.worktrees/scroll-world/node_modules node rm.mjs
```

Open both PNGs. Every section is fully visible with no element stuck at opacity 0.

- [ ] **Step 5: Console and network**

`read_console_messages` with `onlyErrors: true` on the home page and each sub-page: none. `read_network_requests` filtered on `/demo/threshold/`: every image 200, none over 1.2 MB.

- [ ] **Step 6: Award-tier visual review**

Take full-height screenshots of the home page at 1440 with Puppeteer (`fullPage: true`) and open them. Compare against the two references and against the spec section by section. The questions to answer honestly, in writing in the final report: does the hero read as the Limitless idea with the athlete through the word; is there a single warm pixel; does the site look like any of the other eight; is the type wide enough to read as a sports wordmark; does the motion feel alive without being busy. Fix anything that fails before calling the build done.

- [ ] **Step 7: Update memory and report**

Update `webminor-work-section-state.md` in the memory directory with a short Threshold entry (route, what is distinctive, asset names, anything that bit). Then report to Adam with the screenshots, the test output, and any known gaps.

---

## Self-review notes

- Spec coverage: hero (T7), manifesto (T8), programmes rail (T8), week wall + book (T9), coaches (T10), membership slider + join (T11), space (T12), footer/rail/nav (T6), sub-pages (T13), imagery + cover (T4), work entry (T14), tests/lint/responsive/reduced-motion/visual review (T15). Wordmark and favicon (T5).
- Type consistency: `Day`, `Session`, `ProgrammeId` from `timetable.ts`; `Billing`, `LEVELS`, `priceFor` from `content.ts`; `useNow` from `Rail.tsx`; `chosen` from `Membership.tsx`; `BookingValue` fields as named in T3. `Reveal` accepts `as="li"` (T5) and is used that way in T9 and T10.
- Known trade-off: `chosen` in `Membership.tsx` is a module-level object rather than provider state, to keep `BookingProvider` unaware of pricing. If the join flow opens from the rail before the section has rendered, it uses the defaults (three a week, monthly), which is the intended behaviour.

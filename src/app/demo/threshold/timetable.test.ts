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

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

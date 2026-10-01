import { describe, it, expect } from "vitest";
import { approach, smoothstep, seeded } from "./motion";

describe("motion helpers", () => {
  it("approach moves toward the target and never overshoots", () => {
    const v = approach(0, 10, 1 / 60, 8);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(10);
    expect(approach(0, 10, 10, 8)).toBeCloseTo(10, 3);
  });
  it("approach snaps when rate is infinite", () => {
    expect(approach(3, 7, 1 / 60, Infinity)).toBe(7);
  });
  it("smoothstep clamps and eases", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5);
  });
  it("seeded is deterministic and in range", () => {
    expect(seeded("patty-1", "rz")).toBe(seeded("patty-1", "rz"));
    for (const id of ["a", "b", "bun-top", "cheese-2"]) {
      const v = seeded(id, "rx");
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(seeded("a", "rz")).not.toBe(seeded("b", "rz"));
  });
});

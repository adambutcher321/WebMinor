import { describe, it, expect } from "vitest";
import { rowProgress, rowDrift, railState, rowPop } from "./work-motion-math";

const VH = 1000;

describe("rowProgress", () => {
  it("is 0 until the row's top reaches 90% of the viewport", () => {
    expect(rowProgress(1400, 600, VH)).toBe(0);
    expect(rowProgress(900, 600, VH)).toBe(0);
  });
  it("is 1 once the row's bottom has risen to 55% of the viewport", () => {
    expect(rowProgress(-50, 600, VH)).toBe(1);
    expect(rowProgress(-900, 600, VH)).toBe(1);
  });
  it("rises in a straight line between the two", () => {
    // travel runs from top=900 to top=-50: 950px
    expect(rowProgress(425, 600, VH)).toBeCloseTo(0.5, 5);
  });
  it("never divides by nothing", () => {
    expect(rowProgress(0, 0, 0)).toBe(0);
  });
});

describe("rowDrift", () => {
  it("is 0 when the row is centred, negative above, positive below, clamped", () => {
    expect(rowDrift(200, 600, VH)).toBe(0);
    expect(rowDrift(-300, 600, VH)).toBeLessThan(0);
    expect(rowDrift(700, 600, VH)).toBeGreaterThan(0);
    expect(rowDrift(9000, 600, VH)).toBe(1);
    expect(rowDrift(-9000, 600, VH)).toBe(-1);
  });
});

describe("railState", () => {
  it("is empty and on the first build before any row is read", () => {
    expect(railState([0, 0, 0])).toEqual({ filled: 0, active: 0 });
  });
  it("counts finished rows plus the one in progress", () => {
    const r = railState([1, 1, 0.4, 0]);
    expect(r.filled).toBeCloseTo(2.4);
    expect(r.active).toBe(2);
  });
  it("stays on the last build once everything is read", () => {
    expect(railState([1, 1, 1])).toEqual({ filled: 3, active: 2 });
  });
});

describe("rowPop", () => {
  it("is fully out around the middle of the viewport", () => {
    expect(rowPop(0)).toBe(1);
    expect(rowPop(0.1)).toBe(1);
    expect(rowPop(-0.12)).toBe(1);
  });
  it("is settled back once the row is well away from the middle", () => {
    expect(rowPop(0.62)).toBe(0);
    expect(rowPop(-1)).toBe(0);
  });
  it("eases between, the same either side", () => {
    expect(rowPop(0.37)).toBeCloseTo(0.5, 5);
    expect(rowPop(-0.37)).toBeCloseTo(rowPop(0.37), 10);
  });
});

import { describe, it, expect } from "vitest";
import { rowProgress, rowDrift } from "./work-motion-math";

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

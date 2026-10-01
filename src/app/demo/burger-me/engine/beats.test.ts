import { describe, it, expect } from "vitest";
import { heroBeat } from "./beats";

describe("heroBeat", () => {
  it("holds assembled for the first 15%", () => {
    expect(heroBeat(0).explode).toBe(0);
    expect(heroBeat(0.14).explode).toBe(0);
  });
  it("is fully apart through the label window", () => {
    expect(heroBeat(0.5).explode).toBeCloseTo(1);
    expect(heroBeat(0.55).labels).toBeCloseTo(1);
  });
  it("hides labels outside 45–65%", () => {
    expect(heroBeat(0.3).labels).toBe(0);
    expect(heroBeat(0.8).labels).toBe(0);
  });
  it("is rebuilt from 85%", () => {
    expect(heroBeat(0.86).explode).toBe(0);
    expect(heroBeat(1).explode).toBe(0);
  });
  it("never zooms aggressively", () => {
    for (let p = 0; p <= 1; p += 0.05) {
      const b = heroBeat(p);
      expect(b.scale).toBeGreaterThanOrEqual(1);
      expect(b.scale).toBeLessThanOrEqual(1.08);
    }
  });
});

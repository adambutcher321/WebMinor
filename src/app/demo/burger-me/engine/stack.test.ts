import { describe, it, expect } from "vitest";
import { layoutStack, stackHeight } from "./stack";
import type { LayerSpec } from "./burgers";

const dims = {
  "bun-top": { h: 300, seat: 40, cx: 0, depth: 0.9 },
  cheese: { h: 60, seat: 20, cx: 5, depth: 0.5 },
  "bun-bottom": { h: 200, seat: 0, cx: 0, depth: 0.2 },
} as const;
const stack: LayerSpec[] = [
  { id: "bun-top", type: "bun-top" },
  { id: "cheese-1", type: "cheese" },
  { id: "bun-bottom", type: "bun-bottom" },
];
const opts = { gap: 100, depth: 80, maxRot: 3 };

describe("layoutStack", () => {
  it("assembles bottom-up, each layer seated into the one below", () => {
    const p = layoutStack(stack, 0, opts, dims as never);
    const by = Object.fromEntries(p.map((l) => [l.id, l]));
    expect(by["bun-bottom"].y).toBe(0);
    expect(by["cheese-1"].y).toBe(200 - 20);
    expect(by["bun-top"].y).toBe(180 + 60 - 40);
    expect(by["bun-bottom"].index).toBe(0);
    expect(by["bun-top"].index).toBe(2);
  });
  it("explode adds an even gap per layer from the bottom", () => {
    const p0 = layoutStack(stack, 0, opts, dims as never);
    const p1 = layoutStack(stack, 1, opts, dims as never);
    p1.forEach((l, i) => expect(l.y - p0[i].y).toBeCloseTo(l.index * 100));
  });
  it("is flat and fully shadowed when assembled", () => {
    for (const l of layoutStack(stack, 0, opts, dims as never)) {
      // toBeCloseTo, not toBe: a negative seed times zero is -0, and toBe(0) uses Object.is.
      expect(l.rx).toBeCloseTo(0); expect(l.ry).toBeCloseTo(0); expect(l.rz).toBeCloseTo(0); expect(l.z).toBeCloseTo(0);
      expect(l.shadow).toBe(1);
    }
  });
  it("keeps rotations within maxRot and fades contact shadows when apart", () => {
    for (const l of layoutStack(stack, 1, opts, dims as never)) {
      expect(Math.abs(l.rz)).toBeLessThanOrEqual(3);
      expect(Math.abs(l.rx)).toBeLessThanOrEqual(3);
      if (l.index > 0) expect(l.shadow).toBeLessThan(0.25);
    }
  });
  it("stackHeight grows with explode", () => {
    expect(stackHeight(stack, 1, opts, dims as never)).toBeGreaterThan(stackHeight(stack, 0, opts, dims as never));
  });
});

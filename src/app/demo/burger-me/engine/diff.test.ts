import { describe, it, expect } from "vitest";
import { diffStacks } from "./diff";
import { bySlug } from "./burgers";

describe("diffStacks", () => {
  it("Original → Bacon Cheese adds only bacon", () => {
    const d = diffStacks(bySlug("the-original")!.stack, bySlug("bacon-cheese")!.stack);
    expect(d.get("bacon")).toBe("entering");
    expect([...d.values()].filter((c) => c !== "unchanged")).toEqual(["entering"]);
  });
  it("Original → Hot Honey swaps pickles for jalapeños", () => {
    const d = diffStacks(bySlug("the-original")!.stack, bySlug("hot-honey")!.stack);
    expect(d.get("pickles")).toBe("exiting");
    expect(d.get("jalapenos")).toBe("entering");
    expect(d.get("patty-1")).toBe("unchanged");
  });
  it("flags a reorder as moved", () => {
    const a = [{ id: "x", type: "onion" as const }, { id: "y", type: "pickles" as const }];
    const b = [{ id: "y", type: "pickles" as const }, { id: "x", type: "onion" as const }];
    const d = diffStacks(a, b);
    expect(new Set([d.get("x"), d.get("y")])).toContain("moved");
  });
  it("identical stacks are all unchanged", () => {
    const s = bySlug("smokehouse")!.stack;
    expect([...diffStacks(s, s).values()].every((c) => c === "unchanged")).toBe(true);
  });
});

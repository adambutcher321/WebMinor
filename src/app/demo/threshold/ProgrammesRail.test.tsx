import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import ProgrammesRail from "./ProgrammesRail";
import { PROGRAMMES } from "./content";

const WIDE = "(min-width: 900px)";
const REDUCE = "(prefers-reduced-motion: reduce)";

function stubMatchMedia(overrides: Record<string, boolean>) {
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: overrides[q] ?? false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
  }));
}

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
});

afterEach(() => {
  cleanup();
});

describe("ProgrammesRail", () => {
  beforeEach(() => stubMatchMedia({}));

  it("renders one card per programme with its days", () => {
    render(<ProgrammesRail />);
    for (const p of PROGRAMMES) {
      // Scoped to the card: two programmes (Strength, Conditioning) share the
      // literal days string "Mon to Sat", so an unscoped screen.getByText
      // matches both and throws. Each card is otherwise identified uniquely
      // by its programme name heading.
      const card = screen.getByRole("heading", { name: p.name }).closest("li")!;
      expect(within(card).getByText(p.days)).toBeInTheDocument();
    }
    expect(screen.getAllByRole("img")).toHaveLength(PROGRAMMES.length);
  });
});

/*
  These cover the scroll maths ProgrammesRail's effect writes as CSS custom
  properties -- the translateX sign and the span calculation, both easy to
  get backwards. jsdom does no layout, so `clientWidth`/`scrollWidth`/
  `offsetHeight` and `getBoundingClientRect` are stubbed to fixed values
  below; the exact numbers only matter relative to each other and to the
  assertions.
*/
describe("ProgrammesRail scroll maths (pinned)", () => {
  const GUTTER = 40;
  const CLIENT_WIDTH = 1000;
  const SCROLL_WIDTH = 2400;
  const SPAN = SCROLL_WIDTH - CLIENT_WIDTH + 2 * GUTTER; // 1480
  const INNER_HEIGHT = 800;
  const OFFSET_HEIGHT = INNER_HEIGHT + SPAN; // total scroll distance === SPAN

  let rectTop: number;

  beforeEach(() => {
    rectTop = 0;
    stubMatchMedia({ [WIDE]: true, [REDUCE]: false });
    vi.stubGlobal("innerHeight", INNER_HEIGHT);
    vi.spyOn(window, "getComputedStyle").mockReturnValue({ paddingLeft: `${GUTTER}px` } as CSSStyleDeclaration);
    vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(CLIENT_WIDTH);
    vi.spyOn(Element.prototype, "scrollWidth", "get").mockReturnValue(SCROLL_WIDTH);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(OFFSET_HEIGHT);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      () => ({ top: rectTop, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes --span from scrollWidth, clientWidth and twice the gutter", () => {
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;
    expect(outer.style.getPropertyValue("--span")).toBe(`${SPAN}px`);
  });

  it("clamps --span at 0 when the track already fits the sticky panel", () => {
    vi.spyOn(Element.prototype, "scrollWidth", "get").mockReturnValue(500); // narrower than clientWidth
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;
    expect(outer.style.getPropertyValue("--span")).toBe("0px");
  });

  it("writes --x as 0 before the section, 1 after it, and the exact fraction between", () => {
    const total = OFFSET_HEIGHT - INNER_HEIGHT; // === SPAN, by construction above
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;

    rectTop = 0; // section's own top at the viewport's top edge -> not yet scrolled into the pin
    window.dispatchEvent(new Event("scroll"));
    expect(outer.style.getPropertyValue("--x")).toBe("0.0000");

    rectTop = -total / 4; // a quarter through the pin range
    window.dispatchEvent(new Event("scroll"));
    expect(outer.style.getPropertyValue("--x")).toBe("0.2500");

    rectTop = -total; // scrolled exactly through the whole pin range
    window.dispatchEvent(new Event("scroll"));
    expect(outer.style.getPropertyValue("--x")).toBe("1.0000");
  });

  it("writes --shift as the negative pixel offset -x * span (this is what actually moves the track)", () => {
    const total = OFFSET_HEIGHT - INNER_HEIGHT;
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;

    rectTop = -total / 4; // x = 0.25
    window.dispatchEvent(new Event("scroll"));
    expect(outer.style.getPropertyValue("--shift")).toBe(`${(-0.25 * SPAN).toFixed(2)}px`);

    rectTop = -total; // x = 1: fully shifted left by the whole span
    window.dispatchEvent(new Event("scroll"));
    expect(outer.style.getPropertyValue("--shift")).toBe(`${(-SPAN).toFixed(2)}px`);
  });

  it("re-measures --span (and refreshes --x/--shift) on resize", () => {
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;
    const before = outer.style.getPropertyValue("--span");

    const widerScrollWidth = SCROLL_WIDTH + 400;
    vi.spyOn(Element.prototype, "scrollWidth", "get").mockReturnValue(widerScrollWidth);
    window.dispatchEvent(new Event("resize"));

    const after = outer.style.getPropertyValue("--span");
    expect(after).toBe(`${widerScrollWidth - CLIENT_WIDTH + 2 * GUTTER}px`);
    expect(after).not.toBe(before);
  });

  it("removes its scroll and resize listeners on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ProgrammesRail />);

    const scrollHandler = addSpy.mock.calls.find(([type]) => type === "scroll")?.[1];
    const resizeHandler = addSpy.mock.calls.find(([type]) => type === "resize")?.[1];
    expect(scrollHandler).toBeDefined();
    expect(resizeHandler).toBeDefined();

    unmount();

    expect(removeSpy.mock.calls.some(([type, fn]) => type === "scroll" && fn === scrollHandler)).toBe(true);
    expect(removeSpy.mock.calls.some(([type, fn]) => type === "resize" && fn === resizeHandler)).toBe(true);
  });
});

describe("ProgrammesRail scroll maths (not pinned)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes no --x/--span/--shift and attaches no scroll listener under reduced motion", () => {
    stubMatchMedia({ [WIDE]: true, [REDUCE]: true });
    const addSpy = vi.spyOn(window, "addEventListener");
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;
    expect(outer.style.getPropertyValue("--x")).toBe("");
    expect(outer.style.getPropertyValue("--span")).toBe("");
    expect(outer.style.getPropertyValue("--shift")).toBe("");
    expect(addSpy.mock.calls.some(([type]) => type === "scroll")).toBe(false);
  });

  it("writes no --x/--span/--shift and attaches no scroll listener below the pin breakpoint", () => {
    stubMatchMedia({ [WIDE]: false, [REDUCE]: false });
    const addSpy = vi.spyOn(window, "addEventListener");
    const { container } = render(<ProgrammesRail />);
    const outer = container.querySelector("section")!;
    expect(outer.style.getPropertyValue("--x")).toBe("");
    expect(outer.style.getPropertyValue("--span")).toBe("");
    expect(outer.style.getPropertyValue("--shift")).toBe("");
    expect(addSpy.mock.calls.some(([type]) => type === "scroll")).toBe(false);
  });
});

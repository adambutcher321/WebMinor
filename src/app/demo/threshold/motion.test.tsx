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

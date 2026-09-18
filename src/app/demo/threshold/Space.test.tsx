import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Space from "./Space";
import { SPACE, COPY } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Space", () => {
  it("renders the three photographs and the line about the building", () => {
    render(<Space />);
    for (const p of SPACE) expect(screen.getByAltText(p.alt)).toBeInTheDocument();
    expect(screen.getByText(COPY.spaceLine)).toBeInTheDocument();
  });
});

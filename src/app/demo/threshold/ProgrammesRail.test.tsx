import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ProgrammesRail from "./ProgrammesRail";
import { PROGRAMMES } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("ProgrammesRail", () => {
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

import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Coaches from "./Coaches";
import { COACHES } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Coaches", () => {
  it("renders a portrait and a hidden action shot per coach", () => {
    render(<Coaches />);
    for (const c of COACHES) {
      expect(screen.getByRole("heading", { name: c.name })).toBeInTheDocument();
      expect(screen.getByAltText(`${c.name}, ${c.discipline} coach`)).toBeInTheDocument();
    }
    expect(screen.getAllByTestId("action")).toHaveLength(COACHES.length);
    expect(screen.queryByText(COACHES[0].bio)).toBeNull();
  });
  it("shows the bio in long mode", () => {
    render(<Coaches long />);
    expect(screen.getByText(COACHES[0].bio)).toBeInTheDocument();
  });
});

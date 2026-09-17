import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { BookingProvider } from "./BookingProvider";

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Hero", () => {
  it("has a real heading and nine decorative letters", () => {
    render(<BookingProvider><Hero /></BookingProvider>);
    expect(screen.getByRole("heading", { level: 1, name: "Threshold" })).toBeInTheDocument();
    expect(screen.getAllByTestId("letter")).toHaveLength(9);
  });
  it("renders the strip placeholder before the clock ticks", () => {
    render(<BookingProvider><Hero /></BookingProvider>);
    expect(screen.getByTestId("strip")).toHaveTextContent("Next class");
  });
});

import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Rail from "./Rail";
import { BookingProvider } from "./BookingProvider";

beforeAll(() => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

describe("Rail", () => {
  it("shows a countdown and the next class name after the clock ticks", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T06:00:00")); // a Monday, 30 min before 06:30 Strength
    render(<BookingProvider><Rail /></BookingProvider>);
    expect(screen.getByTestId("countdown")).toHaveTextContent("--:--");
    await act(async () => { vi.advanceTimersByTime(20); });
    expect(screen.getByTestId("countdown")).toHaveTextContent("00:30");
    expect(screen.getByTestId("next-name")).toHaveTextContent("Strength");
    vi.useRealTimers();
  });
});

import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Week from "./Week";
import BookDrawer from "./BookDrawer";
import { BookingProvider } from "./BookingProvider";
import { sessionsOn } from "./timetable";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

const ui = (props = {}) => render(
  <BookingProvider><Week initialDay={0} {...props} /><BookDrawer /></BookingProvider>,
);

describe("Week", () => {
  it("shows Monday's sessions and switches day on tab click", () => {
    ui();
    expect(screen.getAllByTestId("row")).toHaveLength(sessionsOn(0).length);
    fireEvent.click(screen.getByRole("tab", { name: /Wed/ }));
    expect(screen.getAllByTestId("row")).toHaveLength(sessionsOn(2).length);
  });

  it("filters by programme when asked", () => {
    ui({ programme: "mobility", full: true });
    const rows = screen.getAllByTestId("row");
    expect(rows).toHaveLength(sessionsOn(0).filter((s) => s.programme === "mobility").length);
  });

  it("books a class through the drawer and marks the row", () => {
    ui();
    const first = screen.getAllByTestId("row")[0];
    const before = Number(within(first).getByTestId("places").textContent);
    fireEvent.click(within(first).getByRole("button", { name: /Book/ }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(within(dialog).getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /Confirm/ }));
    expect(within(dialog).getByText(/You're in/)).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /Close/ }));
    expect(screen.queryByRole("dialog")).toBeNull();
    const after = Number(within(screen.getAllByTestId("row")[0]).getByTestId("places").textContent);
    expect(after).toBe(before - 1);
    expect(within(screen.getAllByTestId("row")[0]).getByText("Booked")).toBeInTheDocument();
  });

  it("offers the waitlist on a full class", () => {
    ui();
    const full = screen.getAllByTestId("row").find((r) => within(r).getByTestId("places").textContent === "0")!;
    expect(within(full).getByRole("button", { name: /Waitlist/ })).toBeInTheDocument();
  });
});

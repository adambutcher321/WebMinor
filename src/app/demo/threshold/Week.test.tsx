import { useEffect } from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Week from "./Week";
import BookDrawer from "./BookDrawer";
import { BookingProvider, useBooking } from "./BookingProvider";
import { sessionsOn, WEEK } from "./timetable";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

// A fixed clock: Friday (day 4) at 11:58. Both Week (day tabs default to
// Monday via `initialDay`) and the booking-flow tests only ever look at
// Monday, which this clock never matches, so this mock is safe for every
// existing test and only bites the tests below that explicitly view Friday.
vi.mock("./Rail", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./Rail")>();
  return { ...actual, useNow: () => ({ day: 4, minutes: 11 * 60 + 58 }) };
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

  it("offers the waitlist on a full class, and marks it Waitlisted (not Booked) once joined", () => {
    ui();
    const full = screen.getAllByTestId("row").find((r) => within(r).getByTestId("places").textContent === "0")!;
    fireEvent.click(within(full).getByRole("button", { name: /Waitlist/ }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(within(dialog).getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /Confirm/ }));
    // The eyebrow now agrees with the confirmation heading instead of still
    // reading "Waitlist".
    expect(within(dialog).getAllByText(/On the list/)).toHaveLength(2);
    fireEvent.click(within(dialog).getByRole("button", { name: /Close/ }));
    const rowNow = screen.getAllByTestId("row").find((r) => within(r).getByTestId("places").textContent === "0")!;
    expect(within(rowNow).getByText("Waitlisted")).toBeInTheDocument();
    expect(within(rowNow).queryByText("Booked")).toBeNull();
    // The opener (the Waitlist pill) is gone, replaced by the Waitlisted
    // label, so focus should still land somewhere inside #week rather than
    // falling out to <body>.
    expect(document.getElementById("week")!.contains(document.activeElement)).toBe(true);
  });

  it("marks today's past sessions Done and leaves the rest bookable", () => {
    ui({ initialDay: 4 }); // Friday, matching the mocked clock (11:58)
    const rows = screen.getAllByTestId("row"); // ordered 06:30, 07:30, 12:15, 17:30
    expect(within(rows[0]).getByText("Done")).toBeInTheDocument();
    expect(within(rows[0]).queryByRole("button")).toBeNull();
    expect(within(rows[1]).getByText("Done")).toBeInTheDocument();
    expect(within(rows[2]).getByRole("button", { name: /Book/ })).toBeInTheDocument();
    expect(within(rows[3]).getByRole("button", { name: /Book/ })).toBeInTheDocument();
  });

  it("leaves another day fully bookable regardless of the clock (rolling template)", () => {
    ui(); // Monday, same mocked Friday clock
    for (const row of screen.getAllByTestId("row")) {
      expect(within(row).queryByText("Done")).toBeNull();
    }
  });

  it("keeps focus inside #week after a booking, even though the opener pill is gone", () => {
    ui();
    const first = screen.getAllByTestId("row")[0];
    fireEvent.click(within(first).getByRole("button", { name: /Book/ }));
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(within(dialog).getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /Confirm/ }));
    fireEvent.click(within(dialog).getByRole("button", { name: /Close/ }));
    const week = document.getElementById("week")!;
    expect(week.contains(document.activeElement)).toBe(true);
  });
});

describe("Week day tabs keyboard pattern", () => {
  it("roving tabindex: only the selected tab is a Tab stop", () => {
    ui();
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("tabindex", tab.getAttribute("aria-selected") === "true" ? "0" : "-1");
    }
  });

  it("each tab controls the rows tabpanel, which is labelled by the selected tab", () => {
    ui();
    const panel = screen.getByRole("tabpanel");
    const mon = screen.getByRole("tab", { name: "Mon" });
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("aria-controls", panel.id);
    }
    expect(panel).toHaveAttribute("aria-labelledby", mon.id);
  });

  it("ArrowRight moves selection and focus, wrapping from Sun back to Mon", () => {
    ui();
    const fri = screen.getByRole("tab", { name: "Fri" });
    fri.focus();
    fireEvent.keyDown(fri, { key: "ArrowRight" });
    const sat = screen.getByRole("tab", { name: "Sat" });
    expect(sat).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(sat);

    fireEvent.keyDown(sat, { key: "ArrowRight" });
    const sun = screen.getByRole("tab", { name: "Sun" });
    expect(sun).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(sun);

    fireEvent.keyDown(sun, { key: "ArrowRight" });
    const mon = screen.getByRole("tab", { name: "Mon" });
    expect(mon).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(mon);
  });

  it("ArrowLeft wraps from Mon to Sun", () => {
    ui();
    const mon = screen.getByRole("tab", { name: "Mon" });
    mon.focus();
    fireEvent.keyDown(mon, { key: "ArrowLeft" });
    const sun = screen.getByRole("tab", { name: "Sun" });
    expect(sun).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(sun);
  });

  it("Home and End jump to Monday and Sunday", () => {
    ui();
    const wed = screen.getByRole("tab", { name: "Wed" });
    wed.focus();
    fireEvent.keyDown(wed, { key: "End" });
    const sun = screen.getByRole("tab", { name: "Sun" });
    expect(sun).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(sun);

    fireEvent.keyDown(sun, { key: "Home" });
    const mon = screen.getByRole("tab", { name: "Mon" });
    expect(mon).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(mon);
  });
});

describe("BookDrawer", () => {
  function OpenSession({ id }: { id: string }) {
    const { openDrawer } = useBooking();
    const session = WEEK.find((x) => x.id === id)!;
    useEffect(() => { openDrawer(session); }, [openDrawer, session]);
    return null;
  }

  it("refuses a session that has already started, with no form", () => {
    // Friday 06:30 (mocked clock: Friday 11:58) -- started, handed straight
    // to the drawer rather than reached through a Week row.
    render(<BookingProvider><OpenSession id="fri-0630-strength" /><BookDrawer /></BookingProvider>);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByLabelText("Name")).toBeNull();
    expect(within(dialog).getByText(/already under way/i)).toBeInTheDocument();
    expect(within(dialog).getAllByRole("button", { name: /Close/ })).toHaveLength(1);
  });

  // A real opener button, focused before the click -- mirroring a real
  // browser's click-to-focus, which fireEvent.click alone doesn't simulate
  // (see the comment on the opener check itself in BookDrawer.tsx).
  function Opener({ id }: { id: string }) {
    const { openDrawer } = useBooking();
    const session = WEEK.find((x) => x.id === id)!;
    return <button type="button" onClick={() => openDrawer(session)}>Open</button>;
  }
  const BOOKABLE_ID = "mon-1215-mobility"; // Monday: never "started" under the mocked Friday clock

  const renderWithOpener = () => {
    const utils = render(<BookingProvider><Opener id={BOOKABLE_ID} /><BookDrawer /></BookingProvider>);
    const openerBtn = screen.getByRole("button", { name: "Open" });
    openerBtn.focus();
    fireEvent.click(openerBtn);
    return { ...utils, openerBtn };
  };

  it("moves focus into the dialog on open", () => {
    renderWithOpener();
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
  });

  it("Escape closes and returns focus to the opener when it still exists", () => {
    const { openerBtn } = renderWithOpener();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(openerBtn);
  });

  it("traps Tab focus inside the dialog, wrapping in both directions", () => {
    renderWithOpener();
    const dialog = screen.getByRole("dialog");
    const closeBtn = within(dialog).getByRole("button", { name: "Close" });
    const confirmBtn = within(dialog).getByRole("button", { name: /Confirm/ });

    confirmBtn.focus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(closeBtn);

    closeBtn.focus();
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(confirmBtn);
  });

  it("locks page scroll while open and releases it on close", () => {
    renderWithOpener();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close" }));
    expect(document.body.style.overflow).toBe("");
  });

  it("releases the scroll lock on unmount, even without closing first", () => {
    const { unmount } = renderWithOpener();
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});

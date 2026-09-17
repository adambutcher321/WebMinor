import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { BookingProvider, useBooking } from "./BookingProvider";
import { WEEK } from "./timetable";

const wrapper = ({ children }: { children: React.ReactNode }) => <BookingProvider>{children}</BookingProvider>;

describe("BookingProvider", () => {
  beforeEach(() => localStorage.clear());

  it("throws outside the provider", () => {
    expect(() => renderHook(() => useBooking())).toThrow();
  });

  it("books, exposes the id, and replaces a duplicate", async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    act(() => result.current.book({ sessionId: "a", name: "Ada", email: "a@x.com", waitlist: false }));
    act(() => result.current.book({ sessionId: "a", name: "Ada L", email: "a@x.com", waitlist: false }));
    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0].name).toBe("Ada L");
    expect(result.current.bookedIds).toEqual(["a"]);
    act(() => result.current.cancel("a"));
    expect(result.current.bookings).toHaveLength(0);
  });

  it("persists to localStorage and reads it back", async () => {
    const first = renderHook(() => useBooking(), { wrapper });
    await waitFor(() => expect(localStorage.getItem("threshold.bookings")).not.toBeNull());
    act(() => first.result.current.book({ sessionId: "b", name: "B", email: "b@x.com", waitlist: true }));
    await waitFor(() => expect(JSON.parse(localStorage.getItem("threshold.bookings")!)).toHaveLength(1));
    first.unmount();

    const second = renderHook(() => useBooking(), { wrapper });
    await waitFor(() => expect(second.result.current.bookedIds).toEqual(["b"]));
  });

  it("joins and leaves", async () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    act(() => result.current.join({ levelIndex: 2, billing: "annual", name: "C", email: "c@x.com", start: "2026-10-01" }));
    expect(result.current.membership?.levelIndex).toBe(2);
    await waitFor(() => expect(localStorage.getItem("threshold.membership")).toContain("annual"));
    act(() => result.current.leave());
    expect(result.current.membership).toBeNull();
  });

  it("opens and closes the drawer", () => {
    const { result } = renderHook(() => useBooking(), { wrapper });
    act(() => result.current.openDrawer(WEEK[0]));
    expect(result.current.drawer?.id).toBe(WEEK[0].id);
    act(() => result.current.closeDrawer());
    expect(result.current.drawer).toBeNull();
  });
});

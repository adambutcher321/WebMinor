import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import Membership from "./Membership";
import JoinFlow from "./JoinFlow";
import { BookingProvider } from "./BookingProvider";
import { LEVELS, priceFor } from "./content";

beforeAll(() => {
  class IO { observe() {} disconnect() {} unobserve() {} }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: true, media: q, addEventListener() {}, removeEventListener() {} })); // reduced motion: price shows instantly
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { cb(performance.now() + 5000); return 1; });
});

const ui = () => render(<BookingProvider><Membership /><JoinFlow /></BookingProvider>);

describe("Membership", () => {
  it("prices the slider live and toggles billing", () => {
    ui();
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "4" } });
    expect(screen.getByTestId("price")).toHaveTextContent(`£${LEVELS[4].monthly}`);
    expect(screen.getByText(LEVELS[4].label)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Annual/ }));
    expect(screen.getByTestId("price")).toHaveTextContent(`£${priceFor(4, "annual").perMonth}`);
    expect(screen.getByTestId("saving")).toHaveTextContent(`£${priceFor(4, "annual").saving}`);
  });

  it("joins through three steps", async () => {
    ui();
    // BookingProvider reads localStorage after hydration (deferred a
    // microtask so the server HTML and first client render agree); wait for
    // that write-back before the flow's own write is asserted below.
    await waitFor(() => expect(localStorage.getItem("threshold.bookings")).not.toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /Join at this level/ }));
    const d = screen.getByRole("dialog");
    expect(within(d).getByText(/Step 1/)).toBeInTheDocument();
    fireEvent.click(within(d).getByRole("button", { name: /Continue/ }));
    fireEvent.change(within(d).getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(within(d).getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.change(within(d).getByLabelText("Start date"), { target: { value: "2026-10-01" } });
    fireEvent.click(within(d).getByRole("button", { name: /Join/ }));
    expect(within(d).getByText(/Welcome/)).toBeInTheDocument();
    expect(localStorage.getItem("threshold.membership")).toContain("ada@x.com");
  });
});

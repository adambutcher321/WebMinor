import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Nav from "./Nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/demo/threshold" }));

describe("Nav mobile menu", () => {
  it("opens, closes on a burger click, and closes on Escape", () => {
    render(<Nav />);
    const opener = screen.getByRole("button", { name: "Menu" });

    fireEvent.click(opener);
    const closer = screen.getByRole("button", { name: "Close menu" });
    expect(closer).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(closer);
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

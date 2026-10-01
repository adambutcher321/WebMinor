"use client";

import { useEffect } from "react";
import { railState, rowDrift, rowPop, rowProgress } from "./work-motion-math";

const ROOT = "[data-work-root]";
const REDUCED = "(prefers-reduced-motion: reduce)";

/*
  Drives the work index's movement and renders nothing. The stylesheet holds
  rows back whenever motion is allowed; this marks them as they arrive. Under
  reduced motion neither side does anything. Reveals are one-shot:
  an observer marks each [data-reveal] element as it arrives and CSS does the
  rest. Scroll position is written to each [data-row] as two variables: --p
  (how far through being read the row is) and --drift (where it sits in the
  viewport, which parallaxes its cover). The page rail gets --g, the number of
  builds read so far, which fills its bands blue, and the band being read is
  marked active.
*/
export default function WorkMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(ROOT);
    if (!root || window.matchMedia(REDUCED).matches) return;
    // Tells the stylesheet the script has arrived, which stands its failsafe down.
    root.setAttribute("data-work-ready", "");

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "true");
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

    const rows = [...root.querySelectorAll<HTMLElement>("[data-row]")];
    // The page rail tracks the builds in its own section.
    const rail = root.querySelector<HTMLElement>("[data-rail]");
    const railRows = rail ? [...(rail.closest("section")?.querySelectorAll<HTMLElement>("[data-row]") ?? [])] : [];
    const bands = rail ? [...rail.children] as HTMLElement[] : [];
    let shownActive = -1;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const progress = new Map<HTMLElement, number>();
      for (const row of rows) {
        const { top, height } = row.getBoundingClientRect();
        const p = rowProgress(top, height, vh);
        progress.set(row, p);
        row.style.setProperty("--p", p.toFixed(4));
        if (top < vh * 1.5 && top + height > -vh * 0.5) {
          const drift = rowDrift(top, height, vh);
          row.style.setProperty("--drift", drift.toFixed(4));
          row.style.setProperty("--pop", rowPop(drift).toFixed(4));
        }
      }
      if (rail) {
        const { filled, active } = railState(railRows.map((r) => progress.get(r) ?? 0));
        rail.style.setProperty("--g", filled.toFixed(4));
        if (active !== shownActive) {
          shownActive = active;
          bands.forEach((b, i) => b.setAttribute("data-state", i < active ? "passed" : i === active ? "active" : "ahead"));
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Desktop pointer: covers tilt toward the cursor with a sheen, and the
    // cursor becomes a VIEW disc while it is over one.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cursor = root.querySelector<HTMLElement>("[data-view-cursor]");
    const frames = [...root.querySelectorAll<HTMLElement>("[data-reveal='frame']")];
    const onPointer = (e: PointerEvent) => {
      if (!cursor) return;
      cursor.style.translate = `${e.clientX}px ${e.clientY}px`;
      const over = (e.target as Element | null)?.closest?.("[data-reveal='frame']");
      cursor.toggleAttribute("data-on", Boolean(over));
    };
    const tilt = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--tx", `${((x - 0.5) * 7).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${((0.5 - y) * 6).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    };
    const untilt = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty("--tx", "0deg");
      el.style.setProperty("--ty", "0deg");
    };
    if (fine) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      for (const f of frames) {
        f.addEventListener("pointermove", tilt);
        f.addEventListener("pointerleave", untilt);
      }
    }

    const counters = [...root.querySelectorAll<HTMLElement>("[data-count]")];
    const timers = counters.map((el) => {
      const target = Number(el.dataset.count);
      const started = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - started) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased)).padStart(2, "0");
        if (t >= 1) clearInterval(id);
      };
      const id = window.setInterval(tick, 40);
      return id;
    });

    return () => {
      root.removeAttribute("data-work-ready");
      reveal.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      for (const f of frames) {
        f.removeEventListener("pointermove", tilt);
        f.removeEventListener("pointerleave", untilt);
      }
      cursor?.removeAttribute("data-on");
      if (frame) cancelAnimationFrame(frame);
      timers.forEach((id) => clearInterval(id));
    };
  }, []);

  return null;
}

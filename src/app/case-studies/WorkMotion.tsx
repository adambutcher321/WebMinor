"use client";

import { useEffect } from "react";
import { rowDrift, rowProgress } from "./work-motion-math";

const ROOT = "[data-work-root]";
const REDUCED = "(prefers-reduced-motion: reduce)";

/*
  Drives the work index's movement and renders nothing. The stylesheet holds
  rows back whenever motion is allowed; this marks them as they arrive. Under
  reduced motion neither side does anything. Reveals are one-shot:
  an observer marks each [data-reveal] element as it arrives and CSS does the
  rest. Scroll position is written to each [data-row] as two variables: --p
  (how far through being read the row is, which fills its tick band) and
  --drift (where it sits in the viewport, which parallaxes its cover).
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
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const row of rows) {
        const { top, height } = row.getBoundingClientRect();
        row.style.setProperty("--p", rowProgress(top, height, vh).toFixed(4));
        if (top < vh * 1.5 && top + height > -vh * 0.5) {
          row.style.setProperty(
            "--drift",
            rowDrift(top, height, vh).toFixed(4),
          );
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

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
      if (frame) cancelAnimationFrame(frame);
      timers.forEach((id) => clearInterval(id));
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import s from "./boucher.module.css";

/*
  A handful of the Doodle print's monsters, as die-cut stickers, peel off the
  jacket and escape the photo as the section scrolls through: each starts
  tucked over the jacket (sx, sy) and travels to its own spot around and past
  the frame edge (ex, ey), in % of the photo. One variable, --esc (0–1), drives
  them all from CSS; positions use container units so the travel scales with
  the photo. Each wobbles on its own loop and leans with the pointer by its
  depth. Decorative: hidden from assistive tech.
*/

interface Monster { src: string; w: number; sx: number; sy: number; ex: number; ey: number; r: number; depth: number }

const M = (n: number, w: number, sx: number, sy: number, ex: number, ey: number, r: number, depth: number): Monster => ({
  src: `/demo/boucher/monsters/m${n}.webp`, w, sx, sy, ex, ey, r, depth,
});

const MONSTERS: Monster[] = [
  M(1, 28, 38, 48, -4, 8, -12, 26),
  M(2, 25, 56, 52, 84, -12, 10, 18),
  M(3, 19, 48, 40, 92, 34, 8, 30),
  M(4, 21, 44, 66, -2, 76, -8, 22),
  M(5, 24, 58, 64, 88, 82, 14, 14),
];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function EscapedMonsters() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { el.style.setProperty("--esc", "1"); return; }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the photo's top reaches 85% of the screen, 1 once its middle is at 40%.
      const p = clamp((vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.5), 0, 1);
      el.style.setProperty("--esc", (p * p * (3 - 2 * p)).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      el.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={s.monsters} aria-hidden="true">
      {MONSTERS.map((m, i) => (
        <span
          key={m.src}
          className={s.monster}
          style={{ "--w": m.w, "--sx": m.sx, "--sy": m.sy, "--ex": m.ex, "--ey": m.ey, "--r": `${m.r}deg`, "--depth": m.depth, "--delay": `${i * -0.7}s` } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- die-cut stickers, sized in container units */}
          <img src={m.src} alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}

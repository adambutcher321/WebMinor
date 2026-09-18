"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { useNow } from "./Rail";
import { nextClass, placesLeft, DAYS } from "./timetable";
import { programmeById, COPY } from "./content";
import { useBooking } from "./BookingProvider";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Magnetic } from "./motion";
import s from "./threshold.module.css";

// Two explicit lines, not a wrap: below 900px the word must break as
// "THRES" / "HOLD" and nothing else, so a font-metric change can never
// produce a third line (see threshold.module.css .heroWordLine).
const WORD_LINES = ["THRES".split(""), "HOLD".split("")];

/*
  The athlete threads through the word: photograph at the back, outline type,
  then the cut-out of the same athlete in front. Pointer position and scroll
  progress are written to CSS variables on the section, and the layers read
  them at different depths. Nothing here sets state; the DOM is driven
  directly from the listeners.
*/
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED);
  const now = useNow();
  const { bookedIds, openDrawer } = useBooking();
  const next = now ? nextClass(now) : null;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const onScroll = () => {
      const h = el.offsetHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / h));
      if (Number.isFinite(p)) el.style.setProperty("--p", p.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <section ref={ref} className={`${s.onNavy} ${s.hero}`} data-reduced={reduced} onPointerMove={onMove} onPointerLeave={onLeave}>
      <h1 className={s.srOnly}>Threshold</h1>

      <img className={s.heroPhoto} src="/demo/threshold/hero.webp" alt="" fetchPriority="high" decoding="async" />

      <div className={`${s.display} ${s.heroWord}`} aria-hidden="true">
        {WORD_LINES.map((line, li) => {
          const offset = WORD_LINES.slice(0, li).reduce((n, l) => n + l.length, 0);
          return (
            <span className={s.heroWordLine} key={li}>
              {line.map((ch, i) => (
                <span key={i} data-testid="letter" style={{ "--i": offset + i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          );
        })}
      </div>

      <img className={s.heroCutout} src="/demo/threshold/hero-cutout.webp" alt="An athlete in the set position, lit magenta and cyan" decoding="async" />

      <div className={s.heroCopy}>
        <p className={s.heroLine}>{COPY.heroLine}</p>
        <div className={s.heroStrip} data-testid="strip">
          <span className={s.eyebrow}>Next class</span>
          {next ? (
            <>
              <strong>{programmeById(next.programme).name}</strong>
              <span>{DAYS[next.day]} {next.time}</span>
              <span>{placesLeft(next, bookedIds)} places left</span>
              <Magnetic>
                <button type="button" className={s.pill} onClick={() => openDrawer(next)}>Book it</button>
              </Magnetic>
            </>
          ) : (
            <span aria-hidden="true">{" "}</span>
          )}
        </div>
      </div>
    </section>
  );
}

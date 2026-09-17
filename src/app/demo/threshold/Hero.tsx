"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { useNow } from "./Rail";
import { nextClass, placesLeft, DAYS } from "./timetable";
import { programmeById, COPY } from "./content";
import { useBooking } from "./BookingProvider";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Magnetic } from "./motion";
import s from "./threshold.module.css";

const WORD = "THRESHOLD".split("");

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
        {WORD.map((ch, i) => (
          <Fragment key={i}>
            <span data-testid="letter" style={{ "--i": i } as CSSProperties}>{ch}</span>
            {i === 4 && <span aria-hidden="true" className={s.heroBreak} />}
          </Fragment>
        ))}
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

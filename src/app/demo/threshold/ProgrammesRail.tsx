"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PROGRAMMES } from "./content";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED } from "./motion";
import s from "./threshold.module.css";

/*
  Pinned: vertical scroll through the tall outer scrubs the track sideways.
  Below 900px (or under reduced motion) the section is a normal snap-scrolling
  row instead — see `pinned` below and the `[data-pinned="false"]` rules in
  the stylesheet.

  `--span`, the pixel distance the track has to travel, is measured from the
  real DOM rather than estimated from vw math: the sticky panel's own
  `clientWidth` already reflects `.site`'s rail sidebar (56px, >=1024px only)
  the way `window.innerWidth` never would, and `track.scrollWidth` is the
  actual rendered width of the four cards, not a guessed `4 * 34vw`. That
  measurement only changes with viewport width, so it is taken once on mount
  and again on resize, not on every scroll tick. The outer's own
  scroll-through height (`calc(100vh + var(--span))`, in the stylesheet)
  then makes the vertical scroll distance exactly equal to the horizontal
  shift needed, so the last card lands with its own gutter of clearance on
  the right, mirroring the opening gutter on the left, instead of short,
  long, or flush against the bare edge.

  The scroll handler itself still reads the pinned element's own bounding
  rect on every tick, the same way Hero.tsx tracks its own scroll progress:
  that position can move from page reflows unrelated to viewport size (a
  counter's digit count changing width above it, a font swap, and so on), so
  unlike the width measurement above it is not safe to cache across ticks.
*/
export default function ProgrammesRail() {
  const outerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const reduced = useMediaQuery(REDUCED);
  const wide = useMediaQuery("(min-width: 900px)");
  const pinned = wide && !reduced;

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track || !pinned) return;

    const measureSpan = () => {
      // Fix round 1, M2: the opening has a gutter inset on the left (the
      // sticky panel's own padding-left); the travel distance now adds that
      // same gutter as trailing space on the right too, so the last card's
      // right edge ends at `container right - gutter` instead of flush
      // against the container's bare edge.
      const gutter = parseFloat(getComputedStyle(sticky).paddingLeft) || 0;
      const span = Math.max(0, track.scrollWidth - sticky.clientWidth + 2 * gutter);
      outer.style.setProperty("--span", `${span}px`);
    };

    const onScroll = () => {
      const r = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      const x = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      outer.style.setProperty("--x", x.toFixed(4));
    };

    const onResize = () => { measureSpan(); onScroll(); };

    measureSpan();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [pinned]);

  return (
    <section id="programmes" ref={outerRef} className={`${s.onNavy} ${s.progOuter}`} data-pinned={pinned}>
      <div className={s.progSticky} ref={stickyRef}>
        <header className={s.progHead}>
          <p className={s.eyebrow}>Programmes</p>
          <h2 className={`${s.display} ${s.h2}`}>Four ways in</h2>
        </header>
        <ul className={s.progTrack} ref={trackRef}>
          {PROGRAMMES.map((p, i) => (
            <li key={p.id} className={s.progCard} style={{ "--i": i } as React.CSSProperties}>
              <img src={p.image} alt={p.alt} loading="lazy" decoding="async" />
              <div className={s.progText}>
                <span className={s.progIndex}>0{i + 1}</span>
                <h3 className={`${s.display} ${s.progName}`}>{p.name}</h3>
                <p>{p.line}</p>
                <span className={s.progDays}>{p.days}</span>
                <Link href={`/demo/threshold/timetable?programme=${p.id}`} className={s.progLink}>See the week</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

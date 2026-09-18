"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PROGRAMMES } from "./content";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED } from "./motion";
import s from "./threshold.module.css";

/*
  Pinned scroll-scrub at >=900px with motion allowed, a plain scrollable row
  otherwise -- that layout switch lives in the stylesheet's media queries
  (== Programmes ==), not here. This effect only measures and writes the CSS
  variables the layout consumes: `--span`, how far the track has to travel,
  from the sticky panel's own `clientWidth` rather than `window.innerWidth`
  (the left rail sidebar at >=1024px eats into the former but not the
  latter); and `--x`/`--shift`, scroll progress and the signed pixel offset,
  from the pinned section's own bounding rect, read fresh on every scroll
  tick because that position can move from page reflows unrelated to
  viewport width (a counter's digit count changing above it, a font swap)
  and so can't be cached the way `--span` can.
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

    let span = 0;

    const measureSpan = () => {
      const gutter = parseFloat(getComputedStyle(sticky).paddingLeft) || 0;
      span = Math.max(0, track.scrollWidth - sticky.clientWidth + 2 * gutter);
      outer.style.setProperty("--span", `${span}px`);
    };

    const onScroll = () => {
      const r = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      const x = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      outer.style.setProperty("--x", x.toFixed(4));
      outer.style.setProperty("--shift", `${(-x * span).toFixed(2)}px`);
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
    <section id="programmes" ref={outerRef} className={`${s.onNavy} ${s.progOuter}`}>
      <div className={s.progSticky} ref={stickyRef}>
        <header className={s.progHead}>
          <p className={s.eyebrow}>Programmes</p>
          <h2 className={`${s.display} ${s.h2}`}>Four ways in</h2>
        </header>
        <ul className={s.progTrack} ref={trackRef}>
          {PROGRAMMES.map((p, i) => (
            <li key={p.id} className={s.progCard}>
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

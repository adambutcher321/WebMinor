"use client";

import { useEffect, useRef } from "react";
import { SPACE, COPY } from "./content";
import { useMediaQuery } from "../useClientEnv";
import { REDUCED, Reveal } from "./motion";
import s from "./threshold.module.css";

/*
  The last home-page section: three photographs of the unit, each drifting a
  different amount as the section scrolls through view. The listener only
  attaches when the layout is the wide (>=900px) grid and motion isn't
  reduced -- `live` gates both the listener and, via `data-live`, the CSS
  transform itself, so a narrow or reduced-motion visitor gets a static grid.
*/
export default function Space() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMediaQuery(REDUCED);
  const wide = useMediaQuery("(min-width: 900px)");
  const live = wide && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const centre = r.top + r.height / 2 - window.innerHeight / 2;
      const sy = Math.max(-1, Math.min(1, centre / window.innerHeight));
      el.style.setProperty("--sy", sy.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [live]);

  return (
    <section id="space" ref={ref} className={`${s.onFrost} ${s.space}`} data-live={live}>
      <Reveal className={s.spaceHead}>
        <p className={s.eyebrow}>The space</p>
        <h2 className={`${s.display} ${s.h2}`}>A print works, levelled</h2>
        <p className={s.spaceLine}>{COPY.spaceLine}</p>
      </Reveal>
      <div className={s.spaceGrid}>
        {SPACE.map((p, i) => (
          <Reveal key={p.src} delay={i * 120} className={s.spaceCell}>
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

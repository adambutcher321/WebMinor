"use client";

import { useEffect, useRef, useState } from "react";
import ExplodedBurger from "./engine/ExplodedBurger";
import { bySlug } from "./engine/burgers";
import { heroBeat } from "./engine/beats";
import { smoothstep } from "./engine/motion";
import { STATEMENTS } from "./content";
import s from "./burger-me.module.css";

/* The pinned home story. One passive scroll listener turns the section's
   scroll position into 0–1 and writes the camera transform directly; the
   burger gets the beat's explode and label amounts as props (state updated
   only when they change by more than 0.005, so React renders at most a
   couple of times per frame's worth of change). */
export default function HeroStory() {
  const ref = useRef<HTMLElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(() => heroBeat(0));
  const [p, setP] = useState(0);
  const original = bySlug("the-original")!;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - innerHeight;
      const prog = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      if (!Number.isFinite(prog)) return;
      const b = heroBeat(reduced ? 0 : prog);
      // Composition on top of the beat's camera: assembled, the burger sits large to the right
      // of the headline; it eases left and down to scale as it comes apart (room for the
      // tags on its right), then closes up larger and centred for the hand-off.
      const open = reduced ? 0 : 1 - smoothstep(0.08, 0.27, prog);
      const close = reduced ? 0 : smoothstep(0.85, 1, prog);
      const lead = Math.max(open, 0.5 * close);
      const narrow = innerWidth < 768;
      const zoom = 1 + (narrow ? 0.3 : 0.75) * lead;
      const shift = narrow ? 0 : 22 * open + 8 * close;
      // Grow from the burger's base while it is assembled; from the middle while it is apart.
      if (cam.current) cam.current.style.transformOrigin = `${narrow ? 50 : 42}% ${(50 + 38 * lead).toFixed(1)}%`;
      if (cam.current) cam.current.style.transform = `translate3d(${(b.x + shift).toFixed(3)}%, ${b.y}%, 0) scale(${(b.scale * zoom).toFixed(4)})`;
      setBeat((prev) => (Math.abs(prev.explode - b.explode) > 0.005 || Math.abs(prev.labels - b.labels) > 0.01 ? b : prev));
      setP((prev) => (Math.abs(prev - prog) > 0.01 ? prog : prev));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Phone caption: one statement at a time through the label window.
  const capIdx = Math.min(STATEMENTS.length - 1, Math.max(0, Math.floor(((p - 0.45) / 0.2) * STATEMENTS.length)));
  const intro = 1 - Math.min(1, Math.max(0, (p - 0.07) / 0.07));

  return (
    <section ref={ref} className={s.hero} aria-label="The Original, taken apart">
      <div className={`${s.heroPin} ${s.stageGround} ${s.grain}`}>
        <h1 className={`${s.display} ${s.heroTitle}`} style={{ opacity: intro }}>
          Built <em>in front</em> of you.
        </h1>
        <p className={s.heroLede} style={{ opacity: intro }}>
          Two British beef patties smashed to order, American cheese, house sauce, toasted brioche. Scroll and we&apos;ll show you how it&apos;s made.
        </p>
        <div ref={cam} className={s.heroCam}>
          <div className={s.heroBurger}>
            <ExplodedBurger burger={original} explode={beat.explode} labels={beat.labels} interactive />
          </div>
        </div>
        <p className={`${s.display} ${s.statement}`} style={{ opacity: Math.max(0, Math.min(1, (p - 0.66) / 0.06)) * (1 - Math.max(0, Math.min(1, (p - 0.86) / 0.06))) }}>
          Every one, <span style={{ color: "var(--bm-mustard)" }}>every time.</span>
        </p>
        <p className={`${s.display} ${s.heroCaption}`} style={{ opacity: beat.labels, fontSize: 30, color: "var(--bm-mustard)" }} aria-hidden="true">
          {STATEMENTS[capIdx].text}
        </p>
        <span className={s.scrollCue} style={{ opacity: intro * 0.7 }}>Scroll</span>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './altrix.module.css';
import s from './hero-watch.module.css';

/*
 * The hero watch, alive.
 *
 * The render is still the one photograph, but three things move on it:
 *
 *   1. The whole object enlarges, lifts and turns a few degrees as the hero
 *      scrolls away, so the fold is a camera move rather than a poster.
 *   2. It leans towards the cursor, a few degrees each way, through two CSS
 *      variables written straight to the element (no React re-render).
 *   3. The crystal carries a live face. The altimeter counts up from sea level
 *      on arrival, then keeps climbing with the scroll, and its trace draws as
 *      it goes. The face is a disc positioned over the dial in the render,
 *      measured against a grid, so it scales and tilts with the object.
 *
 * Under reduced motion the face reads the render's own figure, 5,364 m, and
 * nothing transforms.
 */

const REST = 5364;      // what the photograph says
const SUMMIT = 6120;    // where the scroll takes it
const ARRIVE_MS = 2400;

const fmt = (n: number) => Math.round(n).toLocaleString('en-GB');

/* A plausible ascent profile, normalised 0..1 in both axes. */
const PROFILE = [0, 0.04, 0.03, 0.09, 0.12, 0.1, 0.18, 0.22, 0.2, 0.3, 0.34, 0.31, 0.42, 0.47, 0.45, 0.55, 0.6, 0.58, 0.68, 0.74, 0.72, 0.8, 0.86, 0.84, 0.92, 0.97, 1];

export default function HeroWatch() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [draw, setDraw] = useState(0);
  const [reduced, setReduced] = useState(false);
  const scrollP = useRef(0);
  const arrived = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) {
      // Read the photograph's figure and hold it.
      queueMicrotask(() => { setReduced(true); setValue(REST); setDraw(1); });
      return;
    }

    const hero = el.closest('section') as HTMLElement | null;
    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      // Arrival: 0 → REST over ARRIVE_MS, eased out hard.
      const a = Math.min(1, (now - t0) / ARRIVE_MS);
      arrived.current = 1 - Math.pow(1 - a, 4);
      // Scroll: 0 → 1 across the hero's own height.
      const h = (hero && hero.offsetHeight) || window.innerHeight || 1;
      const raw = window.scrollY / (h * 0.9);
      scrollP.current = Number.isFinite(raw) ? Math.max(0, Math.min(1, raw)) : 0;
      const p = scrollP.current;
      const v = REST * arrived.current + (SUMMIT - REST) * p;
      setValue(v);
      setDraw(Math.min(1, arrived.current * 0.86 + p * 0.14));
      el.style.setProperty('--p', p.toFixed(4));
      if (a < 1 || p > 0) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    raf = requestAnimationFrame(tick);

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !hero) return;
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    };
    const onLeave = () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); };

    window.addEventListener('scroll', onScroll, { passive: true });
    hero?.addEventListener('pointermove', onMove);
    hero?.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      hero?.removeEventListener('pointermove', onMove);
      hero?.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Trace path across the lower third of the face, drawn to `draw`.
  const W = 100, H = 100;
  const pts = PROFILE.map((y, i) => [12 + (i / (PROFILE.length - 1)) * 76, 92 - y * 26] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const safeDraw = Number.isFinite(draw) ? Math.max(0, Math.min(1, draw)) : 0;
  const last = pts[Math.min(pts.length - 1, Math.floor(safeDraw * (pts.length - 1)))];
  // Climb rate follows the reading, so it needs no ref during render.
  const rate = Math.round(380 + Math.max(0, (value - REST) / (SUMMIT - REST)) * 140);

  return (
    <div ref={wrapRef} className={`${styles.product} ${s.wrap}`} data-reduced={reduced} aria-hidden="false">
      <div className={s.tilt}>
        <Image
          className={s.img}
          src="/demo/altrix/summit-03.webp"
          alt="The ALTRIX Summit Series 03 expedition watch, titanium case and ember crown, its altimeter climbing."
          width={1888}
          height={1888}
          loading="eager"
          fetchPriority="high"
          unoptimized
        />
        {/* The live face, sitting exactly over the crystal in the render. */}
        <div className={s.face} aria-live="off">
          <div className={s.faceInner}>
            <span className={s.label}>Altimeter</span>
            <span className={s.reading}>
              {fmt(value)}
              <span className={s.unit}>M</span>
            </span>
            <span className={s.rate}>
              <span className={s.rateArrow} aria-hidden="true">▲</span> {rate} m/h
            </span>
            <svg className={s.trace} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={d} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - safeDraw }} />
              <circle cx={last[0]} cy={last[1]} r="1.6" style={{ opacity: safeDraw > 0.02 ? 1 : 0 }} />
            </svg>
          </div>
          <span className={s.glass} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

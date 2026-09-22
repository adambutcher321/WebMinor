'use client';

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import s from './google-reviews.module.css';

/*
  The reviews sit in a symmetric 3D fan: one card square on in the centre of
  the page, the others turned away and stepped out to either side, nearest
  first. Stepping is always the visitor's move — arrows, arrow keys or a swipe
  — never a timer, so the section is still 100% of the time until it is asked
  to move. Mechanisms and timings: design-loop/webminor-reviews-motion-bar.md.

  Every review is in the DOM at every step, so keyboard and screen-reader users
  reach all of them; only the front one is reachable by Tab (the rest are
  inert), so focus never lands on a card turned away from the viewer.
*/
export default function ReviewsStack({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  const count = items.length;
  const [index, setIndex] = useState(0);
  // The fan is rendered open, so it is open without JavaScript. Only when
  // JavaScript is running, and the fan is still below the fold, does it close
  // and wait to open on first view.
  const [pending, setPending] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const step = useCallback(
    (direction: 1 | -1) => setIndex((i) => (i + direction + count) % count),
    [count],
  );

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setPending(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPending(false);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  }

  function onPointerDown(e: React.PointerEvent) {
    swipe.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: React.PointerEvent) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    // Ignore anything that is mostly a vertical scroll, or too small to be meant.
    if (Math.abs(dx) < 48 || Math.abs(e.clientY - start.y) > Math.abs(dx)) return;
    step(dx < 0 ? 1 : -1);
  }

  return (
    <div className={s.rail}>
      <div
        ref={stackRef}
        className={`${s.stack} ${pending ? s.stackPending : s.stackIn}`}
        role="group"
        aria-roledescription="carousel"
        aria-label="Google reviews"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {items.map((item, i) => {
          // Signed distance from the front card: negative fans left, positive
          // fans right, so the front card always sits in the middle. Anything
          // beyond two steps out waits off-stage on the side it will arrive
          // from, which is what keeps the fan the same shape every step.
          const rel = (i - index + count) % count;
          const half = Math.floor(count / 2);
          const signed = rel > half ? rel - count : rel;
          const pos = Math.max(-3, Math.min(3, signed));
          return (
            <div
              key={i}
              className={s.slot}
              data-pos={pos}
              aria-hidden={pos !== 0}
              inert={pos !== 0}
            >
              {item}
            </div>
          );
        })}
      </div>

      <div className={s.controls}>
        <button type="button" className={s.arrow} onClick={() => step(-1)} aria-label="Previous review">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className={s.arrow} onClick={() => step(1)} aria-label="Next review">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <p className={s.counter} aria-live="polite">
          <span className={s.counterNow}>{String(index + 1).padStart(2, '0')}</span>
          <span aria-hidden="true"> / {String(count).padStart(2, '0')}</span>
          <span className={s.srOnly}> of {count} reviews</span>
        </p>
        {actions}
      </div>
    </div>
  );
}

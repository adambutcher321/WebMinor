'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import s from './google-reviews.module.css';

/*
  The cards scroll natively (touch, trackpad, keyboard). The buttons are only
  for mouse-wheel users, who have no other way to move a horizontal row.
*/
export default function ReviewsRail({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  function step(direction: 1 | -1) {
    const el = listRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: reduced ? 'auto' : 'smooth' });
  }

  return (
    <div className={s.rail}>
      <ul ref={listRef} className={s.list} onScroll={measure} tabIndex={0} aria-label="Google reviews">
        {children}
      </ul>
      <div className={s.controls}>
        <button type="button" className={s.arrow} onClick={() => step(-1)} disabled={edge.start} aria-label="Previous reviews">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className={s.arrow} onClick={() => step(1)} disabled={edge.end} aria-label="More reviews">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

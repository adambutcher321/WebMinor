'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './deck.module.css';

/**
 * The triptych assembles rather than simply appearing: the outer two images start
 * tucked behind the centre as a stacked deck, then fan out to their places as the
 * section rises into view.
 *
 * This is the reference's deck logic run forwards — its rows break formation on exit,
 * so a group that *arrives* by coming together reads as the same idea, and gives the
 * page a moving part where it previously had a static row of three.
 *
 * Scrubbed to scroll, so the visitor owns the timeline (exempt from M2/M3).
 */
export default function StackTrio({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = ref.current;
    if (!host) return;
    const cards = Array.from(host.children) as HTMLElement[];
    if (cards.length < 3) return;

    // Outer cards travel in from behind the middle one; the centre only settles.
    const from = [
      { x: 190, y: 26, s: 0.86, r: -4 },
      { x: 0, y: 18, s: 0.95, r: 0 },
      { x: -190, y: 26, s: 0.86, r: 4 },
    ];

    let raf = 0;
    let last = -1;

    const tick = () => {
      const rect = host.getBoundingClientRect();
      // Runs while the group climbs the lower two-thirds of the viewport, so it is
      // fully assembled before it reaches reading height.
      const start = window.innerHeight * 0.95;
      const end = window.innerHeight * 0.35;
      const raw = (start - rect.top) / (start - end);
      const p = Math.min(1, Math.max(0, raw));
      // Ease-out, so the fan decelerates into place rather than arriving linearly.
      const e = 1 - Math.pow(1 - p, 3);

      if (Math.abs(e - last) > 0.002) {
        last = e;
        for (let i = 0; i < cards.length; i++) {
          const f = from[i] ?? from[1];
          const x = f.x * (1 - e);
          const y = f.y * (1 - e);
          const s = f.s + (1 - f.s) * e;
          const r = f.r * (1 - e);
          cards[i].style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s}) rotate(${r}deg)`;
          cards[i].style.opacity = String(0.3 + 0.7 * Math.min(1, e * 1.4));
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      for (const c of cards) {
        c.style.transform = '';
        c.style.opacity = '';
      }
    };
  }, []);

  return (
    <div ref={ref} className={`${className} ${styles.deck}`}>
      {children}
    </div>
  );
}

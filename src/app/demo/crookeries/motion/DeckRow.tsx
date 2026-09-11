'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './deck.module.css';

/**
 * The reference's signature exit: a row of cards breaks formation on its way out,
 * each one taking a progressively larger step up and to the right until the row reads
 * as a fanned deck (M6).
 *
 * Scrubbed against the row's own exit from the viewport, so the visitor owns the
 * timeline — the bar's duration and easing rules do not apply here.
 *
 * The offsets are monotonic by index, which is what separates a deck from a jumble:
 * the bar fails a row whose offsets are random rather than a steady step.
 */
export default function DeckRow({
  children,
  className = '',
  /** Horizontal step per card at full fan, in px. */
  stepX = 46,
  /** Vertical step per card at full fan, in px. Negative is up. */
  stepY = -34,
}: {
  children: ReactNode;
  className?: string;
  stepX?: number;
  stepY?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = ref.current;
    if (!host) return;

    const cards = Array.from(host.children) as HTMLElement[];
    if (cards.length < 2) return;

    let raf = 0;
    let last = -1;

    const tick = () => {
      const rect = host.getBoundingClientRect();
      /*
       * The fan runs across the row's whole exit.
       *
       * An earlier window keyed off `rect.bottom` only opened once the row had almost
       * left the viewport, so the deck fanned where nobody could see it and the row
       * measured as a rigid block. Keying off `rect.top` starts the gesture while the
       * row is still on screen and finishes as the last of it clears the top.
       */
      const vh = window.innerHeight;
      const startAt = vh * 0.25;
      const p = Math.min(1, Math.max(0, (startAt - rect.top) / (startAt + rect.height)));

      if (Math.abs(p - last) > 0.002) {
        last = p;
        for (let i = 0; i < cards.length; i++) {
          const x = stepX * i * p;
          const y = stepY * i * p;
          cards[i].style.transform = p > 0 ? `translate3d(${x}px, ${y}px, 0)` : '';
          // The leading card stays put and stays opaque; the deck thins as it fans,
          // which is what stops four solid cards colliding on the way out.
          cards[i].style.opacity = p > 0 ? String(1 - p * (i / cards.length) * 0.85) : '';
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
  }, [stepX, stepY]);

  return (
    <div ref={ref} className={`${className} ${styles.deck}`}>
      {children}
    </div>
  );
}

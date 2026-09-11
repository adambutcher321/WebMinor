'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './deck.module.css';

/**
 * The gallery tiles drift at different rates as the row passes, so a row of five
 * already sitting at staggered heights reads as depth rather than as a static mosaic.
 *
 * Rates alternate rather than ramp: a monotonic ramp across five tiles pulls the whole
 * row into a diagonal, which is the deck exit's job (M6) and would say the same thing
 * twice. Alternating keeps the row level while still separating the planes.
 *
 * Scrubbed to scroll, so it is exempt from the duration rules — and it resolves to a
 * resting state at the row's centre rather than looping (M4).
 */
export default function GalleryDrift({
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
    if (!cards.length) return;

    // px of travel across the full pass, per tile.
    const rates = [34, -22, 46, -18, 30];

    let raf = 0;
    let last = -1;

    const tick = () => {
      const rect = host.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      // -1 when the row is entering from below, 0 at centre screen, +1 leaving above.
      const p = Math.min(1, Math.max(-1, (window.innerHeight / 2 - mid) / (window.innerHeight / 2 + rect.height / 2)));

      if (Math.abs(p - last) > 0.002) {
        last = p;
        for (let i = 0; i < cards.length; i++) {
          const rate = rates[i % rates.length];
          cards[i].style.transform = `translate3d(0, ${(-p * rate).toFixed(2)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      for (const c of cards) c.style.transform = '';
    };
  }, []);

  return (
    <div ref={ref} className={`${className} ${styles.deck}`}>
      {children}
    </div>
  );
}

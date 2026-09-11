'use client';

import { useEffect, useRef } from 'react';
import styles from './klikcard.module.css';

/**
 * The KLIK card itself, built in the DOM rather than rendered as an image.
 *
 * Branding has to be crisp at every size and the card has to respond to the cursor, so
 * the wordmark, chip and contactless mark are real type and real SVG. A generated still
 * would be soft at large sizes, could not tilt, and would garble small lettering.
 */
export type CardVariant = 'holo' | 'black' | 'clear' | 'lime' | 'chrome';

export default function KlikCard({
  variant = 'holo',
  className,
}: {
  variant?: CardVariant;
  /** Lets the chooser size the card without reaching into this module's CSS. */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let inside = false;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Track relative to the card's own centre so the tilt follows the pointer even
      // when the card is off to one side of the viewport.
      tx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      ty = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      inside = true;
    };

    const onLeave = () => {
      inside = false;
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      // Damped, so the card has weight rather than snapping to the cursor.
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      el.style.setProperty('--rx', (cy * -9).toFixed(3));
      el.style.setProperty('--ry', (cx * 13).toFixed(3));
      // The sheen tracks the tilt, so the holographic surface reads as a real surface.
      el.style.setProperty('--sheen', (50 + cx * 42).toFixed(2));
      el.style.setProperty('--lift', inside ? '1' : '0');
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`${styles.stage} ${className ?? ''}`}>
      <div className={`${styles.card} ${styles[variant]}`} ref={ref}>
        <div className={styles.sheen} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />

        <div className={styles.top}>
          <span className={styles.mark}>KLIK</span>
          <svg className={styles.wave} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 6a8 8 0 0 1 0 12M12.5 3.5a12 12 0 0 1 0 17M4 8.5a4.5 4.5 0 0 1 0 7" />
          </svg>
        </div>

        {/* Chip drawn rather than imaged, so its contacts stay sharp at any scale. */}
        <svg className={styles.chip} viewBox="0 0 46 34" aria-hidden="true">
          <rect x="0.6" y="0.6" width="44.8" height="32.8" rx="5" />
          <path d="M0.6 11.5h13M0.6 22.5h13M45.4 11.5h-13M45.4 22.5h-13M15.5 0.6v9M15.5 33.4v-9M30.5 0.6v9M30.5 33.4v-9" />
          <rect x="15.5" y="9.5" width="15" height="15" rx="2.4" />
        </svg>

        <div className={styles.bottom}>
          <span className={styles.number}>•••• •••• •••• 4021</span>
          <div className={styles.baseRow}>
            <span className={styles.name}>KLIK MEMBER</span>
            <span className={styles.exp}>12 / 30</span>
          </div>
        </div>

        <span className={styles.edge} aria-hidden="true" />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionDisabled } from './MotionRoot';
import styles from './motion.module.css';

interface RevealProps {
  children: ReactNode;
  /** Stagger direct children instead of moving the block as one unit (M3, M6). */
  stagger?: boolean;
  /** Arrive out of focus and resolve once (M7). Default on — it is the bar's rule. */
  blur?: boolean;
  className?: string;
  id?: string;
  /** Fraction of the element that must be visible before it fires. */
  threshold?: number;
}

/**
 * Reveals its contents once, on entry, then never again.
 *
 * "Once" is load-bearing: M4 requires motion to resolve to absolute stillness, so a
 * reveal that re-fires when the visitor scrolls back up would put the page permanently
 * in motion. The observer disconnects on first hit.
 */
export default function Reveal({
  children,
  stagger = false,
  blur = true,
  className = '',
  id,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const disabled = useMotionDisabled();

  useEffect(() => {
    if (disabled || shown) return;
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount has missed its entrance; show it without
    // animating rather than firing a reveal the visitor is already looking at.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [disabled, shown, threshold]);

  const cls = [
    className,
    disabled ? '' : styles.reveal,
    stagger ? styles.staggered : '',
    blur ? styles.blurred : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} id={id} className={cls} data-shown={disabled || shown ? 'true' : 'false'}>
      {children}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './reveal.module.css';

/**
 * Reveals once on entry, then never again — M5 requires motion to resolve and stop, so
 * a reveal that re-fires on scroll-back would put the page permanently in motion.
 */
export default function Reveal({
  children,
  className = '',
  stagger = false,
  from = 'up',
  delay = 0,
  threshold = 0.18,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  /** Payment UI arrives on a diagonal rather than fading in place (M7). */
  from?: 'up' | 'diag';
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold]);

  const cls = [className, styles.reveal, stagger ? styles.stagger : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={cls}
      data-shown={shown}
      data-from={from}
      style={delay ? ({ '--delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

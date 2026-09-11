'use client';

import { useEffect, useRef, useState } from 'react';
import { isIntroDone, onIntroDone } from './intro';
import { DUR } from './tokens';

/**
 * Counts a figure up once, when the hero hands over.
 *
 * Echoes the intro's own counter, so the number in the stat card reads as the same
 * instrument settling rather than as a separate flourish. It runs once and stops (M4),
 * and its 900ms sits inside the reference's 400-1750ms band (M2).
 */
export default function CountUp({
  to,
  suffix = '',
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const run = () => {
      if (started.current) return;
      started.current = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 900);
        // Ease-out, matching every other move on the page — no overshoot.
        const e = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * e));
        if (p < 1) requestAnimationFrame(step);
      };
      setValue(0);
      requestAnimationFrame(step);
    };

    if (isIntroDone()) {
      run();
      return;
    }
    return onIntroDone(run);
  }, [to]);

  // Tabular figures, so the card does not reflow as the digits change.
  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}
      {suffix}
    </span>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useMediaQuery } from '../useClientEnv';

/*
  Motion for a trade site.

  Voltiva had no scroll motion at all — every hover was a colour change and
  nothing ever arrived. The brief here is restraint rather than spectacle: this
  is a working electrician's site, so blocks fade up and settle, the numbers
  count once, and nothing loops or follows the cursor. Anything showier would
  make the business look less serious, not more.

  The reduced-motion preference is read during render through the shared
  `useMediaQuery` store rather than written into state from an effect — setting
  state synchronously in an effect body renders once with the wrong value and
  again with the right one, which is what `react-hooks/set-state-in-effect`
  exists to stop.
*/

const REDUCED = '(prefers-reduced-motion: reduce)';
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

function useArrived<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const reduced = useMediaQuery(REDUCED);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, reduced]);

  return { ref, arrived: reduced || seen, reduced };
}

/** Fades and rises a block as it arrives. `delay` staggers siblings. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, arrived } = useArrived<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: arrived ? 1 : 0,
        transform: arrived ? 'none' : 'translateY(18px)',
        transition: `opacity 640ms ${EASE} ${delay}ms, transform 640ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Counts a stat up once, on arrival.
 *
 * The values carry their own formatting — "2,400+", "2 hrs" — so the number is
 * pulled out, animated, and the surrounding characters put back, rather than
 * splitting the data into three fields for the sake of an animation.
 */
export function CountUp({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, arrived, reduced } = useArrived<HTMLParagraphElement>(0.4);

  /*
    Memoised because the effect below depends on it. `String.match` returns a
    fresh array on every render, so an un-memoised value re-ran the effect on
    each animation frame: the loop cancelled and restarted itself with a new
    start time, progress never advanced, and the counters stalled part-way —
    "2,400+" settled at "145+" and "18" never left zero.
  */
  const match = useMemo(() => value.match(/^(\D*)([\d,]+)(.*)$/), [value]);
  const target = match ? Number(match[2].replace(/,/g, '')) : 0;
  const hasNumber = match !== null;
  const [counted, setCounted] = useState(0);

  useEffect(() => {
    if (!arrived || reduced || !hasNumber) return;

    let raf = 0;
    const start = performance.now();
    const run = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      // Ease out, so it sprints then lands rather than crawling to the number.
      setCounted(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [arrived, reduced, target, hasNumber]);

  if (!match) {
    return (
      <p className={className} style={style}>
        {value}
      </p>
    );
  }

  const shown = reduced ? target : counted;

  return (
    <p ref={ref} className={className} style={style}>
      {match[1]}
      {shown.toLocaleString('en-GB')}
      {match[3]}
    </p>
  );
}

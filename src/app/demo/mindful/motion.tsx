"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMediaQuery } from "../useClientEnv";
import s from "./mindful.module.css";

/*
  Two browser-only pieces.

  Reveal fires once on entry and never again, so the page comes to rest.
  Counter runs its number up once when it is seen. Both respect
  prefers-reduced-motion, read through useMediaQuery so no state is set inside
  an effect: under reduced motion the reveal is simply already shown and the
  counter already at its value.
*/

const REDUCED = "(prefers-reduced-motion: reduce)";

export function Reveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
  threshold = 0.16,
  style,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  threshold?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useMediaQuery(REDUCED);
  const shown = seen || reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || seen || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced, threshold]);

  const cls = [className, s.reveal, stagger ? s.stagger : ""].filter(Boolean).join(" ");
  const vars = delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div ref={ref} className={cls} data-shown={shown} style={vars || style ? { ...vars, ...style } : undefined}>
      {children}
    </div>
  );
}

export function Counter({
  value,
  suffix = "",
  className = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useMediaQuery(REDUCED);

  useEffect(() => {
    const el = ref.current;
    if (!el || done || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
          else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, done, reduced]);

  const shown = reduced ? value : n;

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

/** Two copies of the children, scrolled endlessly; pauses under the pointer. */
export function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${s.marquee} ${className}`}>
      <div className={s.marqueeTrack}>
        <div className="flex gap-5 shrink-0">{children}</div>
        <div className="flex gap-5 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

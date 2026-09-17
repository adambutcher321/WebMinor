"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { useMediaQuery } from "../useClientEnv";
import s from "./threshold.module.css";

/*
  Three browser-only pieces. Reveal fires once on entry. Counter runs up once
  when seen. Magnetic pulls its child towards the pointer inside a radius and
  lets go on leave. All three read prefers-reduced-motion through
  useMediaQuery so no state is set inside an effect; under reduced motion
  Reveal is already shown, Counter already at its value, Magnetic inert.
*/

export const REDUCED = "(prefers-reduced-motion: reduce)";

export function Reveal({
  children, className = "", delay = 0, threshold = 0.16, as = "div",
}: { children: ReactNode; className?: string; delay?: number; threshold?: number; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useMediaQuery(REDUCED);
  const shown = seen || reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el || seen || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced, threshold]);

  const Tag = as;
  const style = delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined;
  return (
    // @ts-expect-error ref type varies with Tag
    <Tag ref={ref} className={`${s.reveal} ${className}`} data-shown={shown} style={style}>
      {children}
    </Tag>
  );
}

export function Counter({ value, suffix = "", className = "", duration = 1500 }: { value: number; suffix?: string; className?: string; duration?: number }) {
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
          if (p < 1) raf = requestAnimationFrame(tick); else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration, done, reduced]);

  return <span ref={ref} className={className}>{(reduced ? value : n).toLocaleString("en-GB")}{suffix}</span>;
}

export function Magnetic({ children, radius = 40, className = "" }: { children: ReactNode; radius?: number; className?: string }) {
  const [off, setOff] = useState({ x: 0, y: 0 });
  const reduced = useMediaQuery(REDUCED);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    const pull = d < radius + Math.max(r.width, r.height) / 2 ? 0.35 : 0;
    setOff({ x: dx * pull, y: dy * pull });
  };
  const onLeave = () => setOff({ x: 0, y: 0 });

  return (
    <div
      className={`${s.magnetic} ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ "--mx": `${off.x}px`, "--my": `${off.y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

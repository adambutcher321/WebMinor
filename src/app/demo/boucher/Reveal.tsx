"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "../useClientEnv";
import s from "./boucher.module.css";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const el = ref.current;
    if (!el || seen || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, reduced]);

  return (
    <div ref={ref} className={`${s.reveal} ${className}`} data-shown={seen || reduced}>
      {children}
    </div>
  );
}

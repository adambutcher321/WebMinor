"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { COLOURWAYS, type Colourway } from "./shop";
import s from "./boucher.module.css";

/*
  The active colourway is page state, not stage state: the nav, the sections
  under the stage and the footer all take their colour from it. It is held
  here, above everything, and written onto the wrapper as CSS variables so the
  tint is a single 900ms transition rather than fifty components re-rendering.
*/

interface TintValue {
  index: number;
  active: Colourway;
  prev: number | null;
  dir: 1 | -1;
  go: (to: number) => void;
  next: () => void;
  back: () => void;
  /** True once the visitor has taken control; autoplay stops for good. */
  touched: boolean;
  /** A colourway the page shows without choosing it: a section scrolled into
   *  the middle of the screen, or a card under the pointer. The stage keeps
   *  the visitor's choice; only the tint follows. null = show the choice. */
  preview: number | null;
  setPreview: (i: number | null) => void;
}

const TintContext = createContext<TintValue | null>(null);

export function TintProvider({ children, initialSlug, autoplay = true }: { children: ReactNode; initialSlug?: string; autoplay?: boolean }) {
  const start = Math.max(0, COLOURWAYS.findIndex((c) => c.slug === initialSlug));
  const [index, setIndex] = useState(start);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [touched, setTouched] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);

  const go = useCallback(
    (to: number, byUser = true) => {
      const n = ((to % COLOURWAYS.length) + COLOURWAYS.length) % COLOURWAYS.length;
      if (n !== index) {
        setPrev(index);
        // Wrapping from last to first still reads as "forward".
        setDir(n > index || (index === COLOURWAYS.length - 1 && n === 0) ? 1 : -1);
        if (index === 0 && n === COLOURWAYS.length - 1) setDir(-1);
        setIndex(n);
      }
      if (byUser) setTouched(true);
    },
    [index],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const back = useCallback(() => go(index - 1), [go, index]);

  // Clear the "leaving" jacket once its transition has run.
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 950);
    return () => clearTimeout(t);
  }, [prev, index]);

  // Autoplay until the visitor takes over. Paused while the tab is hidden.
  useEffect(() => {
    if (touched || !autoplay || preview !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      go(index + 1, false);
    }, 5200);
    return () => clearInterval(id);
  }, [touched, autoplay, index, go, preview]);

  const value = useMemo<TintValue>(
    () => ({ index, active: COLOURWAYS[index], prev, dir, go, next, back, touched, preview, setPreview }),
    [index, prev, dir, go, next, back, touched, preview],
  );

  const c = COLOURWAYS[preview ?? index];
  const vars = {
    "--bg": c.bg,
    "--bg-deep": c.bgDeep,
    "--fg": c.fg,
    "--fg-soft": c.fgSoft,
    "--panel": c.panel,
  } as CSSProperties;

  return (
    <TintContext.Provider value={value}>
      <div className={s.tint} style={vars} data-colourway={c.slug}>
        {children}
      </div>
    </TintContext.Provider>
  );
}

export function useTint(): TintValue {
  const ctx = useContext(TintContext);
  if (!ctx) throw new Error("useTint must be used inside TintProvider");
  return ctx;
}

/** Reads `?c=slug` so links from the shop land on the right colourway. */
export function TintFromQuery({ children, autoplay = true }: { children: ReactNode; autoplay?: boolean }) {
  const params = useSearchParams();
  return (
    <TintProvider initialSlug={params.get("c") ?? undefined} autoplay={autoplay}>
      {children}
    </TintProvider>
  );
}

/**
 * Washes the page to `slug` while this block sits across the middle of the
 * screen, and hands back to the visitor's colourway when it leaves. `when`
 * limits it to a media query (e.g. only when cards are stacked one per row).
 */
export function TintZone({ slug, when, className = "", children }: { slug: string; when?: string; className?: string; children: ReactNode }) {
  const { setPreview } = useTint();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (when && !window.matchMedia(when).matches) return;
    const i = COLOURWAYS.findIndex((c) => c.slug === slug);
    let on = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { on = true; setPreview(i); }
        else if (on) { on = false; setPreview(null); }
      },
      { rootMargin: "-46% 0px -46% 0px" },
    );
    io.observe(el);
    return () => { io.disconnect(); if (on) setPreview(null); };
  }, [slug, when, setPreview]);
  return <div ref={ref} className={className}>{children}</div>;
}

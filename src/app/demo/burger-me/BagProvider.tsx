"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bySlug } from "./engine/burgers";

/* The bag. Lives in the layout so it survives navigation; written to
   localStorage after hydration so server and first client render agree. */

interface Line { slug: string; qty: number }
interface Bag {
  lines: Line[]; count: number; total: number;
  add(slug: string): void; setQty(slug: string, qty: number): void;
  open: boolean; setOpen(v: boolean): void;
  ordered: boolean; placeOrder(): void; reset(): void;
  lastAdded: number;
}

const Ctx = createContext<Bag | null>(null);
const KEY = "burger-me.bag";

export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved: Line[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(raw)) {
        saved = raw.filter((l): l is Line => !!l && typeof l.slug === "string" && Number.isInteger(l.qty) && l.qty > 0 && !!bySlug(l.slug));
      }
    } catch { /* private mode or bad JSON */ }
    queueMicrotask(() => { setLines(saved); setReady(true); });
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
  }, [lines, ready]);

  const add = useCallback((slug: string) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.slug === slug);
      return hit ? prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { slug, qty: 1 }];
    });
    setOrdered(false);
    setLastAdded(Date.now());
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);
  const placeOrder = useCallback(() => { setOrdered(true); setLines([]); }, []);
  const reset = useCallback(() => setOrdered(false), []);

  const value = useMemo<Bag>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + (bySlug(l.slug)?.price ?? 0) * l.qty, 0);
    return { lines, count, total, add, setQty, open, setOpen, ordered, placeOrder, reset, lastAdded };
  }, [lines, add, setQty, open, ordered, placeOrder, reset, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBag outside BagProvider");
  return v;
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { bySlug, DELIVERY, FREE_DELIVERY_OVER, type Colourway, type Size } from "./shop";

/*
  The basket and the wishlist. Both live in the route layout so they survive
  navigation, and both are written to localStorage so they survive a reload,
  which is the difference between a shop and a picture of one.

  Storage is read after hydration, not during the first render, so the server
  HTML and the first client render agree and React has nothing to complain
  about; the badge fills in a frame later.
*/

export interface CartLine {
  slug: string;
  size: Size;
  qty: number;
}

interface CartValue {
  lines: CartLine[];
  detailed: { key: string; colourway: Colourway; size: Size; qty: number; line: number }[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  toFreeDelivery: number;
  add: (slug: string, size: Size) => void;
  setQty: (slug: string, size: Size, qty: number) => void;
  remove: (slug: string, size: Size) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  /** Something was just added; the nav badge pulses on it. */
  lastAdded: number;
}

const CartContext = createContext<CartValue | null>(null);
const KEY = "boucher-cart";
const WISH = "boucher-wish";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const rawW = localStorage.getItem(WISH);
      // Deferred to a microtask so this effect does not set state synchronously.
      queueMicrotask(() => {
        if (raw) setLines(JSON.parse(raw));
        if (rawW) setWishlist(JSON.parse(rawW));
        setHydrated(true);
      });
    } catch {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
      localStorage.setItem(WISH, JSON.stringify(wishlist));
    } catch {
      /* private mode; the basket still works for the session */
    }
  }, [lines, wishlist, hydrated]);

  const add = useCallback((slug: string, size: Size) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug && l.size === size);
      if (found) return prev.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { slug, size, qty: 1 }];
    });
    setLastAdded(Date.now());
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: Size, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.slug === slug && l.size === size))
        : prev.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((slug: string, size: Size) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.size === size)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const value = useMemo<CartValue>(() => {
    const detailed = lines.flatMap((l) => {
      const colourway = bySlug(l.slug);
      return colourway ? [{ key: `${l.slug}-${l.size}`, colourway, size: l.size, qty: l.qty, line: colourway.price * l.qty }] : [];
    });
    const subtotal = detailed.reduce((n, d) => n + d.line, 0);
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY;
    return {
      lines,
      detailed,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      toFreeDelivery: subtotal >= FREE_DELIVERY_OVER ? 0 : FREE_DELIVERY_OVER - subtotal,
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
      wishlist,
      toggleWish,
      lastAdded,
    };
  }, [lines, open, wishlist, lastAdded, add, setQty, remove, clear, toggleWish]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

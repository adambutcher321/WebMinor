'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  FREE_DELIVERY_OVER,
  deliveryCost,
  productBySlug,
  type Product,
} from './shop';

/*
  The basket lives in the route layout, not in the page, so it survives the
  navigation from the storefront to /checkout. A provider mounted in the page
  would be torn down and remounted on that click, and the visitor would arrive
  at checkout with an empty basket — which is exactly the bug that makes a
  demo shop feel like a mockup.
*/

export interface CartItem {
  slug: string;
  qty: number;
}

interface CartValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  deliveryId: string;
  setDeliveryId: (id: string) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  detailed: { product: Product; qty: number; line: number }[];
  /** Pence still to spend for free delivery, or 0 once it is earned. */
  toFreeDelivery: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryId, setDeliveryId] = useState('standard');
  const [open, setOpen] = useState(false);

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found) {
        return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartValue>(() => {
    const detailed = items.flatMap((i) => {
      const product = productBySlug(i.slug);
      return product ? [{ product, qty: i.qty, line: product.price * i.qty }] : [];
    });

    const subtotal = detailed.reduce((sum, d) => sum + d.line, 0);
    const delivery = deliveryCost(deliveryId, subtotal);

    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      deliveryId,
      setDeliveryId,
      add,
      setQty,
      remove,
      clear,
      detailed,
      toFreeDelivery: subtotal >= FREE_DELIVERY_OVER ? 0 : FREE_DELIVERY_OVER - subtotal,
      open,
      setOpen,
    };
  }, [items, deliveryId, open, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
}

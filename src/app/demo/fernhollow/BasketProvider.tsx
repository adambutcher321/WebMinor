'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useIsClient } from '../useClientEnv';
import { SERVICE_FEE, cabinBySlug, extras as allExtras } from './stay';

/*
  One basket for the whole route: the hero widget, the cabin grid and the
  extras shelf all read and write the same stay. Keeping it in context rather
  than in each section is what lets the extras shelf price "three nights of
  firewood" correctly without the shelf knowing anything about dates.

  Dates resolve on the client only. `new Date()` differs between the server
  render and the client, so the server ships an empty stay and the defaults
  appear once hydration has happened — the same approach the booking widget
  already used before the basket existed.
*/

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function defaultStay(): { from: string; to: string } {
  const from = new Date();
  from.setDate(from.getDate() + 14);
  const to = new Date(from);
  to.setDate(to.getDate() + 3);
  return { from: isoDate(from), to: isoDate(to) };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (!checkIn || !checkOut || Number.isNaN(a) || Number.isNaN(b) || b <= a) return 0;
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export interface BasketLine {
  id: string;
  name: string;
  /** Total for this line, already multiplied out. */
  total: number;
  detail: string;
}

interface BasketValue {
  ready: boolean;
  cabin: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  chosen: string[];
  today: string;
  setCabin: (slug: string) => void;
  setCheckIn: (v: string) => void;
  setCheckOut: (v: string) => void;
  setGuests: (n: number) => void;
  toggleExtra: (id: string) => void;
  hasExtra: (id: string) => boolean;
  lines: BasketLine[];
  total: number;
}

const BasketContext = createContext<BasketValue | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const ready = useIsClient();
  const fallback = useMemo(() => (ready ? defaultStay() : null), [ready]);

  const [cabin, setCabin] = useState('alderwood');
  const [pickedIn, setPickedIn] = useState<string | null>(null);
  const [pickedOut, setPickedOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [chosen, setChosen] = useState<string[]>([]);

  const checkIn = pickedIn ?? fallback?.from ?? '';
  const checkOut = pickedOut ?? fallback?.to ?? '';
  const nights = nightsBetween(checkIn, checkOut);

  const toggleExtra = useCallback((id: string) => {
    setChosen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const hasExtra = useCallback((id: string) => chosen.includes(id), [chosen]);

  const { lines, total } = useMemo(() => {
    const c = cabinBySlug(cabin);
    const out: BasketLine[] = [];

    if (nights > 0) {
      out.push({
        id: 'stay',
        name: c.name,
        total: c.rate * nights,
        detail: `£${c.rate} × ${nights} ${nights === 1 ? 'night' : 'nights'}`,
      });
    }

    for (const id of chosen) {
      const extra = allExtras.find((e) => e.id === id);
      if (!extra) continue;
      const qty = extra.unit === 'night' ? Math.max(nights, 1) : 1;
      out.push({
        id: extra.id,
        name: extra.name,
        total: extra.price * qty,
        detail: extra.unit === 'night' ? `£${extra.price} × ${qty} nights` : 'Per stay',
      });
    }

    if (out.length > 0) {
      out.push({
        id: 'service',
        name: 'Cleaning and linen',
        total: SERVICE_FEE,
        detail: 'Per stay',
      });
    }

    return { lines: out, total: out.reduce((sum, l) => sum + l.total, 0) };
  }, [cabin, nights, chosen]);

  const value: BasketValue = {
    ready,
    cabin,
    checkIn,
    checkOut,
    guests,
    nights,
    chosen,
    today: ready ? isoDate(new Date()) : '',
    setCabin,
    setCheckIn: setPickedIn,
    setCheckOut: setPickedOut,
    setGuests,
    toggleExtra,
    hasExtra,
    lines,
    total,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket(): BasketValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used inside a BasketProvider');
  return ctx;
}

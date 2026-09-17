"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "./timetable";
import type { Billing } from "./content";

/*
  Bookings and membership for the whole demo. Lives in the route layout so it
  survives navigation, written to localStorage so it survives a reload.
  Storage is read after hydration (deferred to a microtask) so the server HTML
  and the first client render agree.
*/

export interface Booking {
  sessionId: string;
  name: string;
  email: string;
  waitlist: boolean;
}

export interface Membership {
  levelIndex: number;
  billing: Billing;
  name: string;
  email: string;
  start: string;
}

export interface BookingValue {
  bookings: Booking[];
  bookedIds: string[];
  book: (b: Booking) => void;
  cancel: (sessionId: string) => void;
  membership: Membership | null;
  join: (m: Membership) => void;
  leave: () => void;
  drawer: Session | null;
  openDrawer: (s: Session) => void;
  closeDrawer: () => void;
  joinOpen: boolean;
  setJoinOpen: (v: boolean) => void;
}

const Ctx = createContext<BookingValue | null>(null);
const BOOKINGS = "threshold.bookings";
const MEMBERSHIP = "threshold.membership";

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [drawer, setDrawer] = useState<Session | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const b = localStorage.getItem(BOOKINGS);
      const m = localStorage.getItem(MEMBERSHIP);
      queueMicrotask(() => {
        if (b) setBookings(JSON.parse(b));
        if (m) setMembership(JSON.parse(m));
        setHydrated(true);
      });
    } catch {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(BOOKINGS, JSON.stringify(bookings));
      if (membership) localStorage.setItem(MEMBERSHIP, JSON.stringify(membership));
      else localStorage.removeItem(MEMBERSHIP);
    } catch {
      /* private mode; state still works for the session */
    }
  }, [bookings, membership, hydrated]);

  const book = useCallback((b: Booking) => {
    setBookings((prev) => [...prev.filter((x) => x.sessionId !== b.sessionId), b]);
  }, []);
  const cancel = useCallback((sessionId: string) => {
    setBookings((prev) => prev.filter((x) => x.sessionId !== sessionId));
  }, []);
  const join = useCallback((m: Membership) => setMembership(m), []);
  const leave = useCallback(() => setMembership(null), []);
  const openDrawer = useCallback((s: Session) => setDrawer(s), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);

  const value = useMemo<BookingValue>(
    () => ({
      bookings,
      bookedIds: bookings.map((b) => b.sessionId),
      book, cancel, membership, join, leave,
      drawer, openDrawer, closeDrawer, joinOpen, setJoinOpen,
    }),
    [bookings, book, cancel, membership, join, leave, drawer, openDrawer, closeDrawer, joinOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking(): BookingValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBooking must be used inside BookingProvider");
  return v;
}

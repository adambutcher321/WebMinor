'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useBasket } from './BasketProvider';
import { cabinBySlug, money } from './stay';

const GUEST_OPTIONS = [1, 2, 3, 4];

/*
  The widget no longer owns the stay.

  It used to hold its own dates, guests and nightly rate, which was fine while
  it was the only thing on the page that could take a booking. Now the cabin
  grid sets the cabin and the extras shelf adds lines, so a private copy of the
  dates would mean the hero quoting one total and the basket another. Everything
  here reads and writes the shared basket instead, and the price it shows is the
  basket's price — extras included.

  Dates still resolve on the client only: `new Date()` differs between the
  server render and the client, so the provider ships an empty stay and fills it
  after hydration, which keeps both passes identical.
*/
export default function BookingWidget() {
  const {
    ready,
    cabin,
    checkIn,
    checkOut,
    guests,
    nights,
    today,
    setCheckIn,
    setCheckOut,
    setGuests,
    total,
  } = useBasket();

  const [guestsOpen, setGuestsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const chosenCabin = cabinBySlug(cabin);

  // A dropdown that only closed by re-clicking its own trigger felt broken:
  // click anywhere else and it stayed open over the page.
  useEffect(() => {
    if (!guestsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!guestsRef.current?.contains(e.target as Node)) setGuestsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuestsOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [guestsOpen]);

  const shell =
    'w-full max-w-[340px] sm:max-w-[300px] rounded-2xl border border-white/15 bg-black/40 backdrop-blur-xl shadow-2xl';

  if (submitted) {
    return (
      <div
        className={`${shell} p-6 text-center`}
        style={{ fontFamily: 'var(--font-inter-fh)' }}
        role="status"
      >
        <div className="w-11 h-11 rounded-full bg-amber-300/15 border border-amber-300/30 flex items-center justify-center mx-auto mb-4">
          <Check className="w-5 h-5 text-amber-300" aria-hidden="true" />
        </div>
        <p
          className="text-lg mb-2"
          style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 500 }}
        >
          Request sent
        </p>
        <p className="text-sm text-white/60 leading-relaxed mb-5">
          We&apos;ll confirm {chosenCabin.name} and your extras within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-white/50 hover:text-white underline underline-offset-4 transition-colors"
        >
          Book another stay
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${shell} p-5`}
      style={{ fontFamily: 'var(--font-inter-fh)' }}
    >
      <p className="text-xs text-white/50 mb-1">Your stay</p>
      {/*
        Was an <h2>, which put a second-level heading inside a floating widget
        directly under the page <h1> and made the outline read as though the
        cabin were a section of the page.
      */}
      <p
        className="text-lg mb-4"
        style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 500 }}
      >
        {chosenCabin.name}
      </p>

      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2 mb-3">
        <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 cursor-pointer hover:border-white/20 transition-colors">
          <span className="block text-[10px] uppercase tracking-wide text-white/40">
            Check-in
          </span>
          {/*
            `text-sm` plus the native calendar glyph overflowed the column, so
            the date read "25/03/202" with the year cut off. min-w-0 lets the
            input shrink inside the grid track instead of pushing out of it.
          */}
          <input
            type="date"
            value={checkIn}
            min={today || undefined}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full min-w-0 bg-transparent text-[13px] text-white outline-none focus-visible:[outline:2px_solid_#fcd34d] focus-visible:outline-offset-2 [color-scheme:dark]"
          />
        </label>
        <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 cursor-pointer hover:border-white/20 transition-colors">
          <span className="block text-[10px] uppercase tracking-wide text-white/40">
            Check-out
          </span>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today || undefined}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full min-w-0 bg-transparent text-[13px] text-white outline-none focus-visible:[outline:2px_solid_#fcd34d] focus-visible:outline-offset-2 [color-scheme:dark]"
          />
        </label>
      </div>

      <div className="relative mb-4" ref={guestsRef}>
        <button
          type="button"
          onClick={() => setGuestsOpen((v) => !v)}
          aria-expanded={guestsOpen}
          aria-controls={listId}
          className="flex items-center justify-between w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:border-white/20 transition-colors"
        >
          <span className="text-sm text-white/70">Guests</span>
          <span className="flex items-center gap-1 text-sm">
            {guests} {guests === 1 ? 'guest' : 'guests'}
            <ChevronDown
              aria-hidden="true"
              className={`w-3.5 h-3.5 text-white/50 transition-transform ${
                guestsOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>
        {guestsOpen && (
          <div
            id={listId}
            className="absolute left-0 right-0 top-full mt-1 rounded-lg border border-white/15 bg-[#141816] shadow-xl overflow-hidden z-20"
          >
            {GUEST_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGuests(g);
                  setGuestsOpen(false);
                }}
                className="block w-full text-left text-sm px-3 py-2.5 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                {g} {g === 1 ? 'guest' : 'guests'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mb-4">
        {/* Sterling: the brand is Highland lochs and the contact number is +44. */}
        <span className="text-2xl font-semibold">
          {ready && nights > 0 ? money(total) : money(chosenCabin.rate)}
          <span className="text-sm font-normal text-white/50">
            {ready && nights > 0
              ? ` / ${nights} ${nights === 1 ? 'night' : 'nights'}`
              : ' /night'}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="block w-full text-center rounded-lg bg-white text-[#0d1210] text-sm font-semibold py-3 hover:bg-amber-50 transition-colors"
      >
        Reserve
      </button>
    </div>
  );
}

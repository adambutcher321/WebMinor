"use client";

import { useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { useIsClient } from "../../useClientEnv";

const SESSION_TYPES = ["1:1 Private Session", "Group Flow Class", "Retreat Day"];

/*
  Three things were wrong with this form, all of them things a visitor meets.

  Labels: every field was placeholder-only, and the date input and the session
  dropdown had no placeholder at all — so two of the five controls announced
  nothing whatsoever to a screen reader, and a sighted visitor met a bare date
  box with no idea what date it wanted. Visually-hidden labels now name all five;
  the design is unchanged.

  Past dates: the date input had no `min`, so "book" accepted a day last year.

  The session choice: the sessions page has a "Book this" button under each of
  the three cards, and all three landed here on a form that had silently reset
  to the first option. The button now carries the choice in the URL and the form
  opens on it.
*/
const FIELD =
  "w-full rounded-2xl border border-black/10 bg-[#faf6f0] px-4 py-3 text-sm text-[#2b2a26] placeholder:text-[#2b2a26]/35 outline-none focus:border-[#5b7052]/50 focus-visible:[outline:2px_solid_#5b7052] focus-visible:outline-offset-2 transition-colors";

const LABEL = "sr-only";

export default function BookingForm() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("session");
  const initialType =
    requested && SESSION_TYPES.includes(requested) ? requested : SESSION_TYPES[0];

  const [sessionType, setSessionType] = useState(initialType);
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nameId = useId();
  const phoneId = useId();
  const typeId = useId();
  const dateId = useId();
  const notesId = useId();

  // `new Date()` differs between the server render and the client, so the floor
  // for the date picker is only applied once hydrated.
  const isClient = useIsClient();
  const today = useMemo(
    () => (isClient ? new Date().toISOString().slice(0, 10) : undefined),
    [isClient],
  );

  if (submitted) {
    return (
      <div
        className="rounded-[2rem] border border-black/5 bg-white p-8 sm:p-10 text-center"
        role="status"
      >
        <div className="w-12 h-12 rounded-full bg-[#5b7052]/10 border border-[#5b7052]/30 flex items-center justify-center mx-auto mb-5">
          <Check className="w-5 h-5 text-[#5b7052]" aria-hidden="true" />
        </div>
        <p
          className="text-2xl mb-2"
          style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
        >
          Request sent
        </p>
        <p
          className="text-sm text-[#2b2a26]/60 leading-relaxed mb-6"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {sessionType}
          {date
            ? ` — requested for ${new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`
            : ""}
          . Jessica will reply within a day to confirm your slot.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-[#2b2a26]/50 hover:text-[#2b2a26] underline underline-offset-4 transition-colors"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Book another session
        </button>
        <p
          className="text-xs text-[#2b2a26]/35 pt-6"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Concept demo — nothing was actually sent.
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[2rem] border border-black/5 bg-white p-6 sm:p-10 space-y-4"
      style={{ fontFamily: "var(--font-manrope)" }}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={nameId} className={LABEL}>
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor={phoneId} className={LABEL}>
            Phone number
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Phone number"
            className={FIELD}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={typeId} className={LABEL}>
            Session type
          </label>
          <select
            id={typeId}
            name="sessionType"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className={FIELD}
          >
            {SESSION_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={dateId} className={LABEL}>
            Preferred date
          </label>
          <input
            id={dateId}
            name="date"
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className={`${FIELD} [color-scheme:light]`}
          />
        </div>
      </div>

      <div>
        <label htmlFor={notesId} className={LABEL}>
          Anything Jessica should know before your session?
        </label>
        <textarea
          id={notesId}
          name="notes"
          placeholder="Anything Jessica should know before your session?"
          rows={3}
          className={`${FIELD} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-[#2b2a26] text-white text-sm font-semibold py-3.5 hover:bg-[#3d3b34] transition-colors"
      >
        Confirm booking request
      </button>
      <p className="text-xs text-[#2b2a26]/35 text-center">
        Concept demo — this form is not connected.
      </p>
    </form>
  );
}

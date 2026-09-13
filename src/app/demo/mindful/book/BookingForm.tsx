"use client";

import { useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { useIsClient } from "../../useClientEnv";
import { RESET, RETREATS, WAYS } from "../content";
import s from "../mindful.module.css";

/*
  The one form on the site. Every "book", "apply" and "hold a place" button
  lands here with `?session=` naming what it was for, and the form opens on it.
  The free call is the default, because it is the thing I would rather you did
  first.
*/
export const CALL = "Free twenty-minute call";

const OPTIONS = [
  CALL,
  ...WAYS.map((w) => w.bookAs),
  RESET.name,
  ...RETREATS.map((r) => r.name),
];

const FIELD =
  "w-full rounded-2xl border px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[#5b7052]/60 focus-visible:[outline:2px_solid_#5b7052] focus-visible:outline-offset-2";
const FIELD_STYLE = { borderColor: "var(--line)", background: "var(--cream)", color: "var(--ink)" } as const;

export default function BookingForm() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("session");
  const initial = requested && OPTIONS.includes(requested) ? requested : CALL;

  const [sessionType, setSessionType] = useState(initial);
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const typeId = useId();
  const dateId = useId();
  const notesId = useId();

  const isClient = useIsClient();
  const today = useMemo(() => (isClient ? new Date().toISOString().slice(0, 10) : undefined), [isClient]);

  const isCall = sessionType === CALL;
  const isReset = sessionType === RESET.name;
  const isRetreat = RETREATS.some((r) => r.name === sessionType);

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-white border p-8 sm:p-10" style={{ borderColor: "var(--line)" }} role="status">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--sage-soft)" }}>
          <Check className="w-5 h-5" style={{ color: "var(--sage)" }} aria-hidden="true" />
        </div>
        <p className={`${s.h3} mt-5`}>{isCall ? "I'll call you." : isReset ? "Application received." : "Request sent."}</p>
        <p className={`${s.body} mt-3`}>
          {sessionType}
          {date && !isRetreat
            ? `, requested for ${new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`
            : ""}
          . I reply to everything within a day, usually the same afternoon.
          {isReset ? " We will speak before anything is paid." : ""}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className={`${s.small} mt-6 underline underline-offset-4 hover:text-[#2b2a26] transition-colors`}
        >
          Send another
        </button>
        <p className={`${s.small} mt-6`}>Concept demo. Nothing was actually sent.</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[2rem] bg-white border p-6 sm:p-10 space-y-5"
      style={{ borderColor: "var(--line)" }}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor={typeId} className={s.eyebrow}>
          What for
        </label>
        <select
          id={typeId}
          name="sessionType"
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          className={`${FIELD} mt-2 appearance-none`}
          style={FIELD_STYLE}
        >
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <p className={`${s.small} mt-2`}>
          {isCall && "Twenty minutes on the phone. We talk about your week and I tell you where to start."}
          {isReset && `${RESET.places}. ${RESET.starts}. Nothing is paid until we have spoken.`}
          {isRetreat && "I will hold the place for three days while we sort the details."}
          {!isCall && !isReset && !isRetreat && "Tell me a preferred day and I will come back with times."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={nameId} className={s.eyebrow}>
            Your name
          </label>
          <input id={nameId} name="name" type="text" required autoComplete="name" className={`${FIELD} mt-2`} style={FIELD_STYLE} />
        </div>
        <div>
          <label htmlFor={phoneId} className={s.eyebrow}>
            Phone
          </label>
          <input id={phoneId} name="phone" type="tel" required autoComplete="tel" className={`${FIELD} mt-2`} style={FIELD_STYLE} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={emailId} className={s.eyebrow}>
            Email
          </label>
          <input id={emailId} name="email" type="email" required autoComplete="email" className={`${FIELD} mt-2`} style={FIELD_STYLE} />
        </div>
        {!isRetreat && (
          <div>
            <label htmlFor={dateId} className={s.eyebrow}>
              {isCall ? "A good day to call" : "Preferred date"}
            </label>
            <input
              id={dateId}
              name="date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className={`${FIELD} mt-2 [color-scheme:light]`}
              style={FIELD_STYLE}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor={notesId} className={s.eyebrow}>
          {isReset ? "What has not worked so far" : "Anything I should know"}
        </label>
        <textarea
          id={notesId}
          name="notes"
          rows={4}
          placeholder={isReset ? "Apps, classes, resolutions. Be honest, it helps." : "Injuries, a stiff neck, a fear of being the least flexible person in the room."}
          className={`${FIELD} mt-2 resize-none placeholder:text-[#2b2a26]/35`}
          style={FIELD_STYLE}
        />
      </div>

      <button type="submit" className={`${s.btn} ${s.btnInk} w-full justify-center`}>
        {isCall ? "Ask Jessica to call" : isReset ? "Apply for a place" : isRetreat ? "Hold my place" : "Send the request"}
      </button>
      <p className={`${s.small} text-center`}>Concept demo. This form is not connected.</p>
    </form>
  );
}

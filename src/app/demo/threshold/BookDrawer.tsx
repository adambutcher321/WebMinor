"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { placesLeft, hasStarted, DAYS_LONG } from "./timetable";
import { programmeById, coachBySlug } from "./content";
import { useBooking } from "./BookingProvider";
import { useNow } from "./Rail";
import { weekRowId } from "./Week";
import s from "./threshold.module.css";

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
  One drawer for booking and waitlisting. Slides in from the right; Escape
  and the scrim close it. "done" is reset whenever a new session opens
  because it's compared against the current drawer's id, so the confirmation
  never shows for the wrong class. A session whose start time has passed
  while the drawer is still open (or is handed to it already passed) shows
  as started instead of a form -- there's nothing left to book.

  It's a real dialog: while it's open, Tab is trapped inside it, the page
  behind can't scroll, and closing (by any route) returns focus to whatever
  opened it, or, if that control no longer exists (a booking replaces the
  pill that opened this with the Booked label), to that row itself, or,
  failing that, the selected day tab. The top-right dismiss is only rendered
  for the plain form -- once there's a single-button outcome panel (booked,
  waitlisted, or already started), its own "Close" pill is the only close
  affordance, so there is never more than one control named "Close".
*/
export default function BookDrawer() {
  const { drawer, closeDrawer, book, bookedIds } = useBooking();
  const now = useNow();
  const [done, setDone] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const panelCloseRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const confirmed = drawer != null && done === drawer.id;
  const started = drawer != null && hasStarted(now, drawer);
  const showsOutcomePanel = confirmed || started;

  useEffect(() => {
    if (!drawer) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    nameRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      // `body` isn't a real opener: some browsers (Firefox, Safari) never
      // focus a button on click at all, so the "opener" captured above can
      // be `body` itself even on a perfectly normal open, not just a
      // removed one -- treat that the same as "the opener is gone."
      const opener = openerRef.current;
      if (opener && opener.isConnected && opener !== document.body) {
        opener.focus();
        return;
      }
      const fallback = document.getElementById(weekRowId(drawer.id))
        ?? document.querySelector<HTMLElement>('#week [role="tab"][aria-selected="true"]');
      fallback?.focus();
    };
  }, [drawer, closeDrawer]);

  useEffect(() => {
    if (showsOutcomePanel) panelCloseRef.current?.focus();
  }, [showsOutcomePanel]);

  if (!drawer) return null;

  const left = placesLeft(drawer, bookedIds);
  const waitlist = left === 0;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    book({ sessionId: drawer.id, name: String(f.get("name")), email: String(f.get("email")), waitlist });
    setDone(drawer.id);
  };

  return (
    <div className={s.scrim} onClick={closeDrawer}>
      <aside ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="bd-title" className={s.drawer} onClick={(e) => e.stopPropagation()}>
        {!showsOutcomePanel && (
          <button type="button" className={s.drawerClose} onClick={closeDrawer} aria-label="Close">Close</button>
        )}
        <p className={s.eyebrow}>
          {confirmed ? (waitlist ? "On the list" : "Booked") : started ? "Closed" : waitlist ? "Waitlist" : "Book a place"}
        </p>
        <h2 id="bd-title" className={`${s.display} ${s.drawerTitle}`}>{programmeById(drawer.programme).name}</h2>
        <p className={s.drawerMeta}>
          {DAYS_LONG[drawer.day]} {drawer.time} · with {coachBySlug(drawer.coach).name} · {waitlist ? "full" : `${left} left`}
        </p>

        {confirmed ? (
          <div className={s.drawerDone}>
            <p className={`${s.display} ${s.drawerDoneMark}`}>{waitlist ? "On the list" : "You're in"}</p>
            <p>{waitlist ? "We'll email you the moment a place opens." : "Arrive ten minutes early. Chalk is provided."}</p>
            <button ref={panelCloseRef} type="button" className={s.pill} onClick={closeDrawer}>Close</button>
          </div>
        ) : started ? (
          <div className={s.drawerDone}>
            <p className={`${s.display} ${s.drawerDoneMark} ${s.drawerStartedMark}`}>Already under way</p>
            <p>{"This one's started. Pick another time on the wall."}</p>
            <button ref={panelCloseRef} type="button" className={s.pill} onClick={closeDrawer}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className={s.drawerForm}>
            <label>Name<input ref={nameRef} name="name" required autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <button type="submit" className={s.pill}>{waitlist ? "Confirm waitlist" : "Confirm booking"}</button>
          </form>
        )}
      </aside>
    </div>
  );
}

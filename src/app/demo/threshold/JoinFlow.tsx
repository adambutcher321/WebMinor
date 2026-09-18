"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { LEVELS, priceFor, programmeById, type Billing } from "./content";
import { nextClass, DAYS_LONG } from "./timetable";
import { useBooking } from "./BookingProvider";
import { useNow } from "./Rail";
import { chosen } from "./Membership";
import s from "./threshold.module.css";

/*
  JoinFlow itself lives in the layout, mounted once well before the
  membership section (and the `chosen` store it reads) has anything real in
  it. The dialog's actual body is a separate component, JoinDialog, mounted
  only while `joinOpen` is true -- that's what lets its `useState(chosen...)`
  calls read the slider's CURRENT choice: they run at mount time, and a
  fresh mount happens every time the drawer opens.
*/
function JoinDialog({ close }: { close: () => void }) {
  const { join, membership } = useBooking();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [levelIndex, setLevel] = useState(chosen.levelIndex);
  const [billing, setBilling] = useState<Billing>(chosen.billing);
  const now = useNow();
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = previousOverflow;
    };
  }, [close]);

  const price = priceFor(levelIndex, billing);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    join({ levelIndex, billing, name: String(f.get("name")), email: String(f.get("email")), start: String(f.get("start")) });
    setStep(3);
  };
  const first = now ? nextClass(now) : null;

  return (
    <div className={s.scrim} onClick={close}>
      <aside ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="jf-title" className={s.drawer} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={s.drawerClose} onClick={close} aria-label="Close">Close</button>
        <p className={s.eyebrow}>Step {step} of 3</p>

        {step === 1 && (
          <>
            <h2 id="jf-title" className={`${s.display} ${s.drawerTitle}`}>{LEVELS[levelIndex].label}</h2>
            <p className={s.drawerMeta}>£{price.perMonth} a month, billed {billing}. {billing === "annual" ? `You save £${price.saving}.` : "Switch to annual to save two months."}</p>
            <div className={s.stepLevels}>
              {LEVELS.map((l, i) => (
                <button key={l.label} type="button" data-on={i === levelIndex} onClick={() => setLevel(i)}>{l.label}<b>£{priceFor(i, billing).perMonth}</b></button>
              ))}
            </div>
            <div className={s.billing} role="group" aria-label="Billing">
              <button type="button" data-on={billing === "monthly"} onClick={() => setBilling("monthly")}>Monthly</button>
              <button type="button" data-on={billing === "annual"} onClick={() => setBilling("annual")}>Annual</button>
            </div>
            <button type="button" className={s.pill} onClick={() => setStep(2)}>Continue</button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={submit} className={s.drawerForm}>
            <h2 id="jf-title" className={`${s.display} ${s.drawerTitle}`}>About you</h2>
            <label>Name<input name="name" required autoComplete="name" defaultValue={membership?.name} /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" defaultValue={membership?.email} /></label>
            <label>Start date<input name="start" type="date" required /></label>
            <button type="submit" className={s.pill}>Join</button>
          </form>
        )}

        {step === 3 && (
          <div className={s.drawerDone}>
            <h2 id="jf-title" className={`${s.display} ${s.drawerDoneMark}`}>Welcome in</h2>
            <p>{LEVELS[levelIndex].label}, £{price.perMonth} a month. Nothing is charged until your start date.</p>
            {first && <p>Your first session could be {programmeById(first.programme).name}, {DAYS_LONG[first.day]} {first.time}.</p>}
            <button type="button" className={s.pill} onClick={close}>Done</button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function JoinFlow() {
  const { joinOpen, setJoinOpen } = useBooking();
  const close = useCallback(() => setJoinOpen(false), [setJoinOpen]);
  if (!joinOpen) return null;
  return <JoinDialog close={close} />;
}

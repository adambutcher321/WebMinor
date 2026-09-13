"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import s from "../mindful.module.css";

/* Demo only: nothing is sent. The success state says so. */
export default function GuideForm() {
  const [done, setDone] = useState(false);
  const nameId = useId();
  const emailId = useId();

  if (done) {
    return (
      <div className="rounded-[2rem] bg-white border p-8 sm:p-10" style={{ borderColor: "var(--line)" }} role="status">
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--sage-soft)" }}>
          <Check className="w-5 h-5" style={{ color: "var(--sage)" }} aria-hidden="true" />
        </div>
        <p className={`${s.h3} mt-5`}>Day one is on its way.</p>
        <p className={`${s.body} mt-3`}>
          Three minutes of breathing on the edge of the bed. Tomorrow, your spine.
          If it does not arrive, look in the folder your email hides things in.
        </p>
        <p className={`${s.small} mt-6`}>Concept demo. Nothing was actually sent.</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[2rem] bg-white border p-8 sm:p-10"
      style={{ borderColor: "var(--line)" }}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <p className={s.h3}>Send me the seven mornings.</p>
      <p className={`${s.body} mt-2`}>One a day, for a week. Then nothing unless you ask.</p>
      <div className="mt-7 space-y-4">
        <div>
          <label htmlFor={nameId} className={s.eyebrow}>
            First name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="given-name"
            className="mt-2 w-full rounded-2xl border px-4 py-3.5 text-[15px] outline-none focus:border-[#5b7052]/60 transition-colors"
            style={{ borderColor: "var(--line)", background: "var(--cream)", color: "var(--ink)" }}
          />
        </div>
        <div>
          <label htmlFor={emailId} className={s.eyebrow}>
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-2xl border px-4 py-3.5 text-[15px] outline-none focus:border-[#5b7052]/60 transition-colors"
            style={{ borderColor: "var(--line)", background: "var(--cream)", color: "var(--ink)" }}
          />
        </div>
      </div>
      <button type="submit" className={`${s.btn} ${s.btnInk} mt-6 w-full justify-center`}>
        Start with day one
      </button>
      <p className={`${s.small} mt-4 text-center`}>Concept demo. This form is not connected.</p>
    </form>
  );
}

"use client";

import { useId, useState } from "react";
import s from "../boucher.module.css";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const aboutId = useId();
  const msgId = useId();

  if (sent) {
    return (
      <div className={`${s.card} p-8`} role="status">
        <p className={s.h3}>Got it.</p>
        <p className={`${s.body} mt-2`}>One of the two of us will reply within a working day, usually the one who is not at the factory.</p>
        <p className={`${s.micro} mt-6`}>Concept demo. Nothing was sent.</p>
      </div>
    );
  }

  return (
    <form
      className={`${s.card} p-6 sm:p-8 space-y-4`}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={nameId} className={s.micro}>Name</label>
          <input id={nameId} name="name" type="text" required autoComplete="name" className={`${s.field} mt-2`} />
        </div>
        <div>
          <label htmlFor={emailId} className={s.micro}>Email</label>
          <input id={emailId} name="email" type="email" required autoComplete="email" className={`${s.field} mt-2`} />
        </div>
      </div>
      <div>
        <label htmlFor={aboutId} className={s.micro}>About</label>
        <select id={aboutId} name="about" className={`${s.field} mt-2 appearance-none`} defaultValue="order">
          <option value="order">An order</option>
          <option value="sizing">Sizing</option>
          <option value="repair">A repair</option>
          <option value="wholesale">Stocking the jacket</option>
          <option value="press">Press</option>
          <option value="else">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor={msgId} className={s.micro}>Message</label>
        <textarea id={msgId} name="message" rows={5} required className={`${s.field} mt-2 resize-none`} placeholder="Order numbers help. So do photos, if it is a repair." />
      </div>
      <button type="submit" className={`${s.btn} ${s.btnFg} w-full justify-center`}>
        Send
      </button>
      <p className={`${s.micro} text-center`} style={{ letterSpacing: "0.08em", textTransform: "none" }}>
        Concept demo. This form is not connected.
      </p>
    </form>
  );
}

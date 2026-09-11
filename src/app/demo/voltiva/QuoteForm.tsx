'use client';

import { useId, useState } from 'react';
import { Check } from 'lucide-react';
import { SERVICES } from './data';

const FIELD =
  'w-full rounded-lg border border-[#0B1D33]/12 bg-white px-4 py-3 text-[16px] text-[#0B1D33] placeholder:text-[#59636E]/60 outline-none transition-colors focus:border-[#1677FF] focus-visible:[outline:2px_solid_#1677FF] focus-visible:outline-offset-2';

export default function QuoteForm() {
  const [sent, setSent] = useState(false);
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const jobId = useId();
  const detailId = useId();

  if (sent) {
    return (
      <div
        className="rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(11,29,51,0.10)] sm:p-10"
        role="status"
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0FA3A6]/12">
          <Check className="h-5 w-5 text-[#0FA3A6]" aria-hidden="true" />
        </div>
        <p
          className="mb-2 text-2xl font-bold text-[#0B1D33]"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Request received
        </p>
        <p className="mx-auto max-w-sm text-[16px] leading-relaxed text-[#59636E]">
          One of our engineers will call you back with a fixed price. If it&rsquo;s
          an emergency, ring{' '}
          <a
            href="tel:+441752000000"
            className="font-semibold text-[#1677FF] underline underline-offset-4"
          >
            01752 000 000
          </a>{' '}
          instead — we answer that one around the clock.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[14px] text-[#59636E] underline underline-offset-4 transition-colors hover:text-[#0B1D33]"
        >
          Send another request
        </button>
        <p className="pt-6 text-[13px] text-[#59636E]/70">
          Concept demo — nothing was actually sent.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(11,29,51,0.10)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={nameId}
            className="mb-1.5 block text-[14px] font-semibold text-[#0B1D33]"
          >
            Your name
          </label>
          <input id={nameId} name="name" type="text" required autoComplete="name" placeholder="Jane Hollis" className={FIELD} />
        </div>
        <div>
          <label
            htmlFor={phoneId}
            className="mb-1.5 block text-[14px] font-semibold text-[#0B1D33]"
          >
            Phone
          </label>
          <input id={phoneId} name="phone" type="tel" required autoComplete="tel" placeholder="07700 900000" className={FIELD} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={emailId}
            className="mb-1.5 block text-[14px] font-semibold text-[#0B1D33]"
          >
            Email
          </label>
          <input id={emailId} name="email" type="email" required autoComplete="email" placeholder="jane@example.com" className={FIELD} />
        </div>
        <div>
          <label
            htmlFor={jobId}
            className="mb-1.5 block text-[14px] font-semibold text-[#0B1D33]"
          >
            What do you need?
          </label>
          <select id={jobId} name="job" className={FIELD} defaultValue={SERVICES[0].title}>
            {SERVICES.map((s) => (
              <option key={s.title} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor={detailId}
          className="mb-1.5 block text-[14px] font-semibold text-[#0B1D33]"
        >
          Tell us about the job
        </label>
        <textarea
          id={detailId}
          name="detail"
          rows={4}
          placeholder="Rough age of the property, what's happening, and when suits you."
          className={`${FIELD} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#1677FF] py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#0F5FD6]"
      >
        Request a fixed price
      </button>
      <p className="text-center text-[13px] text-[#59636E]/70">
        Concept demo — this form is not connected.
      </p>
    </form>
  );
}

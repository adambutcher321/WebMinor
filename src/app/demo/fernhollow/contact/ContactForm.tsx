'use client';

import { useId, useState } from 'react';
import { Check } from 'lucide-react';

/*
  Two problems here, both of which a visitor meets immediately.

  Accessibility: every field was placeholder-only. A placeholder is not a label —
  it disappears the moment you type, and a screen reader announcing "edit text"
  with no name gives no way to tell the three fields apart. Real labels now sit
  on every input, visually hidden so the design is unchanged.

  Feedback: the form called preventDefault and did nothing else, so pressing
  "Send enquiry" produced no response at all — the fine print explained the form
  was not connected, but only after the visitor had already been ignored. It
  now resolves into a confirmation, the same way the booking widget does. Still
  no network call: this is a concept demo and there is nowhere real to send it.
*/
const FIELD =
  'w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-200/40 focus:bg-white/[0.05] focus-visible:[outline:2px_solid_#fcd34d] focus-visible:outline-offset-2 transition-colors';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  if (sent) {
    return (
      <div
        className="rounded-2xl border border-amber-200/20 bg-white/[0.03] p-8 text-center"
        style={{ fontFamily: 'var(--font-inter-fh)' }}
        role="status"
      >
        <div className="w-11 h-11 rounded-full bg-amber-300/15 border border-amber-300/30 flex items-center justify-center mx-auto mb-4">
          <Check className="w-5 h-5 text-amber-300" aria-hidden="true" />
        </div>
        <p
          className="text-xl mb-2"
          style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 500 }}
        >
          Thank you
        </p>
        <p className="text-sm text-white/60 leading-relaxed mb-5">
          We&apos;ve got your note and we&apos;ll come back to you within a day,
          usually much sooner.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-xs text-white/50 hover:text-white underline underline-offset-4 transition-colors"
        >
          Send another enquiry
        </button>
        <p className="text-xs text-white/30 pt-5">
          Concept demo &mdash; nothing was actually sent.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3.5"
      style={{ fontFamily: 'var(--font-inter-fh)' }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor={nameId} className="sr-only">
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
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email address"
            className={FIELD}
          />
        </div>
      </div>
      <div>
        <label htmlFor={messageId} className="sr-only">
          Tell us about your stay
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          placeholder="Tell us about your stay..."
          rows={4}
          className={`${FIELD} resize-none`}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-2xl bg-white text-[#0d1210] text-sm font-semibold py-3.5 hover:bg-amber-50 transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
      >
        Send enquiry
      </button>
      <p className="text-xs text-white/30 text-center pt-1">
        Concept demo &mdash; this form is not connected.
      </p>
    </form>
  );
}

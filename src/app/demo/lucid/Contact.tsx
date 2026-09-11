'use client';

import { useState } from 'react';
import { Reveal } from './Motion';
import s from './contact.module.css';

/*
  Contact.

  Two routes rather than one form: most people arriving here want a demo
  appointment, and the rest have a question that a form thread answers badly.
  Splitting them means neither has to pretend to be the other.

  Nothing is sent anywhere — the form reports that plainly on success rather
  than implying a message is in flight.
*/

const STUDIOS = [
  { city: 'London', at: '14 Rathbone Place, W1T', note: 'Open seven days' },
  { city: 'Manchester', at: '2 Blackfriars Street, M3', note: 'Closed Mondays' },
  { city: 'Bristol', at: '31 Park Street, BS1', note: 'Open seven days' },
];

const REASONS = ['Book a demo', 'Order support', 'Accessibility', 'Press', 'Something else'];

export default function Contact() {
  const [reason, setReason] = useState(REASONS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const ready = name.trim().length > 1 && email.includes('@') && message.trim().length > 4;

  return (
    <section className={s.section} id="contact">
      <div className={s.wrap}>
        <Reveal className={s.head}>
          <p className={s.eyebrow}>Get in touch</p>
          <h2 className={s.title}>Try one on, or just ask us something.</h2>
        </Reveal>

        <div className={s.grid}>
          {/* ---- studios ---- */}
          <Reveal className={s.studios} delay={80}>
            <h3 className={s.subTitle}>Come and wear it</h3>
            <p className={s.subBody}>
              Twenty minutes, no appointment needed, and nobody will try to sell
              you anything while you are in the headset.
            </p>

            <ul className={s.studioList}>
              {STUDIOS.map((st) => (
                <li className={s.studio} key={st.city}>
                  <span className={s.studioCity}>{st.city}</span>
                  <span className={s.studioAt}>{st.at}</span>
                  <span className={s.studioNote}>{st.note}</span>
                </li>
              ))}
            </ul>

            <dl className={s.direct}>
              <div>
                <dt className={s.directKey}>Email</dt>
                <dd className={s.directVal}>hello@lucid.example</dd>
              </div>
              <div>
                <dt className={s.directKey}>Phone</dt>
                <dd className={s.directVal}>020 7946 0412</dd>
              </div>
              <div>
                <dt className={s.directKey}>Hours</dt>
                <dd className={s.directVal}>Mon to Fri, 09:00 to 18:00</dd>
              </div>
            </dl>
          </Reveal>

          {/* ---- form ---- */}
          <Reveal className={s.formCard} delay={170}>
            {sent ? (
              <div className={s.sent} role="status">
                <span className={s.sentMark} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className={s.sentTitle}>That would have reached us.</h3>
                <p className={s.sentBody}>
                  This is a concept site, so nothing was actually sent. On a live
                  build this lands in the studio inbox and is answered the same day.
                </p>
                <button type="button" className={s.ghost} onClick={() => setSent(false)}>
                  Write another
                </button>
              </div>
            ) : (
              <form
                className={s.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (ready) setSent(true);
                }}
              >
                <h3 className={s.subTitle}>Send a message</h3>

                <div className={s.reasons}>
                  {REASONS.map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={`${s.reason} ${reason === r ? s.reasonOn : ''}`}
                      onClick={() => setReason(r)}
                      aria-pressed={reason === r}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className={s.fields}>
                  <label className={s.field}>
                    <span className={s.label}>Your name</span>
                    <input
                      className={s.input}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      placeholder="Alex Trevena"
                    />
                  </label>

                  <label className={s.field}>
                    <span className={s.label}>Email</span>
                    <input
                      className={s.input}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className={`${s.field} ${s.wide}`}>
                    <span className={s.label}>Message</span>
                    <textarea
                      className={`${s.input} ${s.textarea}`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder={
                        reason === 'Book a demo'
                          ? 'Which studio suits you, and roughly when?'
                          : 'Tell us what you need.'
                      }
                    />
                  </label>
                </div>

                <button type="submit" className={s.send} disabled={!ready}>
                  {ready ? `Send · ${reason}` : 'Fill in the three fields'}
                  <span className={s.sendDisc} aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                      <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                <p className={s.fine}>
                  Concept demo by WebMinor. Nothing you type here is transmitted or stored.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Anton, Inter } from 'next/font/google';
import KlikCard, { type CardVariant } from '../sections/KlikCard';
import { DELIVERY_FAST, colourways, money } from './cards';
import page from '../klik.module.css';
import s from './get.module.css';

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-klik-display', display: 'swap' });
const ui = Inter({ subsets: ['latin'], variable: '--font-klik-ui', display: 'swap' });

/*
  Ordering a card.

  Everything happens on one screen: the card is the product, so it stays in
  view and changes surface the moment a colour is chosen, rather than being
  replaced by a progress bar and three separate routes. The monster holds it
  up, which is the difference between a checkout and something worth finishing.

  Nothing is transmitted and no card number is ever requested — this is a
  concept store, and a demo that rendered a convincing payment field would be
  teaching people to type real details into a page that is not a payment page.
*/
export default function GetKlikPage() {
  const [variant, setVariant] = useState<CardVariant>('holo');
  const [fast, setFast] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [placed, setPlaced] = useState(false);
  // Minted when the order is placed, so the server and client never render different values.
  const [ref, setRef] = useState('');

  const chosen = useMemo(
    () => colourways.find((c) => c.id === variant) ?? colourways[0],
    [variant],
  );

  const delivery = fast ? DELIVERY_FAST : 0;
  const total = chosen.price + delivery;
  const ready = name.trim().length > 1 && email.includes('@');

  const step = placed ? 3 : ready ? 2 : 1;

  if (placed) {
    return (
      <div className={`${page.page} ${s.page} ${display.variable} ${ui.variable}`}>
        <div className={s.bar}>
          <Link href="/demo/klik" className={s.mark}>
            KLIK
          </Link>
        </div>

        <div className={s.done}>
          <div className={s.doneChar}>
            <Image
              src="/demo/klik/char-excited.webp"
              alt=""
              aria-hidden="true"
              width={1024}
              height={1024}
              sizes="(max-width: 700px) 70vw, 320px"
            />
          </div>
          <h1 className={s.doneHead}>
            It&apos;s <em>yours</em>.
          </h1>
          <p className={s.doneBody}>
            Your {chosen.name} card is on its way. Your virtual card is already live in
            the app, so you can spend before the real one lands on the mat.
          </p>
          <p className={s.doneRef}>Order {ref}</p>
          <div className={s.doneActions}>
            <Link href="/demo/klik" className={s.doneBtn}>
              Back to KLIK
            </Link>
            <Link href="/case-studies" className={`${s.doneBtn} ${s.doneBtnGhost}`}>
              See who built this
            </Link>
          </div>
          <p className={s.fine} style={{ marginTop: 26 }}>
            Concept demo by WebMinor. No order was placed and no payment was taken.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${page.page} ${s.page} ${display.variable} ${ui.variable}`}>
      <div className={s.bar}>
        <Link href="/demo/klik" className={s.back}>
          <span aria-hidden="true">←</span> Back
        </Link>

        <Link href="/demo/klik" className={s.mark}>
          KLIK
        </Link>

        <div className={s.steps}>
          {['Colour', 'Details', 'Done'].map((label, i) => {
            const n = i + 1;
            const cls =
              n === step ? s.stepDotOn : n < step ? s.stepDotDone : '';
            return (
              <span key={label} className={`${s.stepDot} ${cls}`}>
                <span className={s.stepNum}>{n}</span>
                <span className={s.stepLabel}>{label}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className={s.grid}>
        {/* ---- the card, always in view ---- */}
        <div>
          <div className={s.stage}>
            <div className={s.cardBig}>
              <KlikCard variant={variant} />
            </div>
            <div className={s.holder}>
              <Image
                src="/demo/klik/char-lean.webp"
                alt=""
                aria-hidden="true"
                width={1024}
                height={1024}
                sizes="(max-width: 700px) 40vw, 230px"
              />
            </div>
          </div>

          <div className={s.pickHead}>
            <h1 className={s.pickTitle}>
              Pick your <span className={s.pickName}>{chosen.name}</span>
            </h1>
            <span className={s.pickPrice}>{money(chosen.price)}</span>
          </div>

          <ul className={s.swatches}>
            {colourways.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`${s.swatch} ${c.id === variant ? s.swatchOn : ''}`}
                  onClick={() => setVariant(c.id as CardVariant)}
                  aria-pressed={c.id === variant}
                >
                  <span className={s.chipCircle} style={{ background: c.swatch }} />
                  <span className={s.swatchName}>{c.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <p className={s.pickNote}>{chosen.note}</p>
        </div>

        {/* ---- details ---- */}
        <div>
          <section className={s.panel}>
            <h2 className={s.panelTitle}>Where it goes</h2>
            <div className={s.fields}>
              <label className={s.wide}>
                <span className={s.label}>Name on the card</span>
                <input
                  className={s.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Trevena"
                  autoComplete="name"
                />
              </label>
              <label className={s.wide}>
                <span className={s.label}>Email</span>
                <input
                  className={s.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label className={s.wide}>
                <span className={s.label}>Address</span>
                <input className={s.input} placeholder="14 Fore Street" autoComplete="address-line1" />
              </label>
              <label>
                <span className={s.label}>Town</span>
                <input className={s.input} placeholder="Falmouth" autoComplete="address-level2" />
              </label>
              <label>
                <span className={s.label}>Postcode</span>
                <input className={s.input} placeholder="TR11 3QA" autoComplete="postal-code" />
              </label>
            </div>
          </section>

          <section className={s.panel}>
            <h2 className={s.panelTitle}>How fast</h2>
            <div className={s.choices}>
              <label className={`${s.choice} ${!fast ? s.choiceOn : ''}`}>
                <input
                  type="radio"
                  name="speed"
                  className={s.hiddenInput}
                  checked={!fast}
                  onChange={() => setFast(false)}
                />
                <span className={s.radio} aria-hidden="true" />
                <span>
                  <span className={s.choiceName}>Standard</span>
                  <span className={s.choiceNote} style={{ display: 'block' }}>
                    3 working days. Your virtual card works now anyway.
                  </span>
                </span>
                <span className={s.choicePrice}>Free</span>
              </label>

              <label className={`${s.choice} ${fast ? s.choiceOn : ''}`}>
                <input
                  type="radio"
                  name="speed"
                  className={s.hiddenInput}
                  checked={fast}
                  onChange={() => setFast(true)}
                />
                <span className={s.radio} aria-hidden="true" />
                <span>
                  <span className={s.choiceName}>Next day</span>
                  <span className={s.choiceNote} style={{ display: 'block' }}>
                    Order before 6pm and it is on the mat tomorrow.
                  </span>
                </span>
                <span className={s.choicePrice}>{money(DELIVERY_FAST)}</span>
              </label>
            </div>
          </section>

          <section className={s.panel}>
            <h2 className={s.panelTitle}>The damage</h2>
            <div className={s.sum}>
              <span>{chosen.name} card</span>
              <span>{money(chosen.price)}</span>
            </div>
            <div className={s.sum}>
              <span>Delivery</span>
              <span>{money(delivery)}</span>
            </div>
            <div className={s.sum}>
              <span>Monthly fee</span>
              <span>Free, forever</span>
            </div>
            <div className={s.sumTotal}>
              <span>Total</span>
              <span className={s.sumBig}>{money(total)}</span>
            </div>

            <button
              type="button"
              className={s.go}
              disabled={!ready}
              onClick={() => { setRef(`KLK-${Math.floor(10000 + Math.random() * 89999)}`); setPlaced(true); }}
            >
              {ready ? 'Send me the card' : 'Add your name and email'}
            </button>
            <p className={s.fine}>
              Concept demo by WebMinor. Nothing is charged, no card details are asked
              for, and nothing you type here is sent anywhere.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

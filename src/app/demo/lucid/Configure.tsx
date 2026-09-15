'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { BASE_PRICE, extras, groups, money, plain } from './shop';
import { Magnetic, Reveal } from './Motion';
import s from './configure.module.css';

/*
  Build and buy.

  The configurator and the basket are the same thing: there is one product, so
  a separate cart page would be a screen that exists only to repeat what is
  already on this one. The running total sits beside the choices and moves as
  they change, which is the part that has to be legible.

  Nothing is transmitted and no card details are ever requested — this is a
  concept store, and a demo that rendered a convincing payment field would be
  teaching people to type real card numbers into a page that is not a payment
  page.
*/
export default function Configure() {
  const [picked, setPicked] = useState<Record<string, string>>({
    storage: '256',
    band: 'titanium',
    lenses: 'none',
  });
  const [added, setAdded] = useState<string[]>([]);
  const [placed, setPlaced] = useState(false);
  const [ref] = useState(() => `LCD-${Math.floor(10000 + Math.random() * 89999)}`);

  const { lines, total } = useMemo(() => {
    const out: { id: string; name: string; detail: string; price: number }[] = [
      { id: 'base', name: 'Lucid One', detail: 'Headset, band and charger', price: BASE_PRICE },
    ];

    for (const g of groups) {
      const c = g.choices.find((x) => x.id === picked[g.id]);
      if (c && c.price > 0) {
        out.push({ id: g.id, name: c.name, detail: g.label, price: c.price });
      }
    }

    for (const id of added) {
      const e = extras.find((x) => x.id === id);
      if (e) out.push({ id: e.id, name: e.name, detail: 'Accessory', price: e.price });
    }

    return { lines: out, total: out.reduce((n, l) => n + l.price, 0) };
  }, [picked, added]);

  function toggleExtra(id: string) {
    setAdded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  if (placed) {
    return (
      <section className={s.section} id="buy">
        <div className={s.wrap}>
          <div className={s.done}>
            <span className={s.doneMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className={s.doneTitle}>Reserved.</h2>
            <p className={s.doneBody}>
              We&apos;ll email you when your Lucid One enters production, and again
              when it ships. Nothing is charged until it leaves the building.
            </p>
            <p className={s.doneRef}>Order {ref}</p>
            <button type="button" className={s.ghost} onClick={() => setPlaced(false)}>
              Change the configuration
            </button>
            <p className={s.fine}>
              Concept demo by WebMinor. No order was placed and no payment was taken.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={s.section} id="buy">
      <div className={s.wrap}>
        <Reveal className={s.head}>
          <p className={s.eyebrow}>Build yours</p>
          <h2 className={s.title}>Three decisions, then it&apos;s yours.</h2>
        </Reveal>

        <div className={s.grid}>
          <div className={s.options}>
            {groups.map((g) => (
              <fieldset className={s.group} key={g.id}>
                <legend className={s.legend}>
                  {g.label}
                  <span className={s.caption}>{g.caption}</span>
                </legend>

                <div className={s.choices}>
                  {g.choices.map((c) => {
                    const on = picked[g.id] === c.id;
                    return (
                      <label className={`${s.choice} ${on ? s.choiceOn : ''}`} key={c.id}>
                        <input
                          type="radio"
                          name={g.id}
                          className={s.realInput}
                          checked={on}
                          onChange={() => setPicked((p) => ({ ...p, [g.id]: c.id }))}
                        />
                        <span className={s.radio} aria-hidden="true" />
                        <span className={s.choiceBody}>
                          <span className={s.choiceName}>{c.name}</span>
                          <span className={s.choiceNote}>{c.note}</span>
                        </span>
                        <span className={s.choicePrice}>
                          {c.price === 0 ? 'Included' : `+ ${plain(c.price)}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <fieldset className={s.group}>
              <legend className={s.legend}>
                Add to the box
                <span className={s.caption}>Optional, and never pre-ticked</span>
              </legend>

              <div className={s.choices}>
                {extras.map((e) => {
                  const on = added.includes(e.id);
                  return (
                    <label className={`${s.choice} ${on ? s.choiceOn : ''}`} key={e.id}>
                      <input
                        type="checkbox"
                        className={s.realInput}
                        checked={on}
                        onChange={() => toggleExtra(e.id)}
                      />
                      <span className={s.check} aria-hidden="true" />
                      <span className={s.choiceBody}>
                        <span className={s.choiceName}>{e.name}</span>
                        <span className={s.choiceNote}>{e.note}</span>
                      </span>
                      <span className={s.choicePrice}>+ {plain(e.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className={s.basket}>
            <div className={s.basketFig}>
              <Image
                src="/demo/lucid/headset-one.webp"
                alt=""
                aria-hidden="true"
                width={900}
                height={513}
                sizes="(max-width: 980px) 60vw, 380px"
              />
            </div>

            <h3 className={s.basketTitle}>Your Lucid One</h3>

            <ul className={s.lines}>
              {lines.map((l) => (
                <li className={s.line} key={l.id}>
                  <span className={s.lineName}>{l.name}</span>
                  <span className={s.lineDetail}>{l.detail}</span>
                  <span className={s.linePrice}>{money(l.price)}</span>
                </li>
              ))}
            </ul>

            <div className={s.totalRow}>
              <span>Total</span>
              <span className={s.totalValue}>{plain(total)}</span>
            </div>
            <p className={s.vat}>Includes VAT. Free delivery, and free returns for 30 days.</p>

            <Magnetic strength={0.18} radius={60} className={s.buyWrap}>
            <button type="button" className={s.buy} onClick={() => setPlaced(true)}>
              Reserve yours
              <span className={s.buyDisc} aria-hidden="true">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            </Magnetic>
            <p className={s.fine}>
              Concept demo by WebMinor. Nothing is charged and no card details are asked for.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

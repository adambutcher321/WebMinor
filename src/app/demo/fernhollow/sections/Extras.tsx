'use client';

import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { useBasket } from '../BasketProvider';
import { extras, money } from '../stay';
import s from './fernhollow-sections.module.css';

/**
 * The extras shelf — the demo's shop.
 *
 * Add-ons are the highest-margin thing a short-stay business sells and the
 * moment they convert best is during the booking, not in a follow-up email, so
 * the shelf sits between choosing a cabin and seeing the total rather than
 * after checkout. Each card toggles a line straight into the basket bar, which
 * is what makes the mechanism legible to a visitor evaluating WebMinor: the
 * price at the foot of the screen moves the instant they press a button.
 */
export default function Extras() {
  const { toggleExtra, hasExtra } = useBasket();

  return (
    <section id="extras" className={`${s.band} ${s.bandPaper}`}>
      <div className={s.measure}>
        <p className={s.eyebrow}>Add to your stay</p>
        <h2 className={s.heading}>The small things that make it a holiday.</h2>
        <p className={s.lede}>
          Chosen now, ready when you arrive. Nothing here is a surprise on the
          final bill.
        </p>
      </div>

      <ul className={s.extraGrid}>
        {extras.map((e) => {
          const on = hasExtra(e.id);
          return (
            <li key={e.id}>
              <article className={`${s.extraCard} ${on ? s.extraCardOn : ''}`}>
                <div className={s.extraFrame}>
                  <Image
                    src={e.image}
                    alt={e.alt}
                    fill
                    sizes="(max-width: 767px) 92vw, (max-width: 1179px) 46vw, 23vw"
                  />
                </div>

                <div className={s.extraBody}>
                  <h3 className={s.extraName}>{e.name}</h3>
                  <p className={s.extraLine}>{e.line}</p>
                </div>

                <div className={s.extraFoot}>
                  <span className={s.extraPrice}>
                    {money(e.price)}
                    <span className={s.extraUnit}>
                      {e.unit === 'night' ? ' / night' : ' / stay'}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleExtra(e.id)}
                    aria-pressed={on}
                    className={`${s.extraBtn} ${on ? s.extraBtnOn : ''}`}
                  >
                    {on ? (
                      <>
                        <Check width={14} height={14} strokeWidth={2.2} aria-hidden="true" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus width={14} height={14} strokeWidth={2.2} aria-hidden="true" />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

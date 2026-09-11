'use client';

import Image from 'next/image';
import { useBasket } from '../BasketProvider';
import { cabins, money } from '../stay';
import s from './fernhollow-sections.module.css';

/**
 * The cabin index. Choosing one here sets the basket's cabin, so the rate the
 * extras shelf and the basket bar quote is always the rate of the cabin the
 * visitor is actually looking at — the selection is the page's primary
 * commercial act, not a decoration.
 */
export default function Cabins() {
  const { cabin, setCabin } = useBasket();

  return (
    <section id="cabins" className={s.band}>
      <div className={s.measure}>
        <p className={s.eyebrow}>Four cabins</p>
        <h2 className={s.heading}>
          Each one is the only building you can see.
        </h2>
        <p className={s.lede}>
          We keep four. Any more and we would stop knowing them. Pick the one
          that suits the weather you are after.
        </p>
      </div>

      <ul className={s.cabinGrid}>
        {cabins.map((c) => {
          const selected = c.slug === cabin;
          return (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => setCabin(c.slug)}
                aria-pressed={selected}
                className={`${s.cabinCard} ${selected ? s.cabinCardOn : ''}`}
              >
                <span className={s.cabinFrame}>
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(max-width: 767px) 92vw, (max-width: 1179px) 46vw, 30vw"
                  />
                  <span className={s.cabinRate}>
                    {money(c.rate)} <span className={s.cabinRateUnit}>/ night</span>
                  </span>
                </span>

                <span className={s.cabinBody}>
                  <span className={s.cabinTop}>
                    <span className={s.cabinName}>{c.name}</span>
                    <span className={s.cabinMark} aria-hidden="true" />
                  </span>
                  <span className={s.cabinPlace}>{c.place}</span>
                  <span className={s.cabinLine}>{c.line}</span>
                  <span className={s.cabinFeatures}>
                    {c.features.map((f) => (
                      <span key={f} className={s.feature}>
                        {f}
                      </span>
                    ))}
                    <span className={s.feature}>Sleeps {c.sleeps}</span>
                  </span>
                </span>

                <span className={s.cabinPick}>
                  {selected ? 'Selected for your stay' : 'Choose this cabin'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

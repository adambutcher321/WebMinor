'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../motion/Reveal';
import styles from './travel.module.css';

const CITIES = [
  { city: 'LONDON', code: 'GBP', sym: '£', rate: '1.00', spend: '£248' },
  { city: 'PARIS', code: 'EUR', sym: '€', rate: '1.17', spend: '€184' },
  { city: 'NEW YORK', code: 'USD', sym: '$', rate: '1.26', spend: '$412' },
  { city: 'TOKYO', code: 'JPY', sym: '¥', rate: '191.4', spend: '¥28,600' },
];

/**
 * Travel. The city list drives a live conversion panel — hovering or focusing a city
 * switches the rate, so the section is something the visitor operates rather than reads.
 */
export default function Travel() {
  const [active, setActive] = useState(0);
  const orbitRef = useRef<HTMLDivElement>(null);

  // The symbol cluster drifts against the scroll, giving the section depth without a
  // looping animation (M5 forbids anything with no end state).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = orbitRef.current;
    if (!el) return;
    let raf = 0;
    let last = -2;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      const p = (window.innerHeight / 2 - mid) / window.innerHeight;
      if (Math.abs(p - last) > 0.002) {
        last = p;
        el.style.setProperty('--drift', p.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const now = CITIES[active];

  return (
    <section className={styles.section} id="travel">
      <div className={styles.wrap}>
        <Reveal>
          <h2 className={styles.head}>
            MONEY WITHOUT
            <span className={styles.headAccent}>BORDERS.</span>
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {/* The city rail — hovering swaps the panel. */}
          <ul className={styles.cities}>
            {CITIES.map((c, i) => (
              <li key={c.city}>
                <button
                  type="button"
                  className={styles.city}
                  data-on={i === active}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <span className={styles.citySym}>{c.sym}</span>
                  <span className={styles.cityName}>{c.city}</span>
                  <span className={styles.cityCode}>{c.code}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.orbit} ref={orbitRef}>
            <Image
              className={styles.orbitArt}
              src="/demo/klik/currency.webp"
              alt="Chrome pound, euro, dollar and yen symbols orbiting in mid air"
              width={1024}
              height={1024}
              sizes="(max-width: 900px) 84vw, 38vw"
            />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTop}>
              <span className={styles.panelLabel}>SPENDING IN</span>
              <span className={styles.panelCity}>{now.city}</span>
            </div>

            <div className={styles.rateRow}>
              <span className={styles.rateFrom}>£1</span>
              <span className={styles.rateArrow} aria-hidden="true">
                →
              </span>
              <span className={styles.rateTo}>
                {now.sym}
                {now.rate}
              </span>
            </div>

            <dl className={styles.meta}>
              <div>
                <dt>THIS TRIP</dt>
                <dd>{now.spend}</dd>
              </div>
              <div>
                <dt>KLIK FEE</dt>
                <dd className={styles.zero}>£0.00</dd>
              </div>
            </dl>

            <p className={styles.panelNote}>Spend there like you live there.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Reveal from '../motion/Reveal';
import styles from './pots.module.css';

const POTS = [
  { name: 'IBIZA', emoji: '🍹', total: 1420, target: 2000, people: ['A', 'J', 'M', 'S'], tilt: -3 },
  { name: 'RENT', emoji: '🏠', total: 850, target: 850, people: ['Y', 'K'], tilt: 2 },
  { name: 'FESTIVAL', emoji: '🎸', total: 380, target: 600, people: ['A', 'M', 'T'], tilt: -2 },
  { name: 'ROAD TRIP', emoji: '🚗', total: 620, target: 900, people: ['J', 'S', 'Y'], tilt: 4 },
];

export default function Pots() {
  return (
    <section className={styles.section} id="pots">
      <div className={styles.wrap}>
        <Reveal>
          <h2 className={styles.head}>
            MONEY&rsquo;S BETTER
            <span className={styles.headAccent}>TOGETHER.</span>
          </h2>
        </Reveal>

        <Reveal className={styles.grid} stagger from="diag">
          {POTS.map((p) => {
            const pct = Math.round((p.total / p.target) * 100);
            const full = pct >= 100;
            return (
              <article
                key={p.name}
                className={styles.pot}
                style={{ '--tilt': `${p.tilt}deg` } as React.CSSProperties}
                data-full={full}
              >
                <header className={styles.potTop}>
                  <span className={styles.potEmoji} aria-hidden="true">
                    {p.emoji}
                  </span>
                  <span className={styles.potName}>{p.name}</span>
                </header>

                <p className={styles.potTotal}>
                  £{p.total.toLocaleString('en-GB')}
                  <span className={styles.potTarget}>/ £{p.target.toLocaleString('en-GB')}</span>
                </p>

                {/* The fill is the only accent on a full pot, so a finished pot reads
                    instantly against the others without a second colour. */}
                <div
                  className={styles.bar}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${p.name} pot, ${pct}% funded`}
                >
                  <span className={styles.barFill} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>

                <footer className={styles.potFoot}>
                  <ul className={styles.faces}>
                    {p.people.map((initial, i) => (
                      <li key={initial + i} className={styles.face} style={{ '--n': i } as React.CSSProperties}>
                        {initial}
                      </li>
                    ))}
                  </ul>
                  <span className={styles.potPct}>{full ? 'FULL' : `${pct}%`}</span>
                </footer>
              </article>
            );
          })}
        </Reveal>

        <Reveal className={styles.foot} stagger>
          <p className={styles.big}>Your money. Your people. One KLIK.</p>
          <p className={styles.small}>
            Open a pot, drop a link, watch it fill. Everyone sees the same number.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

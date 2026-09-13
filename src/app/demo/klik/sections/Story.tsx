'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '../motion/Reveal';
import styles from './story.module.css';

/**
 * Fires a callback the first time the element is well inside the viewport, then stops.
 * Used to start each section's payment animation on arrival — M5 requires these to run
 * once and settle, never loop.
 */
function useArrived(threshold = 0.45) {
  const ref = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setArrived(true);
      return;
    }
    const el = ref.current;
    if (!el || arrived) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArrived(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [arrived, threshold]);

  return { ref, arrived };
}

/* ---- SEND ------------------------------------------------------------- */

export function Send() {
  const { ref, arrived } = useArrived(0.5);

  return (
    <section className={styles.section} id="send">
      <div className={styles.wrap}>
        <Reveal>
          <h2 className={styles.head}>SEND.</h2>
        </Reveal>

        {/* The £20 physically travels between the two phones. The animation states the
            product before the copy does. */}
        <div className={styles.sendStage} ref={ref} data-go={arrived}>
          <div className={`${styles.phone} ${styles.phoneA}`}>
            <div className={styles.phoneTop}>
              <span className={styles.avatar} aria-hidden="true">A</span>
              <span className={styles.phoneWho}>ALEX</span>
              <span className={styles.phoneBal}>£412.60</span>
            </div>
            <ul className={styles.rows} aria-hidden="true">
              <li className={styles.row}><span>Flat white</span><span>−£3.40</span></li>
              <li className={styles.row}><span>Amy · dinner</span><span className={styles.rowIn}>+£31.20</span></li>
              <li className={styles.row}><span>Northern Rail</span><span>−£18.20</span></li>
            </ul>
            <div className={styles.phoneBody}>
              <span className={styles.phoneLabel}>SENDING TO</span>
              <span className={styles.phoneName}>JAKE</span>
              <span className={styles.sendBtn}>SEND £20 →</span>
            </div>
          </div>

          <div className={styles.wire} aria-hidden="true">
            <span className={styles.money}>£20</span>
          </div>

          <div className={`${styles.phone} ${styles.phoneB}`}>
            <div className={styles.phoneTop}>
              <span className={`${styles.avatar} ${styles.avatarB}`} aria-hidden="true">J</span>
              <span className={styles.phoneWho}>JAKE</span>
              <span className={styles.phoneBal}>£88.40</span>
            </div>
            <ul className={styles.rows} aria-hidden="true">
              <li className={`${styles.row} ${styles.rowNew}`}><span>Alex</span><span className={styles.rowIn}>+£20.00</span></li>
              <li className={styles.row}><span>Spotify</span><span>−£10.99</span></li>
              <li className={styles.row}><span>Co-op</span><span>−£7.15</span></li>
            </ul>
            <div className={styles.phoneBody}>
              <span className={styles.receipt}>Jake received £20 · just now</span>
            </div>
          </div>

          <div className={`${styles.toast} ${styles.toastSend}`}>You sent Jake £20</div>
          <div className={`${styles.toast} ${styles.toastRecv}`}>Jake received £20</div>
        </div>

        <Reveal className={styles.footRow} stagger>
          <p className={styles.big}>Money shouldn&rsquo;t take the scenic route.</p>
          <p className={styles.small}>Instant payments between KLIK users. No waiting, no working days.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- SPLIT ------------------------------------------------------------ */

const PEOPLE = ['AMY', 'JACK', 'MIA', 'YOU'];

export function Split() {
  const { ref, arrived } = useArrived(0.45);

  return (
    <section className={styles.section} id="split">
      <div className={styles.wrap}>
        <Reveal>
          <h2 className={`${styles.head} ${styles.headRight}`}>SPLIT.</h2>
        </Reveal>

        <div className={styles.splitStage} ref={ref} data-go={arrived}>
          <div className={styles.bill}>
            <span className={styles.billLabel}>DINNER</span>
            <span className={styles.billTotal}>£124.80</span>
            <span className={styles.billMeta}>FOUR PEOPLE · SAT 21:14</span>
          </div>

          {/* The total breaks into four and each person settles. */}
          <div className={styles.shares}>
            {PEOPLE.map((p, i) => (
              <div key={p} className={styles.share} style={{ '--i': i } as React.CSSProperties}>
                <span className={styles.shareAmount}>£31.20</span>
                <span className={styles.shareWho}>
                  {p} <span className={styles.shareTick}>✓</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <Reveal className={styles.footRow} stagger>
          <p className={styles.big}>Dinner maths is officially cancelled.</p>
          <p className={styles.small}>Split any bill four ways, ten ways, or unevenly. Nobody chases anybody.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- TAP -------------------------------------------------------------- */

export function Tap() {
  const { ref, arrived } = useArrived(0.5);

  return (
    <section className={styles.section} id="tap">
      <div className={styles.wrap}>
        <Reveal>
          <h2 className={styles.head}>TAP.</h2>
        </Reveal>

        <div className={styles.tapStage} ref={ref} data-go={arrived}>
          {/* Two real cards rather than two blank rectangles: the section is
              about a KLIK card meeting a KLIK card, and unbranded panels made
              that read as a loading state. They are Ember and Midnight, two of
              the four colourways from the order page. */}
          <div className={`${styles.tapCard} ${styles.tapEmber}`} aria-hidden="true">
            <span className={styles.tapSheen} />
            <span className={styles.tapTop}>
              <span className={styles.tapMark}>KLIK</span>
              <svg className={styles.tapWave} viewBox="0 0 24 24">
                <path d="M8 6a8 8 0 0 1 0 12M12.5 3.5a12 12 0 0 1 0 17M4 8.5a4.5 4.5 0 0 1 0 7" />
              </svg>
            </span>
            <svg className={styles.tapChip} viewBox="0 0 46 34">
              <rect x="0.6" y="0.6" width="44.8" height="32.8" rx="5" />
              <path d="M0.6 11.5h13M0.6 22.5h13M45.4 11.5h-13M45.4 22.5h-13M15.5 0.6v9M15.5 33.4v-9M30.5 0.6v9M30.5 33.4v-9" />
              <rect x="15.5" y="9.5" width="15" height="15" rx="2.4" />
            </svg>
          </div>

          <div className={`${styles.tapCard} ${styles.tapMidnight}`} aria-hidden="true">
            <span className={styles.tapSheen} />
            <span className={styles.tapTop}>
              <span className={styles.tapMark}>KLIK</span>
              <svg className={styles.tapWave} viewBox="0 0 24 24">
                <path d="M8 6a8 8 0 0 1 0 12M12.5 3.5a12 12 0 0 1 0 17M4 8.5a4.5 4.5 0 0 1 0 7" />
              </svg>
            </span>
            <svg className={styles.tapChip} viewBox="0 0 46 34">
              <rect x="0.6" y="0.6" width="44.8" height="32.8" rx="5" />
              <path d="M0.6 11.5h13M0.6 22.5h13M45.4 11.5h-13M45.4 22.5h-13M15.5 0.6v9M15.5 33.4v-9M30.5 0.6v9M30.5 33.4v-9" />
              <rect x="15.5" y="9.5" width="15" height="15" rx="2.4" />
            </svg>
          </div>

          <div className={styles.paid}>
            <span className={styles.paidTick}>✓</span>
            <span>PAID</span>
          </div>
          <span className={styles.tapRing} aria-hidden="true" />
        </div>

        <Reveal className={styles.footRow} stagger>
          <p className={styles.big}>No numbers. No nonsense. Just tap.</p>
          <p className={styles.small}>Contactless everywhere Visa is accepted, with the card you never take out.</p>
        </Reveal>
      </div>
    </section>
  );
}

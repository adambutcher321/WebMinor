'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../motion/Reveal';
import styles from './close.module.css';

const STATS = [
  { value: 2.4, suffix: 'M', label: 'PAYMENTS SENT', decimals: 1 },
  { value: 48, suffix: '', label: 'COUNTRIES', decimals: 0 },
  { value: 0.2, suffix: ' SEC', label: 'AVERAGE TRANSFER', decimals: 1 },
  { value: 98, suffix: '%', label: 'PAYMENTS INSTANT', decimals: 0 },
];

/** Counts up once when its row arrives, then holds (M5). */
function Stat({ value, suffix, label, decimals }: (typeof STATS)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || done.current) continue;
          done.current = true;
          io.disconnect();
          const t0 = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - p, 3);
            setShown(value * eased);
            if (p < 1) requestAnimationFrame(step);
          };
          setShown(0);
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.statValue}>
        {shown.toFixed(decimals)}
        {suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function Stats() {
  return (
    <section className={styles.stats} id="stats">
      <div className={styles.wrap}>
        <div className={styles.statRow}>
          {STATS.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- security: the tone drops ---------------------------------------- */

const LOCKS = ['FACE ID', 'BIOMETRICS', 'INSTANT FREEZE', 'DISPOSABLE CARDS', 'FRAUD MONITORING', 'ENCRYPTED'];

export function Security() {
  const [frozen, setFrozen] = useState(false);

  return (
    <section className={styles.security} id="security">
      <div className={styles.wrap}>
        <div className={styles.secGrid}>
          <div>
            <Reveal>
              <h2 className={styles.secHead}>
                YOUR MONEY.
                <span className={styles.secHead2}>LOCKED DOWN.</span>
              </h2>
            </Reveal>

            <Reveal className={styles.lockRow} stagger delay={120}>
              {LOCKS.map((l) => (
                <span key={l} className={styles.lock}>
                  {l}
                </span>
              ))}
            </Reveal>

            <Reveal delay={240}>
              <p className={styles.secLead}>
                Lose the card, freeze it from the sofa. Spend somewhere new, get asked. Nothing
                leaves your account that you did not see first, and he checks twice.
              </p>
            </Reveal>
          </div>

          <Reveal className={styles.secStage} delay={160}>
            <div className={styles.secChar}>
              <Image
                src="/demo/klik/mascot-lock.webp"
                alt=""
                aria-hidden="true"
                width={1200}
                height={1200}
                sizes="(max-width: 900px) 70vw, 34vw"
              />
            </div>

            {/* A working freeze toggle: the one security feature people actually use. */}
            <div className={styles.freeze} data-frozen={frozen}>
              <div className={styles.freezeTop}>
                <span className={styles.freezeTitle}>EMBER CARD</span>
                <span className={styles.freezeNo}>•••• 4021</span>
              </div>
              <button
                type="button"
                className={styles.freezeBtn}
                aria-pressed={frozen}
                onClick={() => setFrozen((f) => !f)}
              >
                <span className={styles.freezeKnob} aria-hidden="true" />
                <span>{frozen ? 'FROZEN' : 'FREEZE CARD'}</span>
              </button>
              <p className={styles.freezeNote} aria-live="polite">
                {frozen ? 'Every payment declines until you say otherwise.' : 'Tap once. Instant, everywhere, reversible.'}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---- final CTA -------------------------------------------------------- */

export function FinalCta() {
  return (
    <section className={styles.cta} id="get">
      <div className={styles.ctaWrap}>
        <h2 className={styles.ctaHead}>
          <span>MAKE</span>
          <span className={styles.ctaMoney}>MONEY</span>
          <span>MOVE.</span>
        </h2>

        <div className={styles.ctaChar}>
          <Image
            src="/demo/klik/char-wave.webp"
            alt=""
            aria-hidden="true"
            width={1024}
            height={1024}
            sizes="(max-width: 900px) 70vw, 460px"
          />
        </div>

        <Link className={styles.ctaBtn} href="/demo/klik/get">
          GET KLIK <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ---- footer ----------------------------------------------------------- */

const FOOTER = [
  { head: 'PRODUCT', links: ['Send', 'Split', 'Tap', 'Card', 'Pots'] },
  { head: 'COMPANY', links: ['About', 'Journal', 'Support', 'Legal'] },
  { head: 'SOCIAL', links: ['Instagram', 'X', 'TikTok'] },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.footTop}>
          {FOOTER.map((col) => (
            <div key={col.head} className={styles.footCol}>
              <p className={styles.footHead}>{col.head}</p>
              <ul className={styles.footList}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a className={styles.footLink} href="#top">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.footStores}>
            <a className={styles.store} href="#top">
              APP STORE
            </a>
            <a className={styles.store} href="#top">
              GOOGLE PLAY
            </a>
          </div>
        </div>

        {/* The wordmark is the footer's structure, not a line of small print. */}
        <p className={styles.footMark} aria-hidden="true">
          KLIK<span className={styles.tm}>™</span>
        </p>

        <div className={styles.footBase}>
          <p>KLIK is a fictional brand. A concept build by WebMinor.</p>
          <Link className={styles.footLink} href="/case-studies">
            Back to WebMinor
          </Link>
        </div>
      </div>
    </footer>
  );
}

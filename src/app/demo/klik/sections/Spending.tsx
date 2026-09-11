'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from '../motion/Reveal';
import styles from './spending.module.css';

const SPEND = [
  { label: 'FOOD', value: 384, tx: 46 },
  { label: 'NIGHTS OUT', value: 218, tx: 19 },
  { label: 'TRAVEL', value: 192, tx: 11 },
  { label: 'COFFEE', value: 87, tx: 41 },
];

const MAX = Math.max(...SPEND.map((s) => s.value));
const TOTAL = SPEND.reduce((a, s) => a + s.value, 0);

/**
 * Spending, as typography rather than as a dashboard.
 *
 * The figures are the chart: each row's bar is set in the same display face at a width
 * proportional to the amount, so the data is read at headline scale instead of being
 * shrunk into a widget.
 */
export default function Spending() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGo(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setGo(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.section} id="spending">
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.headRow}>
            <h2 className={styles.head}>THIS MONTH</h2>
            <p className={styles.total}>
              <span className={styles.totalLabel}>TOTAL</span>
              <span className={styles.totalValue}>£{TOTAL.toLocaleString('en-GB')}</span>
            </p>
          </div>
        </Reveal>

        <div className={styles.rows} ref={ref} data-go={go}>
          {SPEND.map((s, i) => (
            <div
              key={s.label}
              className={styles.row}
              style={
                {
                  '--w': `${(s.value / MAX) * 100}%`,
                  '--i': i,
                } as React.CSSProperties
              }
              data-top={i === 0}
            >
              <span className={styles.rowLabel}>{s.label}</span>
              <span className={styles.bar} aria-hidden="true" />
              <span className={styles.rowValue}>£{s.value}</span>
              <span className={styles.rowTx}>{s.tx} txns</span>
            </div>
          ))}
        </div>

        <Reveal className={styles.foot} stagger>
          <p className={styles.quip}>
            41 coffees. Apparently you <span className={styles.quipAccent}>really</span> like coffee.
          </p>
          <p className={styles.small}>
            Every payment sorted the second it lands. No spreadsheets, no receipts in a drawer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

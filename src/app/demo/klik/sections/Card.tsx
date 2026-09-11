'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Reveal from '../motion/Reveal';
import styles from './card.module.css';

const CARDS = [
  {
    key: 'physical',
    name: 'PHYSICAL',
    src: '/demo/klik/card-physical-cut.webp',
    alt: 'The physical KLIK card in soft-touch orange with a debossed KLIK wordmark',
    note: 'Soft-touch orange. Debossed wordmark. Weighs something.',
  },
  {
    key: 'virtual',
    name: 'VIRTUAL',
    src: '/demo/klik/card-virtual-cut.webp',
    alt: 'The virtual KLIK card in iridescent holographic foil',
    note: 'Holographic foil. Live in two seconds, spend in three.',
  },
  {
    key: 'disposable',
    name: 'DISPOSABLE',
    src: '/demo/klik/card-disposable-cut.webp',
    alt: 'The disposable KLIK card in black with an orange spray-painted stripe',
    note: 'Sprayed, used once, then it burns.',
  },
] as const;

/**
 * The card section. Three real KLIK cards sit as a fanned deck that shuffles: choosing
 * one brings it to the front and pushes the others back, so the visitor handles the
 * product rather than reading a list of its variants.
 */
export default function CardSection() {
  const [active, setActive] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  // The deck fans open as the section arrives, scrubbed to scroll.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.94 - rect.top) / (vh * 0.7)));
      if (Math.abs(p - last) > 0.003) {
        last = p;
        stage.style.setProperty('--fan', p.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className={styles.section} id="card">
      <div className={styles.wrap}>
        <Reveal>
          <h2 className={styles.head}>
            ONE CARD.
            <span className={styles.headAccent}>EVERYWHERE.</span>
          </h2>
        </Reveal>

        <div className={styles.stage} ref={stageRef}>
          <div className={styles.deck}>
            {CARDS.map((c, i) => {
              // Offset from the selected card decides depth, tilt and lift, so the
              // chosen one always sits forward regardless of its index.
              const offset = i - active;
              return (
                <button
                  key={c.key}
                  type="button"
                  className={styles.cardBtn}
                  style={{ '--offset': offset, '--i': i } as React.CSSProperties}
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={`${c.name} card`}
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={1024}
                    height={1024}
                    sizes="(max-width: 900px) 64vw, 26vw"
                  />
                </button>
              );
            })}
          </div>

          <ul className={styles.list}>
            {CARDS.map((c, i) => (
              <li
                key={c.key}
                className={styles.item}
                data-active={i === active}
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className={styles.itemIndex}>0{i + 1}</span>
                <span className={styles.itemName}>{c.name}</span>
                <span className={styles.itemNote}>{c.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useId, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { conceptBuilds, spellCount, type WorkEntry } from '@/app/case-studies/work-entries';
import styles from '@/app/home.module.css';

/* The ten concept builds drifting past between the steps and the reviews, so
   the homepage shows the work rather than only describing it. The covers and
   pop-out cut-outs are the work page's own (public/work/pop): the subject
   rises out of its frame on hover, and on the card nearest the middle of the
   screen while nothing is hovered, so phones see it too. The list is rendered
   twice so the drift can loop; the second copy is hidden from assistive tech. */

function Card({ entry, copy }: { entry: WorkEntry; copy: boolean }) {
  return (
    <Link
      href={entry.href}
      className={styles.workCard}
      data-work-card=""
      tabIndex={copy ? -1 : undefined}
      aria-label={copy ? undefined : `${entry.name}: ${entry.disciplines}`}
    >
      <span className={styles.workFrame}>
        <span className={styles.workPlate}>
          <Image src={entry.pop?.plate ?? entry.image} alt="" fill sizes="(max-width: 560px) 72vw, 380px" />
        </span>
        {entry.pop && (
          <span
            className={styles.workPop}
            style={{ '--ox': `${entry.pop.ox}%`, '--oy': `${entry.pop.oy}%` } as CSSProperties}
          >
            <Image src={entry.pop.src} alt="" fill sizes="(max-width: 560px) 72vw, 380px" />
          </span>
        )}
        {entry.logo && (
          <span className={styles.workLogo} style={{ '--ar': entry.logo.width / entry.logo.height } as CSSProperties}>
            <Image src={entry.logo.src} alt="" width={entry.logo.width} height={entry.logo.height} />
          </span>
        )}
      </span>
      <span className={styles.workMeta}>
        <span className={styles.workName}>{entry.name}</span>
        <span className={styles.workDisc}>{entry.disciplines}</span>
      </span>
    </Link>
  );
}

export default function HomeWorkStrip() {
  const headingId = useId();
  const stripRef = useRef<HTMLDivElement>(null);

  // Marks the card nearest the screen's centre with data-centre while the strip
  // is on screen and not hovered; CSS pops whichever card carries it.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(strip.querySelectorAll<HTMLElement>('[data-work-card]'));
    let frame = 0;
    let visible = false;
    let hovered = false;
    let current: HTMLElement | null = null;

    const mark = (next: HTMLElement | null) => {
      if (next === current) return;
      current?.removeAttribute('data-centre');
      next?.setAttribute('data-centre', '');
      current = next;
    };

    const tick = () => {
      frame = visible ? requestAnimationFrame(tick) : 0;
      if (hovered) return mark(null);
      const mid = window.innerWidth / 2;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = card;
        }
      }
      // Only while a card is genuinely near the middle, so the pop arrives and
      // leaves with the card rather than jumping between neighbours.
      mark(best && bestDist < best.offsetWidth * 0.32 ? best : null);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
      if (!visible) mark(null);
    });
    io.observe(strip);
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') hovered = true; };
    const leave = () => { hovered = false; };
    strip.addEventListener('pointerenter', enter);
    strip.addEventListener('pointerleave', leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      strip.removeEventListener('pointerenter', enter);
      strip.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <section className={styles.work} aria-labelledby={headingId}>
      <div className={styles.workHead}>
        <p className={styles.stripLabel}>Concept builds</p>
        <h2 id={headingId} className={styles.howHeading}>
          {spellCount(conceptBuilds.length)} demo sites, all built in Saltash. Open one and click around.
        </h2>
        <Link href="/case-studies" className={styles.workAll}>
          All {conceptBuilds.length} on the work page
        </Link>
      </div>
      <div className={styles.workStrip} ref={stripRef}>
        <div className={styles.workTrack}>
          {[false, true].map((copy) => (
            <ul key={String(copy)} className={styles.workSet} aria-hidden={copy || undefined}>
              {conceptBuilds.map((entry) => (
                <li key={entry.href}>
                  <Card entry={entry} copy={copy} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

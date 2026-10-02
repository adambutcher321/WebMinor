'use client';

import { useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { services } from '@/data/services';
import styles from '@/app/home.module.css';

/* The world above sells the offer in six headlines; this is the plain answer
   underneath: who it's for, what's free, what's paid for and what happens
   after you ring. The steps are the web design page's own, so the two can't
   drift apart. */

const steps = services.find((s) => s.slug === 'web-design-for-trades')?.steps ?? [];

/** Each step's fill, 0–1. Steps sharing a row (four across on desktop, two on
 *  tablets, one on phones) take that row's progress — 0 as its top reaches 85%
 *  of the viewport, 1 by 45% — and split it left to right, so the rule runs
 *  across the row as one line whatever the column count. */
function launchFills(tops: number[], vh: number): number[] {
  const rows = new Map<number, number[]>();
  tops.forEach((top, i) => {
    const key = Math.round(top);
    rows.set(key, [...(rows.get(key) ?? []), i]);
  });
  const fills = new Array<number>(tops.length).fill(0);
  for (const [top, members] of rows) {
    const p = Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.4)));
    members.forEach((i, col) => {
      fills[i] = Math.min(1, Math.max(0, p * members.length - col));
    });
  }
  return fills;
}

export default function HomeHowItWorks({ motion = false }: { motion?: boolean }) {
  // Rendered twice on the homepage (hidden copy + visible tail), so no fixed id.
  const headingId = useId();
  const listRef = useRef<HTMLOListElement>(null);

  // The launch line: --f on each step runs 0 → 1 as it is scrolled into view,
  // filling its top rule cyan (see .howSteps[data-launch] li).
  useEffect(() => {
    const list = listRef.current;
    if (!motion || !list) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const li of list.children) (li as HTMLElement).style.setProperty('--f', '1');
      return;
    }
    let frame = 0;
    const write = () => {
      frame = 0;
      const items = Array.from(list.children) as HTMLElement[];
      const fills = launchFills(items.map((li) => li.getBoundingClientRect().top), window.innerHeight);
      items.forEach((li, i) => li.style.setProperty('--f', fills[i].toFixed(4)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    write();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [motion]);

  return (
    <section className={styles.how} aria-labelledby={headingId}>
      <p className={styles.stripLabel}>For local businesses in Cornwall and Devon</p>
      <h2 id={headingId} className={styles.howHeading}>
        Three pages designed free, then £50 a month + VAT for hosting.
      </h2>
      <ol
        ref={listRef}
        className={styles.howSteps}
        data-launch={motion ? '' : undefined}
      >
        {steps.map((step, i) => (
          <li key={step.title}>
            <span className={styles.howNum}>{String(i + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
      <p className={styles.howNote}>
        Your domain name and changes after launch are paid for separately. Extra pages, SEO and Google Ads start on Starter, and online shops are quoted per job.{' '}
        <Link href="/services/web-design">What&rsquo;s included</Link>
        {' · '}
        <Link href="/pricing">Every price</Link>
      </p>
    </section>
  );
}

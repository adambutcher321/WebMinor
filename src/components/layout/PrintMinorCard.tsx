import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './printminor-card.module.css';

/* A way across to PrintMinor, the print side of Able Print, from every page's
   footer. The stack of printed cards (a Higgsfield render, cut out, prompt in
   scripts/printminor-card/prompts.md) sits half out of the card and lifts and
   fans out on hover, over a CMYK glow. */

export default function PrintMinorCard() {
  return (
    <a
      href="https://www.printminor.com/"
      target="_blank"
      rel="noopener"
      className={styles.card}
      aria-label="Need print as well? Try PrintMinor (opens printminor.com in a new tab)"
    >
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.text}>
        <span className={styles.label}>Need print as well?</span>
        <span className={styles.title}>
          Try PrintMinor
          <ArrowUpRight className={styles.arrow} aria-hidden="true" />
        </span>
        <span className={styles.sub}>Cards, flyers and banners, printed in Saltash.</span>
      </span>
      <span className={styles.stack} aria-hidden="true">
        <Image src="/images/printminor-stack.webp" alt="" width={885} height={900} sizes="110px" />
      </span>
    </a>
  );
}

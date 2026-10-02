import { useId, type CSSProperties } from 'react';
import { techStack } from '@/data/tech-stack';
import styles from '@/app/home.module.css';

/* The tools the sites are built with, as a carousel of their own logos just
   above the footer. It drifts the opposite way to the work strip and pauses
   under the pointer; each tile picks up its brand colour on hover. The list is
   rendered twice so the drift can loop; the second copy is hidden from
   assistive tech. */

export default function HomeTechStrip() {
  const headingId = useId();
  return (
    <section className={styles.tech} aria-labelledby={headingId}>
      <h2 id={headingId} className={`${styles.stripLabel} ${styles.techLabel}`}>
        What your site is built with
      </h2>
      <div className={styles.techStrip}>
        <div className={styles.techTrack}>
          {[false, true].map((copy) => (
            <ul key={String(copy)} className={styles.techSet} aria-hidden={copy || undefined}>
              {techStack.map((tool) => (
                <li key={tool.name} className={styles.techTile} style={{ '--brand': tool.colour } as CSSProperties}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.techIcon}>
                    <path d={tool.path} />
                  </svg>
                  <span>{tool.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

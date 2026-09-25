import { useId } from 'react';
import Link from 'next/link';
import { services } from '@/data/services';
import styles from '@/app/home.module.css';

/* The world above sells the offer in six headlines; this is the plain answer
   underneath: who it's for, what's free, what's paid for and what happens
   after you ring. The steps are the web design page's own, so the two can't
   drift apart. */

const steps = services.find((s) => s.slug === 'web-design-for-trades')?.steps ?? [];

export default function HomeHowItWorks() {
  // Rendered twice on the homepage (hidden copy + visible tail), so no fixed id.
  const headingId = useId();
  return (
    <section className={styles.how} aria-labelledby={headingId}>
      <p className={styles.stripLabel}>For local businesses in Cornwall and Devon</p>
      <h2 id={headingId} className={styles.howHeading}>
        Three pages designed free, then £50 a month + VAT for hosting.
      </h2>
      <ol className={styles.howSteps}>
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

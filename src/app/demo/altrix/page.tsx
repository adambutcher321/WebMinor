import Link from 'next/link';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import styles from './altrix.module.css';
import ProductTheatre from './sections/ProductTheatre';
import AltitudeBand from './sections/AltitudeBand';
import SpecTail from './sections/SpecTail';
import HeroWatch from './HeroWatch';
import { NavAltitude } from './motion';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono-altrix',
  subsets: ['latin'],
  display: 'swap',
});

const NAV_LINKS = ['Overview', 'Technology', 'Specifications', 'Expeditions'];

const TELEMETRY = [
  { label: 'Certified ceiling', value: '9000', unit: 'm' },
  { label: 'Operating floor', value: '−41', unit: '°C' },
  { label: 'Autonomy', value: '120', unit: 'h' },
];

export default function Altrix() {
  return (
    <div className={`${styles.page} ${archivo.variable} ${jetbrainsMono.variable}`}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a className={styles.wordmark} href="#overview">
            <svg className={styles.mark} viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1.5 14 8 2l6.5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.wordmarkText}>Altrix</span>
          </a>

          <nav className={styles.navLinks} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link} className={styles.navLink} href={`#${link.toLowerCase()}`}>
                {link}
              </a>
            ))}
          </nav>

          <NavAltitude className={styles.navAlt} />

          <a className={styles.pill} href="#reserve">
            Pre-order
          </a>
        </div>
      </header>

      <section className={styles.hero} id="overview">
        {/* Full-bleed olive ground plane. */}
        <div className={styles.plane} aria-hidden="true" />

        {/*
          summit-03.png is canonical.png with its #000000 ground keyed to
          alpha and its range remapped so black lands exactly on --void, so
          the object composites over --void and --olive alike and the plane
          boundary passes behind it rather than dividing the frame.
          canonical.png ships alongside it, unmodified.

          unoptimized: the image pipeline re-encodes to lossy WebP, which
          crushes the dial's near-black back down to #000000 — forbidden by
          the palette. The PNG is served as authored instead.
        */}
        <HeroWatch />

        <div className={styles.grid}>
          <div className={styles.display}>
            <h1 className={styles.statement}>
              <span className={styles.line}>Rise</span>
              <span className={styles.line}>Beyond limits</span>
            </h1>
            <p className={styles.eyebrow}>Built for extremes. Made to elevate.</p>
          </div>

          <div className={styles.bodyRow}>
            <p className={styles.copy}>
              <strong className={styles.lead}>The altimeter never blinks.</strong> A
              grade-5 titanium chassis, sapphire crystal and dual-frequency GNSS keep
              their fix in the thin air above the last camp — where ordinary instruments
              stop reporting.
            </p>

            <a className={styles.action} href="#specifications">
              Spec sheet
              <svg
                className={styles.actionArrow}
                viewBox="0 0 20 10"
                fill="none"
                aria-hidden="true"
              >
                <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
              </svg>
            </a>
          </div>

          <dl className={styles.telemetry}>
            {TELEMETRY.map((item) => (
              <div className={styles.readout} key={item.label}>
                <dt className={styles.readoutLabel}>{item.label}</dt>
                <dd className={styles.readoutValue}>
                  {item.value} <span className={styles.readoutUnit}>{item.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProductTheatre />
      <AltitudeBand />
      <SpecTail />

      <footer className={styles.credit}>
        <div className={styles.creditInner}>
          <p className={styles.creditText}>ALTRIX · Concept demo by WebMinor</p>
          <Link className={styles.creditLink} href="/case-studies">
            Back to WebMinor
          </Link>
        </div>
      </footer>
    </div>
  );
}

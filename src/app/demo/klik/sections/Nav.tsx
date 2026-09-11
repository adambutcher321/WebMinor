'use client';

import { useEffect, useState } from 'react';
import styles from './nav.module.css';

const LINKS = [
  { label: 'Product', href: '#send' },
  { label: 'Card', href: '#card' },
  { label: 'Security', href: '#security' },
  { label: 'About', href: '#stats' },
];

/**
 * Minimal fixed nav that condenses once the hero is behind it, plus a full-screen
 * animated menu below the tablet breakpoint.
 */
export default function Nav() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > window.innerHeight * 0.62);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A full-screen menu must not leave the page behind it scrollable.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={styles.nav} data-condensed={condensed}>
        <a className={styles.mark} href="#top" aria-label="KLIK home">
          KLIK
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} className={styles.link} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <a className={styles.cta} href="#get">
            GET KLIK
          </a>
          <button
            className={styles.burger}
            type="button"
            aria-expanded={open}
            aria-controls="klik-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burgerLabel}>{open ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </header>

      {/* `inert` keeps the closed menu's links out of the tab order without hiding it
          from the transition. */}
      <div className={styles.menu} id="klik-menu" data-open={open} inert={!open}>
        <nav className={styles.menuInner} aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              className={styles.menuLink}
              href={l.href}
              style={{ transitionDelay: `${90 + i * 70}ms` }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            className={styles.menuCta}
            href="#get"
            style={{ transitionDelay: `${90 + LINKS.length * 70}ms` }}
            onClick={() => setOpen(false)}
          >
            GET KLIK →
          </a>
        </nav>
      </div>
    </>
  );
}

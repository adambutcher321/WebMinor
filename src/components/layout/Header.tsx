'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';
import Logo from './Logo';
import styles from './header.module.css';

// webminor-bar.md §5 — the header is plain text links and a wordmark, with no
// filled button. The one ask it does make (fix brief 7.1: the homepage runs
// nine screens with no route to an offer) is a cyan text link that arrives once
// the visitor is past the first scene, so the opening frame stays clean.
const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'See our work', href: '/case-studies' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pastFirstScene, setPastFirstScene] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
      setPastFirstScene(window.scrollY > window.innerHeight * 0.75);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // The demo sites are other brands and the launch film is a full-bleed piece;
  // both supply their own chrome. The homepage no longer opts out — it rendered
  // its own copy of this header until 2026-08-23.
  if (pathname?.startsWith('/launch') || pathname?.startsWith('/demo')) {
    return null;
  }

  // The homepage's diorama is its own ground, so the header stays transparent
  // over it for the whole scroll rather than plating itself below the fold.
  const isHome = pathname === '/';
  const showCta = pastFirstScene && pathname !== '/free-website-review';

  return (
    <>
      <header
        className={`${styles.header} ${scrolled && !isHome ? styles.scrolled : ''} ${isHome ? styles.home : ''}`}
      >
        <Logo />

        <div className={styles.right}>
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => {
              // The work link is the one we most want found early, and most
              // visitors land somewhere other than the homepage, so on every
              // page it carries a live dot that beats three times on arrival
              // and then holds. The header persists across page changes, so
              // the dot is keyed to the path: a new page remounts it and the
              // beats run again. Still a text link: no pill, no button.
              const live = link.href === '/case-studies';
              return (
                <Link key={link.href} href={link.href} className={`${styles.navLink} ${live ? styles.navLive : ''}`}>
                  {live && <span key={pathname} className={styles.dot} aria-hidden="true" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/free-website-review"
            className={`${styles.cta} ${showCta ? styles.ctaShown : ''}`}
            aria-hidden={!showCta}
            tabIndex={showCta ? undefined : -1}
          >
            Free website review <span aria-hidden="true">&rarr;</span>
          </Link>

          <a href="tel:01752845258" className={styles.phone}>
            01752 845258
          </a>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={styles.menuButton}
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import MobileNav from './MobileNav';
import Logo from './Logo';
import styles from './header.module.css';

// webminor-bar.md §5 — the header is plain text links and a wordmark. The
// commercial ask is made by the page, not by a permanently docked button, so
// Contact is a link here like everything else and the filled cyan CTA is gone.
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
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

  return (
    <>
      <header className={`${styles.header} ${scrolled && !isHome ? styles.scrolled : ''}`}>
        <Logo />

        <div className={styles.right}>
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>

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

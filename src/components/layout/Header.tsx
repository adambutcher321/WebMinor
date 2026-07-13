'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Phone, Menu } from 'lucide-react';
import MobileNav from './MobileNav';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/case-studies' },
  { label: 'Pricing', href: '/pricing' },
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

  if (pathname?.startsWith('/launch') || pathname === '/') {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B0D10]/80 backdrop-blur-lg border-b border-white/5 shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          {/* Logo */}
          <Logo />

          {/* Desktop nav - centered */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] text-[#F5F7FA] hover:text-[#40E0FF] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: phone + CTA */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {/* Phone */}
            <a
              href="tel:01752845258"
              className="flex items-center gap-2 text-[#F5F7FA] hover:text-[#40E0FF] transition-colors"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <Phone className="size-4" />
              <span className="text-xs tracking-wide">01752 845258</span>
            </a>

            {/* CTA */}
            <Link
              href="/free-website-review"
              className="inline-flex items-center justify-center rounded-lg bg-[#40E0FF] px-5 py-2.5 text-sm font-semibold text-[#0B1D3A] hover:bg-[#40E0FF]/85 transition-colors"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Get my free website review
            </Link>
          </div>

          {/* Mobile: phone icon + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="tel:01752845258"
              aria-label="Call us"
              className="p-2 text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
            >
              <Phone className="size-5" />
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="p-2 text-[#F5F7FA] hover:text-[#40E0FF] transition-colors"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

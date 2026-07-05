'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Menu } from 'lucide-react';
import MobileNav from './MobileNav';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
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
          <a href="/" className="flex items-center gap-0 shrink-0">
            <Image
              src="/images/w-icon.png"
              alt="WebMinor logo"
              width={80}
              height={80}
              className="w-20 h-20 -mr-3"
            />
            <span
              className="text-lg font-bold tracking-tight text-[#F5F7FA]"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Web<span className="text-[#40E0FF]">Minor</span>
            </span>
          </a>

          {/* Desktop nav - centered */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.15em] text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side: phone + CTA */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            {/* Phone */}
            <a
              href="tel:01752845258"
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              <Phone className="size-4" />
              <span className="text-xs tracking-wide">01752 845258</span>
            </a>

            {/* CTA */}
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-lg bg-[#40E0FF] px-5 py-2.5 text-sm font-semibold text-[#0B1D3A] hover:bg-[#40E0FF]/85 transition-colors"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Get my free website review
            </a>
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

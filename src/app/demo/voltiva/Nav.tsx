'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import VoltivaLogo from './Logo';

/*
  voltiva-bar.md §1 — the accent underlines the active item and fills the one
  button. The reference's nav is a single row of eight plain links; ours carries
  the six sections this page actually has, because a nav item pointing at
  nothing is the fault we just spent a day removing from the other two demos.
*/
const SECTIONS = [
  { label: 'Services', id: 'services' },
  { label: 'About', id: 'about' },
  { label: 'Why Us', id: 'why-us' },
  { label: 'Team', id: 'team' },
  { label: 'Insights', id: 'insights' },
  { label: 'Contact', id: 'contact' },
];

export default function VoltivaNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // The nav underline is the bar's active-state mechanism, so it has to actually
  // track where the reader is rather than being decorative.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => !!e,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-[#0B1D33]/8 bg-[#F5F7FA]/92 backdrop-blur-md"
        style={{ fontFamily: 'var(--font-inter-vt)' }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link href="/demo/voltiva" aria-label="Voltiva Electrical, home">
            <VoltivaLogo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className={`relative py-1.5 text-[16px] transition-colors ${
                  active === s.id
                    ? 'text-[#0B1D33]'
                    : 'text-[#59636E] hover:text-[#0B1D33]'
                }`}
              >
                {s.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-[#1677FF] transition-opacity duration-500 ${
                    active === s.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/*
              This was `hidden sm:flex` and the quote button `min-[420px]`, so on
              a 390px phone the header carried a logo and a hamburger and nothing
              else — from the services grid down, the only phone number on the
              page was in a hero the reader had already scrolled past.
            */}
            <a
              href="tel:+441752000000"
              aria-label="Call Voltiva on 01752 000 000"
              className="flex items-center gap-2 rounded-lg border border-[#0B1D33]/12 px-3 py-2 text-[16px] font-semibold text-[#0B1D33] transition-colors hover:border-[#1677FF] hover:text-[#1677FF] sm:border-0 sm:px-0 sm:py-0"
            >
              <Phone className="h-4 w-4 text-[#0FA3A6]" aria-hidden="true" />
              <span className="hidden sm:inline">01752 000 000</span>
            </a>
            <a
              href="#contact"
              className="hidden rounded-lg bg-[#1677FF] px-5 py-2.5 text-[16px] font-semibold text-white transition-colors hover:bg-[#0F5FD6] min-[420px]:inline-block"
            >
              Get a Quote
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="-mr-2 p-2 text-[#0B1D33] lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#F5F7FA] lg:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <VoltivaLogo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-2 p-2 text-[#0B1D33]"
              autoFocus
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav
            className="flex flex-col px-6 pt-4"
            aria-label="Primary"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-[#0B1D33]/10 py-5 text-2xl font-bold text-[#0B1D33]"
              >
                {s.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-lg bg-[#1677FF] px-5 py-3.5 text-center text-base font-semibold text-white"
              style={{ fontFamily: 'var(--font-inter-vt)' }}
            >
              Get a Quote
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flower2, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Sessions', href: '/demo/mindful/sessions' },
  { label: 'About', href: '/demo/mindful/about' },
];

export default function MindfulNav({
  transparent = false,
}: {
  transparent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`relative z-20 flex items-center justify-between px-6 sm:px-10 py-6 ${
          transparent
            ? ''
            : 'border-b border-[#5b7052]/10 bg-[#faf6f0]/90 backdrop-blur-md'
        }`}
      >
        <Link href="/demo/mindful" className="flex items-center gap-2.5">
          <Flower2
            aria-hidden="true"
            className={`w-5 h-5 ${transparent ? 'text-white' : 'text-[#5b7052]'}`}
          />
          <span
            className={`text-2xl tracking-tight ${transparent ? 'text-white' : 'text-[#2b2a26]'}`}
            style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
          >
            Mindful
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={pathname === l.href ? 'page' : undefined}
              className={`text-[14px] tracking-wide transition-colors ${
                transparent
                  ? 'text-white/80 hover:text-white'
                  : pathname === l.href
                    ? 'text-[#2b2a26]'
                    : 'text-[#2b2a26]/70 hover:text-[#2b2a26]'
              }`}
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/demo/mindful/book"
            className="hidden min-[380px]:inline-block rounded-full bg-[#2b2a26] text-white text-[14px] font-semibold px-5 py-2.5 hover:bg-[#3d3b34] transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Book a Session
          </Link>
          {/* The navigation was `hidden md:flex` with no fallback, so on a phone
              neither Sessions nor About could be reached from any page. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className={`md:hidden -mr-2 p-2 transition-colors ${
              transparent
                ? 'text-white/85 hover:text-white'
                : 'text-[#2b2a26]/75 hover:text-[#2b2a26]'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#faf6f0] md:hidden">
          <div className="flex items-center justify-between px-6 py-6">
            <span
              className="text-2xl tracking-tight text-[#2b2a26]"
              style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}
            >
              Mindful
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-2 p-2 text-[#2b2a26]/75 hover:text-[#2b2a26] transition-colors"
              autoFocus
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav
            className="flex flex-col px-6 pt-6"
            aria-label="Primary"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? 'page' : undefined}
                className="border-b border-[#5b7052]/15 py-5 text-3xl text-[#2b2a26] transition-colors hover:text-[#5b7052]"
                style={{ fontWeight: 600 }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/demo/mindful/book"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full bg-[#2b2a26] px-5 py-3.5 text-center text-[15px] font-semibold text-white min-[380px]:hidden"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              Book a Session
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

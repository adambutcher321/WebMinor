'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TreePine, Menu, X } from 'lucide-react';

/*
  "Locations" used to sit here pointing at /rooms — the same destination as
  "Rooms" two links along, and there is no locations page to point it at. A nav
  item that silently repeats its neighbour is worse than one fewer item.
*/
const NAV_LINKS = [
  { label: 'Rooms', href: '/demo/fernhollow/rooms' },
  { label: 'Experiences', href: '/demo/fernhollow/experiences' },
  { label: 'Contact', href: '/demo/fernhollow/contact' },
];

export default function FernhollowNav({
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
          transparent ? '' : 'border-b border-white/10 bg-[#0d1210]/80 backdrop-blur-md'
        }`}
      >
        <Link href="/demo/fernhollow" className="flex items-center gap-2.5">
          <TreePine className="w-5 h-5 text-amber-300" aria-hidden="true" />
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 500 }}
          >
            Fernhollow
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-9"
          aria-label="Primary"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={pathname === l.href ? 'page' : undefined}
              className={`text-[14px] tracking-wide transition-colors hover:text-white ${
                pathname === l.href ? 'text-white' : 'text-white/70'
              }`}
              style={{ fontFamily: 'var(--font-inter-fh)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/demo/fernhollow/rooms"
            className="hidden min-[380px]:inline-block rounded-full bg-white text-[#0d1210] text-[14px] font-semibold px-5 py-2.5 hover:bg-amber-50 transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
            style={{ fontFamily: 'var(--font-inter-fh)' }}
          >
            Book Now
          </Link>
          {/* The whole navigation was `hidden md:flex` with nothing behind it,
              so on a phone the only route out of any page was "Book Now". */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="md:hidden -mr-2 p-2 text-white/80 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#0d1210]/97 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-6 py-6">
            <span
              className="text-xl tracking-tight"
              style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 500 }}
            >
              Fernhollow
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-2 p-2 text-white/80 hover:text-white transition-colors"
              autoFocus
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav
            className="flex flex-col px-6 pt-6"
            aria-label="Primary"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? 'page' : undefined}
                className="border-b border-white/10 py-5 text-3xl text-white/85 hover:text-white transition-colors"
                style={{ fontWeight: 500 }}
              >
                {l.label}
              </Link>
            ))}
            {/* Carries the CTA for the narrow screens where the header pill
                cannot fit beside the wordmark. */}
            <Link
              href="/demo/fernhollow/rooms"
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full bg-white px-5 py-3.5 text-center text-[15px] font-semibold text-[#0d1210] min-[380px]:hidden"
              style={{ fontFamily: 'var(--font-inter-fh)' }}
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

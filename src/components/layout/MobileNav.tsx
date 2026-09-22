'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'See our work', href: '/case-studies' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  if (!isOpen) return null;
  const isHome = pathname === '/';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0D10]/95 backdrop-blur-xl">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute top-5 right-5 p-2 text-[#F5F7FA] hover:text-[#40E0FF] transition-colors"
      >
        <X className="size-7" />
      </button>

      {/* Nav links */}
      <nav className="flex flex-col items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="inline-flex items-center gap-3 text-2xl font-semibold text-[#F5F7FA] hover:text-[#40E0FF] transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {isHome && link.href === '/case-studies' && (
              <span aria-hidden="true" className="size-2 rounded-full bg-[#40E0FF]" />
            )}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="mt-12 flex flex-col items-center gap-6">
        {/* Phone */}
        <a
          href="tel:01752845258"
          className="flex items-center gap-3 text-[#F5F7FA] hover:text-[#40E0FF] transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Phone className="size-5" />
          <span>01752 845258</span>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/447894331253"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-[#F5F7FA] hover:text-[#25D366] transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <MessageCircle className="size-5" />
          <span>WhatsApp us</span>
        </a>

        {/* CTA */}
        <Link
          href="/free-website-review"
          onClick={onClose}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#40E0FF] px-6 py-3 text-sm font-semibold text-[#0B1D3A] hover:bg-[#40E0FF]/90 transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Get my free website review
        </Link>
      </div>
    </div>
  );
}

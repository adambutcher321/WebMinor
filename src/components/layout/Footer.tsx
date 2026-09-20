'use client';

import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

const SERVICES_LINKS = [
  { label: 'Website Design', href: '/services/web-design' },
  { label: 'Ecommerce', href: '/services' },
  { label: 'AI Automation + CRM', href: '/services/lead-generation' },
  { label: 'SEO', href: '/services/local-seo' },
  { label: 'Branding + Marketing', href: '/services' },
  { label: 'Google Business Profile', href: '/services/google-business-profile' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/case-studies' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

export default function Footer({ force = false }: { force?: boolean }) {
  const pathname = usePathname();

  if (!force && (pathname?.startsWith('/launch') || pathname?.startsWith('/demo') || pathname === '/')) {
    return null;
  }

  return (
    <footer className="relative bg-[#0B0D10] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {/* Top section: logo + nav columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo />
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed text-[#9AA3AF]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Crafting high-performance websites that turn visitors into
              customers. Web design consultancy based in Saltash, Cornwall.
            </p>

            {/* Contact info */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="tel:01752845258"
                className="inline-flex items-center gap-2.5 text-sm text-[#9AA3AF] hover:text-[#F5F7FA] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Phone className="size-4 shrink-0" />
                01752 845258
              </a>
              <a
                href="mailto:hello@webminor.co.uk"
                className="inline-flex items-center gap-2.5 text-sm text-[#9AA3AF] hover:text-[#F5F7FA] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Mail className="size-4 shrink-0" />
                hello@webminor.co.uk
              </a>
              <address
                className="inline-flex items-start gap-2.5 text-sm not-italic leading-relaxed text-[#9AA3AF]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <MapPin className="size-4 shrink-0 mt-0.5" />
                <span>
                  Unit 3, Gwel Avon Business Park,
                  <br />
                  Gilston Road, Saltash,
                  <br />
                  Cornwall PL12 6TW
                </span>
              </address>
            </div>
          </div>

          {/* Services */}
          <div className="lg:pt-24">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9AA3AF] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:pt-24">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9AA3AF] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:pt-24">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9AA3AF] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright. Social links return here once the Facebook and Instagram profiles exist. */}
        <div className="mt-8 flex flex-col-reverse items-center gap-6 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p
            className="text-xs text-[#9AA3AF]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            &copy; 2026 WebMinor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

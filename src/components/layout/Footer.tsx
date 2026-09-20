'use client';

import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';
import { towns } from '@/data/towns';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Paste each profile's address into `href` once it exists. While `href` is
// empty the icon shows but is not a link, so nobody lands on a dead page.
const SOCIAL_LINKS = [
  { label: 'Facebook', href: '', icon: FacebookIcon },
  { label: 'Instagram', href: '', icon: InstagramIcon },
];

const SERVICES_LINKS = [
  { label: 'Website Design', href: '/services/web-design' },
  { label: 'Local SEO', href: '/services/local-seo' },
  { label: 'Google Ads', href: '/services/lead-generation' },
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
    <footer className="relative overflow-hidden bg-[#0B0D10] border-t border-white/5">
      {/* Oversized wordmark behind the bottom rows, as on the demo footers. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-1 select-none whitespace-nowrap text-center text-[min(14.5vw,190px)] font-extrabold leading-[0.8] tracking-[0.02em] text-white/[0.03]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        WEBMINOR
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {/* Top section: logo + nav columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo />
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed text-[#9AA3AF]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Free website design for local businesses in Cornwall and
              Devon, from a one-person studio in Saltash.
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

        {/* Areas — the only links into the town pages, so they are not orphans. */}
        <nav aria-label="Areas covered" className="mt-8 border-t border-white/5 pt-8">
          <h3
            className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Areas
          </h3>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {towns.map((town) => (
              <li key={town.slug}>
                <Link
                  href={`/web-design/${town.slug}`}
                  className="text-sm text-[#9AA3AF] transition-colors hover:text-[#40E0FF]"
                >
                  {town.displayName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright + social */}
        <div className="mt-8 flex flex-col-reverse items-center gap-6 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p
            className="max-w-3xl text-xs leading-relaxed text-[#9AA3AF]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            &copy; 2026 WebMinor. All rights reserved. WebMinor is a trading
            name of Able Print Limited, registered in England and Wales under
            company number 05143261. Registered office: Unit 3, Gwel Avon
            Business Park, Gilston Road, Saltash, Cornwall, PL12 6TW. VAT
            number 432542811.
          </p>
          <div className="flex shrink-0 items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              const box =
                'flex size-9 items-center justify-center rounded-lg border border-[#40E0FF]/10 bg-[#40E0FF]/[0.06] text-[#40E0FF]/60';
              return social.href ? (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WebMinor on ${social.label}`}
                  className={`${box} transition-all hover:-translate-y-0.5 hover:border-[#40E0FF]/30 hover:bg-[#40E0FF]/[0.12] hover:text-[#40E0FF]`}
                >
                  <Icon className="size-4" />
                </a>
              ) : (
                <span key={social.label} title={`${social.label} coming soon`} className={box}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

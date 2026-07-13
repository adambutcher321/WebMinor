'use client';

import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

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

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com/webminor', icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com/webminor', icon: InstagramIcon },
];

const SERVICES_LINKS = [
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'Development', href: '/services' },
  { label: 'SEO', href: '/services/local-seo' },
  { label: 'Hosting', href: '/services' },
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

  if (!force && (pathname?.startsWith('/launch') || pathname === '/')) {
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
              className="mt-4 max-w-xs text-sm leading-relaxed text-[#6B7280]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Crafting high-performance websites that turn visitors into
              customers. Web design consultancy based in Saltash, Cornwall.
            </p>

            {/* Contact info */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="tel:01752845258"
                className="inline-flex items-center gap-2.5 text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <Phone className="size-4 shrink-0" />
                01752 845258
              </a>
              <a
                href="mailto:hello@webminor.com"
                className="inline-flex items-center gap-2.5 text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <Mail className="size-4 shrink-0" />
                hello@webminor.com
              </a>
              <address
                className="inline-flex items-start gap-2.5 text-sm not-italic leading-relaxed text-[#6B7280]"
                style={{ fontFamily: "'Space Mono', monospace" }}
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
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
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
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
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
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Proof strip */}
        <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/5 pt-8 sm:flex-row sm:justify-center sm:gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="size-4 fill-[#F59E0B] text-[#F59E0B]"
              />
            ))}
          </div>
          <span
            className="text-sm text-[#6B7280]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            [EDIT: X] 5-star reviews
          </span>
        </div>

        {/* Copyright + social */}
        <div className="mt-8 flex flex-col-reverse items-center gap-6 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p
            className="text-xs text-[#6B7280]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            &copy; 2026 WebMinor. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg border border-[#40E0FF]/10 bg-[#40E0FF]/[0.06] text-[#40E0FF]/60 transition-all hover:border-[#40E0FF]/30 hover:bg-[#40E0FF]/[0.12] hover:text-[#40E0FF] hover:-translate-y-0.5"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

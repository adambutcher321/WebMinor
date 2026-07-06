'use client';

import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

const SERVICES_LINKS = [
  { label: 'Web Design', href: '#services' },
  { label: 'Development', href: '#services' },
  { label: 'SEO', href: '#services' },
  { label: 'Hosting', href: '#services' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/launch')) {
    return null;
  }

  return (
    <footer className="relative bg-[#0B0D10] border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {/* Top section: logo + nav columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/w-icon.png"
                alt="WebMinor logo"
                width={32}
                height={32}
                className="size-8"
              />
              <span
                className="text-lg font-bold tracking-tight text-[#F5F7FA]"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Web<span className="text-[#40E0FF]">Minor</span>
              </span>
            </a>
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
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F5F7FA]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#6B7280] hover:text-[#F5F7FA] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </a>
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

        {/* Social links placeholder */}
        <div className="mt-6 flex justify-center gap-4">
          {/* Social icons will go here */}
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-white/5 pt-8 text-center">
          <p
            className="text-xs text-[#6B7280]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            &copy; 2026 WebMinor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

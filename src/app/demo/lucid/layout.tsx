import type { Metadata } from 'next';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';

/*
  One geometric grotesque doing display, headline and interface, with a mono
  reserved for the technical voice: the callouts, the specification strip and
  the eyebrow. That split is the brand — the product is quiet and the only
  thing that speaks in a technical register is the engineering.
*/
const ui = Manrope({
  variable: '--font-lucid-ui',
  subsets: ['latin'],
  weight: ['400', '500', '600', '800'],
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  variable: '--font-lucid-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: 'Lucid — Concept Demo | WebMinor' },
  description:
    'A concept spatial-computing product site designed and built by WebMinor, showing the kind of premium product launch page we can build.',
  robots: { index: false, follow: false },
};

export default function LucidLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${ui.variable} ${mono.variable}`}>{children}</div>;
}

import type { Metadata } from 'next';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/*
  One geometric grotesque doing display, headline and interface, with a mono
  reserved for the technical voice: the callouts, the specification strip and
  the eyebrow. That split is the brand — the product is quiet and the only
  thing that speaks in a technical register is the engineering.

  The wordmark alone is set in Technopollas, a wide techno face with sliced
  strokes, supplied by Adam. It is loaded only for the five letters of LUCID:
  the rest of the page stays in the grotesque so the logo is the one place
  the brand raises its voice.
*/
const wordmark = localFont({
  src: './fonts/Technopollas.otf',
  variable: '--font-lucid-wordmark',
  display: 'swap',
  preload: true,
});

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
  return <div className={`${ui.variable} ${mono.variable} ${wordmark.variable}`}>{children}</div>;
}

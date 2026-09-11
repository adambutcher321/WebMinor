import type { Metadata } from 'next';

/**
 * Concept demos are noindex, matching the other /demo routes — they are
 * portfolio pieces for invented brands, not pages that should rank.
 *
 * Fonts stay in page.tsx: the ALTRIX design system scopes its type tokens to
 * its own `.page` wrapper rather than a layout-level div.
 */
export const metadata: Metadata = {
  // The root layout applies template "%s | WebMinor", so no suffix here —
  // the sibling demos hardcode one and render "... | WebMinor | WebMinor".
  title: 'ALTRIX — Concept Demo',
  description:
    'A concept product site design by WebMinor for an expedition smartwatch brand — cinematic dark-stage photography, a single accent colour, and a scroll-driven altimeter.',
  robots: { index: false, follow: false },
};

export default function AltrixLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

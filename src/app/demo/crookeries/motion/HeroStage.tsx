'use client';

import { useRef, type ReactNode } from 'react';
import HeroFilm from './HeroFilm';

/**
 * Gives the hero a scroll runway.
 *
 * The card sticks while the visitor scrolls through the taller container behind it,
 * and that travel is what the film is scrubbed against. The hero keeps its inset and
 * rounded corners — the reference's ground rule that nothing is full-bleed still holds.
 */
export default function HeroStage({
  className,
  heroClassName,
  children,
}: {
  className: string;
  heroClassName: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={className}>
      <header className={heroClassName}>
        <HeroFilm scrollRef={ref} />
        {children}
      </header>
    </div>
  );
}

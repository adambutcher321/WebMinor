'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useLenisScrollTrigger } from '@/hooks/useLenisScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

const ReducedMotionContext = createContext(true);

/** Read by every motion component here, so the reduced-motion check happens once. */
export const useMotionDisabled = () => useContext(ReducedMotionContext);

/**
 * Route-scoped motion root: smooth scroll plus the reduced-motion decision.
 *
 * Lenis and GSAP come from the shared `useLenisScrollTrigger` hook, which lazy-imports
 * both — the demo route should not put a scroll library in the bundle of a visitor who
 * never opens it.
 */
export default function MotionRoot({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  useLenisScrollTrigger({ enabled: !reduced });

  return (
    <ReducedMotionContext.Provider value={reduced}>{children}</ReducedMotionContext.Provider>
  );
}

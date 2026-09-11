'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks `prefers-reduced-motion`, live.
 *
 * Starts `true` so the very first render is the still, fully-resolved page: a visitor
 * who asked for no motion must never catch a frame of it, and everyone else sees the
 * finished layout rather than a flash of hidden content if hydration is slow.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return reduced;
}

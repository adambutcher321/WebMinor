import { useEffect } from 'react';

export interface LenisLike {
  on: (event: 'scroll', callback: () => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
}

export interface LenisScrollTriggerDrivers {
  lenis: LenisLike;
  onScrollTriggerUpdate: () => void;
  requestFrame: (callback: (time: number) => void) => number;
  cancelFrame: (handle: number) => void;
}

export function wireLenisToScrollTrigger(drivers: LenisScrollTriggerDrivers): () => void {
  const { lenis, onScrollTriggerUpdate, requestFrame, cancelFrame } = drivers;

  lenis.on('scroll', onScrollTriggerUpdate);

  let rafId = requestFrame(function raf(time) {
    lenis.raf(time);
    rafId = requestFrame(raf);
  });

  return () => {
    cancelFrame(rafId);
    lenis.destroy();
  };
}

export interface UseLenisScrollTriggerOptions {
  enabled: boolean;
}

export function useLenisScrollTrigger({ enabled }: UseLenisScrollTriggerOptions): void {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: Lenis } = await import('lenis');
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      cleanup = wireLenisToScrollTrigger({
        lenis: new Lenis(),
        onScrollTriggerUpdate: () => ScrollTrigger.update(),
        requestFrame: (cb) => requestAnimationFrame(cb),
        cancelFrame: (id) => cancelAnimationFrame(id),
      });
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);
}

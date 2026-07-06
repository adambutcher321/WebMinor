'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import FallbackHero from './FallbackHero';
import CopyOverlay from './CopyOverlay';
import { detectCapabilities, shouldUseFallback } from '@/lib/launch/capabilities';
import { computeLaunchState } from '@/lib/launch/launchState';
import { useLenisScrollTrigger } from '@/hooks/useLenisScrollTrigger';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

export const FALLBACK_IMAGE_SRC = '/images/launch-fallback.jpg';

interface Killable {
  kill: () => void;
}

export default function LaunchHero() {
  const [useFallback, setUseFallback] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability detection must run client-only (window/navigator/matchMedia unavailable during SSR); this intentionally starts as null to avoid a hydration mismatch, then resolves post-mount.
    setUseFallback(shouldUseFallback(detectCapabilities()));
  }, []);

  useLenisScrollTrigger({ enabled: useFallback === false });

  useEffect(() => {
    if (useFallback !== false || !sectionRef.current) return;

    let cancelled = false;
    let scrollTrigger: Killable | undefined;

    // The copy layer is deliberately driven from the same onUpdate as the 3D
    // scene rather than its own ScrollTrigger: a second trigger on a pinned
    // element resolves its start/end offset by the pin spacer, landing the
    // fade after the pin releases instead of during pre-launch.
    const copyEl = sectionRef.current.querySelector<HTMLElement>('[data-launch-copy]');

    (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !sectionRef.current) return;

      scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: true,
        onUpdate: (self: { progress: number }) => {
          progressRef.current.value = self.progress;
          if (copyEl) {
            const state = computeLaunchState(self.progress);
            copyEl.style.opacity = String(state.copyOpacity);
            copyEl.style.transform = `translateY(${state.copyOffsetY}px)`;
          }
        },
      });
    })();

    return () => {
      cancelled = true;
      scrollTrigger?.kill();
    };
  }, [useFallback]);

  if (useFallback === null) {
    return null;
  }

  if (useFallback) {
    return <FallbackHero imageSrc={FALLBACK_IMAGE_SRC} />;
  }

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-[#0B0D10]">
      <Scene progressRef={progressRef} />
      <CopyOverlay className="pointer-events-none absolute inset-0" data-launch-copy="" />
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Scene from './Scene';
import FallbackHero from './FallbackHero';
import CopyOverlay from './CopyOverlay';
import { detectCapabilities, shouldUseFallback } from '@/lib/launch/capabilities';
import { useLenisScrollTrigger } from '@/hooks/useLenisScrollTrigger';

export const FALLBACK_IMAGE_SRC = '/images/launch-fallback.jpg';

interface Killable {
  kill: () => void;
}

export default function LaunchHero() {
  const [useFallback, setUseFallback] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    setUseFallback(shouldUseFallback(detectCapabilities()));
  }, []);

  useLenisScrollTrigger({ enabled: useFallback === false });

  useEffect(() => {
    if (useFallback !== false || !sectionRef.current) return;

    let cancelled = false;
    let scrollTrigger: Killable | undefined;
    let copyTween: (Killable & { scrollTrigger?: Killable | null }) | undefined;

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
        },
      });

      copyTween = gsap.to('[data-launch-copy]', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '35% top',
          scrub: true,
        },
      });
    })();

    return () => {
      cancelled = true;
      scrollTrigger?.kill();
      copyTween?.scrollTrigger?.kill();
      copyTween?.kill();
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

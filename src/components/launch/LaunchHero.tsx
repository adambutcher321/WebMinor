'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import FallbackHero from './FallbackHero';
import CopyOverlay from './CopyOverlay';
import FilmCanvas from './FilmCanvas';
import TelemetryHud from './TelemetryHud';
import { detectCapabilities, shouldUseFallback } from '@/lib/launch/capabilities';
import { computeLaunchState } from '@/lib/launch/launchState';
import { useLenisScrollTrigger } from '@/hooks/useLenisScrollTrigger';

export const FALLBACK_IMAGE_SRC = '/images/launch-poster.webp';

const PARALLAX_FILM_PX = 10;
const PARALLAX_COPY_PX = 18;

interface Killable {
  kill: () => void;
}

export default function LaunchHero() {
  const [useFallback, setUseFallback] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const filmWrapRef = useRef<HTMLDivElement>(null);
  const copyWrapRef = useRef<HTMLDivElement>(null);
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

    // The copy layer is deliberately driven from the same onUpdate as the
    // film rather than its own ScrollTrigger: a second trigger on a pinned
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
        end: '+=300%',
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

  useEffect(() => {
    if (useFallback !== false) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      if (filmWrapRef.current) {
        filmWrapRef.current.style.transform = `translate(${-currentX * PARALLAX_FILM_PX}px, ${-currentY * PARALLAX_FILM_PX}px)`;
      }
      if (copyWrapRef.current) {
        copyWrapRef.current.style.transform = `translate(${currentX * PARALLAX_COPY_PX}px, ${currentY * PARALLAX_COPY_PX}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [useFallback]);

  if (useFallback === null) {
    return null;
  }

  if (useFallback) {
    return <FallbackHero imageSrc={FALLBACK_IMAGE_SRC} />;
  }

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-[#07080C]">
      {/* Film layer: poster paints instantly, canvas scrubs over it. Bleeds
          past the section edges so mouse parallax never reveals a border. */}
      <div ref={filmWrapRef} className="absolute -inset-4 will-change-transform">
        <Image
          src={FALLBACK_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <FilmCanvas progressRef={progressRef} />
      </div>
      <div aria-hidden="true" className="launch-grain absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(5,6,10,0.6)_100%)]"
      />
      <div ref={copyWrapRef} className="absolute inset-0 will-change-transform">
        <CopyOverlay className="pointer-events-none absolute inset-0" data-launch-copy="" />
      </div>
      <TelemetryHud progressRef={progressRef} />
    </section>
  );
}

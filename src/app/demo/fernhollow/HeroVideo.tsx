'use client';

import { useIsClient, useMediaQuery } from '../useClientEnv';

/*
  The hero used to hardcode `hero.mp4` — 12.4MB — for every visitor, while the
  3.0MB `hero-m.mp4` that ships alongside it was never referenced anywhere in the
  project. A phone on mobile data was downloading the desktop master.

  It also autoplayed regardless of `prefers-reduced-motion`. A full-bleed moving
  background is exactly what that setting is for, so when it is set the poster
  still is all that renders — the clip opens on that frame anyway, so nothing is
  lost but the motion.
*/
const DESKTOP = '/demo/fernhollow/hero.mp4';
const MOBILE = '/demo/fernhollow/hero-m.mp4';
const POSTER = '/demo/fernhollow/hero.webp';

export default function FernhollowHeroVideo() {
  const isClient = useIsClient();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isSmall = useMediaQuery('(max-width: 768px)');

  const src = !isClient || reduceMotion ? null : isSmall ? MOBILE : DESKTOP;

  return (
    <div className="absolute inset-0">
      {src ? (
        <video
          key={src}
          autoPlay
          loop
          muted
          playsInline
          poster={POSTER}
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // Poster-only first paint: the same frame the clip opens on, so there is
        // no flash and no layout shift when the video takes over.
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${POSTER})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/50" />
    </div>
  );
}

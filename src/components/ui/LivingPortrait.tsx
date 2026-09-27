"use client";

import { useEffect, useRef } from "react";

const POSTER = "/about/adam-portrait-poster.webp";

/**
 * Adam's portrait as a 4.7s seamless loop (blink, small head turn). The poster
 * is the loop's own first frame, so the still and the motion never disagree.
 * Playback is started here rather than with `autoPlay` so visitors who ask
 * for reduced motion keep the still.
 */
export default function LivingPortrait({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) video.pause();
      else video.play().catch(() => {});
    };
    // Browsers refuse play() in a hidden tab, so retry when it comes forward
    const onVisible = () => {
      if (!document.hidden) sync();
    };
    sync();
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Adam Butcher, founder of WebMinor"
      className={`relative overflow-hidden bg-[#0B0D10] ${className}`}
    >
      <video
        ref={ref}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/about/adam-portrait.webm" type="video/webm" />
        <source src="/about/adam-portrait.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

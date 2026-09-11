'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './herofilm.module.css';

const FRAMES = 80;
const SRC = (i: number) => `/demo/crookeries/hero-film/f${String(i).padStart(3, '0')}.webp`;

/**
 * The hero as a scroll-scrubbed camera move: a slow dolly through the kitchen, driven
 * by the visitor's own scroll rather than by a clock.
 *
 * This is *scrubbed* motion, so the bar's duration and easing rules (M2, M3) do not
 * apply to it — the visitor owns the timeline. See the "scrubbed vs triggered" note in
 * design-loop/crookeries-motion-bar.md.
 *
 * Frames are 3.7MB and are fetched only on first scroll intent. Loading them eagerly
 * cost the launch hero roughly 50 Lighthouse points; the poster is frame one, so the
 * still and the film's first frame are the same pixels and nothing shifts when the
 * canvas takes over.
 */
export default function HeroFilm({ scrollRef }: { scrollRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  // Fetch on first intent, once.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // A narrow viewport gets the still: 80 frames is not a fair thing to send to a
    // phone, and the dolly reads as almost nothing at that size anyway.
    if (window.innerWidth < 900) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener('scroll', start);
      window.removeEventListener('pointermove', start);

      let loaded = 0;
      const imgs: HTMLImageElement[] = [];
      for (let i = 1; i <= FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          loaded += 1;
          // Wait for the whole run before swapping in the canvas, so the scrub can
          // never land on a frame that has not arrived and flash the ground.
          if (loaded === FRAMES) setReady(true);
        };
        img.onerror = () => {
          loaded += 1;
          if (loaded === FRAMES) setReady(true);
        };
        img.src = SRC(i);
        imgs.push(img);
      }
      framesRef.current = imgs;
    };

    window.addEventListener('scroll', start, { passive: true, once: false });
    window.addEventListener('pointermove', start, { passive: true, once: false });
    return () => {
      window.removeEventListener('scroll', start);
      window.removeEventListener('pointermove', start);
    };
  }, []);

  // Map scroll position through the tall hero container onto a frame index.
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const host = scrollRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let last = -1;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      last = -1;
    };

    const draw = (idx: number) => {
      const img = framesRef.current[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      // Cover-fit by hand: the canvas is a different aspect to the frame and the
      // subject sits low, so letterboxing or squashing would both be visible.
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const tick = () => {
      const rect = host.getBoundingClientRect();
      // Scrubbed against the hero's own travel out of the viewport: the camera eases
      // in over the first screenful of scroll and is done by the time the hero leaves.
      const travel = rect.height;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const idx = Math.min(FRAMES - 1, Math.round(p * (FRAMES - 1)));
      if (idx !== last) {
        last = idx;
        draw(idx);
      }
      raf = requestAnimationFrame(tick);
    };

    size();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
    };
  }, [ready, scrollRef]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      data-ready={ready ? 'true' : 'false'}
      aria-hidden="true"
    />
  );
}

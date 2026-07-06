'use client';

import { useEffect, useRef, type RefObject } from 'react';
import {
  FRAME_COUNT,
  framePath,
  frameIndexForProgress,
  nearestLoadedFrame,
  frameLoadOrder,
} from '@/lib/launch/frameSequence';

const COARSE_STRIDE = 8;
const MAX_CONCURRENT_LOADS = 6;
const MAX_DPR = 2;

interface FilmCanvasProps {
  progressRef: RefObject<{ value: number }>;
}

/**
 * Draws the launch film onto a full-bleed canvas, scrubbed by scroll
 * progress. Frames stream in coarse-first so the scrub is usable within the
 * first few downloads; until a frame's exact image arrives, its nearest
 * loaded neighbour is shown instead.
 */
export default function FilmCanvas({ progressRef }: FilmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const images: (HTMLImageElement | null)[] = Array.from({ length: FRAME_COUNT }, () => null);
    const loaded: boolean[] = Array.from({ length: FRAME_COUNT }, () => false);
    let disposed = false;
    let rafId = 0;
    let lastDrawnIndex = -1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      lastDrawnIndex = -1;
    };

    const draw = () => {
      const target = frameIndexForProgress(progressRef.current?.value ?? 0, FRAME_COUNT);
      const index = nearestLoadedFrame(target, loaded);
      if (index === null || index === lastDrawnIndex) return;
      const image = images[index];
      if (!image) return;

      const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      ctx.drawImage(
        image,
        (canvas.width - drawWidth) / 2,
        (canvas.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      lastDrawnIndex = index;
    };

    const tick = () => {
      draw();
      rafId = requestAnimationFrame(tick);
    };

    const order = frameLoadOrder(FRAME_COUNT, COARSE_STRIDE);
    let cursor = 0;
    let inFlight = 0;

    const pump = () => {
      while (!disposed && inFlight < MAX_CONCURRENT_LOADS && cursor < order.length) {
        const index = order[cursor++];
        inFlight++;
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          inFlight--;
          if (disposed) return;
          images[index] = image;
          loaded[index] = true;
          pump();
        };
        image.onerror = () => {
          inFlight--;
          if (!disposed) pump();
        };
        image.src = framePath(index);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    pump();
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="film-canvas"
      className="absolute inset-0 h-full w-full"
    />
  );
}

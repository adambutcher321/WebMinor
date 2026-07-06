'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const TOTAL_FRAMES = 240;

function padNum(n: number): string {
  return String(n).padStart(4, '0');
}

export default function VideoBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    if (pathname?.startsWith('/launch')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(currentFrameRef.current);
    }

    function draw(idx: number) {
      if (!ctx || !canvas) return;
      const img = framesRef.current[idx];
      if (!img || !img.complete) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      const sw = iw * s;
      const sh = ih * s;

      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
      ctx.fillStyle = 'rgba(11,13,16,0.3)';
      ctx.fillRect(0, 0, cw, ch);
    }

    // Preload frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${padNum(i)}.jpg`;
      if (i === 1) img.onload = resize;
      framesRef.current.push(img);
    }

    // Scroll → frame
    function onScroll() {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
      const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        draw(idx);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    resize();
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [pathname]);

  if (pathname?.startsWith('/launch')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 200px 80px rgba(11,13,16,0.4)' }} />
      {/* Centre wash for text readability */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(11,13,16,0.45) 0%, rgba(11,13,16,0.15) 60%, transparent 100%)' }} />
      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[10000] opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}

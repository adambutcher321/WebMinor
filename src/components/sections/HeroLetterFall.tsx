'use client';

import { useEffect, useRef } from 'react';

interface HeroLetterFallProps {
  lines: { text: string; className: string }[];
}

function splitIntoSpans(text: string): HTMLSpanElement[] {
  const spans: HTMLSpanElement[] = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? ' ' : char;
    span.style.display = 'inline-block';
    span.style.transition = 'none';
    spans.push(span);
  }
  return spans;
}

export default function HeroLetterFall({ lines }: HeroLetterFallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lineEls = container.querySelectorAll('[data-hero-line]');
    const allSpans: HTMLSpanElement[] = [];

    lineEls.forEach((lineEl) => {
      const text = lineEl.textContent || '';
      const className = lineEl.getAttribute('data-hero-line') || '';
      lineEl.textContent = '';
      (lineEl as HTMLElement).className = className;

      const spans = splitIntoSpans(text);
      spans.forEach(s => {
        lineEl.appendChild(s);
        allSpans.push(s);
      });
    });

    spansRef.current = allSpans;

    // Pre-seed random values for each character (consistent on scroll back)
    const charData = allSpans.map((_, i) => ({
      stagger: i * 0.006,
      yDist: 250 + Math.random() * 200,
      xDist: -(60 + Math.random() * 160),
      rot: -(4 + Math.random() * 20),
    }));

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        // Animation plays from 5% to 40% of viewport height
        const start = vh * 0.05;
        const end = vh * 0.45;

        allSpans.forEach((span, i) => {
          const d = charData[i];
          const charStart = start + d.stagger * vh;
          const charEnd = end + d.stagger * vh;

          let progress = (scrollY - charStart) / (charEnd - charStart);
          progress = Math.max(0, Math.min(1, progress));

          // Ease in (accelerate as letters fall)
          const eased = progress * progress;

          const x = d.xDist * eased;
          const y = d.yDist * eased;
          const rot = d.rot * eased;
          const opacity = 1 - eased;

          span.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
          span.style.opacity = String(opacity);
        });
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [lines]);

  return (
    <div ref={containerRef}>
      <h1 className="font-[family-name:var(--font-sora)] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
        {lines.map((line, i) => (
          <span
            key={i}
            data-hero-line={`block ${line.className}`}
            className={`block ${line.className}`}
          >
            {line.text}
          </span>
        ))}
      </h1>
    </div>
  );
}

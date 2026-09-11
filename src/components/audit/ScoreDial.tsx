'use client';

import { useEffect, useState } from 'react';

interface ScoreDialProps {
  label: string;
  score: number | null;
  color: string;
  size?: number;
}

export default function ScoreDial({ label, score, color, size = 96 }: ScoreDialProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setAnimated(score ?? 0);
      return;
    }
    const id = requestAnimationFrame(() => setAnimated(score ?? 0));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const stroke = size * 0.09;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (animated / 100);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${score ?? 'no'} out of 100`}>
        <circle cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <text
          x={center}
          y={center + size * 0.07}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight={700}
          fontSize={size * 0.26}
          fill="#F5F7FA"
        >
          {score ?? '—'}
        </text>
      </svg>
      <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider uppercase text-[#6B7280] text-center">
        {label}
      </span>
    </div>
  );
}

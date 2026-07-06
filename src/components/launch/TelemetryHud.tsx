'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { computeTelemetry, type Telemetry } from '@/lib/launch/telemetry';

interface TelemetryHudProps {
  progressRef: RefObject<{ value: number }>;
}

export default function TelemetryHud({ progressRef }: TelemetryHudProps) {
  const [telemetry, setTelemetry] = useState<Telemetry>(() => computeTelemetry(0));
  const lastRef = useRef(telemetry);

  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const next = computeTelemetry(progressRef.current?.value ?? 0);
      if (
        next.clock !== lastRef.current.clock ||
        next.altitude !== lastRef.current.altitude ||
        next.velocity !== lastRef.current.velocity
      ) {
        lastRef.current = next;
        setTelemetry(next);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progressRef]);

  return (
    <div
      aria-hidden="true"
      data-testid="telemetry-hud"
      className="pointer-events-none absolute bottom-6 left-6 z-10 select-none font-[family-name:var(--font-mono)] text-[10px] leading-relaxed tracking-[0.3em] text-white/50"
    >
      <p className="mb-2 flex items-center gap-2 text-white/70">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#40E0FF]" />
        WEBMINOR — MISSION 001
      </p>
      <p>{telemetry.clock}</p>
      <p>{telemetry.altitude}</p>
      <p>{telemetry.velocity}</p>
    </div>
  );
}

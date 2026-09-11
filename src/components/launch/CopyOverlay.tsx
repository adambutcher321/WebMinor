import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CopyOverlayProps = HTMLAttributes<HTMLDivElement>;

export default function CopyOverlay({ className, ...rest }: CopyOverlayProps) {
  return (
    <div
      className={cn('relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center', className)}
      {...rest}
    >
      {/* Scrim: keeps the copy readable over the bright flame and clouds
          without dimming the whole film. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[75%] w-[130%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(5,6,10,0.55)_0%,rgba(5,6,10,0.25)_45%,transparent_72%)]"
      />
      <p
        className="launch-reveal font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.4em] text-[#40E0FF] [text-shadow:0_1px_12px_rgba(5,6,10,0.9)]"
        style={{ animationDelay: '0.1s' }}
      >
        Mission 001 — Ignition
      </p>
      <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold uppercase tracking-tight text-white [text-shadow:0_2px_32px_rgba(5,6,10,0.85)] sm:text-6xl lg:text-7xl">
        <span className="launch-reveal block" style={{ animationDelay: '0.25s' }}>
          We don&apos;t build websites.
        </span>
        <span
          className="launch-reveal block bg-gradient-to-r from-white via-[#7DE8FF] to-[#E29BF0] bg-clip-text text-transparent [text-shadow:none] drop-shadow-[0_2px_18px_rgba(5,6,10,0.8)]"
          style={{ animationDelay: '0.45s' }}
        >
          We launch businesses.
        </span>
      </h1>
      <p
        className="launch-reveal max-w-xl text-lg text-white/85 [text-shadow:0_1px_16px_rgba(5,6,10,0.9)]"
        style={{ animationDelay: '0.7s' }}
      >
        Luxury digital experiences engineered for ambitious companies.
      </p>
      <div
        className="launch-reveal pointer-events-auto flex flex-wrap items-center justify-center gap-4"
        style={{ animationDelay: '0.9s' }}
      >
        <a
          href="/contact"
          className="rounded-full bg-[#40E0FF] px-8 py-3 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-[#0B0D10] shadow-[0_0_24px_rgba(64,224,255,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_48px_rgba(64,224,255,0.6)]"
        >
          Launch Your Project
        </a>
        <a
          href="#about"
          className="rounded-full border border-white/20 bg-white/5 px-8 py-3 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:border-[#40E0FF] hover:text-[#40E0FF] hover:shadow-[0_0_32px_rgba(64,224,255,0.25)]"
        >
          View Our Work
        </a>
      </div>
    </div>
  );
}

import type { HTMLAttributes } from 'react';

type CopyOverlayProps = HTMLAttributes<HTMLDivElement>;

export default function CopyOverlay({ className, ...rest }: CopyOverlayProps) {
  return (
    <div
      className={`relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center ${className ?? ''}`}
      {...rest}
    >
      <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl">
        We don&apos;t build websites.
        <br />
        We launch businesses.
      </h1>
      <p className="max-w-xl text-lg text-white/70">
        Luxury digital experiences engineered for ambitious South West businesses.
      </p>
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-4">
        <a
          href="/contact"
          className="rounded-full bg-[#40E0FF] px-8 py-3 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-[#0B0D10] transition-transform hover:scale-105"
        >
          Launch Your Project
        </a>
        <a
          href="#about"
          className="rounded-full border border-white/20 px-8 py-3 font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-[#40E0FF] hover:text-[#40E0FF]"
        >
          View Our Work
        </a>
      </div>
    </div>
  );
}

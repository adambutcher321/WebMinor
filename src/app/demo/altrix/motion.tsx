'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/*
 * ALTRIX motion primitives. Everything here is a pure function of scroll or
 * cursor position, runs once and settles, and no-ops under reduced motion —
 * the same rules the rest of the page keeps (design-system §7).
 */

const REDUCED = '(prefers-reduced-motion: reduce)';
const COARSE = '(pointer: coarse)';

/** Leans its child towards the cursor and tracks the pointer as --mx/--my (%). */
export function Tilt({
  children,
  max = 5,
  className,
  style,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED).matches || window.matchMedia(COARSE).matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-y * max * 1.5).toFixed(2)}deg`);
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
    };
    const onLeave = () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={className} style={style} data-tilt="">
      {children}
    </div>
  );
}

/** Pulls its child towards a nearby cursor. Ported from the Lucid build. */
export function Magnetic({
  children,
  strength = 0.3,
  radius = 80,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia(REDUCED).matches || window.matchMedia(COARSE).matches) return;
    const el = wrap.firstElementChild as HTMLElement | null;
    if (!el) return;

    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05 && tx === 0 && ty === 0) {
        el.style.removeProperty('transform');
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      const near = Math.abs(mx) < r.width / 2 + radius && Math.abs(my) < r.height / 2 + radius;
      tx = near ? mx * strength : 0;
      ty = near ? my * strength : 0;
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.style.removeProperty('transform');
    };
  }, [strength, radius]);

  return (
    <span ref={wrapRef} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}

/**
 * A figure such as "46.0 mm", "±0.3 m", "−41 °C" or "502 × 502 px" whose
 * leading number counts up from zero the first time it is seen. Anything
 * without a leading number renders as-is.
 */
const FIGURE = /^([^\d]*?)([−\-±]?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

export function CountFigure({ value, className }: { value: string; className?: string }) {
  const m = FIGURE.exec(value);
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (window.matchMedia(REDUCED).matches) return;
    const target = parseFloat(m[3].replace(/,/g, ''));
    const decimals = (m[3].split('.')[1] || '').length;
    const grouped = m[3].includes(',');
    const fmt = (n: number) =>
      grouped ? n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
              : n.toFixed(decimals);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / 1100);
          const e = 1 - Math.pow(1 - p, 3);
          setShown(fmt(target * e));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        setShown(fmt(0));
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!m) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {m[1]}{m[2]}{shown ?? m[3]}{m[4]}
    </span>
  );
}

/** Marks its child data-in once it arrives; the CSS does the rising. */
export function RiseIn({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED).matches) { queueMicrotask(() => setInView(true)); return; }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { setInView(true); io.disconnect(); }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-in={inView}>
      {children}
    </div>
  );
}

/** Slides its child sideways as it passes through the viewport. */
export function Drift({ children, amount = 4, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED).matches) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const passage = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      const x = (passage - 0.5) * 2 * amount;
      el.style.transform = `translate3d(${x.toFixed(2)}%, 0, 0) scale(1.1)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [amount]);

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%', willChange: 'transform' }}>
      {children}
    </div>
  );
}

/** The nav's altitude readout: 0 m at the top of the page, the ceiling at the foot. */
export function NavAltitude({ ceiling = 9000, className }: { ceiling?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      el.textContent = `${(Math.round((p * ceiling) / 5) * 5).toLocaleString('en-GB')} m`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [ceiling]);

  return (
    <span className={className} aria-hidden="true">
      <span data-dot="" />
      <span>Alt</span>
      <span ref={ref}>0 m</span>
    </span>
  );
}

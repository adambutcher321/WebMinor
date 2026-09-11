'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useMediaQuery } from '../useClientEnv';

/*
  Motion primitives for LUCID.

  Three things, chosen because each one serves the product rather than
  decorating it:

  - Smooth scroll, because the teardown is scrubbed by scroll position. Native
    wheel scrolling arrives in coarse steps, so the parts jumped apart in
    stages; with inertia between the wheel and the scroll offset the teardown
    becomes continuous, which is the whole point of it.
  - Magnetic buttons, because the brand is precision hardware and a control
    that leans towards your cursor reads as engineered rather than as a trick.
  - Arrival, because a page where everything is simply already there has no
    sense of being assembled, which is what this product is about.

  Everything here no-ops under `prefers-reduced-motion`, and nothing is hidden
  before JavaScript runs.
*/

const REDUCED = '(prefers-reduced-motion: reduce)';

/** Physics-based scrolling for the route. Renders nothing. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let destroy: (() => void) | undefined;
    let cancelled = false;

    import('lenis')
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          // Long enough to feel weighted, short enough that the teardown still
          // tracks the wheel rather than trailing behind it.
          lerp: 0.11,
          wheelMultiplier: 0.9,
        });

        let raf = requestAnimationFrame(function loop(time: number) {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        });

        destroy = () => {
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      })
      .catch(() => {
        /* Smooth scroll is an enhancement; native scrolling is the fallback. */
      });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return null;
}

/**
 * Pulls its child towards the cursor while the cursor is near it.
 *
 * The element moves, not the page: the wrapper keeps its own box so layout
 * never shifts and nothing below it reflows.
 */
export function Magnetic({
  children,
  strength = 0.32,
  radius = 90,
  className,
}: {
  children: ReactNode;
  /** Fraction of the cursor's offset the element travels. */
  strength?: number;
  /** Distance in px beyond the element's box where the pull begins. */
  radius?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia(REDUCED).matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = wrap.firstElementChild as HTMLElement | null;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      const near =
        Math.abs(mx) < r.width / 2 + radius && Math.abs(my) < r.height / 2 + radius;

      tx = near ? mx * strength : 0;
      ty = near ? my * strength : 0;

      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

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

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      el.style.removeProperty('transform');
    };
  }, [strength, radius]);

  return (
    <span ref={wrapRef} className={className} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}

/** Fades and lifts a block as it arrives. */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  // Read during render through the shared store rather than written into state
  // from an effect, which renders once wrong and once right.
  const reduced = useMediaQuery(REDUCED);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED).matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const on = reduced || seen;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(22px)',
        transition: `opacity 720ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 720ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

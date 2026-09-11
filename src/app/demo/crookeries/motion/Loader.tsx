'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { markIntroDone } from './intro';
import { BLOB_PATH, DUR } from './tokens';
import styles from './loader.module.css';

/** Frames pulled before the door opens, so the counter tracks something real. */
const PREFETCH = 12;
/** Long enough for the wipe to read as a move rather than a flicker. */
const MIN_MS = 900;
/** A shop must never be held behind a loader; past this it opens regardless. */
const MAX_MS = 2000;
const SEEN_KEY = 'crookeries-intro-seen';

type Phase = 'idle' | 'loading' | 'wiping' | 'done';

/**
 * First-visit intro: a counter that tracks real asset progress, then the blob wipe
 * that hands the visitor to the hero (M1).
 *
 * The counter is wired to actual image loads rather than to a timer. A progress number
 * that only pretends to measure something is a lie the visitor has no way to check, and
 * this one is checkable — throttle the network and it slows down.
 *
 * Rendered hidden on the server so a visitor without JavaScript, or one returning later
 * in the session, never meets a door they have to wait behind.
 */
export default function Loader() {
  const [phase, setPhase] = useState<Phase>('idle');
  /** True asset progress. */
  const [pct, setPct] = useState(0);
  /** What the counter displays: eases toward `pct` and never overtakes it. */
  const [shownPct, setShownPct] = useState(0);
  const holeRef = useRef<SVGPathElement>(null);
  const blobRef = useRef<SVGPathElement>(null);
  const startedAt = useRef(0);

  // The SVG is sized in viewport pixels, so the mark has to be placed in that space —
  // there is no CSS centring for a path authored in its own 100-unit box.
  useLayoutEffect(() => {
    if (phase !== 'loading') return;
    const place = () => {
      const t = transformFor(window.innerWidth / 2, window.innerHeight / 2, 2.2);
      blobRef.current?.setAttribute('transform', t);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [phase]);

  // Runs before paint, so the overlay is either up or absent in the first painted
  // frame — never a flash of one then the other.
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      // Private mode with storage disabled: treat as seen and skip the intro rather
      // than showing it on every navigation.
      seen = true;
    }
    if (reduced || seen) {
      markIntroDone();
      setPhase('done');
      return;
    }
    startedAt.current = performance.now();
    setPhase('loading');
    document.documentElement.style.overflow = 'hidden';
  }, []);

  const finish = useCallback(() => {
    document.documentElement.style.overflow = '';
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable — the intro simply plays again next navigation */
    }
    markIntroDone();
    setPhase('done');
  }, []);

  const beginWipe = useCallback(async () => {
    setPhase('wiping');
    const hole = holeRef.current;
    const blob = blobRef.current;
    if (!hole || !blob) {
      markIntroDone();
      finish();
      return;
    }

    const { gsap } = await import('gsap');
    const w = window.innerWidth;
    const h = window.innerHeight;
    // The blob's narrowest radius is its valley — 21 units of the 100-unit box. The
    // hole only covers the viewport once that valley clears the far corner.
    const cover = (Math.hypot(w, h) / 2 / 21) * 1.06;

    // The scale is tweened as a plain number and written to the attribute on each
    // frame. Tweening the transform *string* via `attr` looked right in code but
    // measured as a 200ms snap — GSAP will not interpolate a compound transform.
    const state = { s: 2.2 };
    gsap
      .timeline({ onComplete: finish })
      // The hero copy resolves inside the wipe, not after it. In the reference these
      // are not two moves: the energy census reads 2.05-3.35s as a single composed
      // move, with the headline sharpening over its last 40%.
      .call(markIntroDone, [], (DUR.wipe * 0.55) / 1000)
      .to(blob, { opacity: 0, duration: DUR.state / 1000, ease: 'power2.out' }, 0)
      .to(
        state,
        {
          s: cover,
          duration: DUR.wipe / 1000,
          ease: 'power2.out',
          onUpdate: () => hole.setAttribute('transform', transformFor(w / 2, h / 2, state.s)),
        },
        0,
      );
  }, [finish]);

  // Real progress: prefetch the poster and the opening frames of the hero film.
  useEffect(() => {
    if (phase !== 'loading') return;
    let cancelled = false;
    let loaded = 0;

    const urls = ['/demo/crookeries/hero-film/poster.webp'];
    for (let i = 1; i <= PREFETCH; i++) {
      urls.push(`/demo/crookeries/hero-film/f${String(i).padStart(3, '0')}.webp`);
    }

    const bump = () => {
      loaded += 1;
      if (!cancelled) setPct(Math.round((loaded / urls.length) * 100));
    };

    for (const url of urls) {
      const img = new Image();
      // A missing frame must not strand the visitor behind a stuck counter.
      img.onload = bump;
      img.onerror = bump;
      img.src = url;
    }

    const cap = window.setTimeout(() => {
      if (!cancelled) {
        setPct(100);
      }
    }, MAX_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [phase]);

  /*
   * The counter climbs toward real progress rather than snapping to it.
   *
   * On a warm local connection every asset resolves in one tick, and a counter that
   * reads 100% for its whole life looks broken. Easing toward the true value keeps the
   * number honest — it is capped by actual progress and can never run ahead of it —
   * while still reading as a count.
   */
  useEffect(() => {
    if (phase !== 'loading') return;
    let raf = 0;
    let prev = performance.now();
    const step = (now: number) => {
      const dt = now - prev;
      prev = now;
      setShownPct((cur) => {
        if (cur >= pct) return pct;
        // Full travel takes ~700ms, so the climb is legible without delaying the open.
        return Math.min(pct, cur + (dt / 700) * 100);
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, pct]);

  // Open once the assets are in, the count has caught up, and the moment has registered.
  useEffect(() => {
    if (phase !== 'loading' || pct < 100 || shownPct < 99.5) return;
    const elapsed = performance.now() - startedAt.current;
    const wait = Math.max(0, MIN_MS - elapsed);
    const t = window.setTimeout(beginWipe, wait);
    return () => window.clearTimeout(t);
  }, [phase, pct, shownPct, beginWipe]);

  if (phase === 'done') return null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      data-nojs-hidden="true"
      aria-hidden="true"
      // The page beneath is the real content; the intro is decoration over it.
      role="presentation"
    >
      <noscript>
        <style>{`.${styles.overlay}{display:none!important}`}</style>
      </noscript>
      <svg className={styles.canvas} aria-hidden="true">
        <defs>
          <mask id="crookeries-intro-hole" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            <path ref={holeRef} d={BLOB_PATH} fill="#000" transform="translate(0,0) scale(0) translate(-50,-50)" />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          className={styles.ground}
          mask="url(#crookeries-intro-hole)"
        />
        <path ref={blobRef} className={styles.mark} d={BLOB_PATH} transform="scale(0)" />
      </svg>

      <div className={styles.copy}>
        <p className={styles.wordmark}>Crookeries</p>
        <p className={styles.sub}>( preparing the kitchen )</p>
      </div>
      <p className={styles.count}>({Math.round(shownPct)}%)</p>
      <p className={styles.foot}>
        Small-batch stoneware, cookware and utensils,
        <br />
        made to outlast the kitchen they arrive in.
      </p>
    </div>
  );
}

function transformFor(cx: number, cy: number, s: number) {
  return `translate(${cx},${cy}) scale(${s}) translate(-50,-50)`;
}

'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './hero.module.css';

/**
 * Full-bleed hero, built around the character rather than beside him.
 *
 * He used to sit at 29vw pinned to the right edge with a third of him off
 * canvas, which made the brand's own mascot the smallest thing on its own
 * hero. He is now centred at up to 720px with the headline split above and
 * below him, and he reacts when he is pointed at: the pose cross-fades from
 * idle to arms-up and the whole figure rises, tilts and grows a little, once,
 * over 1200ms, then holds (bar M5 — nothing here loops or drifts).
 *
 * The scene still carries a slow cursor parallax; the type never moves, so the
 * headline stays readable while the objects around it have depth.
 */
export default function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const scene = sceneRef.current;
    if (!scene) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      // Heavy damping: the scene follows the cursor with weight rather than
      // snapping, which is what separates a considered parallax from jitter.
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      scene.style.setProperty('--px', cx.toFixed(4));
      scene.style.setProperty('--py', cy.toFixed(4));
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.hero} id="top">
      <div className={styles.scene} ref={sceneRef}>
        <h1 className={styles.headline}>
          <span className={styles.top}>
            MONEY <span className={styles.moves}>MOVES.</span>
          </span>
          <span className={styles.bottom}>
            SO SHOULD <span className={styles.you}>YOU</span>
          </span>
        </h1>

        {/*
          A button, not a div: the reaction has to be reachable by keyboard, and
          a focus ring on a decorative div would be a lie about what it does.
        */}
        <button type="button" className={styles.character} aria-label="Poke the KLIK monster">
          <span className={styles.stack}>
            <Image
              className={styles.poseIdle}
              src="/demo/klik/char-idle.webp"
              alt="The KLIK monster: a round shaggy black creature with one glowing amber eye, striped curly horns and a wide toothy grin, standing in white high-top trainers marked with an orange K"
              width={1024}
              height={1024}
              preload
              sizes="(max-width: 900px) 78vw, 46vw"
            />
            <Image
              className={styles.poseReact}
              src="/demo/klik/char-excited.webp"
              alt=""
              aria-hidden="true"
              width={1024}
              height={1024}
              sizes="(max-width: 900px) 78vw, 46vw"
            />
          </span>
        </button>

        {/* Sibling, not child: inside the figure it inherited that element's
            stacking context and was painted underneath the headline. */}
        <span className={styles.poke} aria-hidden="true">
          Go on, poke him
        </span>

        <div className={`${styles.chip} ${styles.chipSent}`}>
          <span className={styles.chipDot} aria-hidden="true" />
          <span>
            You sent Jake <strong>£20</strong>
          </span>
        </div>

        <div className={`${styles.chip} ${styles.chipSplit}`}>
          <span>DINNER · SPLIT 4 WAYS</span>
          <strong className={styles.chipAmount}>£31.20</strong>
        </div>

        <div className={`${styles.chip} ${styles.chipTap}`}>
          <span className={styles.chipTick} aria-hidden="true">
            ✓
          </span>
          <span>PAID</span>
        </div>

        <div className={`${styles.chip} ${styles.chipPot}`}>
          <span className={styles.chipPotTop}>IBIZA 🍹</span>
          <span className={styles.chipAmount}>£1,420</span>
          <span className={styles.chipBar} aria-hidden="true">
            <span />
          </span>
        </div>

        <div className={`${styles.chip} ${styles.chipRate}`} aria-hidden="true">
          <span>£1</span>
          <span className={styles.rateArrow}>→</span>
          <span className={styles.rateVal}>€1.17</span>
        </div>
      </div>

      <div className={styles.base}>
        <p className={styles.lead}>Send it. Split it. Tap it. Spend it. Anywhere.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#get">
            GET KLIK
            <span aria-hidden="true">→</span>
          </a>
          <a className={styles.secondary} href="#send">
            EXPLORE KLIK
          </a>
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import s from './lucid.module.css';

/**
 * The product layer, and the only thing on the page that follows the pointer.
 *
 * Direction, per the brief: pointer up lifts the headset and tilts it nose
 * down; pointer down lowers it and tilts it nose up; left and right give a
 * matching sideways tilt. The centre of the hero is neutral. Limits are 20px of
 * travel, 12 degrees of X rotation and 10 degrees of Y rotation.
 *
 * The transform lives on an inner wrapper so the outer element keeps owning
 * position and size — motion can shift the artwork but never move it out of its
 * slot or clip it. The typography, stage and interface are untouched.
 *
 * This is a depth illusion applied to a flat render, not a 3D model: it cannot
 * and does not pretend to reveal any face of the product the photograph does
 * not already show, so the angles stay small enough to read as parallax.
 */
const MAX_LIFT = 20; // px
const MAX_TILT_X = 12; // deg, from vertical pointer travel
const MAX_TILT_Y = 10; // deg, from horizontal pointer travel
const EASING = 0.075; // per frame approach to the target

export default function Headset({ scopeId }: { scopeId: string }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    // On touch the product stays put and the page scrolls normally.
    if (reduce.matches || coarse.matches) return;

    const scope = document.getElementById(scopeId);
    if (!scope) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      const r = scope.getBoundingClientRect();
      // -1 .. 1 from the centre of the hero, which is the neutral position.
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    };

    const home = () => {
      tx = 0;
      ty = 0;
    };

    const tick = () => {
      cx += (tx - cx) * EASING;
      cy += (ty - cy) * EASING;

      // Pointer above centre (cy negative) lifts the product and pitches the
      // nose down, so the movement reads as following the cursor rather than
      // fleeing it.
      const lift = cy * MAX_LIFT;
      const rotX = -cy * MAX_TILT_X;
      const rotY = cx * MAX_TILT_Y;

      inner.style.transform =
        `translate3d(0, ${lift.toFixed(2)}px, 0) ` +
        `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

      raf = requestAnimationFrame(tick);
    };

    scope.addEventListener('pointermove', onMove, { passive: true });
    scope.addEventListener('pointerleave', home);
    window.addEventListener('blur', home);
    raf = requestAnimationFrame(tick);

    return () => {
      scope.removeEventListener('pointermove', onMove);
      scope.removeEventListener('pointerleave', home);
      window.removeEventListener('blur', home);
      cancelAnimationFrame(raf);
    };
  }, [scopeId]);

  return (
    <div className={s.product}>
      <div className={s.productInner} ref={innerRef}>
        <Image
          src="/demo/lucid/headset-one.webp"
          alt="The Lucid One headset: a curved sheet of smoked glass wrapping a brushed aluminium frame, amber optics glowing through it, a knitted grey halo band behind"
          width={1800}
          height={1027}
          preload
          sizes="(max-width: 900px) 86vw, 43vw"
        />
      </div>
    </div>
  );
}

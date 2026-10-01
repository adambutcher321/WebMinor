"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import s from "./boucher.module.css";

/*
  A lifestyle photo whose model rises out of the frame as it crosses the middle
  of the screen. Underneath is a clean plate (the photo with the person painted
  out); on top, the person cut out of the same photo, registered pixel for
  pixel. The cut-out grows from the model's base, so it hides the original and
  its head and shoulders lift past the frame's top edge, then settles back as
  the photo scrolls away. Both layers use the same object-fit: cover box, so
  they stay registered at any frame shape; the growth point is worked out from
  the real crop on every resize.
*/

export interface PopSource {
  plate: string;
  pop: string;
  /** The model's base (bottom centre) as fractions of the image. */
  base: [number, number];
  /** The image's pixel size, for mapping `base` into the cropped frame. */
  size: [number, number];
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Where an image point lands inside a frame that shows it with object-fit: cover. */
function coverPoint([iw, ih]: [number, number], bw: number, bh: number, [fx, fy]: [number, number]) {
  const k = Math.max(bw / iw, bh / ih);
  return { x: (bw - iw * k) / 2 + fx * iw * k, y: (bh - ih * k) / 2 + fy * ih * k };
}

export default function PopPhoto({
  src, alt, sizes, className = "", lift = 0.12, children,
}: { src: PopSource; alt: string; sizes: string; className?: string; /** How much the model grows at full pop. */ lift?: number; children?: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const place = () => {
      const p = coverPoint(src.size, el.offsetWidth, el.offsetHeight, src.base);
      el.style.setProperty("--ox", `${p.x.toFixed(1)}px`);
      el.style.setProperty("--oy", `${Math.min(p.y, el.offsetHeight).toFixed(1)}px`);
    };
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const drift = (r.top + r.height / 2 - vh / 2) / vh;
      const t = clamp((Math.abs(drift) - 0.1) / 0.5, 0, 1);
      el.style.setProperty("--pop", (1 - t * t * (3 - 2 * t)).toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(() => { place(); onScroll(); });
    ro.observe(el);
    place();
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { ro.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [src]);

  return (
    <div ref={frame} className={`${s.popFrame} ${className}`} style={{ "--lift": lift } as CSSProperties}>
      <div className={s.popClip}>
        <Image src={src.plate} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
      <div className={s.popLayer} aria-hidden="true">
        <Image src={src.pop} alt="" fill sizes={sizes} className={`${s.popImg} object-cover`} />
      </div>
      {children}
    </div>
  );
}

"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { INGREDIENTS } from "./ingredients";
import { BURGERS, type Burger, type LayerSpec } from "./burgers";
import { diffStacks } from "./diff";
import { layoutStack, stackHeight, type LayoutOpts } from "./layout";
import { approach, smoothstep } from "./motion";
import s from "./explodedBurger.module.css";

/*
  One physical burger. Every layer is an <img> keyed by its persistent id, so
  a recipe change keeps shared layers' DOM nodes and only moves them. A single
  rAF loop eases each layer toward the layout for the current explode amount,
  heavier ingredients more slowly, and writes transforms straight to the DOM.
  The loop sleeps when the burger is off-screen or the tab is hidden.
*/

export interface ExplodedBurgerProps {
  burger: Burger;
  explode?: number;
  labels?: number;
  interactive?: boolean;
  compact?: boolean;
  onSwap?: (b: Burger) => void;
  className?: string;
}

type Status = "stay" | "enter" | "exit";
interface Shown { spec: LayerSpec; status: Status; born: number }
interface State { x: number; y: number; z: number; rx: number; ry: number; rz: number; o: number; sh: number; sq: number }

const BASE_RATE = 7;
/* The top bun was shot from slightly below, so its flat underside shows as a
   dark ellipse. Assembled, the layer beneath would hide it; crop it away while
   the stack is closed and let it open back up as the burger comes apart. */
const UNDERSIDE_CROP: Partial<Record<string, number>> = { "bun-top": 0.14 };
const OPEN_MS = 380, MID_MS = 520, CLOSE_MS = 900, DONE_MS = 1500;

export default function ExplodedBurger({
  burger, explode = 0, labels, interactive = false, compact = false, onSwap, className = "",
}: ExplodedBurgerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const [els] = useState(() => new Map<string, { layer: HTMLDivElement | null; img: HTMLImageElement | null; contact: HTMLDivElement | null; tag: HTMLDivElement | null }>());
  const state = useRef(new Map<string, State>());
  const [shown, setShown] = useState<Shown[]>(() => burger.stack.map((spec) => ({ spec, status: "stay", born: 0 })));
  const shownRef = useRef(shown);
  const current = useRef(burger);
  const swapAt = useRef<number | null>(null);
  const swapped = useRef(true);
  const props = useRef({ explode, labels, compact, onSwap });

  // Mirror the latest render into refs for the rAF loop (runs before it can read them).
  useLayoutEffect(() => {
    shownRef.current = shown;
    props.current = { explode, labels, compact, onSwap };
  });

  // Recipe change: keep shared layers, add entering, keep exiting until they've drifted off.
  useLayoutEffect(() => {
    const prev = current.current;
    if (prev.slug === burger.slug) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const diff = diffStacks(prev.stack, burger.stack);
    current.current = burger;
    const now = performance.now();
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the recipe swap must commit before paint
      setShown(burger.stack.map((spec) => ({ spec, status: "stay", born: 0 })));
      props.current.onSwap?.(burger);
      return;
    }
    const exiting = prev.stack.filter((l) => diff.get(l.id) === "exiting").map((spec) => ({ spec, status: "exit" as const, born: now }));
    setShown([
      ...burger.stack.map((spec) => ({ spec, status: (diff.get(spec.id) === "entering" ? "enter" : "stay") as Status, born: now })),
      ...exiting,
    ]);
    swapAt.current = now;
    swapped.current = false;
  }, [burger]);

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    if (!stage || !rig) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let visible = true, raf = 0, last = performance.now();
    let k = 1, wPx = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let prevTopGap = 0, settleAt = -1;

    const measure = () => {
      const r = stage.getBoundingClientRect();
      wPx = r.width;
      const opts = optsFor(props.current.compact, r.width);
      // Fit the TALLEST recipe, so the burger keeps one size across every swap.
      const tallest = Math.max(...BURGERS.map((b) => stackHeight(b.stack, 1, opts)));
      k = Math.min((r.width * (props.current.compact ? 0.86 : 0.62)) / 1000, (r.height * 0.86) / tallest);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { rootMargin: "200px" });
    io.observe(stage);
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      pointer.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const lean = interactive && fine && !reduced;
    if (lean) window.addEventListener("pointermove", onMove, { passive: true });

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { explode: rest, labels: labelProp, compact: cmp, onSwap: swapCb } = props.current;
      const opts = optsFor(cmp, wPx);

      // Swap timeline: open → mid (copy changes) → close → done.
      let boost = 0, t = Infinity;
      if (swapAt.current !== null) {
        t = now - swapAt.current;
        boost = t < CLOSE_MS ? smoothstep(0, OPEN_MS, t) : 1 - smoothstep(CLOSE_MS, DONE_MS, t);
        if (!swapped.current && t >= MID_MS) { swapped.current = true; swapCb?.(current.current); }
        if (t >= DONE_MS + 300) {
          swapAt.current = null;
          setShown((list) => list.filter((l) => l.status !== "exit").map((l) => ({ ...l, status: "stay" })));
          // Forget layers that left, so a later re-entry starts from its entrance again.
          const keep = new Set(current.current.stack.map((l) => l.id));
          for (const id of [...state.current.keys()]) if (!keep.has(id)) { state.current.delete(id); els.delete(id); }
        }
      }
      const e = Math.max(rest, (cmp ? 0.35 : 0.6) * boost);
      const closing = swapAt.current !== null && t >= CLOSE_MS;
      const placed = layoutStack(current.current.stack, e, opts);
      const n = placed.length;
      const labelAmt = labelProp ?? smoothstep(0.45, 0.8, e);

      pointer.x = approach(pointer.x, lean ? pointer.tx : 0, dt, 4);
      pointer.y = approach(pointer.y, lean ? pointer.ty : 0, dt, 4);
      rig.style.transform = `rotateX(${(-pointer.y * 3).toFixed(2)}deg) rotateY(${(pointer.x * 4).toFixed(2)}deg)`;

      // Top-bun landing: a 220ms settle the moment the stack closes.
      const top = placed[0];
      const topGap = top ? top.y - layoutStack(current.current.stack, 0, opts)[0].y : 0;
      if (prevTopGap > 6 && topGap <= 6 && e < 0.05) settleAt = now;
      prevTopGap = topGap;
      const settle = settleAt > 0 && now - settleAt < 220 ? Math.sin(Math.PI * ((now - settleAt) / 220)) : 0;

      for (const item of shownRef.current) {
        const ing = INGREDIENTS[item.spec.type];
        const p = placed.find((q) => q.id === item.spec.id);
        let st = state.current.get(item.spec.id);
        const target = p
          ? { x: p.x, y: p.y, z: p.z, rx: p.rx, ry: p.ry, rz: p.rz, o: 1, sh: p.shadow }
          : null;
        if (!st) {
          // Entering layers start offset by their entrance, invisible.
          const base = target ?? { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, o: 0, sh: 0 };
          const from = entrance(ing.enter, item.spec.id);
          st = { ...base, x: base.x + from.x, y: base.y + from.y, z: base.z + from.z, rz: base.rz + from.rz, o: item.status === "enter" ? 0 : 1, sq: 0 };
          if (item.status !== "enter") Object.assign(st, base, { o: 1 });
          state.current.set(item.spec.id, st);
        }
        const exitT = { x: st.x + (seededSide(item.spec.id) * 900), y: st.y + 40, z: st.z - 120, rx: st.rx, ry: st.ry, rz: st.rz + seededSide(item.spec.id) * 6, o: 0, sh: 0 };
        const tg = item.status === "exit" ? exitT : target;
        if (!tg) continue;
        const idx = p ? p.index : 0;
        let rate = reduced ? Infinity : BASE_RATE / ing.weight;
        if (closing) rate *= 1 + 0.9 * (1 - idx / Math.max(1, n - 1)); // bottom settles first
        if (item.status === "enter" && t < OPEN_MS) rate = 0; // wait until the stack has opened
        if (item.status === "exit") rate = reduced ? Infinity : 5;
        st.x = approach(st.x, tg.x, dt, rate);
        st.y = approach(st.y, tg.y, dt, rate);
        st.z = approach(st.z, tg.z, dt, rate);
        st.rx = approach(st.rx, tg.rx, dt, rate);
        st.ry = approach(st.ry, tg.ry, dt, rate);
        st.rz = approach(st.rz, tg.rz, dt, rate);
        st.o = approach(st.o, tg.o, dt, item.status === "exit" ? 9 : rate * 1.4);
        st.sh = approach(st.sh, tg.sh, dt, rate);

        const nodes = els.get(item.spec.id);
        if (!nodes?.layer) continue;
        const px = pointer.x * ing.parallax * 18;
        const py = pointer.y * ing.parallax * 9;
        const isTop = p?.index === n - 1;
        const sq = isTop ? 1 - 0.03 * settle : 1 - 0.008 * settle;
        nodes.layer.style.width = `${ing.w * k}px`;
        nodes.layer.style.transform =
          `translate3d(calc(-50% + ${((st.x + px) * k).toFixed(1)}px), ${(-(st.y + py) * k).toFixed(1)}px, ${(st.z * k).toFixed(1)}px)` +
          ` rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) rotateZ(${st.rz.toFixed(2)}deg) scaleY(${sq.toFixed(3)})`;
        nodes.layer.style.opacity = st.o.toFixed(3);
        nodes.layer.style.zIndex = String(10 + idx * 2);
        const crop = UNDERSIDE_CROP[item.spec.type];
        if (crop && nodes.img) nodes.img.style.clipPath = `inset(0 0 ${(crop * 100 * (1 - smoothstep(0.02, 0.3, e))).toFixed(2)}% 0)`;
        if (nodes.contact) {
          nodes.contact.style.width = `${ing.w * 0.92 * k}px`;
          nodes.contact.style.height = `${ing.w * 0.12 * k}px`;
          nodes.contact.style.transform = `translate3d(calc(-50% + ${(st.x * k).toFixed(1)}px), ${(-(st.y - ing.w * 0.03) * k).toFixed(1)}px, ${(st.z * k).toFixed(1)}px)`;
          nodes.contact.style.opacity = (st.sh * st.o * (idx === 0 ? 0.5 : 0.9)).toFixed(3);
          nodes.contact.style.zIndex = String(9 + idx * 2);
        }
        if (nodes.tag) {
          const firstOfType = current.current.stack.find((l) => l.type === item.spec.type)?.id === item.spec.id;
          nodes.tag.style.transform = `translate3d(${(((st.x + ing.w / 2) * k) + 18).toFixed(1)}px, ${(-(st.y + ing.h * 0.55) * k).toFixed(1)}px, ${(st.z * k).toFixed(1)}px)`;
          nodes.tag.style.opacity = (firstOfType && !cmp ? labelAmt * st.o : 0).toFixed(3);
        }
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = 0;
    }
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    kick();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [interactive, els]);

  return (
    <div ref={stageRef} className={`${s.stage} ${className}`}>
      <div ref={rigRef} className={s.rig}>
        <div className={s.floor} aria-hidden="true" />
        {shown.map(({ spec }) => {
          const ing = INGREDIENTS[spec.type];
          const set = (key: "layer" | "img" | "contact" | "tag") => (el: HTMLDivElement | HTMLImageElement | null) => {
            const cur = els.get(spec.id) ?? { layer: null, img: null, contact: null, tag: null };
            (cur as Record<string, unknown>)[key] = el;
            els.set(spec.id, cur);
          };
          return (
            <div key={spec.id} style={{ display: "contents" }}>
              <div ref={set("contact")} className={s.contact} style={{ opacity: 0 }} aria-hidden="true" />
              <div ref={set("layer")} className={s.layer} style={{ opacity: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- layered cut-outs, sized by the engine */}
                <img ref={set("img")} src={ing.src} alt="" draggable={false} />
              </div>
              <div ref={set("tag")} className={s.tag} aria-hidden="true">{ing.label}</div>
            </div>
          );
        })}
      </div>
      <span className="sr-only">{burger.name}: {burger.stack.map((l) => INGREDIENTS[l.type].label).join(", ")}</span>
    </div>
  );
}

function optsFor(compact: boolean, widthPx: number): LayoutOpts {
  const phone = widthPx > 0 && widthPx < 520;
  if (compact) return { gap: 26, depth: 0, maxRot: 1.5 };
  return phone ? { gap: 70, depth: 40, maxRot: 2 } : { gap: 120, depth: 110, maxRot: 3 };
}

function seededSide(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h & 1 ? 1 : -1;
}

function entrance(kind: "side" | "behind" | "under" | "above", id: string) {
  switch (kind) {
    case "side": return { x: seededSide(id) * 760, y: 30, z: 0, rz: seededSide(id) * 8 };
    case "behind": return { x: 0, y: -60, z: -260, rz: 0 };
    case "under": return { x: 0, y: -110, z: -40, rz: 0 };
    case "above": return { x: 0, y: 260, z: 0, rz: 0 };
  }
}

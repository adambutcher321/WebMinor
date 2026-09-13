"use client";

import { useId, useState } from "react";
import { useCart } from "../CartProvider";
import { useTint } from "../Tint";
import { SIZE_CHART, type Size, type SizeRow } from "../shop";
import s from "../boucher.module.css";

/*
  The size finder. Two sliders and a fit preference give one answer, worked
  out the way a shop assistant would: chest decides the size, height nudges it
  when you are at the edge of a band, and "room to layer" goes up one.
*/

type Measure = "chest" | "length" | "sleeve";
type Fit = "fitted" | "layer";

function recommend(chest: number, height: number, fit: Fit): { size: SizeRow; why: string } {
  let i = SIZE_CHART.findIndex((r) => chest >= r.fitsChest[0] && chest < r.fitsChest[1]);
  if (i < 0) i = chest < SIZE_CHART[0].fitsChest[0] ? 0 : SIZE_CHART.length - 1;
  const row = SIZE_CHART[i];
  let why = `A ${chest} cm chest sits in the ${row.size} band.`;
  // Tall for the band and near its top edge: go up so the body length works.
  if (height > row.fitsHeight[1] && chest >= row.fitsChest[1] - 3 && i < SIZE_CHART.length - 1) {
    i += 1;
    why = `A ${chest} cm chest is at the top of ${row.size}, and at ${height} cm the ${SIZE_CHART[i].size} length will sit better.`;
  }
  if (fit === "layer") {
    if (i < SIZE_CHART.length - 1) {
      const base = SIZE_CHART[i];
      i += 1;
      why += ` Room for a jumper takes ${base.size} up to ${SIZE_CHART[i].size}.`;
    } else {
      why += " XL is the largest we make, and it already has room for a jumper.";
    }
  }
  return { size: SIZE_CHART[i], why };
}

const cmToIn = (cm: number) => Math.round((cm / 2.54) * 10) / 10;

export default function SizeFinder() {
  const [chest, setChest] = useState(100);
  const [height, setHeight] = useState(176);
  const [fit, setFit] = useState<Fit>("fitted");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [hover, setHover] = useState<Measure | null>(null);
  const [picked, setPicked] = useState<Size | null>(null);
  const { add } = useCart();
  const { active } = useTint();
  const chestId = useId();
  const heightId = useId();

  const rec = recommend(chest, height, fit);
  const shown = picked ?? rec.size.size;
  const fmt = (cm: number) => (unit === "cm" ? `${cm} cm` : `${cmToIn(cm)}"`);
  const fmtH = (cm: number) => (unit === "cm" ? `${cm} cm` : `${Math.floor(cm / 30.48)}' ${Math.round((cm % 30.48) / 2.54)}"`);

  const lineStyle = (m: Measure) => ({
    opacity: hover === null || hover === m ? 1 : 0.28,
    transition: "opacity 320ms",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      {/* Finder */}
      <div className="lg:col-span-5">
        <div className={`${s.card} p-7 sm:p-9`}>
          <div className="flex items-center justify-between gap-4">
            <p className={s.micro}>Find your size</p>
            <div className="inline-flex rounded-full p-1" style={{ background: "var(--panel)" }} role="group" aria-label="Units">
              {(["cm", "in"] as const).map((u) => (
                <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u} className="px-3 py-1 rounded-full text-xs font-semibold transition-colors" style={unit === u ? { background: "var(--fg)", color: "var(--bg)" } : {}}>
                  {u}
                </button>
              ))}
            </div>
          </div>

          <label htmlFor={chestId} className="mt-8 flex items-baseline justify-between">
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--display)" }}>Chest</span>
            <span className="text-sm tabular-nums opacity-80">{fmt(chest)}</span>
          </label>
          <input id={chestId} type="range" min={76} max={124} step={1} value={chest} onChange={(e) => { setChest(+e.target.value); setPicked(null); }} className="mt-3 w-full accent-current" style={{ accentColor: "var(--fg)" }} />
          <p className={`${s.micro} mt-2`} style={{ letterSpacing: "0.06em", textTransform: "none" }}>Around the fullest part, tape flat, breathing normally.</p>

          <label htmlFor={heightId} className="mt-7 flex items-baseline justify-between">
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--display)" }}>Height</span>
            <span className="text-sm tabular-nums opacity-80">{fmtH(height)}</span>
          </label>
          <input id={heightId} type="range" min={150} max={200} step={1} value={height} onChange={(e) => { setHeight(+e.target.value); setPicked(null); }} className="mt-3 w-full" style={{ accentColor: "var(--fg)" }} />

          <p className={`${s.micro} mt-7`}>How do you want it</p>
          <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Fit">
            {([["fitted", "Fitted", "Sits close, a t-shirt under it"], ["layer", "Room to layer", "A jumper under it, easily"]] as const).map(([v, label, sub]) => (
              <button key={v} type="button" onClick={() => { setFit(v); setPicked(null); }} aria-pressed={fit === v} className="rounded-2xl p-4 text-left transition-colors" style={fit === v ? { background: "var(--fg)", color: "var(--bg)" } : { background: "var(--panel)" }}>
                <span className="block text-sm font-semibold" style={{ fontFamily: "var(--display)" }}>{label}</span>
                <span className="block text-xs mt-1 opacity-75">{sub}</span>
              </button>
            ))}
          </div>

          <div className={`${s.rule} mt-8 pt-7 flex items-end justify-between gap-6`} aria-live="polite">
            <div>
              <p className={s.micro}>We would put you in</p>
              <p key={rec.size.size} className={`${s.fresh} ${s.display} mt-2`} style={{ fontSize: "4.5rem", lineHeight: 1 }}>
                {rec.size.size}
              </p>
            </div>
            <p className="text-sm opacity-80 max-w-[18ch] text-right leading-relaxed">{rec.why}</p>
          </div>
          <button type="button" className={`${s.btn} ${s.btnFg} mt-6 w-full justify-center`} onClick={() => add(active.slug, rec.size.size)}>
            Add {active.name} in {rec.size.size}
          </button>
        </div>
      </div>

      {/* Diagram + chart */}
      <div className="lg:col-span-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.cutout} alt={active.alt} className="absolute inset-0 w-full h-full object-contain" draggable={false} />
              <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                {/* chest */}
                <g style={lineStyle("chest")}>
                  <path d="M52 186H248" strokeDasharray="4 5" />
                  <path d="M52 178v16M248 178v16" />
                  <rect x="112" y="164" width="76" height="18" rx="9" fill="var(--bg)" stroke="none" />
                  <text x="150" y="177" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" fontWeight="700" fontFamily="var(--display)">A · CHEST</text>
                </g>
                {/* length */}
                <g style={lineStyle("length")}>
                  <path d="M270 60V352" strokeDasharray="4 5" />
                  <path d="M262 60h16M262 352h16" />
                  <rect x="246" y="201" width="80" height="18" rx="9" fill="var(--bg)" stroke="none" transform="rotate(90 286 210)" />
                  <text x="286" y="214" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" fontWeight="700" fontFamily="var(--display)" transform="rotate(90 286 210)">B · LENGTH</text>
                </g>
                {/* sleeve */}
                <g style={lineStyle("sleeve")}>
                  <path d="M196 92L262 322" strokeDasharray="4 5" />
                  <circle cx="196" cy="92" r="4" fill="currentColor" stroke="none" />
                  <circle cx="262" cy="322" r="4" fill="currentColor" stroke="none" />
                  <rect x="206" y="196" width="80" height="18" rx="9" fill="var(--bg)" stroke="none" transform="rotate(74 244 200)" />
                  <text x="246" y="209" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" fontWeight="700" fontFamily="var(--display)" transform="rotate(74 244 200)">C · SLEEVE</text>
                </g>
              </svg>
            </div>
            <p className={`${s.micro} mt-3 text-center`} style={{ letterSpacing: "0.06em", textTransform: "none" }}>
              Garment measurements, laid flat. Hover a column to see where.
            </p>
          </div>

          <div className="md:col-span-7 overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className={s.micro}>
                  <th className="text-left py-3 pr-3 font-semibold">Size</th>
                  {([["chest", "A · Chest"], ["length", "B · Length"], ["sleeve", "C · Sleeve"]] as const).map(([m, label]) => (
                    <th key={m} className="text-right py-3 px-3 font-semibold cursor-default" onMouseEnter={() => setHover(m)} onMouseLeave={() => setHover(null)} style={{ opacity: hover === null || hover === m ? 1 : 0.5 }}>
                      {label}
                    </th>
                  ))}
                  <th className="hidden sm:table-cell text-right py-3 pl-3 font-semibold">Fits chest</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map((r) => {
                  const on = r.size === shown;
                  return (
                    <tr
                      key={r.size}
                      onClick={() => setPicked(r.size)}
                      className="cursor-pointer transition-colors"
                      style={{ borderTop: "1px solid color-mix(in srgb, var(--fg) 14%, transparent)", background: on ? "var(--panel)" : "transparent" }}
                    >
                      <td className="py-3.5 pr-3 font-bold" style={{ fontFamily: "var(--display)" }}>
                        {r.size}
                        {r.size === rec.size.size && <span className={`${s.micro} ml-2`} style={{ fontSize: 9 }}>Yours</span>}
                      </td>
                      <td className="text-right py-3.5 px-3 tabular-nums" style={{ opacity: hover === null || hover === "chest" ? 1 : 0.45 }}>{fmt(r.chest)}</td>
                      <td className="text-right py-3.5 px-3 tabular-nums" style={{ opacity: hover === null || hover === "length" ? 1 : 0.45 }}>{fmt(r.length)}</td>
                      <td className="text-right py-3.5 px-3 tabular-nums" style={{ opacity: hover === null || hover === "sleeve" ? 1 : 0.45 }}>{fmt(r.sleeve)}</td>
                      <td className="hidden sm:table-cell text-right py-3.5 pl-3 tabular-nums opacity-70">
                        {fmt(r.fitsChest[0]).replace(/ cm|"/, "")}–{fmt(r.fitsChest[1])}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={`${s.micro} mt-4`} style={{ letterSpacing: "0.06em", textTransform: "none" }}>
              Every size has 12 cm of ease over the chest it fits. Tap a row to compare it on the diagram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

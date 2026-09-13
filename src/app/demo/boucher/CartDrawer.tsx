"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { FREE_DELIVERY_OVER, money } from "./shop";
import s from "./boucher.module.css";

export default function CartDrawer() {
  const { detailed, count, subtotal, delivery, total, toFreeDelivery, setQty, remove, clear, open, setOpen } = useCart();
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  if (!open) return null;

  const pct = Math.min(100, Math.round(((FREE_DELIVERY_OVER - toFreeDelivery) / FREE_DELIVERY_OVER) * 100));

  return (
    <>
      <button type="button" className={s.scrim} aria-label="Close basket" onClick={() => setOpen(false)} />
      <aside className={s.drawer} role="dialog" aria-modal="true" aria-label="Basket">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <p className="font-semibold" style={{ fontFamily: "var(--display)" }}>
            Basket <span className="opacity-50 font-normal">({count})</span>
          </p>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="w-9 h-9 rounded-full bg-white/10 inline-flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {placed ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-2xl font-semibold" style={{ fontFamily: "var(--display)" }}>Order placed.</p>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Cut, filled and on its way from Porto in three to five working days. A concept demo, so nothing was actually charged.
            </p>
            <button
              type="button"
              className={`${s.btn} mt-8 bg-white text-black`}
              onClick={() => {
                setPlaced(false);
                clear();
                setOpen(false);
              }}
            >
              Back to the jacket
            </button>
          </div>
        ) : detailed.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="text-xl font-semibold" style={{ fontFamily: "var(--display)" }}>Nothing in here yet.</p>
            <p className="mt-2 text-sm text-white/60">Pick a colour, pick a size, and press Get the look.</p>
          </div>
        ) : (
          <>
            <div className="px-6 pt-5">
              <p className="text-xs text-white/60">
                {toFreeDelivery > 0 ? `${money(toFreeDelivery)} more for free delivery` : "Free delivery unlocked"}
              </p>
              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-white transition-[width] duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {detailed.map((d) => (
                <li key={d.key} className="flex items-center gap-4">
                  <div className={s.lineThumb} style={{ background: d.colourway.bg }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.colourway.cutout} alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--display)" }}>
                      The Puffer · {d.colourway.name}
                    </p>
                    <p className="text-xs text-white/55 mt-0.5">Size {d.size}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className={s.qty}>
                        <button type="button" onClick={() => setQty(d.colourway.slug, d.size, d.qty - 1)} aria-label="Fewer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm w-6 text-center tabular-nums">{d.qty}</span>
                        <button type="button" onClick={() => setQty(d.colourway.slug, d.size, d.qty + 1)} aria-label="More">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button type="button" className="text-xs text-white/50 hover:text-white underline underline-offset-4" onClick={() => remove(d.colourway.slug, d.size)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{money(d.line)}</p>
                </li>
              ))}
            </ul>
            <div className="px-6 py-5 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="tabular-nums">{money(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Delivery</span>
                <span className="tabular-nums">{delivery === 0 ? "Free" : money(delivery)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2" style={{ fontFamily: "var(--display)" }}>
                <span>Total</span>
                <span className="tabular-nums">{money(total)}</span>
              </div>
              <button type="button" className={`${s.btn} w-full justify-center bg-white text-black mt-4`} onClick={() => setPlaced(true)}>
                Checkout
              </button>
              <p className="text-[11px] text-white/40 text-center pt-1">Concept demo. No payment is taken.</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

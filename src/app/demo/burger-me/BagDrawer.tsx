"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useBag } from "./BagProvider";
import { bySlug, formatPrice } from "./engine/burgers";
import s from "./burger-me.module.css";

export default function BagDrawer() {
  const bag = useBag();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { open, setOpen, reset } = bag;
  const close = useCallback(() => { setOpen(false); reset(); }, [setOpen, reset]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);
  return (
    <>
      <div className={s.drawerScrim} data-open={bag.open} onClick={close} />
      <aside className={s.drawer} data-open={bag.open} aria-label="Your bag" aria-hidden={!bag.open} inert={!bag.open}>
        <header className={s.drawerHead}>
          <h2 className={s.display} style={{ fontSize: 44 }}>Your bag</h2>
          <button ref={closeRef} className={s.drawerClose} onClick={close} aria-label="Close bag">×</button>
        </header>
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px" }}>
          {bag.ordered ? (
            <div style={{ paddingTop: 32 }}>
              <div className={s.tick} aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#1a0f0c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16l6 6 12-14" /></svg>
              </div>
              <p className={s.display} style={{ fontSize: 64, color: "var(--bm-ketchup)", marginTop: 24 }}>Order in.</p>
              <p style={{ marginTop: 14, fontSize: 18 }}>Ready in 15 minutes at Barbican. We&apos;ll smash yours the moment you walk in.</p>
              <button className={s.btn} style={{ marginTop: 28 }} onClick={close}>Back to the menu</button>
            </div>
          ) : bag.lines.length === 0 ? (
            <p style={{ paddingTop: 32, fontSize: 18 }}>
              Nothing in the bag yet. <Link href="/demo/burger-me/menu" onClick={close} style={{ color: "var(--bm-ketchup)", fontWeight: 700 }}>See the menu</Link>
            </p>
          ) : (
            <ul>
              {bag.lines.map((l) => {
                const b = bySlug(l.slug)!;
                return (
                  <li key={l.slug} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgb(26 15 12 / 0.12)" }}>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 18 }}>{b.name}</p>
                      <p style={{ opacity: 0.7 }}>{formatPrice(b.price)}</p>
                    </div>
                    <div className={s.qty}>
                      <button aria-label={`One fewer ${b.name}`} onClick={() => bag.setQty(l.slug, l.qty - 1)}>−</button>
                      <span>{l.qty}</span>
                      <button aria-label={`One more ${b.name}`} onClick={() => bag.setQty(l.slug, l.qty + 1)}>+</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {!bag.ordered && bag.lines.length > 0 && (
          <footer style={{ padding: 24, borderTop: "1px solid rgb(26 15 12 / 0.12)" }}>
            <p className={s.total}><span>Total</span><span style={{ fontSize: 22 }}>{formatPrice(bag.total)}</span></p>
            <button className={s.btn} style={{ width: "100%" }} onClick={bag.placeOrder}>
              Order for collection — {formatPrice(bag.total)}
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

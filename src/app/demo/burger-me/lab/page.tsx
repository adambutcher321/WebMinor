"use client";

import { useEffect, useState } from "react";
import ExplodedBurger from "../engine/ExplodedBurger";
import { BURGERS } from "../engine/burgers";

/* Temporary bench: master photo beside the layer stack, an explode slider and
   recipe buttons. Deleted in Task 10. ?e=0.6 sets explode; ?b=<slug> swaps to
   that recipe one second after load (QA only). */
export default function Lab() {
  const [e, setE] = useState(0);
  const [b, setB] = useState(BURGERS[0]);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const qe = q.get("e");
    const t0 = qe !== null ? window.setTimeout(() => setE(Math.min(1, Math.max(0, Number(qe) || 0))), 0) : 0;
    const qb = BURGERS.find((x) => x.slug === q.get("b"));
    if (qb) {
      const id = window.setTimeout(() => setB(qb), 1000);
      return () => { window.clearTimeout(id); window.clearTimeout(t0); };
    }
    return () => window.clearTimeout(t0);
  }, []);
  return (
    <main style={{ minHeight: "100svh", background: "#2a0806", color: "#f6eddc", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        {BURGERS.map((x) => (
          <button key={x.slug} onClick={() => setB(x)} style={{ padding: "6px 10px", background: x.slug === b.slug ? "#f2b705" : "#3a0c0a", color: x.slug === b.slug ? "#1a0f0c" : "#f6eddc" }}>
            {x.name}
          </button>
        ))}
        <label>explode <input type="range" min={0} max={1} step={0.01} value={e} onChange={(ev) => setE(+ev.target.value)} /> {e.toFixed(2)}</label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "minmax(0, 1fr)", gap: 24, height: "78svh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/demo/burger-me/master.webp" alt="master" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        <ExplodedBurger burger={b} explode={e} interactive />
      </div>
    </main>
  );
}

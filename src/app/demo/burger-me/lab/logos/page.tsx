import { Fredoka } from "next/font/google";
import Logo from "../../Logo";
import s from "./logos.module.css";

/* Temporary: six wordmark candidates for the client to choose from.
   Deleted in Task 10. Logo.tsx currently implements candidate 1. */

const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["600", "700"], display: "swap" });

/* ---------- 1. Straight wordmark ---------- */
function C1() { return <Logo />; }

/* ---------- 2. Stacked, ME in a bun-shaped pill ---------- */
function C2() {
  return (
    <span className={`${s.display} ${s.c2}`} role="img" aria-label="Burger Me">
      <span className={s.top} aria-hidden="true">Burger</span>
      <span className={s.pill} aria-hidden="true">Me</span>
    </span>
  );
}

/* ---------- 3. Bun cross-section roundel between the words ----------
   BURGER has no O to replace, so the cross-section stands where the O would
   sit: a round bun (sesame dome, patty, base) set between BURGER and ME.
   Gaps between the three layers are real negative space so it holds at 24px. */
function BunO() {
  return (
    <svg viewBox="0 0 100 100" style={{ height: "0.98em", width: "0.98em", alignSelf: "center", margin: "0 0.16em" }} aria-hidden="true">
      <defs>
        <mask id="c3-seeds">
          <rect width="100" height="100" fill="#fff" />
          {[[34, 24, -30], [52, 17, 5], [68, 25, 35], [46, 33, 0], [60, 36, -20], [26, 38, -50]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3.4" ry="1.7" transform={`rotate(${r} ${x} ${y})`} fill="#000" />
          ))}
        </mask>
      </defs>
      <path mask="url(#c3-seeds)" fill="currentColor" d="M5 43C5 16 26 4 50 4s45 12 45 39z" />
      {/* patty with a lacy smashed lower edge */}
      <path fill="var(--logo-accent)" d="M3 48h94v10l-3.5 2.5 1.2 3-4.2-1.6-2.8 3.4-3-3.2-4.6 2.3-3-3-4 2.6-3.2-3-5 2.2-3.4-2.6-4.4 2.4-3-3-4.8 2.6-3-2.6-4.6 2.2-3.4-3.2-4.2 2.4-2.6-3L3 62z" />
      <path fill="currentColor" d="M5 74h90c0 15-11 22-26 22H31C16 96 5 89 5 74z" />
    </svg>
  );
}
function C3() {
  return (
    <span className={`${s.display}`} style={{ display: "inline-flex", alignItems: "baseline", letterSpacing: "-0.012em" }} role="img" aria-label="Burger Me">
      <span aria-hidden="true">Burger</span>
      <BunO />
      <span aria-hidden="true" className={s.accent}>Me</span>
    </span>
  );
}

/* ---------- 4. Lowercase rounded, ketchup dot ---------- */
function C4() {
  return (
    <span className={`${fredoka.className} ${s.c4}`} role="img" aria-label="Burger Me">
      <span aria-hidden="true">burger&nbsp;me</span><i aria-hidden="true" />
    </span>
  );
}

/* ---------- 5. Slanted, smash-patty lacy underline ---------- */
function lacyPath(w: number, h: number) {
  // Deterministic ragged lower edge: a smashed patty crust with lace and a few crumbs.
  const pts: string[] = [];
  const step = 4;
  const n = Math.round(w / step);
  const noise = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  pts.push(`M0 0H${w}`);
  for (let i = n; i >= 0; i--) {
    const x = i * step;
    const r = noise(i);
    const depth = h * (0.35 + 0.65 * (r > 0.78 ? 1 : r * 0.7));
    pts.push(`L${x + step * 0.5} ${depth.toFixed(1)}`, `L${x} ${(h * 0.3 + noise(i + 40) * h * 0.25).toFixed(1)}`);
  }
  pts.push("Z");
  return pts.join(" ");
}
function C5() {
  const W = 220, H = 14;
  return (
    <span className={`${s.display} ${s.c5}`} role="img" aria-label="Burger Me">
      <span aria-hidden="true" style={{ letterSpacing: "-0.012em" }}>Burger <span className={s.accent}>Me</span></span>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={lacyPath(W, H)} fill="var(--logo-accent)" />
        <circle cx="31" cy={H + 1.5} r="1.2" fill="var(--logo-accent)" />
        <circle cx="118" cy={H + 2} r="1.5" fill="var(--logo-accent)" />
        <circle cx="187" cy={H + 1.2} r="1" fill="var(--logo-accent)" />
      </svg>
    </span>
  );
}

/* ---------- 6. BM monogram, layers with a cheese drip, beside the word ---------- */
function Mono() {
  const f = { fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontVariationSettings: '"wdth" 75, "opsz" 96' } as const;
  return (
    <svg viewBox="0 0 54 70" style={{ height: "2em", width: "auto" }} aria-hidden="true">
      <text x="27" y="26" textAnchor="middle" fontSize="36" fill="currentColor" style={f}>B</text>
      {/* melted cheese slice between the layers, dripping over the M */}
      <g fill="var(--logo-accent)" stroke="var(--logo-accent)" strokeLinecap="round">
        <rect x="7" y="28" width="40" height="6" rx="3" strokeWidth="0" />
        <path d="M14 32v8M26 32v12M38 32v6" strokeWidth="4" fill="none" />
      </g>
      <text x="27" y="67" textAnchor="middle" fontSize="36" fill="currentColor" style={f}>M</text>
    </svg>
  );
}
function C6() {
  return (
    <span className={`${s.display} ${s.c6}`} role="img" aria-label="Burger Me">
      <Mono />
      <span aria-hidden="true" style={{ letterSpacing: "-0.012em", fontSize: "0.86em", lineHeight: 0.92, display: "flex", flexDirection: "column" }}>
        <span>Burger</span><span className={s.accent}>Me</span>
      </span>
    </span>
  );
}

const CANDIDATES = [
  { n: 1, name: "Straight wordmark", C: C1, big: 64, small: 24 },
  { n: 2, name: "Stacked, bun pill", C: C2, big: 64, small: 24 },
  { n: 3, name: "Bun cross-section", C: C3, big: 64, small: 24 },
  { n: 4, name: "Rounded lowercase", C: C4, big: 64, small: 24 },
  { n: 5, name: "Smash-lace underline", C: C5, big: 60, small: 24 },
  { n: 6, name: "Layered BM monogram", C: C6, big: 44, small: 24 },
];

export default function LogoLab() {
  return (
    <main className={`${s.page} ${fredoka.variable}`}>
      <div className={s.head}>
        <strong>Burger Me · logo candidates</strong>
        <span>each: large on oxblood · 24px · on cream</span>
      </div>
      <div className={s.grid}>
        {CANDIDATES.map(({ n, name, C, big, small }) => (
          <section key={n} className={s.card}>
            <div className={s.label}><span>{n} · {name}</span></div>
            <div className={s.stage} style={{ fontSize: big }}><C /></div>
            <div className={s.small} style={{ fontSize: small }}><C /><span className={s.dim} style={{ fontSize: 12 }}>24px</span></div>
            <div className={s.cream} style={{ fontSize: big * 0.62 }}><C /></div>
          </section>
        ))}
      </div>
    </main>
  );
}

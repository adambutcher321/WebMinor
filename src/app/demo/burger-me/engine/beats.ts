import { smoothstep } from "./motion";

export interface Beat {
  explode: number;
  labels: number;
  /** Camera: scale ≥ 1, x/y in % of the stage. */
  scale: number; x: number; y: number;
}

/* The home story. 0–12 assembled · 12–32 separating · 32–76 labels (held
   long enough to read every ingredient) · 76–90 coming back together ·
   90–100 rebuilt and handing off. */
export const LABELS_FROM = 0.32;
export const LABELS_TO = 0.76;

export function heroBeat(p: number): Beat {
  const apart = smoothstep(0.12, 0.32, p);
  const together = smoothstep(0.76, 0.9, p);
  const explode = p >= 0.9 ? 0 : apart * (1 - together);
  const labels = p < LABELS_FROM || p > LABELS_TO ? 0 : smoothstep(LABELS_FROM, 0.37, p) * (1 - smoothstep(0.72, LABELS_TO, p));
  const push = smoothstep(0, 0.55, p) * (1 - smoothstep(0.7, 1, p) * 0.7);
  return {
    explode,
    labels,
    scale: 1 + 0.08 * push,
    x: -1.5 + 3 * smoothstep(0, 1, p),
    y: -2 * smoothstep(0.1, 0.6, p) + 2 * smoothstep(0.7, 1, p),
  };
}

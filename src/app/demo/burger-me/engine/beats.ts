import { smoothstep } from "./motion";

export interface Beat {
  explode: number;
  labels: number;
  /** Camera: scale ≥ 1, x/y in % of the stage. */
  scale: number; x: number; y: number;
}

/* The home story. 0–15 assembled · 15–45 separating · 45–65 labels ·
   65–85 coming back together · 85–100 rebuilt and handing off. */
export function heroBeat(p: number): Beat {
  const apart = smoothstep(0.15, 0.45, p);
  const together = smoothstep(0.65, 0.85, p);
  const explode = p >= 0.85 ? 0 : apart * (1 - together);
  const labels = p < 0.45 || p > 0.65 ? 0 : smoothstep(0.45, 0.5, p) * (1 - smoothstep(0.6, 0.65, p));
  const push = smoothstep(0, 0.55, p) * (1 - smoothstep(0.7, 1, p) * 0.7);
  return {
    explode,
    labels,
    scale: 1 + 0.08 * push,
    x: -1.5 + 3 * smoothstep(0, 1, p),
    y: -2 * smoothstep(0.1, 0.6, p) + 2 * smoothstep(0.7, 1, p),
  };
}

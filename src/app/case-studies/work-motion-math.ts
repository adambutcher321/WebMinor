/* Scroll maths for the work index, kept pure so it can be tested.
   `top` and `height` are a row's getBoundingClientRect values, `vh` the
   viewport height, all in px. */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** 0 when the row's top reaches 90% of the viewport, 1 when its bottom has
 *  risen to 55%: the stretch over which a row is the one being read. */
export function rowProgress(top: number, height: number, vh: number): number {
  const travel = height + vh * 0.35;
  if (travel <= 0) return 0;
  return clamp((vh * 0.9 - top) / travel, 0, 1);
}

/** The row centre's offset from the viewport centre, -1 (above) to 1 (below). */
export function rowDrift(top: number, height: number, vh: number): number {
  if (vh <= 0) return 0;
  return clamp((top + height / 2 - vh / 2) / vh, -1, 1);
}

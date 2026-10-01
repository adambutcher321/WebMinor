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

/** The page rail: `filled` is how many builds have been read (the sum of the
 *  rows' progress, so 2.4 = two read and the third 40% through), `active` the
 *  build being read now. */
export function railState(progress: number[]): { filled: number; active: number } {
  const filled = progress.reduce((sum, p) => sum + clamp(p, 0, 1), 0);
  const active = Math.min(Math.max(progress.length - 1, 0), Math.floor(filled));
  return { filled, active };
}

/** How far a cover's subject has popped out of its frame, 0–1: fully out while
 *  the row is near the middle of the viewport, settling back as it leaves.
 *  `drift` is rowDrift's value. */
export function rowPop(drift: number): number {
  const t = clamp((Math.abs(drift) - 0.12) / 0.5, 0, 1);
  return 1 - t * t * (3 - 2 * t);
}

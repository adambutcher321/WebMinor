/**
 * KLIK motion tokens.
 *
 * Measured off the Averon reel — see design-loop/klik-bar.md for the census. Its nine
 * moves run 900-2950ms with a mean of 1917ms, so these are deliberately slower than
 * typical UI timings: M5 fails anything under 900ms because a snappy move reads as a
 * different brand entirely.
 */

export const EASE_OUT = 'cubic-bezier(0.16, 0.84, 0.28, 1)';
export const EASE_INOUT = 'cubic-bezier(0.62, 0.02, 0.24, 1)';

export const DUR = {
  /** Cursor and hover feedback — below the M5 floor by design, as these are states. */
  fast: 320,
  /** Button and label state changes. */
  ui: 520,
  /** The standard reveal. */
  move: 1200,
  /** Section-scale choreography. Near the reference's 1917ms mean. */
  long: 1900,
} as const;

export const STAGGER = 110;

/** Objects never land square (M3). Rotations are drawn from this set. */
export const TILTS = [-9, 6, -4, 11, -7, 3, -12, 8] as const;

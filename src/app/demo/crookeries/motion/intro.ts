/**
 * A one-shot signal for "the intro has handed over".
 *
 * The hero copy must resolve as the wipe opens, not behind it — otherwise the
 * headline's one blur-to-sharp move (M7) happens where nobody can see it, and the
 * visitor arrives at a page that has already finished moving.
 */

let done = false;
const waiting = new Set<() => void>();

export function isIntroDone() {
  return done;
}

export function markIntroDone() {
  if (done) return;
  done = true;
  for (const cb of waiting) cb();
  waiting.clear();
}

/** Fires immediately if the intro is already past. Returns an unsubscribe. */
export function onIntroDone(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}

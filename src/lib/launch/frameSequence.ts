export const FRAME_COUNT = 159;

const FRAME_DIR = '/frames-launch';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function framePath(index: number): string {
  const oneBased = String(index + 1).padStart(4, '0');
  return `${FRAME_DIR}/frame_${oneBased}.webp`;
}

export function frameIndexForProgress(progress: number, frameCount: number): number {
  return Math.round(clamp01(progress) * (frameCount - 1));
}

/**
 * The frame to draw right now: the target if it has loaded, otherwise the
 * closest loaded neighbour so scrubbing degrades to a coarser film instead
 * of freezing. Null only before the very first frame arrives.
 */
export function nearestLoadedFrame(target: number, loaded: readonly boolean[]): number | null {
  if (loaded[target]) return target;
  for (let distance = 1; distance < loaded.length; distance++) {
    if (loaded[target - distance]) return target - distance;
    if (loaded[target + distance]) return target + distance;
  }
  return null;
}

/**
 * Download order for the sequence: a coarse pass (every `stride`th frame)
 * makes the whole scrub range usable almost immediately, then the gaps
 * backfill for full smoothness.
 */
export function frameLoadOrder(frameCount: number, stride: number): number[] {
  const order: number[] = [];
  const seen = new Set<number>();

  for (let i = 0; i < frameCount; i += stride) {
    order.push(i);
    seen.add(i);
  }
  for (let i = 0; i < frameCount; i++) {
    if (!seen.has(i)) order.push(i);
  }
  return order;
}

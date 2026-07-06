import { describe, it, expect } from 'vitest';
import {
  FRAME_COUNT,
  framePath,
  frameIndexForProgress,
  nearestLoadedFrame,
  frameLoadOrder,
} from './frameSequence';

describe('framePath', () => {
  it('maps a zero-based index to the 1-based, zero-padded webp path', () => {
    expect(framePath(0)).toBe('/frames-launch/frame_0001.webp');
    expect(framePath(158)).toBe('/frames-launch/frame_0159.webp');
  });
});

describe('frameIndexForProgress', () => {
  it('returns the first frame at progress 0 and the last at progress 1', () => {
    expect(frameIndexForProgress(0, FRAME_COUNT)).toBe(0);
    expect(frameIndexForProgress(1, FRAME_COUNT)).toBe(FRAME_COUNT - 1);
  });

  it('scrubs linearly through the sequence', () => {
    expect(frameIndexForProgress(0.5, 159)).toBe(79);
  });

  it('clamps out-of-range progress', () => {
    expect(frameIndexForProgress(-0.5, 159)).toBe(0);
    expect(frameIndexForProgress(1.5, 159)).toBe(158);
  });
});

describe('nearestLoadedFrame', () => {
  it('returns the target itself when loaded', () => {
    const loaded = [false, true, false];
    expect(nearestLoadedFrame(1, loaded)).toBe(1);
  });

  it('returns the closest loaded neighbour when the target is missing', () => {
    const loaded = [true, false, false, false, true];
    expect(nearestLoadedFrame(1, loaded)).toBe(0);
    expect(nearestLoadedFrame(3, loaded)).toBe(4);
  });

  it('returns null when nothing is loaded yet', () => {
    expect(nearestLoadedFrame(2, [false, false, false])).toBeNull();
  });
});

describe('frameLoadOrder', () => {
  it('loads a coarse pass (every Nth frame plus the last) before backfilling', () => {
    const order = frameLoadOrder(9, 4);

    // Coarse pass first: 0, 4, 8 — then the rest, each exactly once.
    expect(order.slice(0, 3)).toEqual([0, 4, 8]);
    expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('covers every frame exactly once for the real sequence size', () => {
    const order = frameLoadOrder(FRAME_COUNT, 8);
    expect(new Set(order).size).toBe(FRAME_COUNT);
    expect(order).toHaveLength(FRAME_COUNT);
    expect(order[0]).toBe(0);
  });
});

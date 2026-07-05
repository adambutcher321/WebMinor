import { describe, it, expect, vi } from 'vitest';
import { wireLenisToScrollTrigger } from './useLenisScrollTrigger';

function createFakeLenis() {
  return {
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  };
}

describe('wireLenisToScrollTrigger', () => {
  it('subscribes the ScrollTrigger update callback to the Lenis scroll event', () => {
    const lenis = createFakeLenis();
    const onScrollTriggerUpdate = vi.fn();

    wireLenisToScrollTrigger({
      lenis,
      onScrollTriggerUpdate,
      requestFrame: () => 1,
      cancelFrame: vi.fn(),
    });

    expect(lenis.on).toHaveBeenCalledWith('scroll', onScrollTriggerUpdate);
  });

  it('drives the Lenis raf loop via the injected frame scheduler', () => {
    const lenis = createFakeLenis();
    let scheduled: ((time: number) => void) | undefined;
    const requestFrame = vi.fn((cb: (time: number) => void) => {
      scheduled = cb;
      return 42;
    });

    wireLenisToScrollTrigger({
      lenis,
      onScrollTriggerUpdate: vi.fn(),
      requestFrame,
      cancelFrame: vi.fn(),
    });

    expect(requestFrame).toHaveBeenCalledTimes(1);
    scheduled?.(16);
    expect(lenis.raf).toHaveBeenCalledWith(16);
    expect(requestFrame).toHaveBeenCalledTimes(2);
  });

  it('returns a cleanup function that cancels the frame and destroys Lenis', () => {
    const lenis = createFakeLenis();
    const cancelFrame = vi.fn();

    const cleanup = wireLenisToScrollTrigger({
      lenis,
      onScrollTriggerUpdate: vi.fn(),
      requestFrame: () => 7,
      cancelFrame,
    });

    cleanup();

    expect(cancelFrame).toHaveBeenCalledWith(7);
    expect(lenis.destroy).toHaveBeenCalled();
  });
});

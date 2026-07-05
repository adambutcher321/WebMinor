import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shouldUseFallback, detectCapabilities, type CapabilityInputs } from './capabilities';

describe('shouldUseFallback', () => {
  const baseline: CapabilityInputs = {
    viewportWidth: 1440,
    hasWebGL2: true,
    hardwareConcurrency: 8,
    prefersReducedMotion: false,
  };

  it('returns false when the device is capable and motion is allowed', () => {
    expect(shouldUseFallback(baseline)).toBe(false);
  });

  it('returns true when the user prefers reduced motion, regardless of capability', () => {
    expect(shouldUseFallback({ ...baseline, prefersReducedMotion: true })).toBe(true);
  });

  it('returns true when WebGL2 is unavailable', () => {
    expect(shouldUseFallback({ ...baseline, hasWebGL2: false })).toBe(true);
  });

  it('returns true below the mobile breakpoint', () => {
    expect(shouldUseFallback({ ...baseline, viewportWidth: 480 })).toBe(true);
  });

  it('returns true when hardwareConcurrency is low but reported', () => {
    expect(shouldUseFallback({ ...baseline, hardwareConcurrency: 2 })).toBe(true);
  });

  it('does not penalise a hardwareConcurrency of 0 (unreported by the browser)', () => {
    expect(shouldUseFallback({ ...baseline, hardwareConcurrency: 0 })).toBe(false);
  });
});

describe('detectCapabilities', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      writable: true,
      configurable: true,
      value: 8,
    });
  });

  it('reads viewport width, hardware concurrency, and reduced-motion preference from the browser', () => {
    const capabilities = detectCapabilities();

    expect(capabilities.viewportWidth).toBe(window.innerWidth);
    expect(capabilities.hardwareConcurrency).toBe(8);
    expect(capabilities.prefersReducedMotion).toBe(false);
  });

  it('reports hasWebGL2 as false under jsdom, which has no WebGL support', () => {
    expect(detectCapabilities().hasWebGL2).toBe(false);
  });
});

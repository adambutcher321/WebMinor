import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockShouldUseFallback = vi.fn();
vi.mock('@/lib/launch/capabilities', () => ({
  detectCapabilities: () => ({
    viewportWidth: 1440,
    hasWebGL2: true,
    hardwareConcurrency: 8,
    prefersReducedMotion: false,
  }),
  shouldUseFallback: (...args: unknown[]) => mockShouldUseFallback(...args),
}));

vi.mock('./Scene', () => ({
  default: () => <div data-testid="scene-stub" />,
}));

vi.mock('@/hooks/useLenisScrollTrigger', () => ({
  useLenisScrollTrigger: vi.fn(),
}));

const mockScrollTriggerCreate = vi.fn(() => ({ kill: vi.fn() }));
const mockGsapTo = vi.fn(() => ({ kill: vi.fn(), scrollTrigger: null }));
vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn(), to: mockGsapTo },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: mockScrollTriggerCreate },
}));

const { default: LaunchHero } = await import('./LaunchHero');
const { useLenisScrollTrigger } = await import('@/hooks/useLenisScrollTrigger');

describe('LaunchHero', () => {
  beforeEach(() => {
    mockShouldUseFallback.mockReset();
    mockScrollTriggerCreate.mockClear();
    mockGsapTo.mockClear();
  });

  it('renders the FallbackHero and skips ScrollTrigger when shouldUseFallback is true', async () => {
    mockShouldUseFallback.mockReturnValue(true);
    render(<LaunchHero />);

    await waitFor(() => {
      expect(screen.getByTestId('fallback-hero')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('scene-stub')).not.toBeInTheDocument();
    expect(useLenisScrollTrigger).toHaveBeenCalledWith({ enabled: false });
    expect(mockScrollTriggerCreate).not.toHaveBeenCalled();
  });

  it('renders the 3D Scene and wires a pinned, scrubbed ScrollTrigger when shouldUseFallback is false', async () => {
    mockShouldUseFallback.mockReturnValue(false);
    render(<LaunchHero />);

    await waitFor(() => {
      expect(screen.getByTestId('scene-stub')).toBeInTheDocument();
    });
    expect(useLenisScrollTrigger).toHaveBeenCalledWith({ enabled: true });
    await waitFor(() => {
      expect(mockScrollTriggerCreate).toHaveBeenCalledWith(
        expect.objectContaining({ pin: true, scrub: true })
      );
    });
  });

  it('fades and lifts the copy from the pin trigger onUpdate, not a second ScrollTrigger', async () => {
    mockShouldUseFallback.mockReturnValue(false);
    render(<LaunchHero />);

    await waitFor(() => {
      expect(mockScrollTriggerCreate).toHaveBeenCalled();
    });

    const copy = document.querySelector('[data-launch-copy]') as HTMLElement;
    expect(copy).not.toBeNull();

    const config = (mockScrollTriggerCreate.mock.calls[0] as unknown[])[0] as {
      onUpdate: (self: { progress: number }) => void;
    };

    config.onUpdate({ progress: 1 });
    expect(copy.style.opacity).toBe('0');
    expect(copy.style.transform).toBe('translateY(-40px)');

    config.onUpdate({ progress: 0 });
    expect(copy.style.opacity).toBe('1');
    expect(copy.style.transform).toBe('translateY(0px)');

    expect(mockGsapTo).not.toHaveBeenCalled();
    expect(mockScrollTriggerCreate).toHaveBeenCalledTimes(1);
  });
});

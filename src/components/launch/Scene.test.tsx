import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';

// Polyfill ResizeObserver for Canvas tests
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children?: ReactNode }) => <>{children}</>,
}));

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children?: ReactNode }) => <>{children}</>,
  Bloom: () => null,
}));

const sceneContentsSpy = vi.fn(() => null);
vi.mock('./SceneContents', () => ({
  default: (props: unknown) => sceneContentsSpy(props),
  BASE_CAMERA_Z: 12,
}));

const { default: Scene } = await import('./Scene');

describe('Scene', () => {
  it('renders SceneContents inside the Canvas with the given progressRef', async () => {
    const progressRef = { current: { value: 0 } };
    await ReactThreeTestRenderer.create(<Scene progressRef={progressRef} />);

    expect(sceneContentsSpy).toHaveBeenCalledWith(expect.objectContaining({ progressRef }));
  });
});

import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { computeLaunchState } from '@/lib/launch/launchState';

vi.mock('./scene/Rocket', () => ({
  default: React.forwardRef(function RocketStub(_props: unknown, ref: React.Ref<import('three').Group>) {
    return <group ref={ref} name="rocket" />;
  }),
}));

vi.mock('@react-three/drei', () => ({
  Environment: () => null,
}));

const { default: SceneContents } = await import('./SceneContents');

describe('SceneContents', () => {
  it('drives rocket position, engine glow intensity, and smoke scale from progressRef via computeLaunchState', async () => {
    const progressRef = { current: { value: 0 } };
    const renderer = await ReactThreeTestRenderer.create(<SceneContents progressRef={progressRef} />);

    progressRef.current.value = 1;
    await renderer.advanceFrames(2, 1);

    const expected = computeLaunchState(1);

    const rocket = renderer.scene.findByProps({ name: 'rocket' });
    expect(rocket.instance.position.y).toBeCloseTo(expected.rocketOffsetY);

    const engineGlow = renderer.scene.findByProps({ name: 'engine-glow' });
    expect(engineGlow.instance.intensity).toBeCloseTo(expected.engineGlowIntensity);

    const smoke = renderer.scene.findByProps({ name: 'smoke' });
    expect(smoke.instance.scale.x).toBeCloseTo(expected.smokeScale);
  });
});

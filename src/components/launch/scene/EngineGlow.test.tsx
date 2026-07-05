import { describe, it, expect } from 'vitest';
import * as React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import EngineGlow from './EngineGlow';

describe('EngineGlow', () => {
  it('renders a point light named "engine-glow" starting at zero intensity', async () => {
    const ref = React.createRef<import('three').PointLight>();
    const renderer = await ReactThreeTestRenderer.create(<EngineGlow ref={ref} />);
    const glow = renderer.scene.findByProps({ name: 'engine-glow' });

    expect(glow.instance.intensity).toBe(0);
    expect(ref.current).toBe(glow.instance);
  });
});

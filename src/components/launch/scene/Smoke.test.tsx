import { describe, it, expect } from 'vitest';
import * as React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Smoke from './Smoke';

describe('Smoke', () => {
  it('renders a group named "smoke" with two sprite plumes, starting hidden', async () => {
    const ref = React.createRef<import('three').Group>();
    const renderer = await ReactThreeTestRenderer.create(<Smoke ref={ref} />);
    const smoke = renderer.scene.findByProps({ name: 'smoke' });

    expect(smoke.children).toHaveLength(2);
    expect(smoke.instance.scale.x).toBeCloseTo(0.5);
    expect(ref.current).toBe(smoke.instance);

    for (const child of smoke.children) {
      const material = (child.instance as unknown as { material: { opacity: number } }).material;
      expect(material.opacity).toBe(0);
    }
  });
});

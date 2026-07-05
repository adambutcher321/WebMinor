import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Planet from './Planet';

describe('Planet', () => {
  it('renders a sphere mesh named "planet"', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Planet />);
    const planet = renderer.scene.findByProps({ name: 'planet' });

    expect(planet.instance.geometry.type).toBe('SphereGeometry');
  });
});

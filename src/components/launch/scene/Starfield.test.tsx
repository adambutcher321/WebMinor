import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Starfield, { STAR_COUNT } from './Starfield';

describe('Starfield', () => {
  it('renders a points object with STAR_COUNT star positions', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Starfield />);
    const points = renderer.scene.findByProps({ name: 'starfield' });

    expect(points.instance.geometry.attributes.position.count).toBe(STAR_COUNT);
  });
});

import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import Nebula, { NEBULA_LAYERS } from './Nebula';

describe('Nebula', () => {
  it('renders one sprite per configured nebula layer', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Nebula />);
    const group = renderer.scene.findByProps({ name: 'nebula' });

    expect(group.children).toHaveLength(NEBULA_LAYERS.length);
  });
});

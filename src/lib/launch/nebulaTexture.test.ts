import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createNebulaTexture } from './nebulaTexture';

describe('createNebulaTexture', () => {
  it('returns a CanvasTexture without throwing, even without a real 2D context (e.g. under jsdom)', () => {
    const texture = createNebulaTexture(64);
    expect(texture).toBeInstanceOf(THREE.CanvasTexture);
    expect(texture.image.width).toBe(64);
    expect(texture.image.height).toBe(64);
  });
});

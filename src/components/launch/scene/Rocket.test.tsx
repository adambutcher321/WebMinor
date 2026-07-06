import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import * as THREE from 'three';
import ReactThreeTestRenderer from '@react-three/test-renderer';

function createFakeGltfScene(): THREE.Group {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  group.add(mesh);
  return group;
}

const fakeGltfScene = createFakeGltfScene();

vi.mock('@react-three/drei', () => ({
  useGLTF: Object.assign(vi.fn(() => ({ scene: fakeGltfScene })), { preload: vi.fn() }),
}));

const { default: Rocket, applyChromeMaterial } = await import('./Rocket');

describe('applyChromeMaterial', () => {
  it('replaces every mesh material with a high-metalness, low-roughness standard material', () => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 'red' }));
    group.add(mesh);

    applyChromeMaterial(group);

    const material = mesh.material as THREE.MeshStandardMaterial;
    expect(material).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(material.metalness).toBeGreaterThanOrEqual(0.9);
    expect(material.roughness).toBeLessThanOrEqual(0.2);
  });
});

describe('Rocket', () => {
  it('applies the chrome material to the loaded GLTF scene and forwards its ref', async () => {
    const ref = React.createRef<THREE.Group>();
    await ReactThreeTestRenderer.create(<Rocket ref={ref} />);

    expect(ref.current).toBe(fakeGltfScene);
    const mesh = fakeGltfScene.children[0] as THREE.Mesh;
    expect(mesh.material).toBeInstanceOf(THREE.MeshStandardMaterial);
  });
});

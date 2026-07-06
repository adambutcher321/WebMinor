import { forwardRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const ROCKET_MODEL_PATH = '/models/rocket.glb';

export function applyChromeMaterial(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: '#C9D3DC',
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.2,
      });
    }
  });
}

interface RocketProps {
  modelPath?: string;
}

const Rocket = forwardRef<THREE.Group, RocketProps>(function Rocket(
  { modelPath = ROCKET_MODEL_PATH },
  ref
) {
  const { scene } = useGLTF(modelPath) as unknown as { scene: THREE.Group };

  useEffect(() => {
    applyChromeMaterial(scene);
  }, [scene]);

  return <primitive ref={ref} object={scene} name="rocket" />;
});

export default Rocket;

useGLTF.preload(ROCKET_MODEL_PATH);

import { useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group, PointLight, Sprite, SpriteMaterial } from 'three';
import { computeLaunchState } from '@/lib/launch/launchState';
import Starfield from './scene/Starfield';
import Nebula from './scene/Nebula';
import Planet from './scene/Planet';
import EngineGlow from './scene/EngineGlow';
import Smoke from './scene/Smoke';
import Rocket from './scene/Rocket';

export const BASE_CAMERA_Z = 12;

interface SceneContentsProps {
  progressRef: RefObject<{ value: number }>;
}

export default function SceneContents({ progressRef }: SceneContentsProps) {
  const { camera } = useThree();
  const rocketRef = useRef<Group>(null);
  const engineGlowRef = useRef<PointLight>(null);
  const smokeRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const state = computeLaunchState(progressRef.current?.value ?? 0);

    if (rocketRef.current) {
      rocketRef.current.rotation.y += delta * 0.1;
      rocketRef.current.position.y = state.rocketOffsetY;
    }

    if (engineGlowRef.current) {
      engineGlowRef.current.intensity = state.engineGlowIntensity;
    }

    if (smokeRef.current) {
      smokeRef.current.scale.setScalar(state.smokeScale);
      for (const child of smokeRef.current.children) {
        const sprite = child as Sprite;
        const material = sprite.material as SpriteMaterial;
        material.opacity = state.smokeOpacity;
      }
    }

    camera.position.y = state.cameraOffsetY;
    camera.position.z = BASE_CAMERA_Z + state.cameraOffsetZ;
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#DCEBFF" />
      <Starfield />
      <Nebula />
      <Planet />
      <EngineGlow ref={engineGlowRef} />
      <Smoke ref={smokeRef} />
      <Rocket ref={rocketRef} />
    </>
  );
}

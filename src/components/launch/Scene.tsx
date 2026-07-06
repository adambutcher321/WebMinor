import { Suspense, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import SceneContents, { BASE_CAMERA_Z } from './SceneContents';

export const MAX_DPR = 2;

interface SceneProps {
  progressRef: RefObject<{ value: number }>;
}

export default function Scene({ progressRef }: SceneProps) {
  return (
    <Canvas
      dpr={[1, MAX_DPR]}
      camera={{ position: [0, 0, BASE_CAMERA_Z], fov: 45 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <SceneContents progressRef={progressRef} />
      </Suspense>
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

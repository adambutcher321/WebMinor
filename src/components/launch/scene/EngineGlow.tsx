import { forwardRef } from 'react';
import type { PointLight } from 'three';

const EngineGlow = forwardRef<PointLight>(function EngineGlow(_props, ref) {
  return (
    <pointLight
      ref={ref}
      name="engine-glow"
      position={[0, -3.4, 0]}
      color="#FF8A3D"
      intensity={0}
      distance={6}
    />
  );
});

export default EngineGlow;

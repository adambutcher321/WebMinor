import { forwardRef } from 'react';
import type { Group } from 'three';

const Smoke = forwardRef<Group>(function Smoke(_props, ref) {
  return (
    <group ref={ref} name="smoke" position={[0, -4, 0]} scale={0.5}>
      <sprite scale={[3, 3, 1]}>
        <spriteMaterial color="#FF8A3D" opacity={0} transparent depthWrite={false} />
      </sprite>
      <sprite position={[1, -0.4, 0]} scale={[2.2, 2.2, 1]}>
        <spriteMaterial color="#FFC98A" opacity={0} transparent depthWrite={false} />
      </sprite>
    </group>
  );
});

export default Smoke;

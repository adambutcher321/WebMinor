import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export default function Planet() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} name="planet" position={[0, -14, -18]}>
      <sphereGeometry args={[6, 48, 48]} />
      <meshStandardMaterial color="#1B2A4A" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

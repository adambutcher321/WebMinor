import * as THREE from 'three';

interface NebulaLayerConfig {
  position: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}

export const NEBULA_LAYERS: NebulaLayerConfig[] = [
  { position: [-8, 2, -20], scale: 14, color: '#5B3DF0', opacity: 0.18 },
  { position: [10, -4, -25], scale: 18, color: '#2563EB', opacity: 0.14 },
  { position: [0, 6, -30], scale: 16, color: '#40E0FF', opacity: 0.1 },
];

export default function Nebula() {
  return (
    <group name="nebula">
      {NEBULA_LAYERS.map((layer, i) => (
        <sprite key={i} position={layer.position} scale={[layer.scale, layer.scale, 1]}>
          <spriteMaterial
            color={layer.color}
            opacity={layer.opacity}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

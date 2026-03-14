import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import type * as THREE from "three";

interface CoinMeshProps {
  position: [number, number, number];
}

export function CoinMesh({ position }: CoinMeshProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 3.5;
      // Gentle bob up and down
      ref.current.position.y =
        position[1] + Math.sin(Date.now() * 0.004) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Main coin disc */}
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 20]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#cc8800"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Inner ring detail */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
        <meshStandardMaterial
          color="#FFA500"
          metalness={0.8}
          roughness={0.2}
          emissive="#aa6600"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

import React from "react";
import { CAR_MAP } from "../types/game";

interface CarMeshProps {
  selectedCar: string;
}

function WheelMesh({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, -0.12, z]}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 10]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Hubcap */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[x > 0 ? 0.07 : -0.07, 0, 0]}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.02, 8]} />
        <meshLambertMaterial color="#c0c0c0" />
      </mesh>
    </group>
  );
}

export function CarMesh({ selectedCar }: CarMeshProps) {
  const carDef = CAR_MAP[selectedCar] ?? CAR_MAP.sports;
  const color = carDef.color;
  const roofColor = carDef.roofColor;

  return (
    <>
      {/* Main body — wider and taller for top-down visibility */}
      <mesh>
        <boxGeometry args={[1.0, 0.38, 1.5]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Hood (front) — slightly raised */}
      <mesh position={[0, 0.22, 0.42]}>
        <boxGeometry args={[0.82, 0.06, 0.4]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Cabin / roof */}
      <mesh position={[0, 0.32, -0.08]}>
        <boxGeometry args={[0.74, 0.24, 0.72]} />
        <meshLambertMaterial color={roofColor} />
      </mesh>

      {/* Front windshield */}
      <mesh position={[0, 0.28, 0.37]}>
        <boxGeometry args={[0.66, 0.16, 0.07]} />
        <meshLambertMaterial color="#99ddff" transparent opacity={0.8} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.28, -0.48]}>
        <boxGeometry args={[0.6, 0.14, 0.06]} />
        <meshLambertMaterial color="#99ddff" transparent opacity={0.6} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.3, 0.1, 0.76]}>
        <boxGeometry args={[0.22, 0.12, 0.05]} />
        <meshLambertMaterial
          color="#fffbe6"
          emissive="#ffe580"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[0.3, 0.1, 0.76]}>
        <boxGeometry args={[0.22, 0.12, 0.05]} />
        <meshLambertMaterial
          color="#fffbe6"
          emissive="#ffe580"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.32, 0.1, -0.77]}>
        <boxGeometry args={[0.18, 0.1, 0.04]} />
        <meshLambertMaterial
          color="#ff3333"
          emissive="#ff0000"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0.32, 0.1, -0.77]}>
        <boxGeometry args={[0.18, 0.1, 0.04]} />
        <meshLambertMaterial
          color="#ff3333"
          emissive="#ff0000"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Wheels */}
      <WheelMesh x={-0.54} z={0.48} />
      <WheelMesh x={0.54} z={0.48} />
      <WheelMesh x={-0.54} z={-0.48} />
      <WheelMesh x={0.54} z={-0.48} />
    </>
  );
}

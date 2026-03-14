import { useFrame } from "@react-three/fiber";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { CarMesh } from "./CarMesh";
import { CoinMesh } from "./CoinMesh";
import { RoadMesh } from "./RoadMesh";
import {
  ANGLE_LEFT,
  ANGLE_RIGHT,
  type RoadSegment,
  extendRoad,
  generateInitialRoad,
  isOnSegment,
} from "./roadGen";

interface GameSceneProps {
  selectedCar: string;
  directionRef: React.MutableRefObject<number>;
  onGameOver: (score: number, coins: number) => void;
  onScoreUpdate: (score: number, coins: number) => void;
}

export function GameScene({
  selectedCar,
  directionRef,
  onGameOver,
  onScoreUpdate,
}: GameSceneProps) {
  // --- Game physics refs ---
  const carX = useRef(0);
  const carZ = useRef(0);
  const speed = useRef(0.08);
  const score = useRef(0);
  const coinsCount = useRef(0);
  // Grace period: don't check collision for the first N frames
  const graceFrames = useRef(150);
  const gameOverCalled = useRef(false);
  const extendingRoad = useRef(false);
  const frameCount = useRef(0);
  // Consecutive off-road frames before triggering game over (prevents false positives at junctions)
  const offRoadFrames = useRef(0);

  // --- Three.js mesh refs ---
  const carGroupRef = useRef<THREE.Group>(null);
  const groundRef = useRef<THREE.Mesh>(null);

  // --- Road segments ---
  const [segments, setSegments] = useState<RoadSegment[]>(() =>
    generateInitialRoad(),
  );
  const segmentsRef = useRef<RoadSegment[]>([]);

  // --- Collected coins ---
  const collectedSetRef = useRef(new Set<string>());
  const [collectedCoins, setCollectedCoins] = useState<Set<string>>(
    () => new Set(),
  );

  // --- Car render position (for visible segment culling) ---
  const [carRenderPos, setCarRenderPos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    segmentsRef.current = segments;
    extendingRoad.current = false;
  }, [segments]);

  useFrame((state, delta) => {
    if (gameOverCalled.current) return;

    frameCount.current++;
    const f = frameCount.current;

    if (graceFrames.current > 0) graceFrames.current--;

    // Clamp delta to avoid huge jumps
    const dt = Math.min(delta, 0.05) * 60;
    const angle = directionRef.current;
    const spd = speed.current;

    // Move car along current angle direction
    carX.current += Math.sin(angle) * spd * dt;
    carZ.current -= Math.cos(angle) * spd * dt;
    score.current += spd * dt * 10;

    // Progressive speed: starts at 0.08, caps at 0.30
    speed.current = Math.min(0.3, 0.08 + score.current * 0.00004);

    // Update car mesh position and rotation
    if (carGroupRef.current) {
      carGroupRef.current.position.set(carX.current, 0.3, carZ.current);
      // Car visual rotation: face direction of travel
      // Car model's front is +Z; movement is -Z at angle=0
      // So base rotation is Math.PI, then subtract the angle
      carGroupRef.current.rotation.y = Math.PI - angle;
    }

    // Ground plane follows car
    if (groundRef.current) {
      groundRef.current.position.set(carX.current, -0.1, carZ.current);
    }

    // Camera: close overhead, tilted slightly forward to show road ahead
    const camY = 13;
    const camZOffset = 6;
    state.camera.position.set(carX.current, camY, carZ.current + camZOffset);
    state.camera.lookAt(carX.current, 0, carZ.current - 6);

    // --- Collision detection (after grace period) ---
    if (graceFrames.current <= 0) {
      const segs = segmentsRef.current;
      // Only check segments close to the car
      const nearby = segs.filter((seg) => {
        const mx = (seg.startX + seg.endX) / 2;
        const mz = (seg.startZ + seg.endZ) / 2;
        return (
          Math.hypot(carX.current - mx, carZ.current - mz) < seg.length / 2 + 8
        );
      });

      if (nearby.length > 0) {
        const onRoad = nearby.some((seg) =>
          isOnSegment(carX.current, carZ.current, seg),
        );

        if (!onRoad) {
          offRoadFrames.current++;
          // Require 5 consecutive off-road frames to trigger game over
          // This prevents false positives at segment junctions
          if (offRoadFrames.current >= 5) {
            gameOverCalled.current = true;
            onGameOver(Math.floor(score.current), coinsCount.current);
            return;
          }
        } else {
          offRoadFrames.current = 0;
        }
      }
    }

    // --- Coin collection ---
    let gotCoin = false;
    for (const seg of segmentsRef.current) {
      for (const coin of seg.coins) {
        if (!collectedSetRef.current.has(coin.id)) {
          if (Math.hypot(carX.current - coin.x, carZ.current - coin.z) < 1.2) {
            collectedSetRef.current.add(coin.id);
            coinsCount.current++;
            gotCoin = true;
          }
        }
      }
    }
    if (gotCoin) {
      setCollectedCoins(new Set(collectedSetRef.current));
    }

    // --- Road extension ---
    if (!extendingRoad.current) {
      const segs = segmentsRef.current;
      const lastSeg = segs[segs.length - 1];
      if (lastSeg) {
        const d = Math.hypot(
          carX.current - lastSeg.endX,
          carZ.current - lastSeg.endZ,
        );
        if (d < 150) {
          extendingRoad.current = true;
          setSegments((prev) => extendRoad(prev));
        }
      }
    }

    // --- Periodic UI updates ---
    if (f % 4 === 0) {
      onScoreUpdate(Math.floor(score.current), coinsCount.current);
    }
    if (f % 20 === 0) {
      setCarRenderPos([carX.current, carZ.current]);
    }
  });

  // Filter visible segments (generous radius for smooth culling)
  const [rx, rz] = carRenderPos;
  const visibleSegs = segments.filter((seg) => {
    const mx = (seg.startX + seg.endX) / 2;
    const mz = (seg.startZ + seg.endZ) / 2;
    return Math.hypot(rx - mx, rz - mz) < 120;
  });

  // Find the next few upcoming segments to highlight (the ones ahead of the car)
  const upcomingHighlight = new Set<number>();
  const carZVal = carRenderPos[1];
  let found = 0;
  for (const seg of visibleSegs) {
    if (seg.startZ < carZVal + 5 && seg.endZ < carZVal && found < 3) {
      upcomingHighlight.add(seg.id);
      found++;
    }
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[8, 15, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} />

      {/* Bright sky color via background */}
      <color attach="background" args={["#87CEEB"]} />

      {/* Ground plane (grass) — follows car */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[800, 800]} />
        <meshLambertMaterial color="#22c55e" />
      </mesh>

      {/* Road segments */}
      <RoadMesh segments={visibleSegs} highlightIds={upcomingHighlight} />

      {/* Coins */}
      {visibleSegs.flatMap((seg) =>
        seg.coins
          .filter((c) => !collectedCoins.has(c.id))
          .map((c) => <CoinMesh key={c.id} position={[c.x, 0.45, c.z]} />),
      )}

      {/* Car */}
      <group ref={carGroupRef} position={[0, 0.3, 0]}>
        <CarMesh selectedCar={selectedCar} />
      </group>
    </>
  );
}

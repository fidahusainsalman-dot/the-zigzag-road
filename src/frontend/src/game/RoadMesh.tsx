import React from "react";
import type { RoadSegment } from "./roadGen";

interface RoadMeshProps {
  segments: RoadSegment[];
  highlightIds?: Set<number>;
}

function SegmentMesh({
  seg,
  highlight,
}: {
  seg: RoadSegment;
  highlight: boolean;
}) {
  const midX = (seg.startX + seg.endX) / 2;
  const midZ = (seg.startZ + seg.endZ) / 2;
  // Align the box's local Z axis with the segment direction
  const rotY = Math.PI - seg.angle;
  const roadColor = highlight ? "#7c8494" : "#4b5263";
  const edgeColor = highlight ? "#ffffff" : "#e2e8f0";
  const dashCount = Math.floor(seg.length / 3);

  return (
    <group position={[midX, 0, midZ]} rotation={[0, rotY, 0]}>
      {/* Road surface */}
      <mesh>
        <boxGeometry args={[seg.width, 0.18, seg.length]} />
        <meshLambertMaterial color={roadColor} />
      </mesh>

      {/* Road shoulders */}
      <mesh position={[-(seg.width / 2 + 0.15), 0.0, 0]}>
        <boxGeometry args={[0.3, 0.1, seg.length]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[seg.width / 2 + 0.15, 0.0, 0]}>
        <boxGeometry args={[0.3, 0.1, seg.length]} />
        <meshLambertMaterial color="#374151" />
      </mesh>

      {/* White edge stripes */}
      <mesh position={[-(seg.width / 2 - 0.15), 0.1, 0]}>
        <boxGeometry args={[0.18, 0.02, seg.length]} />
        <meshLambertMaterial color={edgeColor} />
      </mesh>
      <mesh position={[seg.width / 2 - 0.15, 0.1, 0]}>
        <boxGeometry args={[0.18, 0.02, seg.length]} />
        <meshLambertMaterial color={edgeColor} />
      </mesh>

      {/* Center dashed yellow line — use seg.id-based keys */}
      {Array.from({ length: dashCount }, (_, i) => (
        <mesh
          key={`dash-${seg.id}-${i}`}
          position={[0, 0.1, -seg.length / 2 + i * 3 + 1.2]}
        >
          <boxGeometry args={[0.12, 0.02, 1.8]} />
          <meshLambertMaterial color="#facc15" />
        </mesh>
      ))}
    </group>
  );
}

export function RoadMesh({ segments, highlightIds }: RoadMeshProps) {
  return (
    <>
      {segments.map((seg) => (
        <SegmentMesh
          key={seg.id}
          seg={seg}
          highlight={highlightIds?.has(seg.id) ?? false}
        />
      ))}
    </>
  );
}

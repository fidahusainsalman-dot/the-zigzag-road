export const ANGLE_LEFT = -Math.PI / 4; // diagonal left-forward
export const ANGLE_RIGHT = Math.PI / 4; // diagonal right-forward
export const ROAD_WIDTH = 6; // wider road = more forgiving

export interface CoinData {
  x: number;
  z: number;
  id: string;
}

export interface RoadSegment {
  id: number;
  startX: number;
  startZ: number;
  endX: number;
  endZ: number;
  angle: number;
  length: number;
  width: number;
  coins: CoinData[];
}

let segCounter = 0;
let coinCounter = 0;

function makeSegment(
  startX: number,
  startZ: number,
  angle: number,
  length: number,
): RoadSegment {
  const width = ROAD_WIDTH;
  const endX = startX + Math.sin(angle) * length;
  const endZ = startZ - Math.cos(angle) * length;
  const dx = endX - startX;
  const dz = endZ - startZ;

  const coins: CoinData[] = [];
  const numCoins = Math.floor(length / 6);
  for (let i = 1; i <= numCoins; i++) {
    const t = i / (numCoins + 1);
    // Slight random lateral offset so coins aren't perfectly centered
    const lateralOff = (Math.random() - 0.5) * 1.5;
    const perpX = -dz / length;
    const perpZ = dx / length;
    coins.push({
      x: startX + dx * t + perpX * lateralOff,
      z: startZ + dz * t + perpZ * lateralOff,
      id: `coin_${coinCounter++}`,
    });
  }

  return {
    id: segCounter++,
    startX,
    startZ,
    endX,
    endZ,
    angle,
    length,
    width,
    coins,
  };
}

export function generateInitialRoad(): RoadSegment[] {
  segCounter = 0;
  coinCounter = 0;

  const segments: RoadSegment[] = [];
  // Start with a short straight-ish segment so the player is clearly on road
  let curX = 0;
  let curZ = 0;
  // First segment always ANGLE_LEFT with generous length
  let angle = ANGLE_LEFT;
  const first = makeSegment(curX, curZ, angle, 28);
  segments.push(first);
  curX = first.endX;
  curZ = first.endZ;
  angle = ANGLE_RIGHT;

  for (let i = 1; i < 70; i++) {
    const length = 20 + Math.random() * 12;
    const seg = makeSegment(curX, curZ, angle, length);
    segments.push(seg);
    curX = seg.endX;
    curZ = seg.endZ;
    angle = angle === ANGLE_LEFT ? ANGLE_RIGHT : ANGLE_LEFT;
  }

  return segments;
}

export function extendRoad(existing: RoadSegment[]): RoadSegment[] {
  const last = existing[existing.length - 1];
  if (!last) return existing;

  const newSegs: RoadSegment[] = [];
  let curX = last.endX;
  let curZ = last.endZ;
  let angle = last.angle === ANGLE_LEFT ? ANGLE_RIGHT : ANGLE_LEFT;

  for (let i = 0; i < 30; i++) {
    const length = 20 + Math.random() * 12;
    const seg = makeSegment(curX, curZ, angle, length);
    newSegs.push(seg);
    curX = seg.endX;
    curZ = seg.endZ;
    angle = angle === ANGLE_LEFT ? ANGLE_RIGHT : ANGLE_LEFT;
  }

  return [...existing, ...newSegs];
}

/**
 * Returns true if point (px, pz) is within the road segment (with buffer).
 * Uses perpendicular distance + along-axis range check.
 */
export function isOnSegment(px: number, pz: number, seg: RoadSegment): boolean {
  const dx = seg.endX - seg.startX;
  const dz = seg.endZ - seg.startZ;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len === 0) return false;

  // Unit vectors along and perpendicular to segment
  const tx = dx / len;
  const tz = dz / len;
  const nx = -tz;
  const nz = tx;

  const relX = px - seg.startX;
  const relZ = pz - seg.startZ;

  const perpDist = Math.abs(relX * nx + relZ * nz);
  const along = relX * tx + relZ * tz;

  // Wider tolerance: half-width + buffer, and extended along-range for junctions
  const halfWidth = seg.width / 2 + 0.8;
  return perpDist < halfWidth && along >= -3 && along <= len + 3;
}

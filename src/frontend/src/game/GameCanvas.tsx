import { Canvas } from "@react-three/fiber";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { GameScene } from "./GameScene";
import { ANGLE_LEFT, ANGLE_RIGHT } from "./roadGen";

interface GameCanvasProps {
  selectedCar: string;
  onGameOver: (score: number, coins: number) => void;
}

export function GameCanvas({ selectedCar, onGameOver }: GameCanvasProps) {
  const directionRef = useRef<number>(ANGLE_LEFT);
  const scoreDisplayRef = useRef<HTMLDivElement>(null);
  const coinsDisplayRef = useRef<HTMLDivElement>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const tapCount = useRef(0);

  // Direct DOM update to avoid React re-renders on every frame
  const handleScoreUpdate = useCallback((s: number, c: number) => {
    if (scoreDisplayRef.current)
      scoreDisplayRef.current.textContent = String(s);
    if (coinsDisplayRef.current)
      coinsDisplayRef.current.textContent = String(c);
  }, []);

  const handleTap = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      directionRef.current =
        directionRef.current === ANGLE_LEFT ? ANGLE_RIGHT : ANGLE_LEFT;

      tapCount.current++;
      // Hide hint after first few taps
      if (tapCount.current >= 3 && hintVisible) {
        setHintVisible(false);
      }
    },
    [hintVisible],
  );

  return (
    <div
      className="relative w-full h-full select-none"
      style={{ touchAction: "none", background: "#87CEEB" }}
      data-ocid="game.canvas_target"
      onPointerDown={handleTap}
    >
      {/* Three.js canvas */}
      <Canvas
        camera={{ position: [0, 13, 6], fov: 55, near: 0.1, far: 1000 }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <GameScene
          selectedCar={selectedCar}
          directionRef={directionRef}
          onGameOver={onGameOver}
          onScoreUpdate={handleScoreUpdate}
        />
      </Canvas>

      {/* HUD overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        {/* Score — top left */}
        <div className="absolute top-4 left-4">
          <div
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              borderRadius: "16px",
              padding: "10px 18px",
              border: "1px solid rgba(255,220,50,0.4)",
              minWidth: "90px",
            }}
          >
            <div
              style={{
                color: "#facc15",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "system-ui",
              }}
            >
              SCORE
            </div>
            <div
              ref={scoreDisplayRef}
              style={{
                color: "#ffffff",
                fontSize: "32px",
                fontWeight: 900,
                lineHeight: 1,
                fontFamily: "system-ui",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              0
            </div>
          </div>
        </div>

        {/* Coins — top right */}
        <div className="absolute top-4 right-4">
          <div
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              borderRadius: "16px",
              padding: "10px 18px",
              border: "1px solid rgba(255,220,50,0.4)",
              minWidth: "90px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                color: "#facc15",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "system-ui",
              }}
            >
              🪙 COINS
            </div>
            <div
              ref={coinsDisplayRef}
              style={{
                color: "#fde68a",
                fontSize: "32px",
                fontWeight: 900,
                lineHeight: 1,
                fontFamily: "system-ui",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              0
            </div>
          </div>
        </div>

        {/* TAP HINT — centered bottom, pulsing */}
        {hintVisible && (
          <div
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            style={{ pointerEvents: "none" }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(10px)",
                borderRadius: "100px",
                padding: "14px 32px",
                border: "2px solid rgba(255,255,255,0.3)",
                animation: "pulse 1s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  fontFamily: "system-ui",
                  textAlign: "center",
                }}
              >
                👆 TAP TO CHANGE DIRECTION
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
      `}</style>
    </div>
  );
}

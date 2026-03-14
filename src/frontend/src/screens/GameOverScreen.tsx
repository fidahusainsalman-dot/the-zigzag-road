import React from "react";

interface GameOverScreenProps {
  score: number;
  coinsCollected: number;
  highScore: number;
  onRestart: () => void;
  onGarage: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  score,
  coinsCollected,
  highScore,
  onRestart,
  onGarage,
  onMenu,
}: GameOverScreenProps) {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0007 0%, #1a0520 50%, #0d0d1f 100%)",
      }}
    >
      {/* Background red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 20%, rgba(239,68,68,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Crash icon */}
      <div
        className="text-7xl mb-4"
        style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.6))" }}
      >
        💥
      </div>

      {/* GAME OVER title */}
      <h1
        className="font-display text-6xl sm:text-7xl font-bold mb-1"
        style={{
          color: "#ef4444",
          textShadow:
            "0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4), 0 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        GAME OVER
      </h1>

      {isNewHighScore && (
        <div className="mb-4 px-4 py-1 rounded-full font-display text-sm text-yellow-300 border border-yellow-400/40 bg-yellow-500/10 animate-pulse-glow">
          🏆 New High Score!
        </div>
      )}

      {/* Stats */}
      <div className="w-full max-w-xs mt-4 mb-8 space-y-3">
        <div
          className="flex items-center justify-between px-5 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="font-body text-white/60 text-sm uppercase tracking-wider">
            Score
          </span>
          <span className="font-display text-2xl text-white">
            {score.toLocaleString()}
          </span>
        </div>

        <div
          className="flex items-center justify-between px-5 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="font-body text-white/60 text-sm uppercase tracking-wider">
            Coins
          </span>
          <span className="font-display text-2xl text-yellow-300">
            🪙 {coinsCollected}
          </span>
        </div>

        <div
          className="flex items-center justify-between px-5 py-3 rounded-xl"
          style={{
            background: "rgba(234,179,8,0.08)",
            border: "1px solid rgba(234,179,8,0.2)",
          }}
        >
          <span className="font-body text-yellow-400/60 text-sm uppercase tracking-wider">
            🏆 Best
          </span>
          <span className="font-display text-2xl text-yellow-400">
            {highScore.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          type="button"
          data-ocid="gameover.restart_button"
          onClick={onRestart}
          className="w-full py-4 rounded-2xl font-display text-xl text-white font-bold active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
          }}
        >
          ▶ RESTART
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            data-ocid="gameover.garage_button"
            onClick={onGarage}
            className="flex-1 py-3 rounded-2xl font-display text-lg text-white bg-white/10 border border-white/20 active:scale-95 transition-transform"
          >
            🚗 GARAGE
          </button>
          <button
            type="button"
            data-ocid="gameover.menu_button"
            onClick={onMenu}
            className="flex-1 py-3 rounded-2xl font-display text-lg text-white bg-white/10 border border-white/20 active:scale-95 transition-transform"
          >
            🏠 MENU
          </button>
        </div>
      </div>
    </div>
  );
}

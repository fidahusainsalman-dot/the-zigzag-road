import React from "react";

interface MainMenuProps {
  totalCoins: number;
  onPlay: () => void;
  onGarage: () => void;
}

export function MainMenu({ totalCoins, onPlay, onGarage }: MainMenuProps) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0d1f 0%, #0a1a3a 50%, #0d0d1f 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(168,85,247,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(6,182,212,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Top section: title + coins */}
      <div className="flex flex-col items-center gap-4 z-10 mt-4">
        <div className="text-center">
          <p className="font-body text-purple-400/80 text-sm uppercase tracking-[0.3em] mb-1">
            endless runner
          </p>
          <h1
            className="font-display text-5xl sm:text-6xl text-white leading-tight"
            style={{
              textShadow:
                "0 0 30px rgba(168,85,247,0.6), 0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            The ZigZag
          </h1>
          <h1
            className="font-display text-5xl sm:text-6xl leading-tight"
            style={{
              background: "linear-gradient(90deg, #facc15, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 10px rgba(250,204,21,0.4))",
            }}
          >
            Road
          </h1>
        </div>

        {/* Coin counter */}
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2">
          <span className="text-2xl">🪙</span>
          <span className="font-display text-2xl text-yellow-300">
            {totalCoins.toLocaleString()}
          </span>
          <span className="font-body text-yellow-400/60 text-sm">Coins</span>
        </div>
      </div>

      {/* Middle: car icon */}
      <div className="text-8xl animate-float z-10">🏎️</div>

      {/* Bottom: action buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs z-10">
        <button
          type="button"
          data-ocid="menu.play_button"
          onClick={onPlay}
          className="w-full py-5 rounded-2xl font-display text-2xl text-white font-bold shadow-lg active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            boxShadow:
              "0 4px 24px rgba(34,197,94,0.4), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          ▶ PLAY
        </button>

        <button
          type="button"
          data-ocid="menu.garage_button"
          onClick={onGarage}
          className="w-full py-4 rounded-2xl font-display text-xl text-white font-bold border border-white/20 bg-white/10 backdrop-blur-sm active:scale-95 transition-transform"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
          🚗 GARAGE
        </button>
      </div>

      {/* Footer */}
      <div className="text-white/20 font-body text-xs mt-4">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/40 transition-colors"
        >
          Built with love using caffeine.ai
        </a>
      </div>
    </div>
  );
}

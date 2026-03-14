import React, { useEffect } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      data-ocid="splash.section"
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a0533 0%, #0a1a4e 40%, #042e47 70%, #0d1a2e 100%)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute rounded-full opacity-10 animate-pulse"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          top: "-150px",
          left: "-100px",
        }}
      />
      <div
        className="absolute rounded-full opacity-10 animate-pulse"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          bottom: "-100px",
          right: "-80px",
          animationDelay: "1s",
        }}
      />
      <div
        className="absolute rounded-full opacity-10"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, #eab308 0%, transparent 70%)",
          top: "40%",
          right: "-50px",
        }}
      />

      {/* Road icon */}
      <div className="mb-6 text-6xl animate-float">🏎️</div>

      {/* Title */}
      <div className="text-center px-8">
        <h1
          className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight"
          style={{
            textShadow:
              "0 0 20px #a855f7, 0 0 40px #a855f7, 0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          The
        </h1>
        <h1
          className="font-display text-6xl sm:text-7xl font-bold leading-tight"
          style={{
            background: "linear-gradient(90deg, #facc15, #f97316, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 0 15px rgba(250,204,21,0.5))",
          }}
        >
          ZigZag Road
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="mt-4 text-lg font-body text-cyan-300/80 tracking-wider uppercase"
        style={{ letterSpacing: "0.2em" }}
      >
        Dodge · Collect · Survive
      </p>

      {/* Loading dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1">
        <span className="text-white/40 font-body text-sm">Made by</span>
        <span
          className="font-display text-xl text-white/70"
          style={{ letterSpacing: "0.05em" }}
        >
          Rock Apps Studio 7
        </span>
      </div>
    </div>
  );
}

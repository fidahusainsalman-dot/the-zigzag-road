import React from "react";
import { CARS } from "../types/game";

interface GarageScreenProps {
  totalCoins: number;
  unlockedCars: string[];
  selectedCar: string;
  onBack: () => void;
  onUnlock: (carId: string) => void;
  onSelect: (carId: string) => void;
}

function CarPreview({ color }: { color: string }) {
  return (
    <div
      className="w-full h-20 rounded-t-xl relative overflow-hidden flex items-end justify-center pb-2"
      style={{
        background: `linear-gradient(160deg, ${color}22 0%, ${color}44 100%)`,
        borderBottom: `2px solid ${color}44`,
      }}
    >
      {/* Road strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 opacity-30"
        style={{ backgroundColor: "#555" }}
      />
      {/* Car shape */}
      <div className="relative flex flex-col items-center">
        <div
          className="w-8 h-3 rounded-sm mb-0.5"
          style={{ backgroundColor: color, opacity: 0.7 }}
        />
        <div
          className="w-12 h-5 rounded-sm shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 4px 12px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

export function GarageScreen({
  totalCoins,
  unlockedCars,
  selectedCar,
  onBack,
  onUnlock,
  onSelect,
}: GarageScreenProps) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0d0d1f 0%, #0a1a3a 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <button
          type="button"
          data-ocid="garage.back_button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-xl active:scale-90 transition-transform"
        >
          ←
        </button>
        <h2 className="font-display text-2xl text-white tracking-wider">
          🏎️ GARAGE
        </h2>
        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1">
          <span>🪙</span>
          <span className="font-display text-lg text-yellow-300">
            {totalCoins}
          </span>
        </div>
      </div>

      {/* Car grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {CARS.map((car, idx) => {
            const isUnlocked = unlockedCars.includes(car.id);
            const isSelected = selectedCar === car.id;
            const canAfford = totalCoins >= car.cost;
            const cardIdx = idx + 1;

            return (
              <div
                key={car.id}
                className="rounded-xl overflow-hidden border transition-all"
                style={{
                  borderColor: isSelected
                    ? car.color
                    : isUnlocked
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? `0 0 16px ${car.color}60` : "none",
                  opacity: !isUnlocked && !canAfford ? 0.6 : 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <CarPreview color={car.color} />

                <div className="px-3 py-3 flex flex-col gap-2">
                  <div>
                    <p className="font-display text-base text-white leading-tight">
                      {car.name}
                    </p>
                    <p className="font-body text-xs text-white/50">
                      {car.description}
                    </p>
                  </div>

                  {isSelected ? (
                    <div
                      className="text-center py-1.5 rounded-lg font-display text-sm"
                      style={{
                        background: `${car.color}22`,
                        color: car.color,
                        border: `1px solid ${car.color}44`,
                      }}
                    >
                      ✓ SELECTED
                    </div>
                  ) : isUnlocked ? (
                    <button
                      type="button"
                      data-ocid={`garage.car.select_button.${cardIdx}`}
                      onClick={() => onSelect(car.id)}
                      className="w-full py-1.5 rounded-lg font-display text-sm text-white bg-white/10 border border-white/20 active:scale-95 transition-transform"
                    >
                      SELECT
                    </button>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-center gap-1 text-yellow-400/80 text-xs font-body">
                        <span>🔒</span>
                        <span>🪙 {car.cost} coins</span>
                      </div>
                      <button
                        type="button"
                        data-ocid={`garage.car.unlock_button.${cardIdx}`}
                        onClick={() => canAfford && onUnlock(car.id)}
                        disabled={!canAfford}
                        className="w-full py-1.5 rounded-lg font-display text-sm transition-all active:scale-95"
                        style={{
                          background: canAfford
                            ? "linear-gradient(135deg, #eab308, #f97316)"
                            : "rgba(255,255,255,0.08)",
                          color: canAfford
                            ? "#0d0d1f"
                            : "rgba(255,255,255,0.3)",
                          cursor: canAfford ? "pointer" : "not-allowed",
                        }}
                      >
                        {canAfford ? "🪙 UNLOCK" : "Need more coins"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useCallback, useState } from "react";
import { GameCanvas } from "./game/GameCanvas";
import { useActor } from "./hooks/useActor";
import { GameOverScreen } from "./screens/GameOverScreen";
import { GarageScreen } from "./screens/GarageScreen";
import { MainMenu } from "./screens/MainMenu";
import { SplashScreen } from "./screens/SplashScreen";
import { CARS } from "./types/game";
import type { Screen } from "./types/game";

function readCoins(): number {
  return Number(localStorage.getItem("zigzag_coins") || "0");
}
function readUnlocked(): string[] {
  try {
    return JSON.parse(localStorage.getItem("zigzag_unlocked") || '["sports"]');
  } catch {
    return ["sports"];
  }
}
function readSelectedCar(): string {
  return localStorage.getItem("zigzag_selected_car") || "sports";
}
function readHighScore(): number {
  return Number(localStorage.getItem("zigzag_highscore") || "0");
}

export default function App() {
  const { actor } = useActor();

  const [screen, setScreen] = useState<Screen>("splash");
  const [gameKey, setGameKey] = useState(0);

  const [totalCoins, setTotalCoins] = useState<number>(readCoins);
  const [unlockedCars, setUnlockedCars] = useState<string[]>(readUnlocked);
  const [selectedCar, setSelectedCar] = useState<string>(readSelectedCar);
  const [highScore, setHighScore] = useState<number>(readHighScore);

  const [lastScore, setLastScore] = useState(0);
  const [lastCoins, setLastCoins] = useState(0);

  const handleGameOver = useCallback(
    (score: number, coins: number) => {
      const newTotal = totalCoins + coins;
      const newHigh = Math.max(highScore, score);

      setLastScore(score);
      setLastCoins(coins);
      setTotalCoins(newTotal);
      setHighScore(newHigh);
      setScreen("gameover");

      localStorage.setItem("zigzag_coins", String(newTotal));
      localStorage.setItem("zigzag_highscore", String(newHigh));

      actor?.submitScore(BigInt(score)).catch(() => {});
    },
    [totalCoins, highScore, actor],
  );

  const handleRestart = useCallback(() => {
    setGameKey((k) => k + 1);
    setScreen("game");
  }, []);

  const handleUnlock = useCallback(
    (carId: string) => {
      const car = CARS.find((c) => c.id === carId);
      if (!car || totalCoins < car.cost) return;
      const newTotal = totalCoins - car.cost;
      const newUnlocked = [...unlockedCars, carId];
      setTotalCoins(newTotal);
      setUnlockedCars(newUnlocked);
      localStorage.setItem("zigzag_coins", String(newTotal));
      localStorage.setItem("zigzag_unlocked", JSON.stringify(newUnlocked));
    },
    [totalCoins, unlockedCars],
  );

  const handleSelect = useCallback((carId: string) => {
    setSelectedCar(carId);
    localStorage.setItem("zigzag_selected_car", carId);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
      {screen === "splash" && <SplashScreen onDone={() => setScreen("menu")} />}

      {screen === "menu" && (
        <MainMenu
          totalCoins={totalCoins}
          onPlay={() => setScreen("game")}
          onGarage={() => setScreen("garage")}
        />
      )}

      {screen === "game" && (
        <GameCanvas
          key={gameKey}
          selectedCar={selectedCar}
          onGameOver={handleGameOver}
        />
      )}

      {screen === "gameover" && (
        <GameOverScreen
          score={lastScore}
          coinsCollected={lastCoins}
          highScore={highScore}
          onRestart={handleRestart}
          onGarage={() => setScreen("garage")}
          onMenu={() => setScreen("menu")}
        />
      )}

      {screen === "garage" && (
        <GarageScreen
          totalCoins={totalCoins}
          unlockedCars={unlockedCars}
          selectedCar={selectedCar}
          onBack={() => setScreen("menu")}
          onUnlock={handleUnlock}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}

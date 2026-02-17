"use client";

import { GameProvider } from "@/context/GameContext";
import { FarcasterReady } from "@/components/FarcasterReady";
import { GameScreen } from "@/components/GameScreen";

export default function Home() {
  return (
    <GameProvider>
      <FarcasterReady />
      <GameScreen />
    </GameProvider>
  );
}

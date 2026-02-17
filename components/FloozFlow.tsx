"use client";

import { useGame } from "@/context/GameContext";

export function FloozFlow() {
  const { state } = useGame();
  const { flowPosition } = state;
  if (!flowPosition) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
    />
  );
}

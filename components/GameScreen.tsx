"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useHaptics } from "@/hooks/useHaptics";
import { GameGrid } from "./GameGrid";
import { GameHUD } from "./GameHUD";
import { PipeQueue } from "./PipeQueue";
import { GameOverScreen } from "./GameOverScreen";
import { LevelComplete } from "./LevelComplete";
import { AnimatePresence } from "framer-motion";

export function GameScreen() {
  const { state, dispatch } = useGame();
  const haptics = useHaptics();
  const prevPhase = useRef(state.phase);

  const onFlowTick = () => {
    dispatch({ type: "FLOW_TICK" });
  };

  useEffect(() => {
    if (state.phase === "placing" && state.timer <= 0) {
      dispatch({ type: "START_FLOW" });
    }
  }, [state.phase, state.timer, dispatch]);

  useEffect(() => {
    if (state.phase !== "placing") return;
    const t = setInterval(() => dispatch({ type: "TIMER_TICK" }), 1000);
    return () => clearInterval(t);
  }, [state.phase, dispatch]);

  useGameLoop(state.phase, state.flowSpeedMs, onFlowTick);

  useEffect(() => {
    if (prevPhase.current !== "gameover" && state.phase === "gameover") {
      haptics.onGameOver();
    }
    prevPhase.current = state.phase;
  }, [state.phase, haptics]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="relative">
        <GameHUD />
      </div>
      <main className="flex-1 flex items-center justify-center overflow-auto py-4">
        <GameGrid />
      </main>
      <PipeQueue />
      <AnimatePresence mode="wait">
        {state.phase === "gameover" && <GameOverScreen key="gameover" />}
        {state.phase === "levelcomplete" && (
          <LevelComplete key="levelcomplete" />
        )}
      </AnimatePresence>
    </div>
  );
}

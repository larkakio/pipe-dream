"use client";

import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { ShareButton } from "./ShareButton";

export function GameOverScreen() {
  const { state, dispatch } = useGame();
  const { score, pipesFlowed, minRequired } = state;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/95 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center max-w-sm"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <h2 className="text-2xl font-bold text-[var(--danger)] mb-2">
          Game Over
        </h2>
        <p className="text-[var(--text-primary)] mb-1">
          Pipes: {pipesFlowed} / {minRequired}
        </p>
        <p className="text-xl font-mono text-[var(--accent-gold)] mb-6">
          Score: {score}
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "RESTART" })}
            className="px-6 py-3 rounded-lg font-medium bg-[var(--accent-cyan)] text-[var(--bg-primary)]"
          >
            Play Again
          </button>
          <ShareButton score={score} />
        </div>
      </motion.div>
    </motion.div>
  );
}

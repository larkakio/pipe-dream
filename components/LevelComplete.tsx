"use client";

import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";

export function LevelComplete() {
  const { state, dispatch } = useGame();
  const { score, level } = state;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-primary)]/95 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center max-w-sm"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <h2 className="text-2xl font-bold text-[var(--accent-neon)] mb-2">
          Level {level} Complete!
        </h2>
        <p className="text-xl font-mono text-[var(--accent-gold)] mb-6">
          Score: {score}
        </p>
        <button
          type="button"
          onClick={() => dispatch({ type: "NEXT_LEVEL" })}
          className="px-6 py-3 rounded-lg font-medium bg-[var(--accent-cyan)] text-[var(--bg-primary)]"
        >
          Next Level
        </button>
      </motion.div>
    </motion.div>
  );
}

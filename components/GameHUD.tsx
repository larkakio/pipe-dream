"use client";

import { useGame } from "@/context/GameContext";

export function GameHUD() {
  const { state } = useGame();
  const { score, level, lives, timer, phase, startDelaySec } = state;
  const maxTimer = phase === "placing" ? startDelaySec : 0;
  const timerPercent = maxTimer > 0 ? (timer / maxTimer) * 100 : 0;

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-secondary)] border-b border-[var(--accent-cyan)]/30">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-[var(--accent-gold)] tabular-nums">
          {score}
        </span>
        <span className="text-xs text-[var(--text-muted)]">LVL {level}</span>
      </div>
      <div className="flex items-center gap-2">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="text-lg opacity-100"
            style={{
              opacity: i < lives ? 1 : 0.2,
            }}
            aria-hidden
          >
            🔧
          </span>
        ))}
      </div>
      {phase === "placing" && (
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-[var(--bg-primary)]">
          <div
            className="h-full bg-[var(--accent-cyan)] transition-all duration-1000 linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor:
                timerPercent < 30 ? "var(--danger)" : "var(--accent-cyan)",
            }}
          />
        </div>
      )}
    </div>
  );
}

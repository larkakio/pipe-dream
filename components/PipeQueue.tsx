"use client";

import { useGame } from "@/context/GameContext";
import { PipeCell } from "./PipeCell";
import type { Cell } from "@/types/game";

const PIPE_LABELS: Record<string, string> = {
  straight_h: "—",
  straight_v: "|",
  corner_ne: "⌐",
  corner_nw: "⌙",
  corner_se: "⌞",
  corner_sw: "⌟",
  cross: "+",
  reservoir: "◉",
  one_way_r: "→",
  one_way_l: "←",
  one_way_u: "↑",
  one_way_d: "↓",
};

function QueueCell({ pipe }: { pipe: string }) {
  const cell: Cell = {
    pipe: pipe as Cell["pipe"],
    filled: false,
    blocked: false,
    fillProgress: 0,
    entryDir: null,
    exitDir: null,
  };
  return (
    <div className="flex flex-col items-center">
      <PipeCell cell={cell} selected={false} size={36} />
      <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
        {PIPE_LABELS[pipe] ?? "?"}
      </span>
    </div>
  );
}

export function PipeQueue() {
  const { state, skipPiece } = useGame();
  const { queue, phase } = state;

  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[var(--bg-secondary)] border-t border-[var(--accent-cyan)]/30">
      <span className="text-xs text-[var(--text-muted)] mr-1">Next:</span>
      <div className="flex gap-1">
        {queue.slice(0, 5).map((pipe, i) => (
          <QueueCell key={i} pipe={pipe} />
        ))}
      </div>
      {phase === "placing" && (
        <button
          type="button"
          onClick={skipPiece}
          className="ml-2 px-2 py-1 text-xs font-medium text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/50 rounded"
        >
          Skip
        </button>
      )}
    </div>
  );
}

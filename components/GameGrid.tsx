"use client";

import { useRef, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { PipeCell } from "./PipeCell";

export function GameGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { state, moveCursor, placePipe } = useGame();
  const { grid, selectedCell } = state;

  const getCellFromPoint = useCallback(
    (clientX: number, clientY: number): { row: number; col: number } | null => {
      const el = gridRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const rows = grid.length;
      const cols = grid[0].length;
      const cellW = rect.width / cols;
      const cellH = rect.height / rows;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      if (row >= 0 && row < rows && col >= 0 && col < cols) return { row, col };
      return null;
    },
    [grid]
  );

  const { handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp } =
    useSwipeGesture(gridRef, getCellFromPoint, {
      onSwipe: moveCursor,
      onTap: placePipe,
    });

  const rows = grid.length;
  const cols = grid[0].length;
  const cellSize = Math.min(
    typeof window !== "undefined" ? (window.innerWidth - 24) / cols : 40,
    52
  );

  return (
    <div
      ref={gridRef}
      className="grid gap-0.5 p-2 select-none touch-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        width: cols * cellSize + 16,
        maxWidth: "100%",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {grid.map((row, ri) =>
        row.map((cell, ci) => (
          <PipeCell
            key={`${ri}-${ci}`}
            cell={cell}
            selected={
              state.phase === "placing" &&
              selectedCell.row === ri &&
              selectedCell.col === ci
            }
            size={cellSize}
          />
        ))
      )}
    </div>
  );
}

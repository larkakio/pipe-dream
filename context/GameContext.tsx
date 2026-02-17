"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import type { GameState, PipeType, Direction } from "@/types/game";
import {
  initGameState,
  getNextFlowPosition,
} from "@/lib/gridEngine";
import { getLevelConfig } from "@/lib/levelConfig";
import { popNextPipe } from "@/lib/pipeQueue";
import { getExitDir } from "@/lib/pipeTypes";
import {
  getPipeScore,
  REPLACEMENT_PENALTY,
  UNUSED_PIPE_PENALTY,
  PER_SECOND_BONUS,
} from "@/lib/scoring";

type Action =
  | { type: "INIT"; level: number }
  | { type: "MOVE_CURSOR"; row: number; col: number }
  | { type: "PLACE_PIPE"; row: number; col: number }
  | { type: "REPLACE_PIPE"; row: number; col: number }
  | { type: "SKIP_PIECE" }
  | { type: "TIMER_TICK" }
  | { type: "START_FLOW" }
  | { type: "FLOW_TICK" }
  | { type: "GAME_OVER" }
  | { type: "LEVEL_COMPLETE" }
  | { type: "RESTART" }
  | { type: "NEXT_LEVEL" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "INIT": {
      return initGameState(action.level);
    }

    case "MOVE_CURSOR": {
      const { row, col } = action;
      if (
        row < 0 ||
        row >= state.grid.length ||
        col < 0 ||
        col >= state.grid[0].length
      )
        return state;
      if (state.grid[row][col].blocked) return state;
      return { ...state, selectedCell: { row, col } };
    }

    case "PLACE_PIPE": {
      const { row, col } = action;
      const cell = state.grid[row]?.[col];
      if (!cell || cell.blocked || state.phase !== "placing") return state;
      if (cell.pipe && cell.pipe !== "start") return state;
      const pipe = state.queue[0];
      if (!pipe || pipe === "start") return state;

      const newGrid = state.grid.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col
            ? { ...c, pipe }
            : c
        )
      );
      const newQueue = popNextPipe(state.queue, getLevelConfig(state.level));

      return {
        ...state,
        grid: newGrid,
        queue: newQueue,
      };
    }

    case "REPLACE_PIPE": {
      const { row, col } = action;
      const cell = state.grid[row]?.[col];
      if (!cell || cell.blocked || cell.filled || cell.pipe === "start")
        return state;
      if (state.phase !== "placing") return state;
      const pipe = state.queue[0];
      if (!pipe) return state;

      const newGrid = state.grid.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col ? { ...c, pipe: pipe } : c
        )
      );
      const newQueue = popNextPipe(state.queue, getLevelConfig(state.level));
      return {
        ...state,
        grid: newGrid,
        queue: newQueue,
        score: Math.max(0, state.score - REPLACEMENT_PENALTY),
      };
    }

    case "SKIP_PIECE": {
      if (state.phase !== "placing" || state.queue.length === 0) return state;
      const newQueue = popNextPipe(state.queue, getLevelConfig(state.level));
      return {
        ...state,
        queue: newQueue,
        score: Math.max(0, state.score - REPLACEMENT_PENALTY),
      };
    }

    case "TIMER_TICK": {
      if (state.phase !== "placing" || state.timer <= 0) return state;
      const next = state.timer - 1;
      if (next <= 0) {
        return { ...state, timer: 0 };
      }
      return { ...state, timer: next };
    }

    case "START_FLOW": {
      if (!state.startCell || !state.startDirection) return state;
      return {
        ...state,
        phase: "flowing",
        flowPosition: { ...state.startCell },
        flowDirection: state.startDirection,
        timer: 0,
      };
    }

    case "FLOW_TICK": {
      if (state.phase !== "flowing" || !state.flowPosition || !state.flowDirection)
        return state;

      const { row, col } = state.flowPosition;
      const dir = state.flowDirection;
      const next = getNextFlowPosition(
        state.grid,
        row,
        col,
        dir,
        state.wrapAround
      );

      if (!next) {
        const minMet = state.pipesFlowed >= state.minRequired;
        if (minMet) return { ...state, phase: "levelcomplete" };
        const newLives = Math.max(0, state.lives - 1);
        return { ...state, phase: "gameover", lives: newLives };
      }

      const cell = state.grid[next.row][next.col];
      const exitDir = getExitDir(cell.pipe!, OPPOSITE[dir]);
      const pipeScore = getPipeScore(cell.pipe!);

      const newGrid = state.grid.map((r, ri) =>
        r.map((c, ci) => {
          if (ri === next.row && ci === next.col) {
            return {
              ...c,
              filled: true,
              fillProgress: 1,
              entryDir: OPPOSITE[dir] as Direction,
              exitDir,
            };
          }
          return c;
        })
      );

      const pipesFlowed = state.pipesFlowed + 1;
      const newScore = state.score + pipeScore;

      return {
        ...state,
        grid: newGrid,
        flowPosition: { row: next.row, col: next.col },
        flowDirection: next.dir,
        score: newScore,
        pipesFlowed,
      };
    }

    case "GAME_OVER":
      return { ...state, phase: "gameover" };

    case "LEVEL_COMPLETE":
      return { ...state, phase: "levelcomplete" };

    case "RESTART":
      return initGameState(1);

    case "NEXT_LEVEL":
      return initGameState(state.level + 1);

    default:
      return state;
  }
}

const OPPOSITE: Record<Direction, Direction> = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
};

const initialState: GameState = initGameState(1);

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
  moveCursor: (dir: "up" | "down" | "left" | "right") => void;
  placePipe: (row: number, col: number) => void;
  replacePipe: (row: number, col: number) => void;
  skipPiece: () => void;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const moveCursor = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      const { row, col } = state.selectedCell;
      const rows = state.grid.length;
      const cols = state.grid[0].length;
      let nr = row;
      let nc = col;
      if (dir === "up") nr--;
      if (dir === "down") nr++;
      if (dir === "left") nc--;
      if (dir === "right") nc++;
      nr = Math.max(0, Math.min(rows - 1, nr));
      nc = Math.max(0, Math.min(cols - 1, nc));
      if (!state.grid[nr][nc].blocked) dispatch({ type: "MOVE_CURSOR", row: nr, col: nc });
    },
    [state.selectedCell, state.grid]
  );

  const placePipe = useCallback((row: number, col: number) => {
    dispatch({ type: "PLACE_PIPE", row, col });
  }, []);

  const replacePipe = useCallback((row: number, col: number) => {
    dispatch({ type: "REPLACE_PIPE", row, col });
  }, []);

  const skipPiece = useCallback(() => {
    dispatch({ type: "SKIP_PIECE" });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        moveCursor,
        placePipe,
        replacePipe,
        skipPiece,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

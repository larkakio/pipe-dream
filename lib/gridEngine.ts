import type { Cell, Direction, GameState } from "@/types/game";
import { canFlowInto, getExitDir, OPPOSITE } from "./pipeTypes";
import { getLevelConfig } from "./levelConfig";
import { generatePipeQueue } from "./pipeQueue";

function createEmptyCell(): Cell {
  return {
    pipe: null,
    filled: false,
    blocked: false,
    fillProgress: 0,
    entryDir: null,
    exitDir: null,
  };
}

function createBlockedCell(): Cell {
  return {
    ...createEmptyCell(),
    pipe: "blocked",
    blocked: true,
  };
}

export function createEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createEmptyCell())
  );
}

export function placeObstacles(
  grid: Cell[][],
  count: number,
  exclude: { row: number; col: number }
): Cell[][] {
  const next = grid.map((r) => r.map((c) => ({ ...c })));
  const rows = next.length;
  const cols = next[0].length;
  const candidates: { row: number; col: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === exclude.row && c === exclude.col) continue;
      if (next[r][c].blocked) continue;
      candidates.push({ row: r, col: c });
    }
  }
  for (let i = 0; i < count && candidates.length > 0; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    const { row, col } = candidates[idx];
    next[row][col] = createBlockedCell();
    candidates.splice(idx, 1);
  }
  return next;
}

export function placeStart(grid: Cell[][]): {
  grid: Cell[][];
  startCell: { row: number; col: number };
  startDirection: Direction;
} {
  const next = grid.map((r) => r.map((c) => ({ ...c })));
  const rows = next.length;
  const cols = next[0].length;
  const innerRows = rows - 2;
  const innerCols = cols - 2;
  const r = 1 + Math.floor(Math.random() * innerRows);
  const c = 1 + Math.floor(Math.random() * innerCols);
  next[r][c] = {
    ...createEmptyCell(),
    pipe: "start",
    entryDir: null,
    exitDir: "S",
  };
  return {
    grid: next,
    startCell: { row: r, col: c },
    startDirection: "S",
  };
}

export function getNextFlowPosition(
  grid: Cell[][],
  row: number,
  col: number,
  dir: Direction,
  wrapAround: boolean
): { row: number; col: number; dir: Direction } | null {
  const rows = grid.length;
  const cols = grid[0].length;
  let nr = row;
  let nc = col;
  if (dir === "N") nr--;
  if (dir === "S") nr++;
  if (dir === "E") nc++;
  if (dir === "W") nc--;

  if (wrapAround) {
    if (nr < 0) nr = rows - 1;
    if (nr >= rows) nr = 0;
    if (nc < 0) nc = cols - 1;
    if (nc >= cols) nc = 0;
  } else {
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return null;
  }

  const cell = grid[nr][nc];
  if (cell.blocked || !cell.pipe) return null;
  if (cell.pipe === "start") return null;
  if (!canFlowInto(cell.pipe, OPPOSITE[dir])) return null;
  const exitDir = getExitDir(cell.pipe, OPPOSITE[dir]);
  if (!exitDir) return null;
  return { row: nr, col: nc, dir: exitDir };
}

export function initGameState(level: number): GameState {
  const config = getLevelConfig(level);
  let grid = createEmptyGrid(config.rows, config.cols);
  const { grid: gridWithStart, startCell, startDirection } = placeStart(grid);
  grid = placeObstacles(gridWithStart, config.obstacles, startCell);
  const queue = generatePipeQueue(config, 5);

  return {
    grid,
    queue,
    level,
    score: 0,
    lives: 3,
    phase: "placing",
    flowPosition: null,
    flowDirection: null,
    timer: config.startDelaySec,
    pipesFlowed: 0,
    minRequired: config.minPipes,
    selectedCell: { ...startCell },
    startCell,
    startDirection,
    wrapAround: config.wrapAround,
    flowSpeedMs: config.flowSpeedMs,
    startDelaySec: config.startDelaySec,
  };
}

export type PipeType =
  | "straight_h"
  | "straight_v"
  | "corner_ne"
  | "corner_nw"
  | "corner_se"
  | "corner_sw"
  | "cross"
  | "reservoir"
  | "one_way_r"
  | "one_way_l"
  | "one_way_u"
  | "one_way_d"
  | "start"
  | "end"
  | "blocked";

export type Direction = "N" | "S" | "E" | "W";

export interface PipeConnections {
  N: boolean;
  S: boolean;
  E: boolean;
  W: boolean;
}

export interface Cell {
  pipe: PipeType | null;
  filled: boolean;
  blocked: boolean;
  fillProgress: number;
  entryDir: Direction | null;
  exitDir: Direction | null;
}

export interface GameState {
  grid: Cell[][];
  queue: PipeType[];
  level: number;
  score: number;
  lives: number;
  phase: "placing" | "flowing" | "gameover" | "levelcomplete" | "bonus";
  flowPosition: { row: number; col: number } | null;
  flowDirection: Direction | null;
  timer: number;
  pipesFlowed: number;
  minRequired: number;
  selectedCell: { row: number; col: number };
  startCell: { row: number; col: number } | null;
  startDirection: Direction | null;
  wrapAround: boolean;
  flowSpeedMs: number;
  startDelaySec: number;
}

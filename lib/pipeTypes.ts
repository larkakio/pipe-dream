import type { PipeType, PipeConnections, Direction } from "@/types/game";

export const PIPE_CONNECTIONS: Record<PipeType, PipeConnections> = {
  straight_h: { N: false, S: false, E: true, W: true },
  straight_v: { N: true, S: true, E: false, W: false },
  corner_ne: { N: true, S: false, E: true, W: false },
  corner_nw: { N: true, S: false, E: false, W: true },
  corner_se: { N: false, S: true, E: true, W: false },
  corner_sw: { N: false, S: true, E: false, W: true },
  cross: { N: true, S: true, E: true, W: true },
  reservoir: { N: true, S: true, E: true, W: true },
  one_way_r: { N: false, S: false, E: true, W: true },
  one_way_l: { N: false, S: false, E: true, W: true },
  one_way_u: { N: true, S: true, E: false, W: false },
  one_way_d: { N: true, S: true, E: false, W: false },
  start: { N: false, S: true, E: false, W: false },
  end: { N: false, S: false, E: false, W: false },
  blocked: { N: false, S: false, E: false, W: false },
};

export const OPPOSITE: Record<Direction, Direction> = {
  N: "S",
  S: "N",
  E: "W",
  W: "E",
};

export function canFlowInto(pipe: PipeType, fromDir: Direction): boolean {
  return PIPE_CONNECTIONS[pipe][OPPOSITE[fromDir]];
}

export function getExitDir(
  pipe: PipeType,
  entryDir: Direction
): Direction | null {
  const opp = OPPOSITE[entryDir];
  const conns = PIPE_CONNECTIONS[pipe];
  const exits = (Object.keys(conns) as Direction[]).filter(
    (d) => conns[d] && d !== opp
  );
  return exits[0] ?? null;
}

export const PLACEABLE_PIPE_TYPES: PipeType[] = [
  "straight_h",
  "straight_v",
  "corner_ne",
  "corner_nw",
  "corner_se",
  "corner_sw",
  "cross",
  "reservoir",
  "one_way_r",
  "one_way_l",
  "one_way_u",
  "one_way_d",
];

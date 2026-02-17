import type { PipeType } from "@/types/game";
import type { LevelConfig } from "./levelConfig";

const WEIGHTS: Record<string, number> = {
  straight_h: 3,
  straight_v: 3,
  corner_ne: 1,
  corner_nw: 1,
  corner_se: 1,
  corner_sw: 1,
  cross: 0.5,
  reservoir: 0.3,
  one_way_r: 0.4,
  one_way_l: 0.4,
  one_way_u: 0.4,
  one_way_d: 0.4,
};

export function getWeightedPipeTypes(config: LevelConfig): PipeType[] {
  const types: PipeType[] = [
    "straight_h",
    "straight_v",
    "corner_ne",
    "corner_nw",
    "corner_se",
    "corner_sw",
    "cross",
  ];
  if (config.hasReservoir) types.push("reservoir");
  if (config.hasOneWay) {
    types.push("one_way_r", "one_way_l", "one_way_u", "one_way_d");
  }
  return types;
}

export function generatePipeQueue(
  config: LevelConfig,
  count: number = 5
): PipeType[] {
  const allowed = getWeightedPipeTypes(config);
  const weights = allowed.map((t) => WEIGHTS[t] ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const queue: PipeType[] = [];
  for (let i = 0; i < count; i++) {
    let r = Math.random() * total;
    for (let j = 0; j < allowed.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        queue.push(allowed[j]);
        break;
      }
    }
    if (r > 0) queue.push(allowed[allowed.length - 1]);
  }
  return queue;
}

export function popNextPipe(queue: PipeType[], config: LevelConfig): PipeType[] {
  const [, ...rest] = queue;
  const next = generatePipeQueue(config, 1)[0];
  return [...rest, next];
}

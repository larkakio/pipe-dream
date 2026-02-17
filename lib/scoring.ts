import type { PipeType } from "@/types/game";

export const PIPE_SCORE = 50;
export const RESERVOIR_SCORE = 200;
export const ONE_WAY_SCORE = 100;
export const LOOP_BONUS_PER_LEVEL = 100;
export const REPLACEMENT_PENALTY = 50;
export const UNUSED_PIPE_PENALTY = 100;
export const PER_SECOND_BONUS = 100;
export const ALL_CELLS_BONUS = 5000;

export function getPipeScore(pipe: PipeType): number {
  if (pipe === "reservoir") return RESERVOIR_SCORE;
  if (
    pipe === "one_way_r" ||
    pipe === "one_way_l" ||
    pipe === "one_way_u" ||
    pipe === "one_way_d"
  )
    return ONE_WAY_SCORE;
  return PIPE_SCORE;
}

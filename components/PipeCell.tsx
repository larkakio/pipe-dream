"use client";

import { motion } from "framer-motion";
import type { Cell as CellType, PipeType } from "@/types/game";

const PIPE_COLOR = "#00d4ff";
const FILL_COLOR = "#39ff14";
const BLOCKED_COLOR = "#333";

function PipeSVG({
  pipe,
  filled,
  fillProgress,
  selected,
}: {
  pipe: PipeType;
  filled: boolean;
  fillProgress: number;
  selected: boolean;
}) {
  const stroke = selected ? "#ffd700" : filled ? FILL_COLOR : PIPE_COLOR;
  const strokeWidth = selected ? 2 : 1;

  if (pipe === "blocked") {
    return (
      <rect
        width="100%"
        height="100%"
        fill={BLOCKED_COLOR}
        rx={2}
      />
    );
  }

  if (pipe === "start") {
    return (
      <g>
        <rect width="100%" height="100%" fill="transparent" />
        <circle cx="50%" cy="50%" r="35%" fill={PIPE_COLOR} opacity={0.8} />
        <path
          d="M 50 50 L 50 10"
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          transform="translate(0,0) scale(0.4) translate(25,25)"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    );
  }

  const w = 100;
  const h = 100;
  const cx = w / 2;
  const cy = h / 2;
  const r = 35;

  const paths: Record<string, string> = {
    straight_h: `M ${cx - r} ${cy} L ${cx + r} ${cy}`,
    straight_v: `M ${cx} ${cy - r} L ${cx} ${cy + r}`,
    corner_ne: `M ${cx} ${cy - r} L ${cx} ${cy} L ${cx + r} ${cy}`,
    corner_nw: `M ${cx} ${cy - r} L ${cx} ${cy} L ${cx - r} ${cy}`,
    corner_se: `M ${cx} ${cy + r} L ${cx} ${cy} L ${cx + r} ${cy}`,
    corner_sw: `M ${cx} ${cy + r} L ${cx} ${cy} L ${cx - r} ${cy}`,
    cross: `M ${cx} ${cy - r} L ${cx} ${cy + r} M ${cx - r} ${cy} L ${cx + r} ${cy}`,
    reservoir: `M ${cx} ${cy - r} L ${cx} ${cy + r} M ${cx - r} ${cy} L ${cx + r} ${cy} M ${cx - r*0.5} ${cy - r*0.5} L ${cx + r*0.5} ${cy + r*0.5} M ${cx + r*0.5} ${cy - r*0.5} L ${cx - r*0.5} ${cy + r*0.5}`,
    one_way_r: `M ${cx - r} ${cy} L ${cx + r} ${cy} M ${cx + r*0.5} ${cy - 15} L ${cx + r} ${cy} L ${cx + r*0.5} ${cy + 15}`,
    one_way_l: `M ${cx + r} ${cy} L ${cx - r} ${cy} M ${cx - r*0.5} ${cy - 15} L ${cx - r} ${cy} L ${cx - r*0.5} ${cy + 15}`,
    one_way_u: `M ${cx} ${cy + r} L ${cx} ${cy - r} M ${cx - 15} ${cy - r*0.5} L ${cx} ${cy - r} L ${cx + 15} ${cy - r*0.5}`,
    one_way_d: `M ${cx} ${cy - r} L ${cx} ${cy + r} M ${cx - 15} ${cy + r*0.5} L ${cx} ${cy + r} L ${cx + 15} ${cy + r*0.5}`,
  };

  const d = paths[pipe] ?? paths.straight_h;

  return (
    <g>
      <rect width="100%" height="100%" fill="transparent" />
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        initial={{ pathLength: 0, opacity: 0.6 }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{ duration: 0.15 }}
        style={{ transform: "scale(0.4)", transformOrigin: "center" }}
        vectorEffect="non-scaling-stroke"
      />
      {filled && (
        <motion.path
          d={d}
          stroke={FILL_COLOR}
          strokeWidth={strokeWidth + 2}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: fillProgress }}
          transition={{ duration: 0.2 }}
          style={{
            transform: "scale(0.4)",
            transformOrigin: "center",
            filter: "drop-shadow(0 0 4px #39ff14)",
          }}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  );
}

export function PipeCell({
  cell,
  selected,
  size,
}: {
  cell: CellType;
  selected: boolean;
  size: number;
}) {
  const { pipe, filled, fillProgress, blocked } = cell;

  return (
    <motion.div
      className="rounded-sm flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        backgroundColor: blocked ? "#1a1a2e" : "#0d1825",
        border: `1px solid ${selected ? "#ffd700" : "#1a2744"}`,
        boxShadow: selected ? "0 0 12px rgba(255,215,0,0.5)" : undefined,
      }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {pipe && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          <PipeSVG
            pipe={pipe}
            filled={filled}
            fillProgress={fillProgress}
            selected={selected}
          />
        </svg>
      )}
    </motion.div>
  );
}

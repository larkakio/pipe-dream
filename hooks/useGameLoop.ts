"use client";

import { useEffect, useRef } from "react";

export function useGameLoop(
  phase: string,
  flowSpeedMs: number,
  onTick: () => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "flowing") return;
    intervalRef.current = setInterval(onTick, flowSpeedMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [phase, flowSpeedMs, onTick]);
}

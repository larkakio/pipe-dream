import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onSwipe: (dir: "up" | "down" | "left" | "right") => void;
  onTap: (row: number, col: number) => void;
}

const MIN_SWIPE = 30;

export function useSwipeGesture(
  gridRef: React.RefObject<HTMLDivElement | null>,
  getCellFromPoint: (clientX: number, clientY: number) => { row: number; col: number } | null,
  handlers: SwipeHandlers
) {
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      startPos.current = { x: t.clientX, y: t.clientY };
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!startPos.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startPos.current.x;
      const dy = t.clientY - startPos.current.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (Math.max(adx, ady) < MIN_SWIPE) {
        const cell = getCellFromPoint(t.clientX, t.clientY);
        if (cell) handlers.onTap(cell.row, cell.col);
      } else {
        if (adx > ady) handlers.onSwipe(dx > 0 ? "right" : "left");
        else handlers.onSwipe(dy > 0 ? "down" : "up");
      }
      startPos.current = null;
    },
    [getCellFromPoint, handlers]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startPos.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!startPos.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (Math.max(adx, ady) < MIN_SWIPE) {
        const cell = getCellFromPoint(e.clientX, e.clientY);
        if (cell) handlers.onTap(cell.row, cell.col);
      } else {
        if (adx > ady) handlers.onSwipe(dx > 0 ? "right" : "left");
        else handlers.onSwipe(dy > 0 ? "down" : "up");
      }
      startPos.current = null;
    },
    [getCellFromPoint, handlers]
  );

  return {
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  };
}

export function useHaptics() {
  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const onPlace = () => vibrate(10);
  const onGameOver = () => vibrate(50);
  const onLoopBonus = () => vibrate([10, 50, 10]);

  return { vibrate, onPlace, onGameOver, onLoopBonus };
}

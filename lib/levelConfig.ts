export interface LevelConfig {
  rows: number;
  cols: number;
  minPipes: number;
  startDelaySec: number;
  flowSpeedMs: number;
  obstacles: number;
  wrapAround: boolean;
  hasReservoir: boolean;
  hasOneWay: boolean;
  hasCross: boolean;
}

export function getLevelConfig(level: number): LevelConfig {
  if (level <= 3) {
    return {
      rows: 7,
      cols: 9,
      minPipes: 10,
      startDelaySec: 8,
      flowSpeedMs: 400,
      obstacles: 0,
      wrapAround: false,
      hasReservoir: false,
      hasOneWay: false,
      hasCross: true,
    };
  }
  if (level <= 6) {
    return {
      rows: 7,
      cols: 9,
      minPipes: 14,
      startDelaySec: 6,
      flowSpeedMs: 320,
      obstacles: 2 + Math.min(2, level - 4),
      wrapAround: false,
      hasReservoir: true,
      hasOneWay: false,
      hasCross: true,
    };
  }
  if (level <= 9) {
    return {
      rows: 7,
      cols: 9,
      minPipes: 18,
      startDelaySec: 5,
      flowSpeedMs: 280,
      obstacles: 4,
      wrapAround: true,
      hasReservoir: true,
      hasOneWay: true,
      hasCross: true,
    };
  }
  if (level <= 12) {
    return {
      rows: 7,
      cols: 9,
      minPipes: 22,
      startDelaySec: 4,
      flowSpeedMs: 240,
      obstacles: 4,
      wrapAround: true,
      hasReservoir: true,
      hasOneWay: true,
      hasCross: true,
    };
  }
  if (level <= 16) {
    return {
      rows: 8,
      cols: 10,
      minPipes: 26,
      startDelaySec: 3,
      flowSpeedMs: 200,
      obstacles: 5,
      wrapAround: true,
      hasReservoir: true,
      hasOneWay: true,
      hasCross: true,
    };
  }
  return {
    rows: 8,
    cols: 10,
    minPipes: 30 + (level - 17) * 2,
    startDelaySec: 2.5,
    flowSpeedMs: 180,
    obstacles: 6,
    wrapAround: true,
    hasReservoir: true,
    hasOneWay: true,
    hasCross: true,
  };
}

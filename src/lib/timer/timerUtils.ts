export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function convertMinutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function calculateWarningThresholds(totalSeconds: number): {
  halfTime: number;
  tenMinutes: number;
  fiveMinutes: number;
  oneMinute: number;
} {
  return {
    halfTime: Math.floor(totalSeconds / 2),
    tenMinutes: 10 * 60, // 600 seconds
    fiveMinutes: 5 * 60, // 300 seconds
    oneMinute: 1 * 60, // 60 seconds
  };
}

export function checkWarningThresholds(
  timeRemaining: number,
  totalTime: number,
  warningsShown: {
    halfTime: boolean;
    tenMinutes: boolean;
    fiveMinutes: boolean;
    oneMinute: boolean;
  }
): {
  warning: 'halfTime' | 'tenMinutes' | 'fiveMinutes' | 'oneMinute' | null;
  message: string;
} | null {
  const thresholds = calculateWarningThresholds(totalTime);
  
  // Check half time
  if (timeRemaining <= thresholds.halfTime && !warningsShown.halfTime) {
    return { warning: 'halfTime', message: 'timer.halfTime' };
  }
  
  // Check 10 minutes
  if (timeRemaining <= thresholds.tenMinutes && !warningsShown.tenMinutes) {
    return { warning: 'tenMinutes', message: 'timer.tenMinutes' };
  }
  
  // Check 5 minutes
  if (timeRemaining <= thresholds.fiveMinutes && !warningsShown.fiveMinutes) {
    return { warning: 'fiveMinutes', message: 'timer.fiveMinutes' };
  }
  
  // Check 1 minute
  if (timeRemaining <= thresholds.oneMinute && !warningsShown.oneMinute) {
    return { warning: 'oneMinute', message: 'timer.oneMinute' };
  }
  
  return null;
}


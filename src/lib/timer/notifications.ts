import { audioManager } from '../audio/audioManager';

export type WarningType = 'halfTime' | 'tenMinutes' | 'fiveMinutes' | 'oneMinute' | 'roundOver';

export interface WarningNotification {
  type: WarningType;
  message: string;
  timeRemaining?: number;
}

export function triggerWarning(warning: WarningNotification): void {
  // Play audio
  if (warning.type === 'roundOver') {
    audioManager.playSound('roundEnd', 0.7);
  } else {
    audioManager.playSound('warning', 0.5);
  }
  
  // Visual notification will be handled by the TimerWarningModal component
  // This function can be extended to dispatch custom events if needed
}

export function triggerRoundEnd(): void {
  audioManager.playSound('roundEnd', 0.7);
}


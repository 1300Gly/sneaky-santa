export type RuleMode = 'peaceful' | 'traditional' | 'chaos' | 'adult';

export interface RoundSettings {
  timeLimit: number; // in minutes, 0 = no limit (Round 1)
  timeLimitEnabled: boolean;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  round: 1 | 2 | 3;
  startTime?: number; // timestamp when timer started
  pauseTime?: number; // timestamp when timer was paused
  totalTime: number; // total time in seconds when timer started
  warningsShown: {
    halfTime: boolean;
    tenMinutes: boolean;
    fiveMinutes: boolean;
    oneMinute: boolean;
  };
}

export interface Settings {
  audioEnabled: boolean;
  digitalDiceEnabled: boolean;
  language: 'nl' | 'en';
}


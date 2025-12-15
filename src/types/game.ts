import type { RuleMode, RoundSettings, TimerState } from './settings';
import type { CardDeckState } from './cards';

export type RoundStatus = 'setup' | 'explanation' | 'countdown' | 'playing' | 'paused' | 'finished';

export interface GameEvent {
  type: string;
  timestamp: number;
  data?: unknown;
}

export interface GameState {
  currentRound: 1 | 2 | 3;
  roundStatus: RoundStatus;
  ruleMode: RuleMode;
  roundSettings: {
    round1: RoundSettings;
    round2: RoundSettings;
    round3: RoundSettings;
  };
  timer: TimerState;
  cardDeck: CardDeckState;
  gameHistory: GameEvent[];
  players: import('./cards').Player[];
  audioEnabled: boolean;
}


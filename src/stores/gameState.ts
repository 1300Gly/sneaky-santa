import { writable } from 'svelte/store';
import type { GameState, RoundStatus } from '../types';
import type { RuleMode, RoundSettings } from '../types';

const defaultGameState: GameState = {
  currentRound: 1,
  roundStatus: 'setup',
  ruleMode: 'traditional',
  roundSettings: {
    round1: { timeLimit: 0, timeLimitEnabled: false },
    round2: { timeLimit: 30, timeLimitEnabled: true },
    round3: { timeLimit: 30, timeLimitEnabled: true },
  },
  timer: {
    isRunning: false,
    isPaused: false,
    timeRemaining: 0,
    round: 1,
    totalTime: 0,
    warningsShown: {
      halfTime: false,
      tenMinutes: false,
      fiveMinutes: false,
      oneMinute: false,
    },
  },
  cardDeck: {
    available: [],
    drawn: [],
    players: [],
    currentCard: undefined,
  },
  gameHistory: [],
  players: [],
  audioEnabled: true,
};

function createGameStateStore() {
  const { subscribe, set, update } = writable<GameState>(defaultGameState);

  return {
    subscribe,
    set,
    update,
    initializeGame: (settings: Partial<GameState>) => {
      set({
        ...defaultGameState,
        ...settings,
        roundStatus: 'explanation',
      });
    },
    updateRound: (round: 1 | 2 | 3) => {
      update((state) => ({
        ...state,
        currentRound: round,
        roundStatus: 'explanation',
      }));
    },
    updateRoundStatus: (status: RoundStatus) => {
      update((state) => ({ ...state, roundStatus: status }));
    },
    setRuleMode: (mode: RuleMode) => {
      update((state) => ({ ...state, ruleMode: mode }));
    },
    updateRoundSettings: (round: 1 | 2 | 3, newSettings: Partial<RoundSettings>) => {
      update((state) => {
        const roundKey = `round${round}` as 'round1' | 'round2' | 'round3';
        return {
          ...state,
          roundSettings: {
            ...state.roundSettings,
            [roundKey]: { ...state.roundSettings[roundKey], ...newSettings },
          },
        };
      });
    },
    addPlayer: (playerName: string) => {
      update((state) => {
        const existingPlayer = state.players.find((p) => p.name === playerName);
        if (!existingPlayer) {
          return {
            ...state,
            players: [...state.players, { name: playerName, savedCards: [] }],
          };
        }
        return state;
      });
    },
    addGameEvent: (type: string, data?: unknown) => {
      update((state) => ({
        ...state,
        gameHistory: [
          ...state.gameHistory,
          { type, timestamp: Date.now(), data },
        ],
      }));
    },
    reset: () => set(defaultGameState),
  };
}

export const gameState = createGameStateStore();


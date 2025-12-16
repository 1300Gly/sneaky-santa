import { get } from 'svelte/store';
import { gameState } from '../../stores/gameState';
import { settings } from '../../stores/settings';
import { timer } from '../../stores/timer';
import { cardDeck } from '../../stores/cards';
import type { GameState } from '../../types';
import type { Settings } from '../../types';
import { saveGameState, loadGameState, saveSettings, loadSettings } from './storage';

// List of all localStorage keys used in the application
export const LOCAL_STORAGE_KEYS = {
  GAME_STATE: 'pass-the-present:game-state',
  SETTINGS: 'pass-the-present:settings',
  STATE_VERSION: 'pass-the-present:state-version',
  LANGUAGE: 'pass-the-present:language',
} as const;

export function persistGameState(): void {
  const state = get(gameState);
  saveGameState(state);
}

export function restoreGameState(): boolean {
  const savedState = loadGameState<GameState>();
  
  if (savedState && validateState(savedState)) {
    gameState.set(savedState);
    
    // Restore timer state separately
    if (savedState.timer) {
      timer.restoreTimer(savedState.timer);
    }
    
    // Restore card deck
    if (savedState.cardDeck) {
      cardDeck.set(savedState.cardDeck);
    }
    
    return true;
  }
  
  return false;
}

export function validateState(state: unknown): state is GameState {
  if (!state || typeof state !== 'object') return false;
  
  const s = state as Partial<GameState>;
  
  // Basic validation
  return (
    typeof s.currentRound === 'number' &&
    s.currentRound >= 1 &&
    s.currentRound <= 3 &&
    typeof s.roundStatus === 'string' &&
    typeof s.ruleMode === 'string' &&
    s.roundSettings !== undefined &&
    s.timer !== undefined &&
    s.cardDeck !== undefined
  );
}

export function persistSettings(): void {
  const currentSettings = get(settings);
  saveSettings(currentSettings);
}

export function restoreSettings(): boolean {
  const savedSettings = loadSettings<Settings>();
  
  if (savedSettings) {
    settings.set(savedSettings);
    return true;
  }
  
  return false;
}

// Auto-save on state changes
if (typeof window !== 'undefined') {
  // Restore state on page load BEFORE setting up subscriptions
  const restored = restoreGameState();
  restoreSettings();
  
  // Set up subscriptions after restoration
  let isInitializing = true;
  let isUpdatingFromTimer = false;
  
  // Sync timer with gameState (when timer changes, update gameState)
  timer.subscribe((timerState) => {
    if (!isInitializing && !isUpdatingFromTimer) {
      isUpdatingFromTimer = true;
      gameState.update((state) => ({
        ...state,
        timer: timerState,
      }));
      isUpdatingFromTimer = false;
    }
  });
  
  // Persist gameState changes (but don't update timer from gameState to avoid loops)
  gameState.subscribe((state) => {
    if (!isInitializing) {
      persistGameState();
    }
  });
  
  // Persist settings changes
  settings.subscribe((currentSettings) => {
    // Always persist settings changes, even during initialization
    // The initial restore will set the settings, but we want to persist any user changes
    // Use a small delay to ensure the store has fully updated
    setTimeout(() => {
      persistSettings();
    }, 10);
  });
  
  // Mark initialization complete after a small delay
  setTimeout(() => {
    isInitializing = false;
  }, 200);
  
  // Don't automatically reset to setup - let the game page handle it
  // If there's no saved state, the game page will redirect to homepage
}


import { writable } from 'svelte/store';
import type { Settings } from '../types';

const defaultSettings: Settings = {
  audioEnabled: true,
  digitalDiceEnabled: true,
  language: 'nl',
};

function createSettingsStore() {
  const { subscribe, set, update } = writable<Settings>(defaultSettings);

  return {
    subscribe,
    set,
    update,
    updateSettings: (newSettings: Partial<Settings>) => {
      update((settings) => ({ ...settings, ...newSettings }));
    },
    toggleAudio: () => {
      update((settings) => ({ ...settings, audioEnabled: !settings.audioEnabled }));
    },
    toggleDigitalDice: () => {
      update((settings) => ({ ...settings, digitalDiceEnabled: !settings.digitalDiceEnabled }));
    },
    reset: () => set(defaultSettings),
  };
}

export const settings = createSettingsStore();


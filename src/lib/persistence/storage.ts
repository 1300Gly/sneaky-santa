const STATE_KEY = 'pass-the-present:game-state';
const SETTINGS_KEY = 'pass-the-present:settings';
const STATE_VERSION_KEY = 'pass-the-present:state-version';
const CURRENT_STATE_VERSION = 1;

export function saveState<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export function loadState<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
}

export function clearState(key?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.removeItem(STATE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(STATE_VERSION_KEY);
    }
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
}

export function saveGameState<T>(data: T): void {
  saveState(STATE_KEY, data);
  saveState(STATE_VERSION_KEY, CURRENT_STATE_VERSION);
}

export function loadGameState<T>(): T | null {
  const version = loadState<number>(STATE_VERSION_KEY);
  
  // Handle state migrations if version changes
  if (version !== null && version !== CURRENT_STATE_VERSION) {
    // Future: implement migration logic here
  }
  
  return loadState<T>(STATE_KEY);
}

export function saveSettings<T>(data: T): void {
  saveState(SETTINGS_KEY, data);
}

export function loadSettings<T>(): T | null {
  return loadState<T>(SETTINGS_KEY);
}


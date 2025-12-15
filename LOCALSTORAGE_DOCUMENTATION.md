# LocalStorage Documentation

This document lists all localStorage keys used in the Pass the Present application.

## Storage Keys

### 1. `pass-the-present:game-state`
**Type**: `GameState` (JSON stringified)

**Contains**:
- `currentRound`: 1 | 2 | 3
- `roundStatus`: 'setup' | 'explanation' | 'countdown' | 'playing' | 'paused' | 'finished'
- `ruleMode`: 'peaceful' | 'traditional' | 'chaos'
- `roundSettings`: Object with settings for each round
  - `round1`: { timeLimit: number, timeLimitEnabled: boolean }
  - `round2`: { timeLimit: number, timeLimitEnabled: boolean }
  - `round3`: { timeLimit: number, timeLimitEnabled: boolean }
- `timer`: TimerState object
  - `isRunning`: boolean
  - `isPaused`: boolean
  - `timeRemaining`: number (seconds)
  - `round`: 1 | 2 | 3
  - `startTime`: number (timestamp, optional)
  - `pauseTime`: number (timestamp, optional)
  - `totalTime`: number (total seconds when timer started)
  - `warningsShown`: Object with boolean flags for each warning
- `cardDeck`: CardDeckState object
  - `available`: Card[] (cards still in deck)
  - `drawn`: Card[] (cards that have been drawn)
  - `players`: Player[] (players with saved cards)
  - `currentCard`: Card | undefined
- `gameHistory`: GameEvent[] (array of game events)
- `players`: Player[] (all players who have claimed save cards)
- `audioEnabled`: boolean

### 2. `pass-the-present:settings`
**Type**: `Settings` (JSON stringified)

**Contains**:
- `audioEnabled`: boolean
- `digitalDiceEnabled`: boolean
- `language`: 'nl' | 'en'

### 3. `pass-the-present:state-version`
**Type**: `number`

**Contains**: Current version number of the state structure (for migration purposes)
- Current version: `1`

### 4. `pass-the-present:language`
**Type**: `'nl' | 'en'`

**Contains**: User's preferred language setting

## State Persistence

- **Auto-save**: Game state is automatically saved to localStorage whenever it changes
- **Auto-restore**: State is automatically restored when the page loads
- **Timer restoration**: Timer state includes timestamps to calculate elapsed time on page refresh
- **Validation**: State is validated before restoration to ensure data integrity

## State Lifecycle

1. **Initial Load**: 
   - If no saved state exists → Start in 'setup' mode
   - If saved state exists → Restore game state and timer

2. **During Gameplay**:
   - All state changes are automatically persisted
   - Timer continues running and state is saved every second

3. **On Refresh**:
   - State is restored from localStorage
   - Timer calculates elapsed time and resumes if it was running
   - Game continues from where it left off

4. **Reset**:
   - Call `gameState.reset()` to clear state
   - Or manually clear localStorage keys

## Clearing State

To clear all stored data:
```javascript
localStorage.removeItem('pass-the-present:game-state');
localStorage.removeItem('pass-the-present:settings');
localStorage.removeItem('pass-the-present:state-version');
localStorage.removeItem('pass-the-present:language');
```

Or use the `clearState()` function from `src/lib/persistence/storage.ts`.


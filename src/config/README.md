# Game Configuration

This folder contains the source of truth for all game rulesets and card configurations.

## Structure

```
config/
├── rulesets/          # Dice rules for each game mode
│   ├── index.ts       # Main export and helper functions
│   ├── peaceful.ts    # Peaceful mode ruleset
│   ├── traditional.ts # Traditional mode ruleset
│   └── chaos.ts       # Chaos mode ruleset
└── cards/             # Card sets for each game mode
    ├── index.ts       # Main export and helper functions
    ├── peaceful.ts    # Peaceful mode cards
    ├── traditional.ts # Traditional mode cards
    └── chaos.ts       # Chaos mode cards
```

## Rulesets

Each ruleset defines:
- **mode**: The rule mode identifier (`'peaceful' | 'traditional' | 'chaos'`)
- **description**: Translation key for the mode description
- **rounds**: Dice rules for each round (1, 2, 3)
  - Each round contains rules for dice values 1-6
  - Rules are translation keys (e.g., `'rounds.round1.diceRules.1'`)

### Editing Rulesets

To modify dice rules for a specific mode:

1. Open the corresponding ruleset file (e.g., `rulesets/peaceful.ts`)
2. Update the translation keys in the `rounds` object
3. Make sure the translation keys exist in `src/lib/i18n/locales/en.json` and `nl.json`

Example:
```typescript
rounds: {
  1: {
    1: 'rounds.round1.diceRules.1', // Translation key for dice value 1
    2: 'rounds.round1.diceRules.2', // Translation key for dice value 2
    // ...
  }
}
```

## Cards

Each card set defines:
- **mode**: The rule mode identifier
- **round1**: Array of cards available in round 1
- **round2**: Array of cards available in round 2
- **round3**: Array of cards available in round 3
- **chance**: Array of chance cards (available in all rounds)

### Card Structure

Each card has:
- **id**: Unique identifier (e.g., `'r1-1'` for round 1, card 1)
- **type**: Card type (`'game' | 'chance'`)
- **round**: Round number (`1 | 2 | 3 | 'all'`)
- **text**: Translation key for the card text
- **isSaveCard**: (optional) Whether the card can be saved
- **canNullifyAction**: (optional) Whether the card can nullify actions

### Editing Cards

To modify cards for a specific mode:

1. Open the corresponding card file (e.g., `cards/peaceful.ts`)
2. Add, remove, or modify cards in the appropriate round array
3. Make sure the translation keys exist in `src/lib/i18n/locales/en.json` and `nl.json`

**Mode Differences:**
- **Peaceful**: Excludes aggressive cards (e.g., `r1-4`, `r1-7`, `r2-2`, `r2-3`)
- **Traditional**: Includes all standard cards (balanced mix)
- **Chaos**: Includes all cards including the most aggressive ones

## Usage

### Getting Rulesets

```typescript
import { getRuleset, getDiceRules } from '../config/rulesets';

// Get full ruleset
const ruleset = getRuleset('peaceful');

// Get dice rules for a specific round
const round1Rules = getDiceRules(1, 'peaceful');
```

### Getting Cards

```typescript
import { getCardSet, getCardsForRound } from '../config/cards';

// Get full card set
const cardSet = getCardSet('peaceful');

// Get cards for a specific round (includes chance cards)
const round1Cards = getCardsForRound('peaceful', 1);
```

## Notes

- All configuration files are the **single source of truth** for the game
- The rules page (`/rules`) displays rules from these configs
- The game uses these configs to generate card decks
- Translation keys must exist in both `en.json` and `nl.json`
- Changes to configs will automatically be reflected in the game


# Pass the Present - Project Documentation

## Project Overview

**Pass the Present** (Kerst Dobbelspel) is a festive Christmas dice game web application built with Astro and Svelte. The application provides an interactive digital companion for playing the traditional Christmas gift exchange game, featuring customizable rules, timers, and an engaging user interface.

### Core Purpose
- **Game Rules & Instructions**: Comprehensive explanation of game rules and setup
- **Interactive Gameplay**: Digital game master that manages rounds, timers, cards, and dice rules

---

## Features & Requirements

### 1. Game Setup & Configuration

#### 1.1 Time Settings
- **Three rounds** with individual time configurations
- Each round has a dropdown selector for time duration
- Default values (TBD - to be determined based on game rules)
- Suggested defaults:
  - Round 1: Until all gifts are off the table (no timer) OR 30 minutes
  - Round 2: 20-45 minutes (default: 30 minutes)
  - Round 3: 20-45 minutes (default: 30 minutes)

#### 1.2 Rule Modes
Three difficulty/playstyle modes that affect gameplay:

- **Peaceful Mode**
  - Gentler card actions
  - More cooperative gameplay
  - Reduced aggressive actions (fewer "steal" cards)

- **Traditional Mode**
  - Standard game rules as per original design
  - Balanced mix of actions

- **Chaos Mode**
  - More aggressive card actions
  - Increased stealing/swapping mechanics
  - More unpredictable gameplay

Each mode affects:
- Card deck contents (filtered/modified card lists)
- Dice rule interpretations
- Available actions

#### 1.3 Round Explanations
- Before each round starts, display:
  - Round-specific rules and objectives
  - What happens in this round
  - Special instructions
- "Start Round" button that triggers:
  - 3-2-1 countdown animation
  - Timer initialization
  - Round begins

#### 1.4 Optional Digital Dice
- Toggle for digital dice if physical dice unavailable
- Animated dice roll
- Random number generation (1-6)
- Visual feedback matching physical dice

---

### 2. Gameplay Features

#### 2.1 Timer System
**Per-Round Timer Requirements:**
- Visible countdown timer
- Pause/Resume functionality
- Reset functionality (with confirmation modal: "Are you sure?")
- Time threshold warnings:
  - Half time remaining
  - 10 minutes remaining
  - 5 minutes remaining
  - 1 minute remaining
- Visual/audio notifications at thresholds
- Round over notification with:
  - "Start Next Round" button
  - Summary of round completion

#### 2.2 During Round Display

**Main Game View Shows:**
- **Dice Rules Panel**: Current round's dice roll actions (1-6)
- **Card Picker Button**: 
  - Click to draw random card
  - Animated card reveal
  - Display card content/instruction
  - Card type indicator (Game Card, Chance Card, Joker)
- **Timer Display**: 
  - Large, visible countdown
  - Pause/Resume controls
  - Reset option (with confirmation)
- **Round Indicator**: Current round number and status

#### 2.3 Card System

**Card Types:**
- **Game Cards (Speelkaarten)**: Round-specific action cards
  - Round 1 Cards: Gift distribution and swapping
  - Round 2 Cards: Unwrapping and gift management
  - Round 3 Cards: Final securing and gift protection
- **Chance Cards (Kanskaarten)**: Special action cards
  - Save cards (can be played at any time)
  - Instant action cards
- **Jokers**: Wild cards with special effects

**Card Features:**
- Filtered by selected rule mode
- Shuffled deck per round
- Returned to deck after use (except save cards)
- Animated reveal when drawn

---

### 3. Dice Rules System

#### 3.1 Round-Specific Dice Rules

**Round 1 Rules:**
1. = Take a game card
2. = Swap one of your gifts with someone else's gift
3. = Game direction reverses (previous player goes next)
4. = Take a gift from someone
5. = Give a gift from the table to someone else
6. = Take a gift of your choice from the table

**Round 2 Rules:**
1. = Take a playing card
2. = Give a gift from yourself to someone else (or take a card if no gift)
3. = Game direction reverses
4. = Take a gift from someone
5. = Swap two gifts from different owners
6. = Unwrap one of your gifts (or take a card if no gift)

**Round 3 Rules:**
1. = Take a playing card
2. = Swap two gifts (from different owners)
3. = Game direction reverses
4. = Take a gift from someone
5. = Give one of your gifts to someone else (or take a card)
6. = Secure one gift (no one can take it)

**Mode Variations:**
- Peaceful: Softer interpretations, fewer steals
- Traditional: Standard rules
- Chaos: More aggressive actions, additional swap options

---

## Technical Architecture

### 4. Technology Stack

#### 4.1 Core Framework
- **Astro**: Static site generation, routing, and build system
- **Svelte**: Component framework for interactive UI
- **TypeScript**: Type safety throughout the application

#### 4.2 State Management
- **Svelte Stores**: 
  - Game state store
  - Timer store
  - Settings store
  - Card deck store
- **Persistence Layer**:
  - `localStorage` for state persistence
  - Auto-save on state changes
  - Recovery on page refresh
  - State versioning for migrations

#### 4.3 Internationalization (i18n)
- **i18n Module**: Custom localization system
- **Supported Languages**: 
  - Dutch (primary - original language)
  - English (secondary)
  - Extensible for additional languages
- **Translation Keys**: Organized by feature/component
- **Dynamic Language Switching**: Runtime language change

#### 4.4 Animation Library
- **Recommended**: Framer Motion (via Svelte port) or Svelte transitions
- **Animation Requirements**:
  - Card reveal animations (flip, slide, fade)
  - Dice roll animations (3D rotation, bounce)
  - Round transition animations (fade, slide)
  - Timer countdown effects
  - Button interactions (hover, click)
  - Modal transitions

#### 4.5 Styling
- **CSS Framework**: Tailwind CSS (recommended) or custom CSS
- **Design System**: 
  - Christmas-themed color palette
  - Consistent spacing and typography
  - Responsive design (mobile-first)
  - Accessible UI components

---

## Project Structure

```
pass-the-present/
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── DiceRules.svelte
│   │   │   ├── CardPicker.svelte
│   │   │   ├── Timer.svelte
│   │   │   ├── RoundIndicator.svelte
│   │   │   ├── DigitalDice.svelte
│   │   │   └── RoundExplanation.svelte
│   │   ├── setup/
│   │   │   ├── TimeSettings.svelte
│   │   │   ├── RuleModeSelector.svelte
│   │   │   └── GameSetup.svelte
│   │   ├── ui/
│   │   │   ├── Button.svelte
│   │   │   ├── Modal.svelte
│   │   │   ├── Card.svelte
│   │   │   └── Countdown.svelte
│   │   └── rules/
│   │       ├── RulesOverview.svelte
│   │       └── RoundRules.svelte
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   ├── index.astro (Home/Rules)
│   │   ├── game.astro (Gameplay)
│   │   └── rules.astro (Detailed Rules)
│   ├── stores/
│   │   ├── gameState.ts
│   │   ├── timer.ts
│   │   ├── settings.ts
│   │   └── cards.ts
│   ├── lib/
│   │   ├── i18n/
│   │   │   ├── index.ts
│   │   │   ├── locales/
│   │   │   │   ├── nl.json
│   │   │   │   └── en.json
│   │   │   └── types.ts
│   │   ├── cards/
│   │   │   ├── cardData.ts
│   │   │   ├── cardFilters.ts
│   │   │   └── cardDeck.ts
│   │   ├── dice/
│   │   │   ├── diceRules.ts
│   │   │   └── diceRoller.ts
│   │   ├── timer/
│   │   │   ├── timerUtils.ts
│   │   │   └── notifications.ts
│   │   └── persistence/
│   │       ├── storage.ts
│   │       └── stateManager.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── cards.ts
│   │   └── settings.ts
│   └── styles/
│       ├── global.css
│       └── animations.css
├── public/
│   ├── images/
│   └── icons/
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── tailwind.config.js (if using Tailwind)
```

---

## Data Models

### 5.1 Game State

```typescript
interface GameState {
  currentRound: 1 | 2 | 3;
  roundStatus: 'setup' | 'explanation' | 'countdown' | 'playing' | 'paused' | 'finished';
  ruleMode: 'peaceful' | 'traditional' | 'chaos';
  roundSettings: {
    round1: RoundSettings;
    round2: RoundSettings;
    round3: RoundSettings;
  };
  timer: TimerState;
  cardDeck: CardDeckState;
  gameHistory: GameEvent[];
}
```

### 5.2 Round Settings

```typescript
interface RoundSettings {
  timeLimit: number; // in minutes, 0 = no limit (Round 1)
  timeLimitEnabled: boolean;
}
```

### 5.3 Timer State

```typescript
interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  round: 1 | 2 | 3;
  warningsShown: {
    halfTime: boolean;
    tenMinutes: boolean;
    fiveMinutes: boolean;
    oneMinute: boolean;
  };
}
```

### 5.4 Card System

```typescript
interface Card {
  id: string;
  type: 'game' | 'chance' | 'joker';
  round: 1 | 2 | 3 | 'all';
  text: string; // i18n key
  icon?: string;
  mode: ('peaceful' | 'traditional' | 'chaos')[];
  isSaveCard?: boolean; // Can be kept and played later
}

interface CardDeckState {
  available: Card[];
  drawn: Card[];
  saved: Card[]; // Player's saved cards
  currentCard?: Card;
}
```

---

## User Flows

### 6.1 Initial Setup Flow

1. User lands on homepage
2. Navigate to "Play Game" or "Rules"
3. **If Play Game:**
   - Configure Round 1 time (or no timer)
   - Configure Round 2 time (dropdown: 15, 20, 30, 45, 60 minutes)
   - Configure Round 3 time (dropdown: 15, 20, 30, 45, 60 minutes)
   - Select Rule Mode (Peaceful/Traditional/Chaos)
   - Toggle Digital Dice (if needed)
   - Click "Start Game"

### 6.2 Round Flow

1. **Round Explanation Screen**
   - Display round-specific rules
   - Show what to expect
   - "Start Round" button

2. **Countdown**
   - 3-2-1 animated countdown
   - Timer initializes

3. **Gameplay**
   - Timer running
   - Dice rules visible
   - Card picker available
   - Timer controls (pause/reset)

4. **Time Warnings**
   - Visual/audio notifications at thresholds
   - Non-intrusive but noticeable

5. **Round End**
   - Timer reaches zero OR all gifts distributed (Round 1)
   - Round over notification
   - "Start Next Round" button (if not final round)
   - Or "Game Complete" screen

### 6.3 Card Drawing Flow

1. User clicks "Pick Card" button
2. Animation: Card shuffles/flips
3. Random card selected from available deck
4. Card revealed with animation
5. Card content displayed
6. If save card: Option to "Save for Later" or "Use Now"
7. Card returned to deck (unless saved)

---

## Implementation Details

### 7.1 State Persistence

**Strategy:**
- Save state to `localStorage` on every state change
- State structure versioned for future migrations
- Recovery on page load:
  - Check for saved state
  - Validate state structure
  - Restore if valid
  - Option to "Start Fresh" if corrupted

**State Keys:**
- `pass-the-present:game-state` - Main game state
- `pass-the-present:settings` - User preferences
- `pass-the-present:state-version` - Version for migrations

### 7.2 i18n Implementation

**Structure:**
```json
{
  "common": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Resume",
    "reset": "Reset"
  },
  "rounds": {
    "round1": {
      "title": "Round 1",
      "description": "...",
      "diceRules": {
        "1": "Take a game card",
        "2": "Swap one of your gifts...",
        ...
      }
    },
    ...
  },
  "cards": {
    "round1": {
      "card1": "Swap one of your gifts...",
      ...
    },
    ...
  }
}
```

**Usage:**
- `t('common.start')` - Get translation
- `t('rounds.round1.diceRules.1')` - Nested keys
- Language switching updates all components reactively

### 7.3 Card Filtering by Mode

**Implementation:**
- All cards have `mode` array property
- Filter function: `filterCardsByMode(cards: Card[], mode: RuleMode): Card[]`
- Applied when initializing card deck for each round
- Cards available in multiple modes appear in all relevant modes

### 7.4 Timer Warnings

**Implementation:**
- Calculate warning thresholds on timer start
- Use `setInterval` or `requestAnimationFrame` for precision
- Trigger warnings only once per threshold
- Visual: Toast notification or banner
- Audio: Optional sound effect (with mute option)

### 7.5 Animation Requirements

**Card Reveal:**
- Flip animation (3D transform)
- Slide-in from deck
- Fade + scale

**Dice Roll:**
- 3D rotation animation
- Bounce effect
- Number reveal

**Round Transitions:**
- Fade out current round
- Slide in next round
- Smooth timer reset

**Countdown:**
- Large number display
- Scale animation on number change
- Final "GO!" animation

---

## UI/UX Considerations

### 8.1 Design Principles

- **Festive Theme**: Christmas colors (red, green, gold, white)
- **Clear Hierarchy**: Important information (timer, dice rules) prominently displayed
- **Accessibility**: 
  - Keyboard navigation
  - Screen reader support
  - High contrast mode
  - Font size options
- **Responsive**: Works on mobile, tablet, desktop
- **Performance**: Smooth 60fps animations

### 8.2 Layout Structure

**Gameplay Screen:**
```
┌─────────────────────────────────────┐
│  Round Indicator        Timer       │
├─────────────────────────────────────┤
│                                     │
│         Dice Rules Panel            │
│    (1-6 with descriptions)          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      [Pick Card Button]             │
│                                     │
│      [Current Card Display]         │
│                                     │
├─────────────────────────────────────┤
│  [Pause] [Reset]  [Digital Dice]   │
└─────────────────────────────────────┘
```

### 8.3 Color Scheme

- **Primary**: Red (#DC2626) - Christmas red
- **Secondary**: Green (#16A34A) - Christmas green
- **Accent**: Gold (#F59E0B) - Festive gold
- **Background**: White/Cream (#FEFEFE)
- **Text**: Dark gray (#1F2937)

---

## Testing Considerations

### 9.1 Unit Tests
- State management functions
- Card filtering logic
- Timer calculations
- i18n translations
- Dice roll randomness

### 9.2 Integration Tests
- Round flow transitions
- State persistence/recovery
- Timer warnings
- Card drawing mechanics

### 9.3 E2E Tests
- Complete game flow
- Settings configuration
- Language switching
- Mobile responsiveness

---

## Future Enhancements (Optional)

- Multiplayer support (shared game state)
- Sound effects and background music
- Custom card creation
- Game statistics/history
- Export game results
- Print-friendly rule sheets
- Additional languages
- Dark mode theme
- Custom themes

---

## Development Phases

### Phase 1: Foundation
- Project setup (Astro + Svelte)
- Basic routing and layout
- i18n system implementation
- State management setup

### Phase 2: Core Features
- Game setup screen
- Timer implementation
- Basic card system
- Dice rules display

### Phase 3: Gameplay
- Round flow implementation
- Card drawing and display
- Timer warnings
- Round transitions

### Phase 4: Polish
- Animations
- UI/UX refinements
- State persistence
- Responsive design

### Phase 5: Rules & Documentation
- Rules explanation pages
- Card content implementation
- Help/FAQ section

---

## Notes

- All game content (cards, rules) should be easily editable via JSON/data files
- Consider making card content and rules configurable without code changes
- Ensure game can be played offline (PWA capabilities)
- Optimize for performance (lazy loading, code splitting)

---

## Card Content Reference

Based on the provided game materials, the following card types exist:

### Round 1 Cards
- Swap gifts with others
- Everyone gives gift left/right
- Exchange smallest/largest gifts
- Roll dice again
- Give gift to someone with fewer gifts

### Round 2 Cards
- Swap places
- Choose someone to give you a gift
- All gifts shift left/right
- Unwrap gifts
- Take all gifts from someone
- Give all your gifts away

### Round 3 Cards
- Secure a gift (cannot be taken)
- Secure someone else's gift
- Everyone secures one gift

### Chance Cards
- Save cards (nullify dice roll)
- Take 2 gifts if you have less than 2
- Roll again
- Someone gets you food/drink
- Someone sings a Christmas song

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Initial Specification


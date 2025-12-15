# Pass the Present - Implementation Plan

This document provides a detailed, step-by-step implementation plan with checklists to track progress from project initialization to completion.

---

## Phase 1: Project Foundation & Setup

### 1.1 Project Initialization
- [ ] Initialize Astro project with Svelte integration
- [ ] Set up TypeScript configuration
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository and initial commit
- [ ] Create `.gitignore` file
- [ ] Set up package.json with dependencies

### 1.2 Development Environment
- [ ] Install core dependencies:
  - [ ] `astro`
  - [ ] `@astrojs/svelte`
  - [ ] `svelte`
  - [ ] `typescript`
- [ ] Install styling dependencies:
  - [ ] `tailwindcss` (or choose alternative)
  - [ ] `@tailwindcss/typography`
- [ ] Install animation library:
  - [ ] `svelte/transition` (built-in) or
  - [ ] `svelte-motion` or
  - [ ] `@motionone/svelte`
- [ ] Configure Astro config file
- [ ] Configure Tailwind config (if using)
- [ ] Set up development scripts in package.json

### 1.3 Project Structure
- [ ] Create directory structure:
  - [ ] `src/components/` (game, setup, ui, rules)
  - [ ] `src/layouts/`
  - [ ] `src/pages/`
  - [ ] `src/stores/`
  - [ ] `src/lib/` (i18n, cards, dice, timer, persistence, audio)
  - [ ] `src/types/`
  - [ ] `src/styles/`
  - [ ] `public/` (images, icons, audio)
- [ ] Create placeholder files for main components
- [ ] Set up basic routing structure

### 1.4 Type Definitions
- [ ] Create `src/types/game.ts`:
  - [ ] `GameState` interface
  - [ ] `RoundSettings` interface
  - [ ] `Player` interface
  - [ ] `GameEvent` interface
- [ ] Create `src/types/cards.ts`:
  - [ ] `Card` interface
  - [ ] `CardDeckState` interface
  - [ ] `CardType` type
  - [ ] `RuleMode` type
- [ ] Create `src/types/settings.ts`:
  - [ ] `Settings` interface
  - [ ] `TimerState` interface
- [ ] Export all types from `src/types/index.ts`

**Phase 1 Completion Criteria:**
- ✅ Project builds successfully
- ✅ Development server runs
- ✅ Basic routing works
- ✅ TypeScript compilation passes
- ✅ All directory structure in place

---

## Phase 2: Core Infrastructure

### 2.1 i18n System
- [ ] Create `src/lib/i18n/index.ts`:
  - [ ] Language detection
  - [ ] Translation function `t(key: string)`
  - [ ] Language switching function
  - [ ] Reactive language store
- [ ] Create `src/lib/i18n/types.ts`:
  - [ ] Translation key types
  - [ ] Language type
- [ ] Create `src/lib/i18n/locales/nl.json`:
  - [ ] Common translations
  - [ ] Round descriptions
  - [ ] Dice rules
  - [ ] Card texts
  - [ ] UI labels
- [ ] Create `src/lib/i18n/locales/en.json`:
  - [ ] All translations in English
- [ ] Create language switcher component
- [ ] Test translation loading and switching

### 2.2 State Management - Stores
- [ ] Create `src/stores/gameState.ts`:
  - [ ] `gameState` writable store
  - [ ] `initializeGame()` function
  - [ ] `updateRound()` function
  - [ ] `updateRoundStatus()` function
  - [ ] `addPlayer()` function
  - [ ] `updatePlayerCards()` function
- [ ] Create `src/stores/timer.ts`:
  - [ ] `timerState` writable store
  - [ ] `startTimer()` function
  - [ ] `pauseTimer()` function
  - [ ] `resumeTimer()` function
  - [ ] `resetTimer()` function
  - [ ] `updateTimeRemaining()` function
- [ ] Create `src/stores/settings.ts`:
  - [ ] `settings` writable store
  - [ ] `updateSettings()` function
  - [ ] `toggleAudio()` function
- [ ] Create `src/stores/cards.ts`:
  - [ ] `cardDeck` writable store
  - [ ] `initializeDeck()` function
  - [ ] `drawCard()` function
  - [ ] `returnCard()` function
  - [ ] `saveCard()` function
  - [ ] `useSavedCard()` function
- [ ] Test all store functions

### 2.3 State Persistence
- [ ] Create `src/lib/persistence/storage.ts`:
  - [ ] `saveState()` function
  - [ ] `loadState()` function
  - [ ] `clearState()` function
  - [ ] State versioning system
- [ ] Create `src/lib/persistence/stateManager.ts`:
  - [ ] `persistGameState()` function
  - [ ] `restoreGameState()` function
  - [ ] `validateState()` function
  - [ ] State migration logic
- [ ] Integrate persistence with stores (auto-save on changes)
- [ ] Test state save/load on page refresh
- [ ] Test state recovery with corrupted data

### 2.4 Audio System
- [ ] Create `src/lib/audio/audioManager.ts`:
  - [ ] `loadAudio()` function
  - [ ] `playSound()` function
  - [ ] `setVolume()` function
  - [ ] `mute()` / `unmute()` functions
  - [ ] Audio debouncing
- [ ] Add audio files to `public/audio/`:
  - [ ] `warning-chime.mp3` (or generate)
  - [ ] `round-end.mp3` (or generate)
- [ ] Test audio playback
- [ ] Test mute/unmute functionality
- [ ] Handle audio loading errors gracefully

**Phase 2 Completion Criteria:**
- ✅ i18n system works with language switching
- ✅ All stores are functional
- ✅ State persists across page refreshes
- ✅ Audio system works with mute option

---

## Phase 3: Card System

### 3.1 Card Data
- [ ] Create `src/lib/cards/cardData.ts`:
  - [ ] All Round 1 game cards
  - [ ] All Round 2 game cards
  - [ ] All Round 3 game cards
  - [ ] All Chance cards
  - [ ] All Joker cards
  - [ ] Card metadata (icons, modes, etc.)
- [ ] Ensure all cards have:
  - [ ] Unique IDs
  - [ ] i18n keys for text
  - [ ] Mode compatibility array
  - [ ] Round assignment
  - [ ] Save card flag (where applicable)
- [ ] Verify card data matches game rules

### 3.2 Card Filtering
- [ ] Create `src/lib/cards/cardFilters.ts`:
  - [ ] `filterCardsByMode()` function
  - [ ] `filterCardsByRound()` function
  - [ ] `getAvailableCards()` function
- [ ] Test filtering for each mode (peaceful, traditional, chaos)
- [ ] Test filtering for each round

### 3.3 Card Deck Management
- [ ] Create `src/lib/cards/cardDeck.ts`:
  - [ ] `createDeck()` function
  - [ ] `shuffleDeck()` function
  - [ ] `drawRandomCard()` function
  - [ ] `returnCardToDeck()` function
  - [ ] `removeCardFromDeck()` function
- [ ] Test deck creation and shuffling
- [ ] Test card drawing randomness
- [ ] Test card return logic

**Phase 3 Completion Criteria:**
- ✅ All card data is defined
- ✅ Card filtering works correctly
- ✅ Deck management functions work
- ✅ Cards can be drawn and returned

---

## Phase 4: Dice System

### 4.1 Dice Rules
- [ ] Create `src/lib/dice/diceRules.ts`:
  - [ ] Round 1 dice rules (1-6)
  - [ ] Round 2 dice rules (1-6)
  - [ ] Round 3 dice rules (1-6)
  - [ ] Mode variations (if applicable)
  - [ ] `getDiceRule()` function
  - [ ] `getAllDiceRules()` function
- [ ] Add i18n keys for all dice rules
- [ ] Test rule retrieval for each round

### 4.2 Digital Dice
- [ ] Create `src/lib/dice/diceRoller.ts`:
  - [ ] `rollDice()` function (random 1-6)
  - [ ] `rollDiceWithAnimation()` function
- [ ] Create `src/components/game/DigitalDice.svelte`:
  - [ ] 3D dice visualization
  - [ ] Roll animation
  - [ ] Number display
  - [ ] Toggle on/off
- [ ] Test dice rolling randomness
- [ ] Test animation smoothness

**Phase 4 Completion Criteria:**
- ✅ All dice rules are defined
- ✅ Digital dice component works
- ✅ Dice animations are smooth

---

## Phase 5: Timer System

### 5.1 Timer Logic
- [ ] Create `src/lib/timer/timerUtils.ts`:
  - [ ] `formatTime()` function (MM:SS)
  - [ ] `calculateWarningThresholds()` function
  - [ ] `checkWarningThresholds()` function
  - [ ] `convertMinutesToSeconds()` function
- [ ] Test time formatting
- [ ] Test threshold calculations

### 5.2 Timer Warnings
- [ ] Create `src/lib/timer/notifications.ts`:
  - [ ] `triggerWarning()` function
  - [ ] `checkAndTriggerWarnings()` function
  - [ ] Warning state management
- [ ] Create `src/components/ui/TimerWarningModal.svelte`:
  - [ ] Modal display
  - [ ] Warning message
  - [ ] Time remaining display
  - [ ] Auto-dismiss after 3-5 seconds
  - [ ] Manual dismiss button
  - [ ] Non-blocking (game continues)
- [ ] Integrate with audio system
- [ ] Test all warning thresholds:
  - [ ] Half time
  - [ ] 10 minutes
  - [ ] 5 minutes
  - [ ] 1 minute

### 5.3 Timer Component
- [ ] Create `src/components/game/Timer.svelte`:
  - [ ] Large countdown display
  - [ ] Pause/Resume button
  - [ ] Reset button (with confirmation modal)
  - [ ] Timer state display
  - [ ] Integration with timer store
- [ ] Test pause/resume functionality
- [ ] Test reset with confirmation
- [ ] Test timer accuracy

**Phase 5 Completion Criteria:**
- ✅ Timer counts down correctly
- ✅ Pause/resume works
- ✅ Reset works with confirmation
- ✅ All warnings trigger correctly
- ✅ Warning modals auto-dismiss

---

## Phase 6: UI Components

### 6.1 Base UI Components
- [ ] Create `src/components/ui/Button.svelte`:
  - [ ] Variants (primary, secondary, etc.)
  - [ ] Sizes
  - [ ] Disabled state
  - [ ] Loading state
  - [ ] Click animations
- [ ] Create `src/components/ui/Modal.svelte`:
  - [ ] Open/close animations
  - [ ] Backdrop
  - [ ] Close button
  - [ ] Escape key to close
  - [ ] Focus trap
- [ ] Create `src/components/ui/Card.svelte`:
  - [ ] Card display component
  - [ ] Card reveal animation
  - [ ] Card type indicator
  - [ ] Icon display
- [ ] Create `src/components/ui/Countdown.svelte`:
  - [ ] 3-2-1 countdown display
  - [ ] Number animations
  - [ ] "GO!" animation
  - [ ] Completion callback

### 6.2 Game Components
- [ ] Create `src/components/game/DiceRules.svelte`:
  - [ ] Display all 6 dice rules
  - [ ] Round-specific rules
  - [ ] Visual dice icons
  - [ ] Responsive layout
- [ ] Create `src/components/game/CardPicker.svelte`:
  - [ ] "Pick Card" button
  - [ ] Card drawing animation
  - [ ] Card reveal
  - [ ] Card content display
- [ ] Create `src/components/game/RoundIndicator.svelte`:
  - [ ] Current round display
  - [ ] Round status
  - [ ] Visual indicators
- [ ] Create `src/components/game/RoundExplanation.svelte`:
  - [ ] Round description
  - [ ] Round rules
  - [ ] "Start Round" button
  - [ ] Integration with countdown

### 6.3 Setup Components
- [ ] Create `src/components/setup/TimeSettings.svelte`:
  - [ ] Round 1 time selector (or "no timer" option)
  - [ ] Round 2 time dropdown (15, 20, 30, 45, 60 min)
  - [ ] Round 3 time dropdown (15, 20, 30, 45, 60 min)
  - [ ] Default values
- [ ] Create `src/components/setup/RuleModeSelector.svelte`:
  - [ ] Three mode options (Peaceful, Traditional, Chaos)
  - [ ] Mode descriptions
  - [ ] Visual selection
- [ ] Create `src/components/setup/GameSetup.svelte`:
  - [ ] Combine all setup components
  - [ ] Digital dice toggle
  - [ ] Audio toggle
  - [ ] "Start Game" button
  - [ ] Validation

### 6.4 Modal Components
- [ ] Create `src/components/game/SaveCardClaimModal.svelte`:
  - [ ] "Who is claiming this save card?" prompt
  - [ ] Text input for player name
  - [ ] "Save Card" button
  - [ ] Validation (name required)
- [ ] Create `src/components/game/SavedCardRedemptionModal.svelte`:
  - [ ] Player name display
  - [ ] Available saved cards list
  - [ ] "Use Saved Card" buttons
  - [ ] "Continue with Action" button
- [ ] Create reset confirmation modal (in Timer component or separate)

**Phase 6 Completion Criteria:**
- ✅ All UI components are created
- ✅ Components are styled consistently
- ✅ Animations work smoothly
- ✅ Components are responsive

---

## Phase 7: Pages & Routing

### 7.1 Layout
- [ ] Create `src/layouts/MainLayout.astro`:
  - [ ] Header with navigation
  - [ ] Language switcher
  - [ ] Footer
  - [ ] Main content area
  - [ ] Global styles

### 7.2 Pages
- [ ] Create `src/pages/index.astro`:
  - [ ] Homepage
  - [ ] Game introduction
  - [ ] Links to "Play Game" and "Rules"
  - [ ] Welcome message
- [ ] Create `src/pages/game.astro`:
  - [ ] Game setup screen (initial state)
  - [ ] Round explanation screens
  - [ ] Gameplay screen
  - [ ] Round over screens
  - [ ] Game complete screen
  - [ ] State management integration
- [ ] Create `src/pages/rules.astro`:
  - [ ] Game rules overview
  - [ ] Round-specific rules
  - [ ] Card explanations
  - [ ] Dice rules
  - [ ] Setup instructions

### 7.3 Navigation Flow
- [ ] Test navigation between pages
- [ ] Test state persistence across navigation
- [ ] Test "Start Fresh" functionality

**Phase 7 Completion Criteria:**
- ✅ All pages are created
- ✅ Navigation works
- ✅ Layout is consistent
- ✅ State persists across navigation

---

## Phase 8: Game Flow Integration

### 8.1 Setup Flow
- [ ] Integrate setup components into game page
- [ ] Connect settings to game state
- [ ] Validate setup before starting
- [ ] Initialize game state on "Start Game"
- [ ] Test complete setup flow

### 8.2 Round Flow
- [ ] Implement round explanation display
- [ ] Implement countdown (3-2-1)
- [ ] Implement round start
- [ ] Implement round end detection
- [ ] Implement "Start Next Round" button
- [ ] Implement game complete screen
- [ ] Test complete round flow

### 8.3 Card Drawing Flow
- [ ] Integrate card picker with deck
- [ ] Implement card reveal animation
- [ ] Implement save card claim modal
- [ ] Implement card return logic
- [ ] Test card drawing for all card types

### 8.4 Saved Card System
- [ ] Implement player name collection on save card draw
- [ ] Implement saved card storage per player
- [ ] Implement saved card redemption modal
- [ ] Implement action nullification logic
- [ ] Test saved card flow end-to-end

### 8.5 Timer Integration
- [ ] Integrate timer with round flow
- [ ] Start timer on round start
- [ ] Stop timer on round end
- [ ] Handle timer warnings during gameplay
- [ ] Test timer with all round types

**Phase 8 Completion Criteria:**
- ✅ Complete game flow works
- ✅ All transitions are smooth
- ✅ State updates correctly
- ✅ All modals work as expected

---

## Phase 9: Animations & Polish

### 9.1 Card Animations
- [ ] Card flip animation on reveal
- [ ] Card slide-in animation
- [ ] Card shuffle animation
- [ ] Smooth transitions between card states

### 9.2 Dice Animations
- [ ] 3D dice roll animation
- [ ] Bounce effect
- [ ] Number reveal animation
- [ ] Smooth transitions

### 9.3 Round Transitions
- [ ] Fade out current round
- [ ] Slide in next round
- [ ] Countdown animations
- [ ] Round over animations

### 9.4 UI Animations
- [ ] Button hover effects
- [ ] Button click animations
- [ ] Modal open/close animations
- [ ] Timer number transitions
- [ ] Warning modal animations

### 9.5 Performance Optimization
- [ ] Optimize animation performance (60fps)
- [ ] Lazy load components where possible
- [ ] Optimize bundle size
- [ ] Test on mobile devices

**Phase 9 Completion Criteria:**
- ✅ All animations are smooth (60fps)
- ✅ Animations enhance UX
- ✅ Performance is good on all devices

---

## Phase 10: Styling & Design

### 10.1 Design System
- [ ] Define color palette (Christmas theme)
- [ ] Define typography scale
- [ ] Define spacing system
- [ ] Create design tokens

### 10.2 Global Styles
- [ ] Create `src/styles/global.css`:
  - [ ] CSS reset/normalize
  - [ ] Base typography
  - [ ] Color variables
  - [ ] Utility classes
- [ ] Create `src/styles/animations.css`:
  - [ ] Animation keyframes
  - [ ] Transition utilities

### 10.3 Component Styling
- [ ] Style all UI components
- [ ] Style game components
- [ ] Style setup components
- [ ] Ensure consistent styling

### 10.4 Responsive Design
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Test on various screen sizes

### 10.5 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] ARIA labels

**Phase 10 Completion Criteria:**
- ✅ Design is consistent and festive
- ✅ Responsive on all devices
- ✅ Accessible to all users
- ✅ Styling matches design system

---

## Phase 11: Content & Translations

### 11.1 Card Content
- [ ] Verify all Round 1 cards have correct text
- [ ] Verify all Round 2 cards have correct text
- [ ] Verify all Round 3 cards have correct text
- [ ] Verify all Chance cards have correct text
- [ ] Verify all Jokers have correct text
- [ ] Add icons to cards (if applicable)

### 11.2 Rules Content
- [ ] Write comprehensive game rules
- [ ] Write round-specific explanations
- [ ] Write setup instructions
- [ ] Add helpful tips

### 11.3 Translations
- [ ] Complete Dutch translations
- [ ] Complete English translations
- [ ] Verify all i18n keys are used
- [ ] Test language switching
- [ ] Proofread all translations

**Phase 11 Completion Criteria:**
- ✅ All content is accurate
- ✅ All translations are complete
- ✅ Content matches game rules

---

## Phase 12: Testing & Bug Fixes

### 12.1 Manual Testing
- [ ] Test complete game flow:
  - [ ] Setup → Round 1 → Round 2 → Round 3 → Complete
- [ ] Test all timer scenarios:
  - [ ] Timer with warnings
  - [ ] Timer pause/resume
  - [ ] Timer reset
  - [ ] Round 1 with no timer
- [ ] Test all card types:
  - [ ] Game cards
  - [ ] Chance cards
  - [ ] Save cards
  - [ ] Jokers
- [ ] Test saved card system:
  - [ ] Claiming save cards
  - [ ] Redeeming save cards
  - [ ] Action nullification
- [ ] Test all rule modes:
  - [ ] Peaceful mode
  - [ ] Traditional mode
  - [ ] Chaos mode
- [ ] Test state persistence:
  - [ ] Refresh during setup
  - [ ] Refresh during gameplay
  - [ ] Refresh with saved cards
- [ ] Test edge cases:
  - [ ] Empty deck
  - [ ] Timer at 0
  - [ ] Multiple saved cards
  - [ ] Invalid state recovery

### 12.2 Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### 12.3 Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667, 414x896)

### 12.4 Bug Fixes
- [ ] Fix identified bugs
- [ ] Test bug fixes
- [ ] Document fixes

**Phase 12 Completion Criteria:**
- ✅ All features work correctly
- ✅ No critical bugs
- ✅ Works on all tested browsers/devices

---

## Phase 13: Final Polish & Deployment

### 13.1 Code Quality
- [ ] Code review
- [ ] Remove console.logs
- [ ] Remove unused code
- [ ] Optimize imports
- [ ] Add code comments where needed

### 13.2 Documentation
- [ ] Update README.md:
  - [ ] Project description
  - [ ] Installation instructions
  - [ ] Development instructions
  - [ ] Build instructions
- [ ] Document any special configurations
- [ ] Add code comments for complex logic

### 13.3 Build & Optimization
- [ ] Test production build
- [ ] Optimize images
- [ ] Minimize CSS/JS
- [ ] Test build output
- [ ] Verify all assets load correctly

### 13.4 Deployment Preparation
- [ ] Set up deployment configuration
- [ ] Configure environment variables (if any)
- [ ] Test deployment build
- [ ] Prepare deployment checklist

### 13.5 Final Testing
- [ ] Full end-to-end test
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] Cross-browser final check

**Phase 13 Completion Criteria:**
- ✅ Code is clean and documented
- ✅ Production build works
- ✅ Ready for deployment

---

## Phase 14: Deployment

### 14.1 Deployment Setup
- [ ] Choose hosting platform (Vercel, Netlify, etc.)
- [ ] Configure build settings
- [ ] Set up custom domain (if applicable)
- [ ] Configure environment variables

### 14.2 Deploy
- [ ] Deploy to staging (if applicable)
- [ ] Test staging deployment
- [ ] Deploy to production
- [ ] Verify production deployment

### 14.3 Post-Deployment
- [ ] Test live site
- [ ] Verify all features work
- [ ] Check analytics (if applicable)
- [ ] Monitor for errors

**Phase 14 Completion Criteria:**
- ✅ Site is live and accessible
- ✅ All features work in production
- ✅ No critical issues

---

## Progress Tracking

### Overall Progress
- **Total Phases**: 14
- **Total Tasks**: ~200+
- **Current Phase**: ___
- **Completion**: ___%

### Quick Status
- [ ] Phase 1: Foundation
- [ ] Phase 2: Infrastructure
- [ ] Phase 3: Card System
- [ ] Phase 4: Dice System
- [ ] Phase 5: Timer System
- [ ] Phase 6: UI Components
- [ ] Phase 7: Pages & Routing
- [ ] Phase 8: Game Flow
- [ ] Phase 9: Animations
- [ ] Phase 10: Styling
- [ ] Phase 11: Content
- [ ] Phase 12: Testing
- [ ] Phase 13: Polish
- [ ] Phase 14: Deployment

---

## Notes

- Check off items as you complete them
- Update progress percentages regularly
- Document any deviations from the plan
- Add notes for complex implementations
- Reference this plan during code reviews

---

**Last Updated**: 2024  
**Status**: Ready for Implementation


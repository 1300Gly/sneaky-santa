import type { Card } from '../../types';
import type { RuleMode } from '../../types';
import { allCards } from '../../lib/cards/cardData';
import { getAvailableCards } from '../../lib/cards/cardFilters';

// Legacy type for backwards compatibility (if needed elsewhere)
export type CardSet = {
  mode: RuleMode;
  round1: Card[];
  round2: Card[];
  round3: Card[];
  chance: Card[];
};

/**
 * Get all cards for a specific round and mode
 * Filters the unified card list by round and mode
 */
export function getCardsForRound(mode: RuleMode, round: 1 | 2 | 3): Card[] {
  return getAvailableCards(allCards, round, mode);
}

/**
 * Get all cards for a specific mode (all rounds)
 */
export function getAllCards(mode: RuleMode): Card[] {
  return allCards.filter((card) => card.mode.includes(mode));
}

/**
 * Get a CardSet structure for a specific mode (for backwards compatibility)
 */
export function getCardSet(mode: RuleMode): CardSet {
  const allModeCards = getAllCards(mode);
  
  return {
    mode,
    round1: allModeCards.filter((card) => card.round === 1),
    round2: allModeCards.filter((card) => card.round === 2),
    round3: allModeCards.filter((card) => card.round === 3),
    chance: allModeCards.filter((card) => card.type === 'chance'),
  };
}


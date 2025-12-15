import type { Card } from '../../types';
import type { RuleMode } from '../../types';

export function filterCardsByMode(cards: Card[], mode: RuleMode): Card[] {
  return cards.filter((card) => card.mode.includes(mode));
}

export function filterCardsByRound(cards: Card[], round: 1 | 2 | 3): Card[] {
  return cards.filter((card) => card.round === round || card.round === 'all');
}

export function getAvailableCards(
  cards: Card[],
  round: 1 | 2 | 3,
  mode: RuleMode
): Card[] {
  const roundFiltered = filterCardsByRound(cards, round);
  return filterCardsByMode(roundFiltered, mode);
}


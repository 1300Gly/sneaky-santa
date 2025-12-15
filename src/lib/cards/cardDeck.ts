import type { Card } from '../../types';
import { getCardsForRound } from '../../config/cards';
import type { RuleMode } from '../../types';

export function shuffleDeck<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createDeck(round: 1 | 2 | 3, mode: RuleMode): Card[] {
  const available = getCardsForRound(mode, round);
  return shuffleDeck(available);
}

export function drawRandomCard(deck: Card[]): { card: Card; remaining: Card[] } | null {
  if (deck.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];
  const remaining = deck.filter((_, i) => i !== randomIndex);
  
  return { card, remaining };
}


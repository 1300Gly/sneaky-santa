export type CardType = 'game' | 'chance';
export type RoundNumber = 1 | 2 | 3 | 'all';

export interface Card {
  id: string;
  type: CardType;
  round: RoundNumber;
  text: string; // i18n key
  icon?: string;
  mode: ('peaceful' | 'traditional' | 'chaos' | 'adult')[];
  isSaveCard?: boolean; // Can be kept and played later
  canNullifyAction?: boolean; // Can be used to cancel actions against player
}

export interface Player {
  name: string;
  savedCards: Card[];
}

export interface CardDeckState {
  available: Card[];
  drawn: Card[];
  players: Player[]; // Players with their saved cards
  currentCard?: Card;
}


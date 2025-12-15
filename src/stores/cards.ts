import { writable } from 'svelte/store';
import type { Card, CardDeckState, Player } from '../types';

const defaultCardDeckState: CardDeckState = {
  available: [],
  drawn: [],
  players: [],
  currentCard: undefined,
};

function createCardDeckStore() {
  const { subscribe, set, update } = writable<CardDeckState>(defaultCardDeckState);

  return {
    subscribe,
    set,
    update,
    initializeDeck: (cards: Card[]) => {
      set({
        available: [...cards],
        drawn: [],
        players: [],
        currentCard: undefined,
      });
    },
    drawCard: () => {
      let drawnCard: Card | undefined;
      
      update((state) => {
        if (state.available.length === 0) {
          return state; // No cards available
        }
        
        const randomIndex = Math.floor(Math.random() * state.available.length);
        drawnCard = state.available[randomIndex];
        
        return {
          ...state,
          available: state.available.filter((_, i) => i !== randomIndex),
          drawn: [...state.drawn, drawnCard!],
          currentCard: drawnCard,
        };
      });
      
      return drawnCard;
    },
    returnCard: (card: Card) => {
      update((state) => {
        // Don't return save cards
        if (card.isSaveCard) {
          return state;
        }
        
        return {
          ...state,
          available: [...state.available, card],
          drawn: state.drawn.filter((c) => c.id !== card.id),
          currentCard: state.currentCard?.id === card.id ? undefined : state.currentCard,
        };
      });
    },
    saveCard: (card: Card, playerName: string) => {
      update((state) => {
        const existingPlayerIndex = state.players.findIndex((p) => p.name === playerName);
        
        if (existingPlayerIndex >= 0) {
          // Add card to existing player
          const updatedPlayers = [...state.players];
          updatedPlayers[existingPlayerIndex] = {
            ...updatedPlayers[existingPlayerIndex],
            savedCards: [...updatedPlayers[existingPlayerIndex].savedCards, card],
          };
          
          return {
            ...state,
            players: updatedPlayers,
            currentCard: state.currentCard?.id === card.id ? undefined : state.currentCard,
          };
        } else {
          // Create new player
          return {
            ...state,
            players: [...state.players, { name: playerName, savedCards: [card] }],
            currentCard: state.currentCard?.id === card.id ? undefined : state.currentCard,
          };
        }
      });
    },
    useSavedCard: (playerName: string, cardId: string) => {
      update((state) => {
        const playerIndex = state.players.findIndex((p) => p.name === playerName);
        
        if (playerIndex >= 0) {
          const updatedPlayers = [...state.players];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            savedCards: updatedPlayers[playerIndex].savedCards.filter((c) => c.id !== cardId),
          };
          
          return {
            ...state,
            players: updatedPlayers,
          };
        }
        
        return state;
      });
    },
    getPlayerSavedCards: (playerName: string): Card[] => {
      let cards: Card[] = [];
      
      update((state) => {
        const player = state.players.find((p) => p.name === playerName);
        cards = player?.savedCards || [];
        return state;
      });
      
      return cards;
    },
    clearCurrentCard: () => {
      update((state) => ({ ...state, currentCard: undefined }));
    },
  };
}

export const cardDeck = createCardDeckStore();


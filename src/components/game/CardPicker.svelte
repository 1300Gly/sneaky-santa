<script lang="ts">
  import { get } from 'svelte/store';
  import { cardDeck } from '../../stores/cards';
  import { translate } from '../../lib/i18n';
  import Button from '../ui/Button.svelte';
  import CardRevealModal from './CardRevealModal.svelte';
  
  // Use reactive $translate instead
  let showCardModal: boolean = false;
  
  $: currentCard = $cardDeck.currentCard;
  $: availableCards = $cardDeck.available;
  
  function handlePickCard() {
    if (availableCards.length === 0) {
      alert('No cards available!');
      return;
    }
    
    const drawnCard = cardDeck.drawCard();
    
    // Show card in modal
    if (drawnCard) {
      showCardModal = true;
    }
  }
  
  function handleCloseCardModal() {
    // Automatically discard the card (it's already in the drawn array)
    // Note: Save cards are handled within the modal itself
    if (currentCard && !currentCard.isSaveCard) {
      cardDeck.clearCurrentCard();
    }
    showCardModal = false;
  }
</script>

<div class="flex flex-col items-center">
  <button
    on:click={handlePickCard}
    disabled={availableCards.length === 0}
    class="w-full px-4 py-3 bg-[#891515] text-white rounded-lg font-bold text-base hover:bg-[#B42D1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md font-['Poppins'] lg:px-6 lg:py-4 lg:rounded-xl lg:text-lg"
  >
    {$translate('cards.pickCard')}
  </button>
</div>

{#if showCardModal && currentCard}
  <CardRevealModal
    card={currentCard}
    isOpen={showCardModal}
    onClose={handleCloseCardModal}
  />
{/if}


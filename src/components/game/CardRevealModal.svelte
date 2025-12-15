<script lang="ts">
  import { get } from 'svelte/store';
  import { translate } from '../../lib/i18n';
  import { cardDeck } from '../../stores/cards';
  import { gameState } from '../../stores/gameState';
  import Card from '../ui/Card.svelte';
  import Button from '../ui/Button.svelte';
  import Modal from '../ui/Modal.svelte';
  import type { Card as CardType } from '../../types';
  
  export let card: CardType | null = null;
  export let isOpen: boolean = false;
  export let onClose: () => void = () => {};
  
  // Use reactive $translate instead
  let isRevealed: boolean = false;
  let modalRef: Modal;
  let playerName: string = '';
  let error: string = '';
  
  function handleReveal() {
    isRevealed = true;
  }
  
  function handleCloseButton() {
    // Use the Modal's exported handleClose function to trigger animation
    if (modalRef && typeof modalRef.handleClose === 'function') {
      modalRef.handleClose();
    }
  }
  
  function handleSaveCard() {
    if (!card || !playerName.trim()) {
      error = $translate('cards.pleaseEnterPlayerName');
      return;
    }
    
    cardDeck.saveCard(card, playerName.trim());
    gameState.addPlayer(playerName.trim());
    cardDeck.clearCurrentCard();
    playerName = '';
    error = '';
    handleCloseButton();
  }
  
  function handleCancelSaveCard() {
    // Automatically discard the card (it's already in the drawn array)
    cardDeck.clearCurrentCard();
    playerName = '';
    error = '';
    handleCloseButton();
  }
  
  // Auto-reveal when modal opens (longer delay for better UX)
  $: if (isOpen && card && !isRevealed) {
    setTimeout(() => {
      isRevealed = true;
    }, 700);
  }
  
  // Reset revealed state when modal closes
  $: if (!isOpen) {
    isRevealed = false;
    playerName = '';
    error = '';
  }
</script>

<Modal
  bind:this={modalRef}
  isOpen={isOpen}
  title={card?.isSaveCard && isRevealed ? $translate('cards.claimSaveCard') : ''}
  onClose={onClose}
  size="xl"
  canClose={true}
>
  {#if card}
    <div class="flex flex-col items-center gap-6">
      <div class="w-full max-w-md">
        <Card
          card={card}
          {isRevealed}
          onReveal={handleReveal}
        />
      </div>
      
      {#if !isRevealed}
        <div class="flex justify-center">
          <Button
            variant="primary"
            size="md"
            on:click={handleCloseButton}
            disabled={false}
          >
            {$translate('common.close')}
          </Button>
        </div>
      {:else if isRevealed && !card.isSaveCard}
        <div class="flex justify-center">
          <Button
            variant="primary"
            size="md"
            on:click={handleCloseButton}
          >
            {$translate('common.close')}
          </Button>
        </div>
      {:else if isRevealed && card.isSaveCard}
        <div class="w-full max-w-md space-y-4">
          <div>
            <label for="player-name-input" class="block text-sm font-semibold text-[#294221] mb-2 font-['Open Sans']">
              {$translate('cards.playerName')}
            </label>
            <input
              id="player-name-input"
              type="text"
              bind:value={playerName}
              placeholder={$translate('cards.enterPlayerName')}
              class="w-full px-4 py-2 border-2 border-[#C6B173]/30 rounded-xl focus:ring-2 focus:ring-[#891515] focus:border-[#891515] text-[#294221] font-['Open Sans']"
              on:keydown={(e) => e.key === 'Enter' && handleSaveCard()}
              autofocus
            />
            {#if error}
              <p class="text-[#891515] text-sm mt-1 font-['Open Sans']">{error}</p>
            {/if}
          </div>
          <div class="flex gap-4 justify-end pt-4 border-t border-[#C6B173]/30">
            <Button
              variant="secondary"
              on:click={handleCancelSaveCard}
            >
              {$translate('common.cancel')}
            </Button>
            <Button
              variant="primary"
              on:click={handleSaveCard}
            >
              {$translate('cards.saveCard')}
            </Button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</Modal>


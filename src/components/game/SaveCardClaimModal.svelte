<script lang="ts">
  import { get } from 'svelte/store';
  import { cardDeck } from '../../stores/cards';
  import { gameState } from '../../stores/gameState';
  import { translate } from '../../lib/i18n';
  import Modal from '../ui/Modal.svelte';
  import Button from '../ui/Button.svelte';
  import type { Card } from '../../types';
  
  export let card: Card | null = null;
  export let isOpen: boolean = false;
  export let onClose: () => void = () => {};
  
  // Use reactive $translate instead
  let playerName: string = '';
  let error: string = '';
  
  // Get translation function for use in regular functions
  $: t = $translate;
  
  function handleSave() {
    if (!card || !playerName.trim()) {
      error = t('cards.pleaseEnterPlayerName');
      return;
    }
    
    cardDeck.saveCard(card, playerName.trim());
    gameState.addPlayer(playerName.trim());
    cardDeck.clearCurrentCard();
    playerName = '';
    error = '';
    onClose();
  }
  
  function handleCancel() {
    // Automatically discard the card (it's already in the drawn array)
    cardDeck.clearCurrentCard();
    playerName = '';
    error = '';
    onClose();
  }
</script>

<Modal
  {isOpen}
  title={$translate('cards.claimSaveCard')}
  {onClose}
  size="md"
>
  {#if card}
    <div class="space-y-4">
      <div class="p-4 bg-[#C6B173]/20 border border-[#C6B173] rounded-xl">
        <p class="text-[#294221] whitespace-pre-line">{card.text}</p>
      </div>
      
      <div>
        <label for="player-name-input" class="block text-sm font-semibold text-[#294221] mb-2">
          {$translate('cards.playerName')}
        </label>
        <input
          id="player-name-input"
          type="text"
          bind:value={playerName}
          placeholder={$translate('cards.enterPlayerName')}
          class="w-full px-4 py-2 border-2 border-[#C6B173]/30 rounded-xl focus:ring-2 focus:ring-[#891515] focus:border-[#891515] text-[#294221]"
          on:keydown={(e) => e.key === 'Enter' && handleSave()}
        />
        {#if error}
          <p class="text-[#891515] text-sm mt-1">{error}</p>
        {/if}
      </div>
    </div>
  {/if}
  
  <div slot="footer" class="flex gap-4 justify-end">
    <Button
      variant="secondary"
      on:click={handleCancel}
    >
      {$translate('common.cancel')}
    </Button>
    <Button
      variant="primary"
      on:click={handleSave}
    >
      {$translate('cards.saveCard')}
    </Button>
  </div>
</Modal>


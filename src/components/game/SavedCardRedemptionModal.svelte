<script lang="ts">
  import { get } from 'svelte/store';
  import { cardDeck } from '../../stores/cards';
  import { translate } from '../../lib/i18n';
  import Modal from '../ui/Modal.svelte';
  import Button from '../ui/Button.svelte';
  import type { Card } from '../../types';
  
  export let playerName: string = '';
  export let isOpen: boolean = false;
  export let onClose: () => void = () => {};
  export let onUseCard: (() => void) | null = null;
  
  // Use reactive $translate instead
  
  $: savedCards = $cardDeck.players.find((p) => p.name === playerName)?.savedCards || [];
  
  function handleUseCard(card: Card) {
    cardDeck.useSavedCard(playerName, card.id);
    if (onUseCard) {
      onUseCard();
    }
    onClose();
  }
  
  function handleContinue() {
    onClose();
  }
</script>

<Modal
  {isOpen}
  title="{playerName} - {$translate('cards.savedCards')}"
  {onClose}
  size="lg"
>
  <div class="space-y-4">
    <p class="text-gray-700">
      {$translate('cards.nullifyAction')}
    </p>
    
    {#if savedCards.length === 0}
      <p class="text-gray-500 text-center py-4">{$translate('cards.noSavedCards')}</p>
    {:else}
      <div class="space-y-3">
        {#each savedCards as card}
          <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-gray-800 mb-3 whitespace-pre-line">{card.text}</p>
            <Button
              variant="primary"
              size="sm"
              on:click={() => handleUseCard(card)}
            >
              {$translate('cards.useSavedCard')}
            </Button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <div slot="footer" class="flex gap-4 justify-end">
    <Button
      variant="secondary"
      on:click={handleContinue}
    >
      {$translate('common.continue')}
    </Button>
  </div>
</Modal>


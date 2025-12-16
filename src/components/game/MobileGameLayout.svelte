<script lang="ts">
  import { gameState } from '../../stores/gameState';
  import { cardDeck } from '../../stores/cards';
  import { settings } from '../../stores/settings';
  import { translate } from '../../lib/i18n';
  import { getDiceRules } from '../../config/rulesets';
  import MobileTimer from './MobileTimer.svelte';
  import CardRevealModal from './CardRevealModal.svelte';
  import DiceModal from './DiceModal.svelte';
  import SavedCardRedemptionModal from './SavedCardRedemptionModal.svelte';
  import Button from '../ui/Button.svelte';
  
  export let onSkipRound: () => void = () => {};
  export let onGoHome: () => void = () => {};
  export let onShowSavedCards: (playerName: string) => void = () => {};
  export let onDiceRoll: (value: number) => void = () => {};
  
  $: currentRound = $gameState.currentRound;
  $: ruleMode = $gameState.ruleMode;
  $: playersWithSavedCards = $cardDeck.players.filter(p => p.savedCards.length > 0);
  $: availableCards = $cardDeck.available;
  $: currentCard = $cardDeck.currentCard;
  let showDiceModal = false;
  let showCardModal = false;
  
  function handleDiceRoll(value: number) {
    onDiceRoll(value);
    // Don't close the modal - let user close it manually
  }
  
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

<div class="flex flex-col min-h-screen">
  <!-- Main Content Area - Scrollable -->
  <div class="flex-1 overflow-y-auto pb-20">
    <div class="space-y-2">
      <!-- Compact Timer at Top -->
      <div class="flex-shrink-0">
        <MobileTimer onRoundOver={() => {}} />
      </div>
      
      <!-- Round Header -->
      <div class="bg-[#891515] rounded-lg px-3 py-2 flex items-center justify-between flex-shrink-0">
        <h2 class="text-lg font-bold text-white font-['Poppins']">{$translate('rounds.round')} {currentRound}</h2>
        <div class="flex gap-1.5">
          {#each [1, 2, 3] as round}
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white border-2 border-white transition-all font-['Poppins'] {
                round === currentRound ? 'bg-[#891515]' :
                round < currentRound ? 'bg-white text-[#891515]' :
                'bg-transparent'
              }"
            >
              {round}
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Dice Rules - Compact -->
      <div class="bg-white rounded-lg p-3 shadow-md flex-shrink-0">
        <h3 class="text-sm font-bold mb-2 text-[#294221] font-['Poppins']">{$translate('setup.diceRulesRound').replace('{round}', String(currentRound))}</h3>
        <div class="space-y-1.5">
          {#each Object.entries(getDiceRules(currentRound, ruleMode)) as [value, ruleKey], i}
            <div class="flex items-start gap-2">
              <div class="flex-shrink-0 w-6 h-6 bg-[#891515] rounded-full flex items-center justify-center font-bold text-xs text-white font-['Poppins']">
                {value}
              </div>
              <p class="text-xs text-[#294221] flex-1 leading-snug font-['Open Sans'] pt-0.5">{$translate(ruleKey)}</p>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Saved Cards Section -->
      {#if playersWithSavedCards.length > 0}
        <div class="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
          <div class="bg-[#891515] px-3 py-1.5">
            <h3 class="text-sm font-semibold text-white font-['Poppins']">{$translate('cards.savedCards')}</h3>
          </div>
          <div class="p-2 space-y-1.5">
            {#each playersWithSavedCards as player}
              <div class="flex items-center justify-between gap-2 p-2 bg-[#C6B173]/10 border border-[#C6B173]/30 rounded-lg">
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-xs text-[#294221] mb-0.5 font-['Open Sans'] truncate">{player.name}</p>
                  <p class="text-xs text-[#294221]/70 font-['Open Sans']">
                    {player.savedCards.length} {$translate('cards.savedCards')}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    on:click={() => onShowSavedCards(player.name)}
                    class="text-xs px-2 py-1"
                  >
                    {$translate('cards.useSavedCard')}
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Fixed Action Bar at Bottom -->
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10 px-3 py-3">
    <!-- Primary Action Buttons: Roll Dice (biggest) and Draw Card -->
    <div class="flex gap-2 mb-2">
      {#if $settings.digitalDiceEnabled}
        <button
          on:click={() => showDiceModal = true}
          class="flex-[1.2] px-4 py-4 bg-[#385025] text-white rounded-xl font-bold hover:bg-[#294221] transition-colors shadow-md font-['Poppins'] text-base"
        >
          🎲 {$translate('setup.rollDice')}
        </button>
      {/if}
      <button
        on:click={handlePickCard}
        disabled={availableCards.length === 0}
        class="flex-1 px-4 py-4 bg-[#891515] text-white rounded-xl font-bold hover:bg-[#B42D1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md font-['Poppins'] text-base"
      >
        {$translate('cards.pickCard')}
      </button>
    </div>
    
    <!-- Secondary Navigation Buttons -->
    <div class="flex gap-2">
      {#if currentRound < 3}
        <Button
          variant="secondary"
          size="sm"
          on:click={onSkipRound}
          class="flex-1 text-xs py-2"
        >
          {$translate('game.skipToNextRound')}
        </Button>
      {/if}
      <Button
        variant="secondary"
        size="sm"
        on:click={onGoHome}
        class="flex-1 text-xs py-2"
      >
        {$translate('common.home')}
      </Button>
    </div>
  </div>
</div>

<!-- Card Reveal Modal -->
{#if showCardModal && currentCard}
  <CardRevealModal
    card={currentCard}
    isOpen={showCardModal}
    onClose={handleCloseCardModal}
  />
{/if}

<!-- Dice Modal -->
<DiceModal
  isOpen={showDiceModal}
  onClose={() => showDiceModal = false}
  onRoll={handleDiceRoll}
/>


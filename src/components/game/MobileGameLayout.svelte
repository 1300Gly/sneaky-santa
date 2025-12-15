<script lang="ts">
  import { gameState } from '../../stores/gameState';
  import { cardDeck } from '../../stores/cards';
  import { settings } from '../../stores/settings';
  import { translate } from '../../lib/i18n';
  import { getDiceRules } from '../../config/rulesets';
  import MobileTimer from './MobileTimer.svelte';
  import CardPicker from './CardPicker.svelte';
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
  let showDiceModal = false;
  
  function handleDiceRoll(value: number) {
    onDiceRoll(value);
    // Don't close the modal - let user close it manually
  }
</script>

<div class="flex flex-col min-h-0 max-h-[calc(100vh-140px)] overflow-y-auto pb-4 space-y-2">
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
  
  <!-- Card Picker -->
  <div class="flex-shrink-0">
    <CardPicker />
  </div>
  
  <!-- Dice Button (if enabled) -->
  {#if $settings.digitalDiceEnabled}
    <div class="flex-shrink-0">
      <button
        on:click={() => showDiceModal = true}
        class="w-full px-4 py-2.5 bg-[#385025] text-white rounded-lg font-semibold hover:bg-[#294221] transition-colors shadow-md font-['Poppins'] text-sm"
      >
        🎲 {$translate('setup.rollDice')}
      </button>
    </div>
  {/if}
  
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
  
  <!-- Navigation Buttons -->
  <div class="bg-white rounded-lg p-2 space-y-1.5 shadow-md flex-shrink-0">
    {#if currentRound < 3}
      <Button
        variant="secondary"
        size="sm"
        on:click={onSkipRound}
        class="w-full text-sm"
      >
        {$translate('game.skipToNextRound')}
      </Button>
    {/if}
    <Button
      variant="secondary"
      size="sm"
      on:click={onGoHome}
      class="w-full text-sm"
    >
      {$translate('common.home')}
    </Button>
  </div>
</div>

<!-- Dice Modal -->
<DiceModal
  isOpen={showDiceModal}
  onClose={() => showDiceModal = false}
  onRoll={handleDiceRoll}
/>


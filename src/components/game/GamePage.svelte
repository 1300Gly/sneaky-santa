<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { gameState } from '../../stores/gameState';
  import { cardDeck } from '../../stores/cards';
  import { createDeck } from '../../lib/cards/cardDeck';
  import RoundExplanation from './RoundExplanation.svelte';
  import RoundIndicator from './RoundIndicator.svelte';
  import Timer from './Timer.svelte';
  import DiceRules from './DiceRules.svelte';
  import CardPicker from './CardPicker.svelte';
  import DigitalDice from './DigitalDice.svelte';
  import MobileGameLayout from './MobileGameLayout.svelte';
  import SavedCardRedemptionModal from './SavedCardRedemptionModal.svelte';
  import Button from '../ui/Button.svelte';
  import Modal from '../ui/Modal.svelte';
  import { settings } from '../../stores/settings';
  import { restoreGameState, restoreSettings } from '../../lib/persistence/stateManager';
  import { clearState } from '../../lib/persistence/storage';
  import { translate } from '../../lib/i18n';
  
  $: roundStatus = $gameState.roundStatus;
  $: currentRound = $gameState.currentRound;
  $: ruleMode = $gameState.ruleMode;
  $: playersWithSavedCards = $cardDeck.players.filter(p => p.savedCards.length > 0);
  let showSkipRoundModal = false;
  let showHomeModal = false;
  let showSavedCardRedemptionModal = false;
  let selectedPlayerForRedemption: string = '';
  
  onMount(() => {
    // Restore state and settings from localStorage
    restoreSettings();
    const restored = restoreGameState();
    console.log('GamePage mounted, restored state:', restored, 'roundStatus:', $gameState.roundStatus);
    
    // Debug: Check localStorage directly
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('pass-the-present:settings');
      console.log('Raw localStorage settings:', savedSettings);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          console.log('Parsed settings:', parsed);
          console.log('digitalDiceEnabled in localStorage:', parsed.digitalDiceEnabled);
        } catch (e) {
          console.error('Failed to parse settings:', e);
        }
      }
      console.log('Settings store after restore:', $settings);
      console.log('digitalDiceEnabled in store:', $settings.digitalDiceEnabled);
    }

    // Wait a bit for state to settle, then initialize deck if needed
    setTimeout(() => {
      console.log('After timeout, roundStatus:', $gameState.roundStatus);
      console.log('Settings after timeout:', $settings);
      // Only initialize deck if we're in playing mode and deck is empty
      if ($cardDeck.available.length === 0 && roundStatus === 'playing') {
        const deck = createDeck(currentRound, ruleMode);
        cardDeck.initializeDeck(deck);
      }
    }, 300);
  });
  
  // Debug: log when roundStatus changes
  $: console.log('roundStatus changed to:', roundStatus);
  
  // Watch for round changes and reinitialize deck
  $: if (roundStatus === 'playing' && $cardDeck.available.length === 0) {
    const deck = createDeck(currentRound, ruleMode);
    cardDeck.initializeDeck(deck);
  }
  
  // Initialize deck when entering explanation mode (for the upcoming round)
  $: if (roundStatus === 'explanation' && $cardDeck.available.length === 0) {
    // Deck will be initialized when round starts
  }
  
  function handleNextRound() {
    if (currentRound < 3) {
      gameState.updateRound((currentRound + 1) as 1 | 2 | 3);
    } else {
      // Game complete
      gameState.updateRoundStatus('finished');
    }
  }
  
  function handleDiceRoll(value: number) {
    // Handle dice roll - could trigger card draw or other actions
    console.log('Dice rolled:', value);
  }
  
  function handleSkipRound() {
    showSkipRoundModal = true;
  }
  
  function confirmSkipRound() {
    if (currentRound < 3) {
      gameState.updateRound((currentRound + 1) as 1 | 2 | 3);
    } else {
      gameState.updateRoundStatus('finished');
    }
    showSkipRoundModal = false;
  }
  
  function cancelSkipRound() {
    showSkipRoundModal = false;
  }
  
  function handleGoHome() {
    showHomeModal = true;
  }
  
  function confirmGoHome() {
    // Clear game state from localStorage when leaving the game
    if (typeof window !== 'undefined') {
      clearState('pass-the-present:game-state');
      clearState('pass-the-present:state-version');
      // Also reset the game state store
      gameState.reset();
      console.log('Game state cleared, redirecting to home');
    }
    window.location.href = '/';
  }
  
  function cancelGoHome() {
    showHomeModal = false;
  }
  
  function handleShowSavedCards(playerName: string) {
    selectedPlayerForRedemption = playerName;
    showSavedCardRedemptionModal = true;
  }
  
  function handleCloseSavedCardRedemptionModal() {
    showSavedCardRedemptionModal = false;
    selectedPlayerForRedemption = '';
  }
  
  function handleUseSavedCard() {
    // Card has been used, modal will close automatically
    // This callback can be used for any additional logic if needed
  }
</script>

<div>
  {#if roundStatus === 'setup'}
    <!-- Redirect to homepage for setup -->
    <div class="card flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto">
                  <p class="text-[#294221] mb-4">{$translate('common.pleaseConfigure')}</p>
                  <Button variant="primary" on:click={confirmGoHome}>
                    {$translate('common.goToHomepage')}
                  </Button>
    </div>
  {:else if roundStatus === 'explanation'}
    {#key `${currentRound}-${roundStatus}`}
      <RoundExplanation />
    {/key}
  {:else if roundStatus === 'playing' || roundStatus === 'paused'}
    <!-- Mobile Layout -->
    <div class="lg:hidden container mx-auto px-4">
      <MobileGameLayout
        onSkipRound={handleSkipRound}
        onGoHome={handleGoHome}
        onShowSavedCards={handleShowSavedCards}
        onDiceRoll={handleDiceRoll}
      />
    </div>
    
    <!-- Desktop Layout -->
    <div class="hidden lg:block container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <!-- Left Panel: Rules and Card Picker -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- Header with Round Number and Indicators -->
            <div class="bg-[#891515] px-6 py-4 flex items-center justify-between">
              <h2 class="text-3xl font-bold text-white font-['Poppins']">{$translate('rounds.round')} {currentRound}</h2>
              <div class="flex gap-2">
                {#each [1, 2, 3] as round}
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white border-2 border-white transition-all font-['Poppins'] {
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
            
            <!-- Body with Dice Rules and Card Picker -->
            <div class="p-6 space-y-6">
              <DiceRules />
              <CardPicker />
            </div>
          </div>
        </div>
        
        <!-- Right Panel: Timer, Navigation, and Dice -->
        <div class="lg:col-span-1 space-y-6">
          <Timer onRoundOver={() => {
            // Timer component will handle showing the modal
          }} />
          
          <!-- Saved Cards Section -->
          {#if playersWithSavedCards.length > 0}
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="bg-[#891515] px-6 py-3">
                <h3 class="text-lg font-semibold text-white font-['Poppins']">{$translate('cards.savedCards')}</h3>
              </div>
              <div class="p-4 space-y-3">
                {#each playersWithSavedCards as player}
                  <div class="flex items-center justify-between gap-3 p-4 bg-[#C6B173]/10 border border-[#C6B173]/30 rounded-lg hover:bg-[#C6B173]/20 transition-colors">
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-[#294221] mb-1 font-['Open Sans'] truncate">{player.name}</p>
                      <p class="text-sm text-[#294221]/70 font-['Open Sans']">
                        {player.savedCards.length} {$translate('cards.savedCards')}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        on:click={() => handleShowSavedCards(player.name)}
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
          <div class="bg-white rounded-xl p-4 space-y-3">
            {#if currentRound < 3}
              <div class="w-full">
                <Button
                  variant="secondary"
                  size="sm"
                  on:click={handleSkipRound}
                >
                  {$translate('game.skipToNextRound')}
                </Button>
              </div>
            {/if}
            <div class="w-full">
              <Button
                variant="secondary"
                size="sm"
                on:click={handleGoHome}
              >
                {$translate('common.home')}
              </Button>
            </div>
          </div>
          
          <!-- Digital Dice -->
          {#if $settings.digitalDiceEnabled}
            <DigitalDice enabled={$settings.digitalDiceEnabled} onRoll={handleDiceRoll} />
          {/if}
        </div>
      </div>
    </div>
  {:else if roundStatus === 'finished'}
    <div class="card max-w-2xl mx-auto text-center animate-fade-in">
      <h1 class="text-4xl font-bold text-[#385025] mb-4 animate-scale-in">🎉 {$translate('game.gameComplete')} 🎉</h1>
      <p class="text-xl text-[#294221] mb-8 animate-slide-in" style="animation-delay: 200ms">
        {$translate('game.allRoundsFinished')}
      </p>
      <div class="animate-slide-in transform transition-transform hover:scale-105" style="animation-delay: 400ms">
        <Button
          variant="primary"
          size="lg"
          on:click={() => gameState.reset()}
        >
          {$translate('game.startNewGame')}
        </Button>
      </div>
    </div>
  {/if}
</div>

<!-- Skip Round Confirmation Modal -->
  <Modal
    isOpen={showSkipRoundModal}
    title={$translate('game.skipToNextRoundTitle')}
    onClose={cancelSkipRound}
    size="md"
  >
    <p class="text-gray-700">
      {$translate('game.skipToNextRoundConfirm').replace('{round}', String(currentRound + 1))}
    </p>
    <div slot="footer" class="flex gap-4 justify-end">
      <Button variant="secondary" on:click={cancelSkipRound}>
        {$translate('common.cancel')}
      </Button>
      <Button variant="danger" on:click={confirmSkipRound}>
        {$translate('game.skipToNextRound')}
      </Button>
    </div>
  </Modal>

<!-- Go Home Confirmation Modal -->
  <Modal
    isOpen={showHomeModal}
    title={$translate('game.leaveGameTitle')}
    onClose={cancelGoHome}
    size="md"
  >
    <p class="text-gray-700">
      {$translate('game.leaveGameConfirm')}
    </p>
    <div slot="footer" class="flex gap-4 justify-end">
      <Button variant="secondary" on:click={cancelGoHome}>
        {$translate('common.cancel')}
      </Button>
      <Button variant="danger" on:click={confirmGoHome}>
        {$translate('game.leaveGame')}
      </Button>
    </div>
  </Modal>

<!-- Saved Card Redemption Modal -->
  {#if selectedPlayerForRedemption}
    <SavedCardRedemptionModal
      playerName={selectedPlayerForRedemption}
      isOpen={showSavedCardRedemptionModal}
      onClose={handleCloseSavedCardRedemptionModal}
      onUseCard={handleUseSavedCard}
    />
  {/if}


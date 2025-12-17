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
  import Countdown from '../ui/Countdown.svelte';
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
  let previousRound = currentRound;
  let isTimerFadingOut = false;
  let timerKey = 0;
  // Independent countdown state - not tied to roundStatus
  let showCountdown = false;
  
  // Track round changes for Timer fade-out/fade-in transition
  $: if (roundStatus === 'playing' || roundStatus === 'paused') {
    if (currentRound !== previousRound && !isTimerFadingOut) {
      // Round changed - fade out timer first
      isTimerFadingOut = true;
      setTimeout(() => {
        // Force re-render of Timer component with new round
        timerKey++;
        isTimerFadingOut = false;
        previousRound = currentRound;
      }, 300); // Wait for fade-out animation to complete
    } else if (currentRound === previousRound && !isTimerFadingOut) {
      // Keep in sync when not transitioning
      previousRound = currentRound;
    }
  } else {
    // Reset when not in playing mode
    previousRound = currentRound;
    isTimerFadingOut = false;
  }
  
  onMount(() => {
    // Restore state and settings from localStorage
    restoreSettings();
    restoreGameState();

    // Wait a bit for state to settle, then initialize deck if needed
    setTimeout(() => {
      // Only initialize deck if we're in playing mode and deck is empty
      if ($cardDeck.available.length === 0 && roundStatus === 'playing') {
        const deck = createDeck(currentRound, ruleMode);
        cardDeck.initializeDeck(deck);
      }
    }, 300);
  });
  
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
  
  function handleCountdownComplete() {
    // Immediately change game state so game UI can start animating
    gameState.updateRoundStatus('playing');
    
    // Start timer if enabled for this round
    const roundSettings = $gameState.roundSettings[`round${currentRound}` as 'round1' | 'round2' | 'round3'];
    if (roundSettings.timeLimitEnabled && roundSettings.timeLimit > 0) {
      import('../../stores/timer').then(({ timer }) => {
        import('../../lib/timer/timerUtils').then(({ convertMinutesToSeconds }) => {
          timer.startTimer(convertMinutesToSeconds(roundSettings.timeLimit), currentRound);
        });
      });
    }
    
    // Keep countdown mounted until fade-out completes (600ms for GO! visibility + 300ms for fade-out)
    setTimeout(() => {
      showCountdown = false;
    }, 900); // 600ms GO! visibility + 300ms fade-out animation
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
      <RoundExplanation onStartCountdown={() => showCountdown = true} />
    {/key}
  {:else if roundStatus === 'playing' || roundStatus === 'paused'}
    <!-- Mobile Layout -->
    <div class="lg:hidden">
      <MobileGameLayout
        onSkipRound={handleSkipRound}
        onGoHome={handleGoHome}
        onShowSavedCards={handleShowSavedCards}
        onDiceRoll={handleDiceRoll}
      />
    </div>
    
    <!-- Desktop Layout -->
    <div class="hidden lg:block container mx-auto px-4">
      {#key `${currentRound}-${roundStatus}`}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <!-- Left Panel: Rules and Card Picker -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden opacity-0 -translate-y-5 animate-slide-in" style="animation-delay: 100ms; animation-duration: 0.6s; animation-fill-mode: forwards;">
              <!-- Header with Round Number and Indicators -->
              <div class="bg-[#891515] px-6 py-4 flex items-center justify-between">
                <h2 class="text-3xl font-bold text-white font-['Poppins']">{$translate('rounds.round')} {currentRound}</h2>
                <div class="flex gap-2">
                  {#each [1, 2, 3] as round, i}
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white transition-all font-['Poppins'] opacity-0 animate-slide-in {
                        round === currentRound ? 'bg-white text-[#891515] border-white' :
                        'bg-transparent text-white/50 border-white/50'
                      }"
                      style="animation-delay: {200 + i * 50}ms; animation-duration: 0.5s; animation-fill-mode: forwards;"
                    >
                      {round}
                    </div>
                  {/each}
                </div>
              </div>
              
              <!-- Body with Dice Rules and Card Picker -->
              <div class="p-6 space-y-6">
                <div class="opacity-0 -translate-y-5 animate-slide-in" style="animation-delay: 300ms; animation-duration: 0.6s; animation-fill-mode: forwards;">
                  <DiceRules />
                </div>
                <div class="opacity-0 -translate-y-5 animate-slide-in" style="animation-delay: 400ms; animation-duration: 0.6s; animation-fill-mode: forwards;">
                  <CardPicker />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Panel: Timer, Navigation, and Dice -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Timer with fade-out/fade-in transition -->
            {#key `timer-${timerKey}-${currentRound}`}
              <div class={isTimerFadingOut ? 'animate-fade-out' : 'opacity-0 -translate-y-5 animate-slide-in'} style={isTimerFadingOut ? 'animation-duration: 0.3s; animation-fill-mode: forwards;' : 'animation-delay: 150ms; animation-duration: 0.6s; animation-fill-mode: forwards;'}>
                <Timer onRoundOver={() => {
                  // Timer component will handle showing the modal
                }} />
              </div>
            {/key}
            
            <!-- Saved Cards Section -->
            {#if playersWithSavedCards.length > 0}
              <div class="bg-white rounded-xl shadow-lg overflow-hidden opacity-0 -translate-y-5 animate-slide-in" style="animation-delay: 500ms; animation-duration: 0.6s; animation-fill-mode: forwards;">
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
            <div class="bg-white rounded-xl p-4 space-y-3 opacity-0 -translate-y-5 animate-slide-in" style="animation-delay: 600ms; animation-duration: 0.6s; animation-fill-mode: forwards;">
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
              <div class="opacity-0 -translate-y-5 animate-slide-in" style="animation-delay: 700ms; animation-duration: 0.6s; animation-fill-mode: forwards;">
                <DigitalDice enabled={$settings.digitalDiceEnabled} onRoll={handleDiceRoll} />
              </div>
            {/if}
          </div>
        </div>
      {/key}
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

<!-- Countdown - Independent of roundStatus, stays mounted during transitions -->
{#if showCountdown}
  <Countdown
    startValue={3}
    onComplete={handleCountdownComplete}
  />
{/if}


<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { timer } from '../../stores/timer';
  import { gameState } from '../../stores/gameState';
  import { formatTime, checkWarningThresholds } from '../../lib/timer/timerUtils';
  import { triggerWarning } from '../../lib/timer/notifications';
  import { translate } from '../../lib/i18n';
  import TimerWarningModal from '../ui/TimerWarningModal.svelte';
  import RoundOverModal from './RoundOverModal.svelte';
  
  export let onRoundOver: (() => void) | null = null;
  export let onWarning: ((message: string, timeRemaining: number) => void) | null = null;
  export let onRoundOverShow: (() => void) | null = null;
  export let onResetConfirm: (() => void) | null = null;
  
  let showResetConfirm: boolean = false;
  let isResetConfirmVisible: boolean = false;
  let isResetConfirmAnimating: boolean = false;
  let showWarning: boolean = false;
  let showRoundOver: boolean = false;
  let warningMessage: string = '';
  let warningTimeRemaining: number = 0;
  let totalTime: number = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let roundOverIntervalId: ReturnType<typeof setInterval> | null = null;
  
  $: timeRemaining = $timer.timeRemaining;
  $: isRunning = $timer.isRunning;
  $: isPaused = $timer.isPaused;
  $: currentRound = $timer.round;
  $: warningsShown = $timer.warningsShown;
  
  onMount(() => {
    // Check for warnings and round over periodically
    intervalId = setInterval(() => {
      // Check if timer reached 0 (timer stops when it reaches 0, so isRunning becomes false)
      if (!isRunning && timeRemaining === 0 && totalTime > 0 && !showRoundOver) {
        // Notify parent to show round over modal
        if (onRoundOverShow) {
          onRoundOverShow();
        } else {
          // Fallback to local modal if no parent handler
          showRoundOver = true;
        }
        // Play round end sound
        import('../../lib/timer/notifications').then(({ triggerRoundEnd }) => {
          triggerRoundEnd();
        }).catch(() => {
          // Ignore if import fails
        });
        if (onRoundOver) {
          onRoundOver();
        }
        return;
      }
      
      // Check for warnings only when timer is running
      if (isRunning && !isPaused && totalTime > 0) {
        // Check for warnings
        const warning = checkWarningThresholds(timeRemaining, totalTime, warningsShown);
        
        if (warning) {
          timer.markWarningShown(warning.warning);
          warningMessage = warning.message;
          warningTimeRemaining = timeRemaining;
          // Notify parent to show warning modal
          if (onWarning) {
            onWarning(warning.message, timeRemaining);
          } else {
            // Fallback to local modal if no parent handler
            showWarning = true;
          }
          triggerWarning({
            type: warning.warning,
            message: warning.message,
            timeRemaining,
          });
        }
      }
    }, 1000);
  });
  
  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (roundOverIntervalId) {
      clearInterval(roundOverIntervalId);
    }
  });
  
  function handleNextRound() {
    showRoundOver = false;
    if (currentRound < 3) {
      gameState.updateRound((currentRound + 1) as 1 | 2 | 3);
      gameState.updateRoundStatus('explanation');
    } else {
      gameState.updateRoundStatus('finished');
    }
    timer.resetTimer();
  }
  
  function handleCloseRoundOver() {
    // Modal can't be closed, but this is here for consistency
    handleNextRound();
  }
  
  function handlePause() {
    if (isPaused) {
      timer.resumeTimer();
    } else {
      timer.pauseTimer();
    }
  }
  
  function handleReset() {
    // Notify parent to show reset confirmation modal
    if (onResetConfirm) {
      onResetConfirm();
    } else {
      // Fallback to local modal if no parent handler
      showResetConfirm = true;
      setTimeout(() => {
        isResetConfirmVisible = true;
      }, 10);
    }
  }
  
  function confirmReset() {
    isResetConfirmVisible = false;
    isResetConfirmAnimating = true;
    setTimeout(() => {
      timer.resetTimer();
      showResetConfirm = false;
      isResetConfirmAnimating = false;
      totalTime = 0;
    }, 300);
  }
  
  function cancelReset() {
    isResetConfirmVisible = false;
    isResetConfirmAnimating = true;
    setTimeout(() => {
      showResetConfirm = false;
      isResetConfirmAnimating = false;
    }, 300);
  }
  
  function closeWarning() {
    showWarning = false;
  }
  
  // Update totalTime when timer starts
  $: if (isRunning && !isPaused && totalTime === 0) {
    totalTime = timeRemaining;
  }
  
  // Check if this is round 1 with no timer
  $: roundSettings = $gameState.roundSettings[`round${currentRound}` as 'round1' | 'round2' | 'round3'];
  $: isRound1NoTimer = currentRound === 1 && (!roundSettings.timeLimitEnabled || roundSettings.timeLimit === 0);
</script>

<div class="bg-[#891515] rounded-xl p-6 flex flex-col items-center gap-4">
  {#if isRound1NoTimer}
    <h2 class="text-xl font-bold text-white font-['Poppins']">{$translate('timer.timeRemaining')}:</h2>
    <div class="text-lg font-semibold text-white text-center px-4 py-2">
      {$translate('timer.round1NoTimer')}
    </div>
  {:else if timeRemaining === 0}
    <h2 class="text-xl font-bold text-white font-['Poppins']">{$translate('timer.roundOver')}</h2>
    <div class="text-7xl font-bold text-white font-['Poppins']">
      {formatTime(timeRemaining)}
    </div>
  {:else}
    <h2 class="text-xl font-bold text-white font-['Poppins']">{$translate('timer.timeRemaining')}</h2>
    <div class="text-7xl font-bold text-white font-['Poppins'] {isPaused ? 'opacity-75' : ''}" class:animate-pulse={timeRemaining <= 60 && !isPaused}>
      {formatTime(timeRemaining)}
    </div>
    {#if isPaused}
      <p class="text-sm text-white/80 font-semibold font-['Open Sans']">{$translate('timer.paused')}</p>
    {/if}
  {/if}
  
  {#if !isRound1NoTimer}
    <div class="flex gap-3 w-full">
      {#if isRunning}
        <button
          on:click={handlePause}
          class="flex-1 px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors font-['Open Sans']"
        >
          {isPaused ? $translate('common.resume') : $translate('common.pause')}
        </button>
      {/if}
      
      <button
        on:click={handleReset}
        class="px-6 py-2 bg-[#385025] text-white rounded-lg font-semibold hover:bg-[#294221] transition-colors font-['Open Sans']"
      >
        {$translate('common.reset')}
      </button>
    </div>
  {/if}
</div>

<!-- Reset confirmation modal rendered at parent level for proper z-index -->
{#if (showResetConfirm || isResetConfirmAnimating) && !onResetConfirm}
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 modal-backdrop" class:backdrop-enter={isResetConfirmVisible} class:backdrop-exit={!isResetConfirmVisible && isResetConfirmAnimating} style="position: fixed;">
    <div class="card max-w-md w-full mx-4 modal-spring" class:modal-enter={isResetConfirmVisible} class:modal-exit={!isResetConfirmVisible && isResetConfirmAnimating}>
      <h3 class="text-2xl font-bold mb-4 text-[#294221]">{$translate('timer.resetConfirm')}</h3>
      <p class="text-[#294221] font-open-sans mb-4">
        {$translate('timer.resetConfirmMessage')}
      </p>
      <div class="flex gap-4 justify-end">
        <button
          on:click={cancelReset}
          class="px-6 py-3 bg-[#385025] text-white rounded-xl font-semibold hover:bg-[#294221] transition-colors border-2 border-[#385025] shadow-md"
        >
          {$translate('common.cancel')}
        </button>
        <button
          on:click={confirmReset}
          class="px-6 py-3 bg-[#891515] text-white rounded-xl font-semibold hover:bg-[#B42D1A] transition-colors border-2 border-[#891515] shadow-md"
        >
          {$translate('common.confirm')}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Warning modal rendered at parent level for proper z-index -->
{#if showWarning && !onWarning}
  <TimerWarningModal
    message={warningMessage}
    timeRemaining={warningTimeRemaining}
    onClose={closeWarning}
    autoDismiss={true}
    dismissDelay={4000}
  />
{/if}

<!-- Round over modal rendered at parent level for proper z-index -->
{#if showRoundOver && !onRoundOverShow}
  <RoundOverModal
    isOpen={showRoundOver}
    currentRound={currentRound}
    onNextRound={handleNextRound}
    onClose={handleCloseRoundOver}
  />
{/if}


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
    intervalId = setInterval(() => {
      if (!isRunning && timeRemaining === 0 && totalTime > 0 && !showRoundOver) {
        showRoundOver = true;
        import('../../lib/timer/notifications').then(({ triggerRoundEnd }) => {
          triggerRoundEnd();
        }).catch(() => {});
        if (onRoundOver) {
          onRoundOver();
        }
        return;
      }
      
      if (isRunning && !isPaused && totalTime > 0) {
        const warning = checkWarningThresholds(timeRemaining, totalTime, warningsShown);
        
        if (warning) {
          timer.markWarningShown(warning.warning);
          warningMessage = warning.message;
          warningTimeRemaining = timeRemaining;
          showWarning = true;
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
    showResetConfirm = true;
    setTimeout(() => {
      isResetConfirmVisible = true;
    }, 10);
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
  
  $: if (isRunning && !isPaused && totalTime === 0) {
    totalTime = timeRemaining;
  }
  
  $: roundSettings = $gameState.roundSettings[`round${currentRound}` as 'round1' | 'round2' | 'round3'];
  $: isRound1NoTimer = currentRound === 1 && (!roundSettings.timeLimitEnabled || roundSettings.timeLimit === 0);
</script>

<div class="bg-[#891515] rounded-lg p-3 flex items-center justify-between gap-3">
  <div class="flex-1 min-w-0">
    {#if isRound1NoTimer}
      <div class="text-xs font-semibold text-white/80 font-['Poppins'] mb-1">{$translate('timer.timeRemaining')}</div>
      <div class="text-sm font-semibold text-white font-['Poppins']">
        {$translate('timer.round1NoTimer')}
      </div>
    {:else if timeRemaining === 0}
      <div class="text-xs font-semibold text-white/80 font-['Poppins'] mb-1">{$translate('timer.roundOver')}</div>
      <div class="text-2xl font-bold text-white font-['Poppins']">
        {formatTime(timeRemaining)}
      </div>
    {:else}
      <div class="text-xs font-semibold text-white/80 font-['Poppins'] mb-1">{$translate('timer.timeRemaining')}</div>
      <div class="text-2xl font-bold text-white font-['Poppins'] {isPaused ? 'opacity-75' : ''}" class:animate-pulse={timeRemaining <= 60 && !isPaused}>
        {formatTime(timeRemaining)}
      </div>
      {#if isPaused}
        <p class="text-xs text-white/80 font-semibold font-['Open Sans'] mt-0.5">{$translate('timer.paused')}</p>
      {/if}
    {/if}
  </div>
  
  {#if !isRound1NoTimer}
    <div class="flex gap-2 flex-shrink-0">
      {#if isRunning}
        <button
          on:click={handlePause}
          class="px-3 py-1.5 text-xs bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors font-['Open Sans']"
        >
          {isPaused ? $translate('common.resume') : $translate('common.pause')}
        </button>
      {/if}
      <button
        on:click={handleReset}
        class="px-3 py-1.5 text-xs bg-[#385025] text-white rounded-lg font-semibold hover:bg-[#294221] transition-colors font-['Open Sans']"
      >
        {$translate('common.reset')}
      </button>
    </div>
  {/if}
</div>

{#if showResetConfirm || isResetConfirmAnimating}
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

{#if showWarning}
  <TimerWarningModal
    message={warningMessage}
    timeRemaining={warningTimeRemaining}
    onClose={closeWarning}
    autoDismiss={true}
    dismissDelay={4000}
  />
{/if}

{#if showRoundOver}
  <RoundOverModal
    isOpen={showRoundOver}
    onClose={handleCloseRoundOver}
    onNextRound={handleNextRound}
  />
{/if}


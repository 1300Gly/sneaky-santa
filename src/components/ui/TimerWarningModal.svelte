<script lang="ts">
  import { onMount } from 'svelte';
  import { translate } from '../../lib/i18n';
  import { get } from 'svelte/store';
  
  export let message: string = '';
  export let timeRemaining: number = 0;
  export let onClose: () => void = () => {};
  export let autoDismiss: boolean = true;
  export let dismissDelay: number = 4000; // 4 seconds
  
  // Use reactive $translate instead
  let isVisible: boolean = false;
  let isAnimating: boolean = false;
  
  onMount(() => {
    // Trigger animation after mount
    setTimeout(() => {
      isVisible = true;
    }, 10);
    
    if (autoDismiss) {
      setTimeout(() => {
        handleClose();
      }, dismissDelay);
    }
  });
  
  function handleClose() {
    isVisible = false;
    isAnimating = true;
    setTimeout(() => {
      onClose();
      isAnimating = false;
    }, 400); // Wait for exit animation
  }
  
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
</script>

{#if isVisible || isAnimating}
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 modal-backdrop"
    class:backdrop-enter={isVisible}
    class:backdrop-exit={!isVisible && isAnimating}
    role="dialog"
    aria-modal="true"
    aria-labelledby="warning-title"
    style="position: fixed;"
  >
      <div
        class="card max-w-md w-full mx-4 border-2 border-[#C6B173]/30 modal-spring"
        class:modal-enter={isVisible}
        class:modal-exit={!isVisible && isAnimating}
      >
        <div class="text-center">
          <div class="text-6xl mb-4">⚠️</div>
          <h2 id="warning-title" class="text-3xl font-bold text-[#891515] mb-4">
            {$translate(message)}
          </h2>
          <p class="text-2xl font-semibold text-[#294221] mb-6">
            {formatTime(timeRemaining)}
          </p>
          <button
            on:click={handleClose}
            class="px-6 py-3 bg-[#891515] text-white rounded-xl font-semibold hover:bg-[#B42D1A] transition-colors border-2 border-[#891515] shadow-md"
          >
            {$translate('common.ok')}
          </button>
        </div>
      </div>
    </div>
{/if}

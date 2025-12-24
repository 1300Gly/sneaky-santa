<script lang="ts">
  import { onMount } from 'svelte';
  
  // Callback function that gets called after 3 second countdown
  export let onComplete: () => void = () => {};
  export let startValue: number = 3;
  
  let count: number = startValue;
  let isComplete: boolean = false;
  let scale: number = 1;
  let isVisible: boolean = false;
  let isAnimating: boolean = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  
  onMount(() => {
    // Start fade-in animation
    setTimeout(() => {
      isVisible = true;
    }, 10);
    
    // Start countdown: 3, 2, 1, then GO!
    // Total duration: 3 seconds (3 -> 2 -> 1 -> GO!)
    intervalId = setInterval(() => {
      if (count > 1) {
        count--;
        scale = 0.5;
        setTimeout(() => {
          scale = 1;
        }, 50);
      } else if (count === 1) {
        // Show "GO!" - this happens at the 3 second mark
        count = 0;
        isComplete = true;
        clearInterval(intervalId!);
        intervalId = null;
        
        // Call the callback immediately when GO! appears (after 3 seconds)
        // This allows the game state to change and UI to start animating
        onComplete();
        
        // Start fade-out independently after GO! has been visible
        // This happens while the game UI is already animating in
        setTimeout(() => {
          isVisible = false;
          isAnimating = true;
        }, 600); // Let GO! be visible for 600ms before starting fade-out
      }
    }, 1000);
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });
</script>

<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 modal-backdrop" class:backdrop-enter={isVisible && !isAnimating} class:backdrop-exit={!isVisible && isAnimating} style="position: fixed;">
  <div class="text-center">
    {#if !isComplete}
      <div
        class="text-9xl font-bold text-white transition-transform duration-100"
        style="transform: scale({scale});"
      >
        {count}
      </div>
    {:else}
      <div class="text-9xl font-bold text-[#385025] animate-scale-in">
        GO!
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes scale-in {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.5s ease-out;
  }
</style>


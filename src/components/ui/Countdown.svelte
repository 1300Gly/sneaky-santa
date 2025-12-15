<script lang="ts">
  import { onMount } from 'svelte';
  
  export let onComplete: () => void = () => {};
  export let startValue: number = 3;
  
  let count: number = startValue;
  let isComplete: boolean = false;
  let scale: number = 1;
  
  onMount(() => {
    const interval = setInterval(() => {
      if (count > 1) {
        count--;
        scale = 0.5;
        setTimeout(() => {
          scale = 1;
        }, 50);
      } else if (count === 1) {
        count = 0;
        isComplete = true;
        setTimeout(() => {
          onComplete();
        }, 1000);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  });
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
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


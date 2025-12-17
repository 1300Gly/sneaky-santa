<script lang="ts">
  import { onMount } from 'svelte';
  import { gameState } from '../../stores/gameState';
  import { translate } from '../../lib/i18n';
  import Button from '../ui/Button.svelte';
  
  export let onStartCountdown: () => void = () => {};
  
  let container: HTMLDivElement;
  let mounted = false;
  
  $: currentRound = $gameState.currentRound;
  $: roundDescription = `rounds.round${currentRound}.description`;
  
  onMount(() => {
    mounted = true;
  });
  
  function handleStartRound() {
    onStartCountdown();
  }
</script>

<div bind:this={container} class="card max-w-3xl mx-auto">
  <h1 class="text-4xl font-bold text-[#891515] mb-6 text-center">
    {$translate(`rounds.round${currentRound}.title`)}
  </h1>
  
  <div class="prose prose-lg max-w-none mb-8">
    <p class="text-[#294221] text-lg leading-relaxed">
      {$translate(roundDescription)}
    </p>
  </div>
  
  <img src="/icons/sneaky-santa.svg" alt="Sneaky Santa Logo" class="w-32 h-32 my-16 mx-auto object-contain drop-shadow-lg" />

  <div class="flex justify-center">
    <Button
      variant="primary"
      size="lg"
      on:click={handleStartRound}
      class="transform transition-transform hover:scale-105"
    >
      {$translate('setup.startRound')}
    </Button>
  </div>
</div>

<style>
  .card {
    animation: fadeIn 0.3s ease-in forwards;
  }
  
  .card h1 {
    animation: scaleIn 0.3s ease-out 0.1s forwards;
    opacity: 0;
  }
  
  .card .prose {
    animation: slideIn 0.3s ease-out 0.2s forwards;
    opacity: 0;
  }
  
  .card > div:last-child {
    animation: slideIn 0.3s ease-out 0.4s forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>

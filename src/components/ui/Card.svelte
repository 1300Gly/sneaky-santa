<script lang="ts">
  import { onMount } from 'svelte';
  import { translate } from '../../lib/i18n';
  
  export let card: import('../../types').Card | null = null;
  export let isRevealed: boolean = false;
  export let onReveal: (() => void) | null = null;
  
  let isAnimating: boolean = false;
  
  function handleReveal() {
    if (isRevealed || !card || isAnimating) return;
    
    isAnimating = true;
    if (onReveal) {
      onReveal();
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }
  
  $: if (isRevealed && !isAnimating) {
    // Card is revealed
  }
  
  $: cardText = card ? $translate(card.text) : '';
</script>

<div
  class="card-container relative cursor-pointer"
  class:revealed={isRevealed}
  on:click={handleReveal}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === 'Enter' && handleReveal()}
>
  {#if !isRevealed}
    <div class="card-back bg-gradient-to-br from-[#891515] to-[#B42D1A] rounded-xl shadow-lg p-8 flex items-center justify-center min-h-[200px] border-2 border-[#C6B173]/30">
      <div class="text-white text-center">
        <img
          src="/icons/sneaky-santa.svg"
          alt="Sneaky Santa logo"
          class="w-16 h-16 mx-auto mb-4 object-contain drop-shadow-lg"
          loading="lazy"
        />
        <p class="text-xl font-semibold">Sneaky Santa</p>
      </div>
    </div>
  {:else if card}
    <div class="card-front bg-white rounded-xl shadow-lg p-8 min-h-[200px] border-2 border-[#C6B173]">
      <div class="text-center">
        <div class="mb-4">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold {
            card.type === 'game' ? 'bg-[#385025]/10 text-[#294221] border border-[#385025]/30' :
            card.type === 'chance' ? 'bg-[#C6B173]/20 text-[#294221] border border-[#C6B173]/40' :
            'bg-[#891515]/10 text-[#294221] border border-[#891515]/30'
          }">
            {card.type === 'game' ? $translate('cards.gameCard') : $translate('cards.chanceCard')}
          </span>
        </div>
        <p class="text-lg text-[#294221] whitespace-pre-line">{cardText}</p>
        {#if card.isSaveCard}
          <div class="mt-4 p-3 bg-[#C6B173]/20 border border-[#C6B173] rounded-lg">
            <p class="text-sm text-[#294221] font-semibold">{$translate('cards.saveCardLabel')}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .card-container {
    perspective: 1000px;
  }
  
  .card-back,
  .card-front {
    backface-visibility: hidden;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-container:not(.revealed) .card-back {
    transform: rotateY(0deg);
  }
  
  .card-container.revealed .card-back {
    transform: rotateY(180deg);
  }
  
  .card-container:not(.revealed) .card-front {
    transform: rotateY(-180deg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  .card-container.revealed .card-front {
    transform: rotateY(0deg);
    animation: cardReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-container:hover:not(.revealed) .card-back {
    transform: scale(1.05) rotateY(0deg);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  @keyframes cardReveal {
    0% {
      opacity: 0;
      transform: rotateY(-180deg) scale(0.9);
    }
    50% {
      transform: rotateY(-90deg) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: rotateY(0deg) scale(1);
    }
  }
</style>


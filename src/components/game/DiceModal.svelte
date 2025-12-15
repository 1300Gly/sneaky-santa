<script lang="ts">
  import { onMount } from 'svelte';
  import { rollDice } from '../../lib/dice/diceRoller';
  import type { DiceValue } from '../../lib/dice/diceRoller';
  import { translate } from '../../lib/i18n';
  import Modal from '../ui/Modal.svelte';
  
  export let isOpen: boolean = false;
  export let onClose: () => void = () => {};
  export let onRoll: ((value: DiceValue) => void) | null = null;
  
  let currentValue: DiceValue = 1;
  let isRolling: boolean = false;
  let cubeElement: HTMLDivElement;
  let hasAutoRolled: boolean = false;
  
  const min = 1;
  const max = 24;
  
  function getRandom(max: number, min: number): number {
    return (Math.floor(Math.random() * (max - min)) + min) * 90;
  }
  
  function performRoll() {
    if (isRolling) return;
    
    isRolling = true;
    
    const rolledValue = rollDice();
    currentValue = rolledValue;
    
    const xRand = getRandom(max, min);
    const yRand = getRandom(max, min);
    
    if (cubeElement) {
      cubeElement.style.webkitTransform = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
      cubeElement.style.transform = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
    }
    
    setTimeout(() => {
      isRolling = false;
      if (onRoll) {
        onRoll(rolledValue);
      }
    }, 1000);
  }
  
  // Auto-roll when modal opens
  $: if (isOpen && cubeElement && !hasAutoRolled) {
    // Small delay to ensure the modal animation has started
    setTimeout(() => {
      performRoll();
      hasAutoRolled = true;
    }, 100);
  }
  
  // Reset hasAutoRolled when modal closes
  $: if (!isOpen) {
    hasAutoRolled = false;
  }
  
  const diceFaces: Record<DiceValue, number[][]> = {
    1: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
    2: [[1, 0, 0], [0, 0, 0], [0, 0, 1]],
    3: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    4: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
    5: [[1, 0, 1], [0, 1, 0], [1, 0, 1]],
    6: [[1, 0, 1], [1, 0, 1], [1, 0, 1]],
  };
</script>

<Modal
  isOpen={isOpen}
  title={$translate('setup.rollDice')}
  onClose={onClose}
  size="md"
  align="center"
>
  <div class="flex flex-col items-center gap-6 py-4">
    <div class="dice-scene">
      <div 
        id="cube"
        bind:this={cubeElement}
        class="dice-3d"
      >
        <div class="dice-face face-front">
          {#each diceFaces[1] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <div class="dice-face face-back">
          {#each diceFaces[2] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <div class="dice-face face-right">
          {#each diceFaces[3] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <div class="dice-face face-left">
          {#each diceFaces[4] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <div class="dice-face face-top">
          {#each diceFaces[5] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <div class="dice-face face-bottom">
          {#each diceFaces[6] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </div>
    
    <button
      on:click={onClose}
      class="w-full px-6 py-3 bg-[#385025] text-white rounded-xl font-semibold hover:bg-[#294221] transition-colors border-2 border-[#385025] shadow-md"
    >
      {$translate('common.close')}
    </button>
  </div>
</Modal>

<style>
  .dice-scene {
    perspective: 1000px;
    perspective-origin: center center;
    width: 150px;
    height: 150px;
    margin: 20px auto;
  }
  
  .dice-3d {
    width: 150px;
    height: 150px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .dice-face {
    position: absolute;
    width: 150px;
    height: 150px;
    background: white;
    border: 3px solid var(--color-primary-dark);
    border-radius: 12px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    padding: 15px;
    box-shadow: 
      inset 0 0 2px rgba(0, 0, 0, 0.1),
      0 4px 6px rgba(0, 0, 0, 0.2);
    backface-visibility: hidden;
  }
  
  .face-front {
    transform: translateZ(75px);
  }
  
  .face-back {
    transform: rotateY(180deg) translateZ(75px);
  }
  
  .face-right {
    transform: rotateY(90deg) translateZ(75px);
  }
  
  .face-left {
    transform: rotateY(-90deg) translateZ(75px);
  }
  
  .face-top {
    transform: rotateX(90deg) translateZ(75px);
  }
  
  .face-bottom {
    transform: rotateX(-90deg) translateZ(75px);
  }
  
  .dice-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    align-items: center;
    justify-items: center;
  }
  
  .dice-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: transparent;
    transition: background 0.2s;
  }
  
  .dice-dot.filled {
    background: black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>


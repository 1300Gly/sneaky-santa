<script lang="ts">
  import { onMount } from 'svelte';
  import { rollDice } from '../../lib/dice/diceRoller';
  import type { DiceValue } from '../../lib/dice/diceRoller';
  import { translate } from '../../lib/i18n';
  
  export let enabled: boolean = false;
  export let onRoll: ((value: DiceValue) => void) | null = null;
  
  let currentValue: DiceValue = 1;
  let isRolling: boolean = false;
  let cubeElement: HTMLDivElement;
  
  const min = 1;
  const max = 24;
  
  function getRandom(max: number, min: number): number {
    return (Math.floor(Math.random() * (max - min)) + min) * 90;
  }
  
  function handleRoll() {
    if (isRolling) return;
    
    isRolling = true;
    
    // Roll the dice to get the value
    const rolledValue = rollDice();
    currentValue = rolledValue;
    
    // Generate random rotations
    const xRand = getRandom(max, min);
    const yRand = getRandom(max, min);
    
    // Apply the rotation
    if (cubeElement) {
      cubeElement.style.webkitTransform = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
      cubeElement.style.transform = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
    }
    
    // Reset rolling state after animation
    setTimeout(() => {
      isRolling = false;
      if (onRoll) {
        onRoll(rolledValue);
      }
    }, 1000);
  }
  
  // Dice face dots configuration
  const diceFaces: Record<DiceValue, number[][]> = {
    1: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
    2: [[1, 0, 0], [0, 0, 0], [0, 0, 1]],
    3: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    4: [[1, 0, 1], [0, 0, 0], [1, 0, 1]],
    5: [[1, 0, 1], [0, 1, 0], [1, 0, 1]],
    6: [[1, 0, 1], [1, 0, 1], [1, 0, 1]],
  };
</script>

<div class="bg-white rounded-xl p-6 flex flex-col items-center gap-4 shadow-lg">
  {#if enabled}
    <button
      on:click={handleRoll}
      disabled={isRolling}
      class="px-6 py-3 bg-[#891515] text-white rounded-xl font-semibold hover:bg-[#B42D1A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-[#891515] shadow-md"
    >
      {#if isRolling}
        {$translate('setup.rolling')}
      {:else}
        {$translate('setup.rollDice')}
      {/if}
    </button>
    
    <div class="dice-scene">
      <div 
        id="cube"
        bind:this={cubeElement}
        class="dice-3d"
      >
        <!-- Face 1 (Front) -->
        <div class="dice-face face-front">
          {#each diceFaces[1] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <!-- Face 2 (Back) -->
        <div class="dice-face face-back">
          {#each diceFaces[2] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <!-- Face 3 (Right) -->
        <div class="dice-face face-right">
          {#each diceFaces[3] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <!-- Face 4 (Left) -->
        <div class="dice-face face-left">
          {#each diceFaces[4] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <!-- Face 5 (Top) -->
        <div class="dice-face face-top">
          {#each diceFaces[5] as row, i}
            <div class="dice-row">
              {#each row as dot, j}
                <div class="dice-dot" class:filled={dot === 1}></div>
              {/each}
            </div>
          {/each}
        </div>
        
        <!-- Face 6 (Bottom) -->
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
  {:else}
    <p class="text-sm text-gray-500">{$translate('setup.digitalDiceDisabled')}</p>
  {/if}
</div>

<style>
  .dice-scene {
    perspective: 1000px;
    perspective-origin: center center;
    width: 120px;
    height: 120px;
    margin: 20px auto;
  }
  
  .dice-3d {
    width: 120px;
    height: 120px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .dice-face {
    position: absolute;
    width: 120px;
    height: 120px;
    background: white;
    border: 3px solid var(--color-primary-dark);
    border-radius: 12px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    padding: 12px;
    box-shadow: 
      inset 0 0 2px rgba(0, 0, 0, 0.1),
      0 4px 6px rgba(0, 0, 0, 0.2);
    backface-visibility: hidden;
  }
  
  /* Position each face of the cube */
  .face-front {
    transform: translateZ(60px);
  }
  
  .face-back {
    transform: rotateY(180deg) translateZ(60px);
  }
  
  .face-right {
    transform: rotateY(90deg) translateZ(60px);
  }
  
  .face-left {
    transform: rotateY(-90deg) translateZ(60px);
  }
  
  .face-top {
    transform: rotateX(90deg) translateZ(60px);
  }
  
  .face-bottom {
    transform: rotateX(-90deg) translateZ(60px);
  }
  
  .dice-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    align-items: center;
    justify-items: center;
  }
  
  .dice-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: transparent;
    transition: background 0.2s;

  }
  
  .dice-dot.filled {
    background: black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
</style>

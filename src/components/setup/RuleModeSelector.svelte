<script lang="ts">
  import { get } from 'svelte/store';
  import { gameState } from '../../stores/gameState';
  import { translate } from '../../lib/i18n';
  import type { RuleMode } from '../../types';
  
  // Use reactive $translate instead
  
  const modes: { value: RuleMode; descriptionKey: string }[] = [
    {
      value: 'peaceful',
      descriptionKey: 'setup.peacefulDescription',
    },
    {
      value: 'traditional',
      descriptionKey: 'setup.traditionalDescription',
    },
    {
      value: 'chaos',
      descriptionKey: 'setup.chaosDescription',
    },
    {
      value: 'adult',
      descriptionKey: 'setup.adultDescription',
    },
  ];
  
  $: currentMode = $gameState.ruleMode;
</script>

<div class="space-y-2.5 sm:space-y-3">
  {#each modes as mode}
    <label class="rule-mode-option flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-xl cursor-pointer transition-all duration-200 {
      currentMode === mode.value 
        ? 'bg-white border-2 border-[#891515] shadow-lg shadow-[#891515]/20' 
        : 'bg-white border-2 border-[#C6B173]/30 hover:border-[#C6B173]/50 hover:shadow-md'
    }">
      <div class="custom-radio mt-0.5">
        <input
          type="radio"
          name="ruleMode"
          value={mode.value}
          checked={currentMode === mode.value}
          on:change={() => gameState.setRuleMode(mode.value)}
          class="sr-only"
        />
        <div class="radio-indicator {
          currentMode === mode.value ? 'checked' : ''
        }"></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-base sm:text-lg text-[#294221] mb-1 sm:mb-1.5">
          {$translate(`setup.${mode.value}`)}
        </div>
        <div class="text-xs sm:text-sm text-[#294221]/70 leading-relaxed">
          {$translate(mode.descriptionKey)}
        </div>
      </div>
    </label>
  {/each}
</div>

<style>
  .custom-radio {
    position: relative;
    flex-shrink: 0;
  }
  
  .radio-indicator {
    width: 20px;
    height: 20px;
    border: 2px solid #C6B173;
    border-radius: 50%;
    background: white;
    transition: all 0.2s ease;
    position: relative;
  }
  
  @media (min-width: 640px) {
    .radio-indicator {
      width: 24px;
      height: 24px;
    }
  }
  
  .rule-mode-option:hover .radio-indicator:not(.checked) {
    border-color: #C6B173;
    background: #C6B173/5;
  }
  
  .radio-indicator.checked {
    border-color: #891515;
    background: white;
  }
  
  .radio-indicator.checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #891515;
    transition: all 0.2s ease;
  }
  
  @media (min-width: 640px) {
    .radio-indicator.checked::after {
      width: 12px;
      height: 12px;
    }
  }
  
  .rule-mode-option:focus-within .radio-indicator {
    outline: 2px solid #891515;
    outline-offset: 2px;
  }
</style>


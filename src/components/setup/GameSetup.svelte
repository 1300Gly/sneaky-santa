<script lang="ts">
  import { get } from 'svelte/store';
  import { gameState } from '../../stores/gameState';
  import { settings } from '../../stores/settings';
  import { translate } from '../../lib/i18n';
  import { persistSettings } from '../../lib/persistence/stateManager';
  import TimeSettings from './TimeSettings.svelte';
  import RuleModeSelector from './RuleModeSelector.svelte';
  import Button from '../ui/Button.svelte';
  
  export let onStart: (() => void) | null = null;
  
  // Use reactive $translate instead
  
  $: digitalDiceEnabled = $settings.digitalDiceEnabled;
  $: audioEnabled = $settings.audioEnabled;
  
  function handleStartGame() {
    // Update state to explanation
    gameState.updateRoundStatus('explanation');
    
    // Force synchronous save by getting state and saving immediately
    // Use a small delay to ensure store update has propagated
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Use get() to get the current state synchronously
        const currentState = get(gameState);
        
        try {
          // Update the state object to ensure it has explanation status
          const stateToSave = {
            ...currentState,
            roundStatus: 'explanation' as const
          };
          
          const serialized = JSON.stringify(stateToSave);
          localStorage.setItem('pass-the-present:game-state', serialized);
          localStorage.setItem('pass-the-present:state-version', '1');
          
          // Verify it was saved correctly by reading it back
          const saved = localStorage.getItem('pass-the-present:game-state');
          if (saved) {
            const parsed = JSON.parse(saved);
            
            // Double-check it's correct
            if (parsed.roundStatus !== 'explanation') {
              console.error('ERROR: State was not saved correctly! Expected explanation, got:', parsed.roundStatus);
              return; // Don't navigate if state wasn't saved correctly
            }
          }
          
          // Small delay to ensure localStorage write completes, then navigate
          setTimeout(() => {
            if (onStart) {
              onStart();
            }
          }, 50);
        } catch (error) {
          console.error('Failed to save state:', error);
        }
      }
    }, 100);
  }
</script>

<div class="space-y-5 sm:space-y-6">
    <section>
      <h2 class="text-base sm:text-lg font-semibold text-[#294221] mb-3 sm:mb-4">
        {$translate('setup.roundTimers')}
      </h2>
      <TimeSettings />
    </section>
    
    <section>
      <h2 class="text-base sm:text-lg font-semibold text-[#294221] mb-3 sm:mb-4">
        {$translate('setup.ruleMode')}
      </h2>
      <RuleModeSelector />
    </section>
    
    <section>
      <h2 class="text-base sm:text-lg font-semibold text-[#294221] mb-3 sm:mb-4">{$translate('setup.options')}</h2>
      <div class="space-y-3 sm:space-y-4">
        <label class="checkbox-option flex items-center gap-2.5 sm:gap-3 cursor-pointer">
          <div class="custom-checkbox">
            <input
              type="checkbox"
              checked={digitalDiceEnabled}
              on:change={() => {
                settings.toggleDigitalDice();
                // Force immediate save
                setTimeout(() => {
                  persistSettings();
                }, 50);
              }}
              class="sr-only"
            />
            <div class="checkbox-indicator {
              digitalDiceEnabled ? 'checked' : ''
            }"></div>
          </div>
          <span class="text-sm sm:text-base text-[#294221] select-none">{$translate('setup.digitalDice')}</span>
        </label>
        
        <label class="checkbox-option flex items-center gap-2.5 sm:gap-3 cursor-pointer">
          <div class="custom-checkbox">
            <input
              type="checkbox"
              checked={audioEnabled}
              on:change={() => {
                settings.toggleAudio();
                // Force immediate save
                setTimeout(() => {
                  persistSettings();
                }, 50);
              }}
              class="sr-only"
            />
            <div class="checkbox-indicator {
              audioEnabled ? 'checked' : ''
            }"></div>
          </div>
          <span class="text-sm sm:text-base text-[#294221] select-none">{$translate('setup.audio')}</span>
        </label>
      </div>
    </section>
    
    <div class="pt-2 sm:pt-4">
      <Button
        variant="primary"
        size="lg"
        on:click={handleStartGame}
        class="text-sm sm:text-base w-full sm:w-auto"
      >
        {$translate('setup.startGame')}
      </Button>
    </div>
</div>

<style>
  .custom-checkbox {
    position: relative;
    flex-shrink: 0;
  }
  
  .checkbox-indicator {
    width: 20px;
    height: 20px;
    border: 2px solid #C6B173;
    border-radius: 0.375rem;
    background: white;
    transition: all 0.2s ease;
    position: relative;
  }
  
  @media (min-width: 640px) {
    .checkbox-indicator {
      width: 24px;
      height: 24px;
    }
  }
  
  .checkbox-option:hover .checkbox-indicator:not(.checked) {
    border-color: #C6B173;
    background: #C6B173/5;
  }
  
  .checkbox-indicator.checked {
    border-color: #891515;
    background: #891515;
  }
  
  .checkbox-indicator.checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transition: all 0.2s ease;
  }
  
  .checkbox-option:focus-within .checkbox-indicator {
    outline: 2px solid #891515;
    outline-offset: 2px;
  }
</style>


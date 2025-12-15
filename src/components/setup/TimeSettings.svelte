<script lang="ts">
  import { get } from 'svelte/store';
  import { gameState } from '../../stores/gameState';
  import { translate } from '../../lib/i18n';
  
  // Use reactive $translate instead
  
  const timeOptions = [15, 20, 30, 45, 60];

  //for dev purposes
  timeOptions.unshift(1);
  
  $: round1Settings = $gameState.roundSettings.round1;
  $: round2Settings = $gameState.roundSettings.round2;
  $: round3Settings = $gameState.roundSettings.round3;
  
  // Get the current value for Round 1 dropdown (0 if disabled, otherwise the time limit)
  $: round1Value = round1Settings.timeLimitEnabled ? round1Settings.timeLimit : 0;
  
  function updateRound1Time(time: number) {
    gameState.updateRoundSettings(1, { timeLimit: time, timeLimitEnabled: time > 0 });
  }
  
  function updateRound2Time(time: number) {
    gameState.updateRoundSettings(2, { timeLimit: time, timeLimitEnabled: true });
  }
  
  function updateRound3Time(time: number) {
    gameState.updateRoundSettings(3, { timeLimit: time, timeLimitEnabled: true });
  }
</script>

<div class="space-y-3 sm:space-y-4">
  <div>
    <label for="round1-time" class="block text-sm sm:text-base font-medium text-[#294221] mb-1.5 sm:mb-2">
      {$translate('setup.round1Time')}
    </label>
    <select
      id="round1-time"
      value={round1Value}
      on:change={(e) => updateRound1Time(Number(e.currentTarget.value))}
      class="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border-2 border-[#C6B173]/30 rounded-xl focus:ring-2 focus:ring-[#891515] focus:border-[#891515] text-[#294221]"
    >
      <option value={0}>{$translate('timer.noTimer')}</option>
      {#each timeOptions as time}
                    <option value={time}>{time} {$translate('common.minutes')}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label for="round2-time" class="block text-sm sm:text-base font-medium text-[#294221] mb-1.5 sm:mb-2">
      {$translate('setup.round2Time')}
    </label>
    <select
      id="round2-time"
      value={round2Settings.timeLimit}
      on:change={(e) => updateRound2Time(Number(e.currentTarget.value))}
      class="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border-2 border-[#C6B173]/30 rounded-xl focus:ring-2 focus:ring-[#891515] focus:border-[#891515] text-[#294221]"
    >
      {#each timeOptions as time}
                    <option value={time}>{time} {$translate('common.minutes')}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label for="round3-time" class="block text-sm sm:text-base font-medium text-[#294221] mb-1.5 sm:mb-2">
      {$translate('setup.round3Time')}
    </label>
    <select
      id="round3-time"
      value={round3Settings.timeLimit}
      on:change={(e) => updateRound3Time(Number(e.currentTarget.value))}
      class="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border-2 border-[#C6B173]/30 rounded-xl focus:ring-2 focus:ring-[#891515] focus:border-[#891515] text-[#294221]"
    >
      {#each timeOptions as time}
                    <option value={time}>{time} {$translate('common.minutes')}</option>
      {/each}
    </select>
  </div>
</div>


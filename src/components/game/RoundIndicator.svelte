<script lang="ts">
  import { gameState } from '../../stores/gameState';
  import { translate } from '../../lib/i18n';
  
  $: currentRound = $gameState.currentRound;
  $: roundStatus = $gameState.roundStatus;
</script>

<div class="bg-[#294221] text-white rounded-xl shadow-md p-4 animate-slide-in">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-2xl font-bold">{$translate('rounds.round')} {currentRound}</h2>
      <p class="text-sm opacity-90">{$translate(`setup.status.${roundStatus}`)}</p>
    </div>
    <div class="flex gap-2">
      {#each [1, 2, 3] as round}
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 {
            round === currentRound
              ? 'bg-white text-[#294221] scale-110 shadow-lg border-[#C6B173]'
              : 'bg-white/20 text-white border-white/30'
          }"
        >
          {round}
        </div>
      {/each}
    </div>
  </div>
</div>


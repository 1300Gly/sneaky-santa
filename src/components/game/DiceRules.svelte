<script lang="ts">
  import { gameState } from '../../stores/gameState';
  import { getDiceRules } from '../../config/rulesets';
  import { translate } from '../../lib/i18n';
  
  $: currentRound = $gameState.currentRound;
  $: ruleMode = $gameState.ruleMode;
  $: rules = getDiceRules(currentRound, ruleMode);
</script>

<div class="bg-white rounded-xl p-6">
  <h2 class="text-xl font-bold mb-6 text-[#294221] font-['Poppins']">{$translate('setup.diceRulesRound').replace('{round}', String(currentRound))}</h2>
  
  <div class="space-y-3">
    {#each Object.entries(rules) as [value, ruleKey], i}
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0 w-10 h-10 bg-[#891515] rounded-full flex items-center justify-center font-bold text-lg text-white font-['Poppins']">
          {value}
        </div>
        <p class="text-[#294221] flex-1 leading-relaxed font-['Open Sans'] pt-1">{$translate(ruleKey)}</p>
      </div>
    {/each}
  </div>
</div>


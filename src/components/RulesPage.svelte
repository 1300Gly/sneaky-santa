<script lang="ts">
  import { translate } from '../lib/i18n';
  import type { RuleMode } from '../types';
  import { getDiceRules, getRuleset } from '../config/rulesets';
  import { onMount } from 'svelte';
  
  let selectedMode: RuleMode = 'traditional';
  let tabContainer: HTMLDivElement;
  let scrollLeftIndicator: HTMLDivElement;
  let scrollRightIndicator: HTMLDivElement;
  
  const modes: RuleMode[] = ['peaceful', 'traditional', 'chaos', 'adult'];
  
  $: ruleset = getRuleset(selectedMode);
  $: diceRules1 = getDiceRules(1, selectedMode);
  $: diceRules2 = getDiceRules(2, selectedMode);
  $: diceRules3 = getDiceRules(3, selectedMode);
  $: diceRules1Entries = Object.entries(diceRules1);
  $: diceRules2Entries = Object.entries(diceRules2);
  $: diceRules3Entries = Object.entries(diceRules3);
  
  function updateScrollIndicators() {
    if (!tabContainer || typeof window === 'undefined') return;
    
    const { scrollLeft, scrollWidth, clientWidth } = tabContainer;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
    
    if (scrollLeftIndicator) {
      scrollLeftIndicator.style.opacity = isAtStart ? '0' : '1';
    }
    if (scrollRightIndicator) {
      scrollRightIndicator.style.opacity = isAtEnd ? '0' : '1';
    }
  }
  
  onMount(() => {
    if (typeof window === 'undefined' || !tabContainer) return;
    
    updateScrollIndicators();
    tabContainer.addEventListener('scroll', updateScrollIndicators);
    window.addEventListener('resize', updateScrollIndicators);
    
    return () => {
      if (tabContainer) {
        tabContainer.removeEventListener('scroll', updateScrollIndicators);
      }
      window.removeEventListener('resize', updateScrollIndicators);
    };
  });
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <h1 class="text-4xl font-bold text-[#891515] mb-8 font-['Poppins'] text-center">{$translate('rules.title')}</h1>
  
  <!-- General Rules Section -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4 text-[#294221] font-['Poppins']">{$translate('rules.requirements.title')}</h2>
      <ul class="list-disc list-inside space-y-2 text-[#294221] font-['Open Sans'] ml-4">
        <li>{$translate('rules.requirements.minMaxParticipants')}</li>
        <li>{$translate('rules.requirements.minGiftsPerParticipant')}</li>
        <li>{$translate('rules.requirements.dice')}</li>
        <li>{$translate('rules.requirements.printedRules')}</li>
        <li>{$translate('rules.requirements.printedGameCards')}</li>
        <li>{$translate('rules.requirements.printedChanceCards')}</li>
      </ul>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4 text-[#294221] font-['Poppins']">{$translate('rules.preparation.title')}</h2>
      <ul class="list-disc list-inside space-y-2 text-[#294221] font-['Open Sans'] ml-4">
        <li>{$translate('rules.preparation.sitInCircle')}</li>
        <li>{$translate('rules.preparation.giftsInMiddle')}</li>
        <li>{$translate('rules.preparation.rollToStart')}</li>
      </ul>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-bold mb-4 text-[#294221] font-['Poppins']">{$translate('rules.theGame.title')}</h2>
      <p class="mb-4 text-[#294221] font-['Open Sans'] leading-relaxed">
        {$translate('rules.theGame.description')}
      </p>
    </section>
  </div>
  
  <!-- Rule Mode Tabs -->
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Tab Headers -->
    <div class="relative border-b-2 border-[#C6B173]/30 bg-[#F5E6D3]">
      <!-- Scrollable container for mobile -->
      <div bind:this={tabContainer} class="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div class="flex min-w-max md:min-w-0 md:flex-nowrap">
          {#each modes as mode}
            <button
              on:click={() => selectedMode = mode}
              class="flex-shrink-0 md:flex-1 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-base sm:text-lg font-['Poppins'] transition-all duration-200 whitespace-nowrap snap-start {
                selectedMode === mode
                  ? 'bg-[#891515] text-white border-b-4 border-[#891515]'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }"
            >
              {$translate(`setup.${mode}`)}
            </button>
          {/each}
        </div>
      </div>
      <!-- Scroll indicators on mobile -->
      <div bind:this={scrollLeftIndicator} class="md:hidden absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#F5E6D3] to-transparent pointer-events-none opacity-0 transition-opacity duration-300"></div>
      <div bind:this={scrollRightIndicator} class="md:hidden absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#F5E6D3] to-transparent pointer-events-none opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <!-- Tab Content -->
    <div class="p-8">
      <!-- Mode Description -->
      <div class="mb-8 p-4 bg-[#C6B173]/10 rounded-xl border border-[#C6B173]/30">
        <p class="text-[#294221] font-['Open Sans'] text-lg">
          {$translate(ruleset.description)}
        </p>
      </div>
      
      <div class="flex flex-col gap-10 lg:gap-20">
        <!-- Round 1 -->
        <section>
          <h2 class="text-2xl font-bold text-[#294221] font-['Poppins']">{$translate('rounds.round1.title')}</h2>
          <p class="text-[#294221] font-['Open Sans'] leading-relaxed">{$translate('rounds.round1.description')}</p>
          <h3 class="text-xl font-semibold text-[#294221] font-['Poppins'] mt-4 mb-3">{$translate('setup.diceRules')}:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each diceRules1Entries as [value, ruleKey]}
              <div class="flex items-start gap-3 p-3 bg-[#F5E6D3]/50 rounded-lg border border-[#C6B173]/30">
                <div class="flex-shrink-0 w-8 h-8 bg-[#891515] rounded-full flex items-center justify-center font-bold text-white font-['Poppins']">
                  {value}
                </div>
                <p class="text-[#294221] font-['Open Sans'] pt-1">{$translate(ruleKey)}</p>
              </div>
            {/each}
          </div>
        </section>
        
        <!-- Round 2 -->
        <section>
          <h2 class="text-2xl font-bold text-[#294221] font-['Poppins']">{$translate('rounds.round2.title')}</h2>
          <p class="text-[#294221] font-['Open Sans'] leading-relaxed">{$translate('rounds.round2.description')}</p>
          <h3 class="text-xl font-semibold text-[#294221] font-['Poppins'] mt-4 mb-3">{$translate('setup.diceRules')}:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each diceRules2Entries as [value, ruleKey]}
              <div class="flex items-start gap-3 p-3 bg-[#F5E6D3]/50 rounded-lg border border-[#C6B173]/30">
                <div class="flex-shrink-0 w-8 h-8 bg-[#891515] rounded-full flex items-center justify-center font-bold text-white font-['Poppins']">
                  {value}
                </div>
                <p class="text-[#294221] font-['Open Sans'] pt-1">{$translate(ruleKey)}</p>
              </div>
            {/each}
          </div>
        </section>
        
        <!-- Round 3 -->
        <section>
          <h2 class="text-2xl font-bold text-[#294221] font-['Poppins']">{$translate('rounds.round3.title')}</h2>
          <p class="text-[#294221] font-['Open Sans'] leading-relaxed">{$translate('rounds.round3.description')}</p>
          <h3 class="text-xl font-semibold text-[#294221] font-['Poppins'] mt-4 mb-3">{$translate('setup.diceRules')}:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each diceRules3Entries as [value, ruleKey]}
              <div class="flex items-start gap-3 p-3 bg-[#F5E6D3]/50 rounded-lg border border-[#C6B173]/30">
                <div class="flex-shrink-0 w-8 h-8 bg-[#891515] rounded-full flex items-center justify-center font-bold text-white font-['Poppins']">
                  {value}
                </div>
                <p class="text-[#294221] font-['Open Sans'] pt-1">{$translate(ruleKey)}</p>
              </div>
            {/each}
          </div>
        </section>
      </div>
    </div>
  </div>
</div>


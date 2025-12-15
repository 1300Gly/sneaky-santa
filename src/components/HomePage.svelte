<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { gameState } from '../stores/gameState';
  import { translate } from '../lib/i18n';
  import GameSetup from './setup/GameSetup.svelte';
  import Modal from './ui/Modal.svelte';
  import Button from './ui/Button.svelte';
  
  // Use reactive $translate instead
  let showSetupModal: boolean = false;
  
  function handlePlayGame() {
    // Check if there's an existing game
    const currentState = $gameState;
    if (currentState.roundStatus !== 'setup' && 
        currentState.roundStatus !== 'finished') {
      // There's an active game, navigate to it
      window.location.href = '/game';
    } else {
      // No active game, show setup modal
      showSetupModal = true;
    }
  }
  
  function handleStartGame() {
    showSetupModal = false;
    // Small delay to ensure state is persisted before navigation
    setTimeout(() => {
      window.location.href = '/game';
    }, 100);
  }
  
  function handleCloseSetupModal() {
    showSetupModal = false;
  }
</script>

<div>
  <!-- Hero Section - Full Width -->
  <section class="relative mb-8 sm:mb-12 md:mb-20 w-screen overflow-hidden" style="margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw);">
    <div class="relative min-h-[85vh] sm:min-h-screen">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          src="/images/5de2a58e-7ab1-407f-ab34-3acd6336ecad.webp" 
          alt="Family playing Sneaky Santa game"
          class="w-full h-full object-cover object-center"
          decoding="async"
          fetchpriority="high"
        />
        <!-- Dark Overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a0101]/92 via-[#0a0101]/85 to-[#131e0f]/70"></div>
      </div>
      
      <!-- Content Overlay -->
      <div class="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center py-8 sm:py-10 md:py-12">
        <div class="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div class="max-w-3xl text-center sm:text-left">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-5 font-['Poppins'] leading-[1.1] flex items-center justify-center sm:justify-start gap-3">
              <img
                src="/icons/sneaky-santa.svg"
                alt={$translate('game.title')}
                class="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain drop-shadow-lg"
                loading="lazy"
              />
              <span>{$translate('game.title')}</span>
            </h1>
            <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 font-['Poppins'] leading-[1.2]">
              {$translate('game.heroTitle')}
            </h2>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-5 sm:mb-6 md:mb-8 font-['Open Sans'] leading-relaxed max-w-2xl mx-auto sm:mx-0">
              {$translate('game.heroSubtitle')}
            </p>
            
            <!-- Catchphrase - Hidden on mobile, shown on tablet+ -->
            <div class="hidden sm:block mb-6 md:mb-8 p-3 md:p-4 bg-white/20 backdrop-blur-sm border-l-4 border-[#C6B173] rounded-r-lg max-w-2xl shadow-lg">
              <p class="text-sm md:text-base lg:text-lg font-semibold text-white font-['Open Sans'] italic drop-shadow-md">
                "{$translate('game.heroCatchphrase')}"
              </p>
            </div>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
              <Button
                variant="primary"
                size="lg"
                on:click={handlePlayGame}
                class="w-full sm:w-auto text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 font-bold shadow-2xl hover:shadow-[0_0_20px_rgba(137,21,21,0.6)]"
              >
                {$translate('game.ctaPrimary')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                on:click={() => window.location.href = '/rules'}
                class="w-full sm:w-auto text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 font-bold shadow-xl hover:shadow-2xl"
              >
                {$translate('game.ctaSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Rest of content with container -->
  <div class="container mx-auto px-4 py-4 sm:py-6 md:py-8">
    <div class="max-w-7xl mx-auto">

  <!-- Why Play Section -->
  <section class="mb-8 sm:mb-12 md:mb-16">
    <div class="text-center mb-6 sm:mb-8 md:mb-10">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
        {$translate('game.whyPlayTitle')}
      </h2>
      <p class="text-sm sm:text-base md:text-lg text-[#294221]/70 font-['Open Sans']">
        {$translate('game.whyPlaySubtitle')}
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-[#C6B173]/20 hover:border-[#C6B173]/40 transition-all">
        <h3 class="text-lg sm:text-xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.benefit1Title')}
        </h3>
        <p class="text-sm sm:text-base text-[#294221]/80 font-['Open Sans'] leading-relaxed">
          {$translate('game.benefit1Description')}
        </p>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-[#C6B173]/20 hover:border-[#C6B173]/40 transition-all">
        <h3 class="text-lg sm:text-xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.benefit2Title')}
        </h3>
        <p class="text-sm sm:text-base text-[#294221]/80 font-['Open Sans'] leading-relaxed">
          {$translate('game.benefit2Description')}
        </p>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-[#C6B173]/20 hover:border-[#C6B173]/40 transition-all">
        <h3 class="text-lg sm:text-xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.benefit3Title')}
        </h3>
        <p class="text-sm sm:text-base text-[#294221]/80 font-['Open Sans'] leading-relaxed">
          {$translate('game.benefit3Description')}
        </p>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-[#C6B173]/20 hover:border-[#C6B173]/40 transition-all">
        <h3 class="text-lg sm:text-xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.benefit4Title')}
        </h3>
        <p class="text-sm sm:text-base text-[#294221]/80 font-['Open Sans'] leading-relaxed">
          {$translate('game.benefit4Description')}
        </p>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-[#C6B173]/20 hover:border-[#C6B173]/40 transition-all">
        <h3 class="text-lg sm:text-xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.benefit5Title')}
        </h3>
        <p class="text-sm sm:text-base text-[#294221]/80 font-['Open Sans'] leading-relaxed">
          {$translate('game.benefit5Description')}
        </p>
      </div>
      
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-[#C6B173]/20 hover:border-[#C6B173]/40 transition-all">
        <h3 class="text-lg sm:text-xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.benefit6Title')}
        </h3>
        <p class="text-sm sm:text-base text-[#294221]/80 font-['Open Sans'] leading-relaxed">
          {$translate('game.benefit6Description')}
        </p>
      </div>
    </div>
  </section>

  <!-- Quick Start Section -->
  <section class="mb-8 sm:mb-12 md:mb-16">
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border-2 border-[#C6B173]/20">
      <div class="text-center mb-4 sm:mb-6 md:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-[#294221] mb-2 sm:mb-3 md:mb-4 font-['Poppins']">
          {$translate('game.quickStartTitle')}
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-[#294221]/70 font-['Open Sans']">
          {$translate('game.quickStartDescription')}
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 mb-6 sm:mb-8 md:mb-10">
        <div class="text-center">
          <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#891515] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5">
            <span class="text-xl sm:text-2xl font-bold text-white font-['Poppins']">1</span>
          </div>
          <p class="text-sm sm:text-base text-[#294221] font-['Open Sans']">
            {$translate('game.step1')}
          </p>
        </div>
        
        <div class="text-center">
          <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#891515] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5">
            <span class="text-xl sm:text-2xl font-bold text-white font-['Poppins']">2</span>
          </div>
          <p class="text-sm sm:text-base text-[#294221] font-['Open Sans']">
            {$translate('game.step2')}
          </p>
        </div>
        
        <div class="text-center">
          <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#891515] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5">
            <span class="text-xl sm:text-2xl font-bold text-white font-['Poppins']">3</span>
          </div>
          <p class="text-sm sm:text-base text-[#294221] font-['Open Sans']">
            {$translate('game.step3')}
          </p>
        </div>
      </div>
      
      <div class="text-center">
        <Button
          variant="primary"
          size="lg"
          on:click={handlePlayGame}
          class="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 md:py-4 font-bold shadow-lg hover:shadow-xl transition-shadow"
        >
          {$translate('game.ctaPrimary')}
        </Button>
      </div>
    </div>
  </section>

  <!-- How to Play Section -->
  <section class="mb-8 sm:mb-12 md:mb-16">
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border-2 border-[#C6B173]/20">
      <h2 class="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 text-[#294221] font-['Poppins']">
        {$translate('game.howToPlay')}
      </h2>
      <p class="text-sm sm:text-base md:text-lg text-[#294221] mb-4 sm:mb-6 md:mb-8 font-['Open Sans'] leading-relaxed">
        {$translate('game.description')}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div class="p-3 sm:p-4 md:p-6 bg-[#F5E6D3]/30 rounded-lg border border-[#C6B173]/30">
          <p class="text-sm sm:text-base text-[#294221] font-['Open Sans'] font-semibold">
            {$translate('game.round1Summary')}
          </p>
        </div>
        <div class="p-3 sm:p-4 md:p-6 bg-[#F5E6D3]/30 rounded-lg border border-[#C6B173]/30">
          <p class="text-sm sm:text-base text-[#294221] font-['Open Sans'] font-semibold">
            {$translate('game.round2Summary')}
          </p>
        </div>
        <div class="p-3 sm:p-4 md:p-6 bg-[#F5E6D3]/30 rounded-lg border border-[#C6B173]/30">
          <p class="text-sm sm:text-base text-[#294221] font-['Open Sans'] font-semibold">
            {$translate('game.round3Summary')}
          </p>
        </div>
      </div>
      <div class="text-center">
        <Button
          variant="secondary"
          size="md"
          on:click={() => window.location.href = '/rules'}
          class="text-sm sm:text-base"
        >
          {$translate('game.ctaSecondary')}
        </Button>
      </div>
    </div>
  </section>

  <!-- Final CTA Section -->
  <section class="text-center mb-4 sm:mb-6 md:mb-8">
    <div class="bg-gradient-to-br from-[#891515] to-[#B42D1A] rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-white">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 font-['Poppins']">
        {$translate('game.readyToPlay')}
      </h2>
      <p class="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 font-['Open Sans'] opacity-90">
        {$translate('game.readyToPlayDescription')}
      </p>
      <Button
        variant="primary"
        size="lg"
        on:click={handlePlayGame}
        class="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 font-bold !bg-white !text-[#891515] hover:!bg-[#F5E6D3] !border-white hover:!border-[#F5E6D3] shadow-xl hover:shadow-2xl transition-all"
      >
        {$translate('game.ctaPrimary')}
      </Button>
    </div>
  </section>
    </div>
  </div>
</div>

<Modal
  isOpen={showSetupModal}
  title={$translate('setup.setup')}
  onClose={handleCloseSetupModal}
  size="xl"
>
  <GameSetup onStart={handleStartGame} />
</Modal>


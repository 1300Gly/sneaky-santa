<script lang="ts">
  import { onMount } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { translate } from '../lib/i18n';
  import LanguageSwitcher from './ui/LanguageSwitcher.svelte';
  import Button from './ui/Button.svelte';
  import Modal from './ui/Modal.svelte';
  import GameSetup from './setup/GameSetup.svelte';
  import { gameState } from '../stores/gameState';
  import { cardDeck } from '../stores/cards';
  import { timer } from '../stores/timer';
  import { clearState } from '../lib/persistence/storage';
  
  let currentPath = '';
  let showLeaveGameModal = false;
  let showSetupModal = false;
  let pendingNavigation: string | null = null;
  let mobileMenuOpen = false;
  
  // Reactive check for game state
  $: {
    if (typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }
  }
  
  $: isInGame = typeof window !== 'undefined' && 
                currentPath === '/game' &&
                $gameState.roundStatus !== 'setup' && 
                $gameState.roundStatus !== 'finished';
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }
  });
  
  // Lock body scroll when mobile menu is open
  $: {
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
  
  function handleNavigation(path: string) {
    if (typeof window === 'undefined') return;
    
    // Check if we're trying to navigate away from an active game
    if (isInGame && currentPath === '/game' && path !== '/game') {
      pendingNavigation = path;
      showLeaveGameModal = true;
      return;
    }
    
    // Normal navigation
    window.location.href = path;
  }
  
  function handlePlayGame() {
    if (typeof window === 'undefined') return;
    
    // If we're in an active game, navigate to home
    if (isInGame) {
      handleNavigation('/');
      return;
    }
    
    // Check if there's an existing active game
    const currentState = $gameState;
    if (currentState.roundStatus !== 'setup' && 
        currentState.roundStatus !== 'finished') {
      // There's an active game, navigate to it
      handleNavigation('/game');
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
  
  function confirmLeaveGame() {
    if (pendingNavigation) {
      // Clear game state from localStorage when leaving the game
      if (typeof window !== 'undefined') {
        clearState('pass-the-present:game-state');
        clearState('pass-the-present:state-version');
        // Reset all game-related stores
        gameState.reset();
        cardDeck.set({
          available: [],
          drawn: [],
          players: [],
          currentCard: undefined,
        });
        timer.resetTimer();
      }
      
      showLeaveGameModal = false;
      const targetPath = pendingNavigation;
      pendingNavigation = null;
      window.location.href = targetPath;
    }
  }
  
  function cancelLeaveGame() {
    showLeaveGameModal = false;
    pendingNavigation = null;
  }
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
  
  function handleMobileNavigation(path: string) {
    closeMobileMenu();
    handleNavigation(path);
  }
</script>

<header class="bg-[#fff9f2] border-b-2 border-[#C6B173]/20 sticky top-0 z-50 shadow-lg">
  <div class="container mx-auto px-4 sm:px-6 py-3 md:py-4">
    <div class="flex items-center justify-between gap-4">
      <!-- Logo/Title Section -->
      <div class="flex items-center flex-shrink-0">
        <button
          on:click={() => handleNavigation('/')}
          class="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img
            src="/icons/sneaky-santa.svg"
            alt={$translate('game.title')}
            class="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain"
            loading="lazy"
          />
          <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#294221] font-['Poppins'] whitespace-nowrap">
            {$translate('game.title')}
          </h1>
        </button>
      </div>
      
      <!-- Desktop Navigation and Actions -->
      <div class="hidden md:flex items-center gap-3 lg:gap-4">
        <!-- Navigation Links -->
        <nav class="flex items-center gap-2">
          {#if !isInGame}
            <button
              on:click={() => handleNavigation('/')}
              class="px-4 py-2 text-[#294221] hover:text-[#891515] font-medium transition-colors rounded-lg hover:bg-[#C6B173]/10 whitespace-nowrap"
            >
              {$translate('navigation.home')}
            </button>
          {/if}
          <button
            on:click={() => handleNavigation('/rules')}
            class="px-4 py-2 text-[#294221] hover:text-[#891515] font-medium transition-colors rounded-lg hover:bg-[#C6B173]/10 whitespace-nowrap"
          >
            {$translate('navigation.rules')}
          </button>
        </nav>
        
        <!-- Play/Home Button -->
        <Button
          variant="primary"
          size="md"
          on:click={handlePlayGame}
          class="font-bold shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
        >
          {#if isInGame}
            {$translate('common.home')}
          {:else}
            <span class="mr-2">▶</span>
            {$translate('navigation.play')}
          {/if}
        </Button>
        
        <!-- Language Switcher -->
        <LanguageSwitcher client:load />
      </div>
      
      <!-- Mobile Actions -->
      <div class="flex md:hidden items-center gap-2">
        <!-- Play/Home Button (Mobile) -->
        <Button
          variant="primary"
          size="sm"
          on:click={handlePlayGame}
          class="font-bold shadow-md hover:shadow-lg transition-shadow text-sm px-3 py-2"
        >
          {#if isInGame}
            {$translate('common.home')}
          {:else}
            <span class="mr-1">▶</span>
            {$translate('navigation.play')}
          {/if}
        </Button>
        
        <!-- Hamburger Menu Button -->
        <button
          on:click={toggleMobileMenu}
          class="p-2 text-[#294221] hover:text-[#891515] hover:bg-[#C6B173]/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {#if mobileMenuOpen}
            <!-- Close Icon (X) -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <!-- Hamburger Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation Menu (Collapsible) -->
    {#if mobileMenuOpen}
      <nav
        transition:slide={{ duration: 300, axis: 'y' }}
        class="md:hidden mt-4 pt-4 border-t border-[#C6B173]/20 pb-2 bg-[#fff9f2] relative z-[50]"
      >
        <div class="flex flex-col gap-2">
          {#if !isInGame}
            <button
              on:click={() => handleMobileNavigation('/')}
              class="px-4 py-3 text-left text-[#294221] hover:text-[#891515] font-medium transition-colors rounded-lg hover:bg-[#C6B173]/10"
            >
              {$translate('navigation.home')}
            </button>
          {/if}
          <button
            on:click={() => handleMobileNavigation('/rules')}
            class="px-4 py-3 text-left text-[#294221] hover:text-[#891515] font-medium transition-colors rounded-lg hover:bg-[#C6B173]/10"
          >
            {$translate('navigation.rules')}
          </button>
          <div class="px-4 py-2">
            <LanguageSwitcher client:load />
          </div>
        </div>
      </nav>
    {/if}
  </div>
</header>

<!-- Mobile Menu Backdrop -->
{#if mobileMenuOpen}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-[45] md:hidden"
    on:click={closeMobileMenu}
    on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
    role="button"
    tabindex="-1"
    aria-label="Close menu"
  ></div>
{/if}

<!-- Game Setup Modal -->
<Modal
  isOpen={showSetupModal}
  title={$translate('setup.setup')}
  onClose={handleCloseSetupModal}
  size="xl"
>
  <GameSetup onStart={handleStartGame} />
</Modal>

<!-- Leave Game Confirmation Modal -->
<Modal
  isOpen={showLeaveGameModal}
  title={$translate('game.leaveGameTitle')}
  onClose={cancelLeaveGame}
  size="md"
>
  <p class="text-gray-700">
    {$translate('game.leaveGameConfirm')}
  </p>
  <div slot="footer" class="flex gap-4 justify-end">
    <Button variant="secondary" on:click={cancelLeaveGame}>
      {$translate('common.cancel')}
    </Button>
    <Button variant="danger" on:click={confirmLeaveGame}>
      {$translate('game.leaveGame')}
    </Button>
  </div>
</Modal>


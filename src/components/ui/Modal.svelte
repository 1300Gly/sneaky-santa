<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  export let isOpen: boolean = false;
  export let title: string = '';
  export let onClose: () => void = () => {};
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let canClose: boolean = true;
  export let align: 'left' | 'center' = 'left'; // Alignment prop for title and content
  
  let isVisible: boolean = false;
  let isAnimating: boolean = false;
  
  // Expose close method for external use
  export function close() {
    handleClose();
  }
  
  $: sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl md:max-w-2xl lg:max-w-3xl',
  };
  
  $: if (isOpen && !isVisible && !isAnimating) {
    // Trigger animation when modal opens
    setTimeout(() => {
      isVisible = true;
    }, 10);
  }
  
  $: if (!isOpen && isVisible) {
    // Trigger exit animation when modal closes
    isVisible = false;
    isAnimating = true;
    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }
  
  function handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen && canClose) {
      handleClose();
    }
  }
  
  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget && canClose) {
      handleClose();
    }
  }
  
  export function handleClose() {
    isVisible = false;
    isAnimating = true;
    setTimeout(() => {
      onClose();
      isAnimating = false;
    }, 400);
  }
  
  onMount(() => {
    if (typeof window === 'undefined') return;
    
    document.addEventListener('keydown', handleEscape);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    }
  });
  
  $: if (typeof window !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
</script>

{#if isOpen || isAnimating}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 modal-backdrop"
    class:backdrop-enter={isVisible}
    class:backdrop-exit={!isVisible && isAnimating}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    on:click={handleBackdropClick}
    on:keydown={handleEscape}
  >
    <div
      class="bg-white rounded-xl shadow-2xl {sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-[#C6B173]/20 modal-spring {align === 'center' ? 'relative' : ''}"
      class:modal-enter={isVisible}
      class:modal-exit={!isVisible && isAnimating}
    >
      {#if title}
        <div class="flex items-center {align === 'center' ? 'justify-center' : 'justify-between'} p-6 border-b-2 border-[#C6B173]/30">
          <h2 id="modal-title" class="text-2xl font-bold text-[#294221] {align === 'center' ? 'text-center' : ''}">{title}</h2>
          {#if canClose}
            <button
              on:click={handleClose}
              class="text-gray-400 hover:text-gray-600 transition-colors {align === 'center' ? 'absolute top-6 right-6' : ''}"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/if}
        </div>
      {:else if canClose}
        <div class="absolute top-4 right-4 z-10">
          <button
            on:click={handleClose}
            class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}
      
      <div class="p-6 {align === 'center' ? 'text-center' : ''}">
        <slot />
      </div>
      
      {#if $$slots.footer}
        <div class="p-6 border-t-2 border-[#C6B173]/30 {align === 'center' ? 'text-center' : ''}">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

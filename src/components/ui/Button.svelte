<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  
  let className: string = '';
  export { className as class };
  
  $: variantClasses = {
    primary: 'bg-[#891515] hover:bg-[#B42D1A] text-white border-2 border-[#891515] hover:border-[#B42D1A]',
    secondary: 'bg-[#385025] hover:bg-[#294221] text-white border-2 border-[#385025] hover:border-[#294221]',
    danger: 'bg-[#B42D1A] hover:bg-[#891515] text-white border-2 border-[#B42D1A] hover:border-[#891515]',
    success: 'bg-[#385025] hover:bg-[#294221] text-white border-2 border-[#385025] hover:border-[#294221]',
  };
  
  $: sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
</script>

<button
  {type}
  {disabled}
  class="rounded-xl font-semibold transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed {variantClasses[variant]} {sizeClasses[size]} hover:shadow-lg active:scale-95 {className}"
  on:click
>
  {#if loading}
    <span class="inline-flex items-center gap-2">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <slot />
    </span>
  {:else}
    <slot />
  {/if}
</button>


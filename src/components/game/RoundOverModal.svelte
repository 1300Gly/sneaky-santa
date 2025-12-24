<script lang="ts">
  import { translate } from '../../lib/i18n';
  import Modal from '../ui/Modal.svelte';
  import Button from '../ui/Button.svelte';
  
  export let isOpen: boolean = false;
  export let currentRound: number = 1;
  export let onNextRound: () => void = () => {};
  export let onClose: () => void = () => {};
</script>

<Modal
  isOpen={isOpen}
  title={currentRound < 3 ? $translate('timer.roundOver') : $translate('game.gameComplete')}
  onClose={onClose}
  size="md"
  canClose={false}
  align="center"
>
  <div class="text-center space-y-4">
    {#if currentRound < 3}
      <div class="text-6xl mb-4">⏰</div>
      <p class="text-lg text-[#294221] font-open-sans">
        {$translate('timer.roundOverMessage')}
      </p>
      <p class="text-md text-[#294221]/80 font-open-sans">
        {$translate('timer.roundOverNextRound').replace('{round}', String(currentRound + 1))}
      </p>
    {:else}
      <div class="text-6xl mb-4">🎉</div>
      <p class="text-lg text-[#294221] font-open-sans leading-relaxed">
        {$translate('timer.roundOverCelebrationMessage')}
      </p>
    {/if}
  </div>
  
  <div slot="footer" class="flex gap-4 justify-center">
    {#if currentRound < 3}
      <Button
        variant="primary"
        size="lg"
        on:click={onNextRound}
      >
        {$translate('timer.startNextRound')}
      </Button>
    {:else}
      <Button
        variant="primary"
        size="lg"
        on:click={onNextRound}
      >
        {$translate('timer.backToHome')}
      </Button>
    {/if}
  </div>
</Modal>


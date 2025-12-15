<script lang="ts">
  import { languageStore, setLanguage } from '../../lib/i18n';
</script>

<div class="flex gap-2">
  <button
    class="px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors {$languageStore === 'nl' ? 'bg-white/40' : ''}"
    on:click={() => setLanguage('nl')}
  >
    NL
  </button>
  <button
    class="px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors {$languageStore === 'en' ? 'bg-white/40' : ''}"
    on:click={() => setLanguage('en')}
  >
    EN
  </button>
</div>


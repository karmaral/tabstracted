<script lang="ts">
  import { tick } from 'svelte';

  /**
  * Triggers the edition.
  * Useful for delegating the `on:click` function of the component to another element.
  */
  export function trigger() {
    handleRename();
  }
  /**
  * Wrapper function for manipulating the new value.
  * It will be run at the end of the submit action
  */
  export let renameAction: (newVal: string) => void;
  export let title: string;

  let isRenaming = false;
  let inputElem: HTMLInputElement;
  let inputValue: string = title;

  function handleKeys(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === 'Escape') {
      inputElem.blur();
    }
  }
  async function handleRename(): Promise<void> {
    isRenaming = true;
    await tick();
    inputElem.focus();
  }
  async function handleSubmit(): Promise<void> {
    isRenaming = false;
    await tick();
    renameAction(inputValue);
  }
</script>

{#if isRenaming}
  <input type="text"
    bind:this={inputElem}
    bind:value={inputValue}
    on:keydown={handleKeys}
    on:blur={handleSubmit}
  />
{:else}
  <span on:click={handleRename}>{title}</span>
{/if}


<style>

  input, span {
    all: unset;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
</style>

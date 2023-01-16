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
  * It will be run at the end of the submit action.
  */
  export let renameAction: (newVal: string) => void;
  export let title: string;
  /**
  * The wrapper tag to render the element with.
  */
  export let tag = 'div';
  export let classList: string[] = [];

  $: classes = classList.join(' ');

  let isRenaming = false;
  let elemRef: HTMLElement;

  function handleKeys(e: KeyboardEvent): void {
    if (!isRenaming) return;
    if (e.key === 'Enter' || e.key === 'Escape') {
      elemRef.blur();
    }
  }

  async function handleRename(): Promise<void> {
    isRenaming = true;
    await tick();
    elemRef.focus();
  }

  async function handleSubmit(): Promise<void> {
    isRenaming = false;
    await tick();
    renameAction(elemRef.innerText);
  }

</script>

<svelte:element this={tag}
  contenteditable={isRenaming}
  class={classes}
  on:click={handleRename}
  on:keydown={handleKeys}
  on:blur={handleSubmit}
  bind:this={elemRef}
>
  <span
    class="editable-title"
    class:active={isRenaming}
  >
      {title}
  </span>
</svelte:element>


<style>

  span {
    all: unset;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
  .editable-title {
    --accent-color: transparent;
    border-bottom: 1px solid var(--accent-color);
  }
  .active {
    --accent-color: currentColor;
  }
</style>

<script lang="ts">
  import { tick } from 'svelte';


  interface Props {
    title: string;
    /**
    * The wrapper tag to render the element with.
    */
    tag?: string;
    classList?: string[];
    /**
    * Wrapper function for manipulating the new value.
    * It will be run at the end of the submit action.
    */
    renameAction?: (newVal: string) => void;
  };
  let {
    title,
    tag = 'div',
    classList = [],
    renameAction = () => void 0,
  }: Props = $props();


  let classes = $derived(classList.join(' '));
  let isRenaming: boolean = $state(false);
  let ref: HTMLElement = $state(document.createElement('div'));

  /**
  * Triggers the edition.
  * Useful for delegating the `onclick` function of the component to another element.
  */
  export function edit() {
    handleRename();
  }


  function handleKeys(e: KeyboardEvent): void {
    if (!isRenaming) return;
    if (e.key === 'Enter' || e.key === 'Escape') {
      ref.blur();
    }
  }

  async function handleRename(): Promise<void> {
    isRenaming = true;
    await tick();
    ref.focus();
  }

  async function handleSubmit(): Promise<void> {
    isRenaming = false;
    await tick();
    renameAction(ref.innerText);
  }

</script>

<svelte:element 
  this={tag}
  contenteditable={isRenaming}
  class={classes}
  onclick={handleRename}
  onkeydown={handleKeys}
  onblur={handleSubmit}
  bind:this={ref}
  role="textbox"
  tabindex="0"
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

<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import { menuState } from '$lib/stores';
  import type { MenuOption, ActionOption } from '$types';
  import ContentItemActions from './content-item-actions.svelte';

  export let id = '';
  /**
   * Extra classes to be added to the main element.
  */
  export let classList: string[] = [];
  export let options: MenuOption[];
  export let actions: ActionOption[];
  /**
   * Whether the contents are displayed horizontally or vertically.
  */
  export let inlineLayout = true;
  /**
   * Order for placing the options menu button.
  */
  export let optionsButtonOrder: 'first' | 'last' = 'first';


  $: classes = ['content-item', ...classList].join(' ');


  let optionsOpen = false;
  let thisElem: HTMLLIElement;

  $: if ($menuState) {
    if (thisElem && thisElem.contains($menuState?.owner as Node)) {
      optionsOpen = $menuState.open;
    }
  }
</script>

<li {id}
  class={classes}
  class:large={!inlineLayout}
  class:options-open={optionsOpen}
  bind:this={thisElem}
>
  {#if inlineLayout}
    <div class="slot main">
      <slot></slot>
    </div>
    <ContentItemActions
      {optionsButtonOrder}
      {options}
      {actions}
    />
  {:else}
    <div class="slot header">
      <slot name="header"></slot>
      <ContentItemActions
        {optionsButtonOrder}
        {options}
        {actions}
      />
    </div>

    <div
      class="slot main"
      use:dndzone={{ items:[] }}
    >
      <slot></slot>
    </div>
  {/if}
</li>

<style>
  .content-item {
    --gap: 1em;
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: .5em 1em;
    border: 1px solid rgb(0 0 0 / 33%);
    background-color: var(--theme-main-bg);
  }
  .content-item:hover {
    background-color:rgb(0 0 0 / 3%);
  }
  .content-item.large {
    align-items: stretch;
    flex-direction: column;
  }
  .slot {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }
  :global(.content-item:hover > .content-item-actions),
  :global(.content-item.large:hover > .slot.header > .content-item-actions) { opacity: 1; }

  :global(.content-item .action-btn) {
    padding: .125rem;
  }
</style>

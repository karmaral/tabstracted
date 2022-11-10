<script lang="ts">
  import type { MenuOption, ActionOption } from '$types';
  import tippy from 'tippy.js';
  import { onMount } from 'svelte';
  import ContentItemActions from './content-item-actions.svelte';

  export let id = '';
  export let className: string;
  export let options: MenuOption[];
  export let actions: ActionOption[];
  /**
   * Whether the contents are displayed horizontally or vertically.
  */
  export let inlineLayout = true;
  /**
   * Whether the options menu is placed last.
  */
  export let optionsButtonOrder: 'first' | 'last' = 'first';

  let optionsOpen = false;

  let thisElem: HTMLLIElement;
</script>

<li {id}
  class="content-item {className}"
  class:large={!inlineLayout}
  bind:this={thisElem}
>
  {#if inlineLayout}
    <div class="slot main">
      <slot></slot>
    </div>
    <ContentItemActions
      parentRef={thisElem}
      {optionsOpen}
      {optionsButtonOrder}
      {options}
      {actions}
    />
  {:else}
    <div class="slot header">
      <slot name="header"></slot>
      <ContentItemActions
        parentRef={thisElem}
        {optionsOpen}
        {optionsButtonOrder}
        {options}
        {actions}
      />
    </div>

    <div class="slot main">
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

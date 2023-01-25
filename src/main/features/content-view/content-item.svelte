<script lang="ts">
  import { onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { menuState } from '$lib/stores';
  import type { MenuOption, ActionOption } from '$types';
  import ContentItemActions from './content-item-actions.svelte';

  export let id: string | number = '';
  /**
   * The type of item. Will be used for preffixing the id.
  */
  export let type = 'item';
  /**
   * Extra classes to be added to the main element.
  */
  export let classList: string[] = [];
  /**
  *  An object containing custom css variables to be applied on the main element.
  * Currently, the changes are not diffed so any update reapplies all properties of the object.
  */
  export let cssVars: Record<string, string | number> = {};
  export let options: MenuOption[];
  export let actions: ActionOption[];
  /**
   * Whether the contents are displayed horizontally or vertically.
   * The group layout allows nesting other items inside the element.
  */
  export let layout: 'inline' | 'group' = 'inline';
  /**
   * Order for placing the options menu button.
  */
  export let optionsButtonOrder: 'first' | 'last' = 'first';

  export let sortable = false;

  $: classes = ['item', ...classList].join(' ');
  $: idStr =  id ? `${type}_${id}` : '';


  let optionsOpen = false;
  let thisElem: HTMLLIElement;

  $: inline = layout === 'inline';

  $: if ($menuState) {
    if (thisElem && thisElem.contains($menuState?.owner as Node)) {
      optionsOpen = $menuState.open;
    }
  }

  function applyCssVars(vars: Record<string, string | number>) {
    if (!thisElem) return;
    Object.keys(vars).forEach((k) => {
      thisElem.style.setProperty(`--${k}`, vars[k] as string);
    });
  }
  $: applyCssVars(cssVars);

  onMount(() => {
    applyCssVars(cssVars);
  });

</script>

<li id={idStr}
  class={classes}
  class:large={!inline}
  class:options-open={optionsOpen}
  class:sortable
  data-id={id}
  data-type={type}
  bind:this={thisElem}
>
  {#if inline}
    <div class="item-content">
      <div class="slot main">
        <slot></slot>
      </div>
      <ContentItemActions
        {optionsButtonOrder}
        {options}
        {actions}
      />
    </div>
  {:else}
  <div class="item-content">
    <div class="slot header">
      <slot name="header"></slot>
      <ContentItemActions
        {optionsButtonOrder}
        {options}
        {actions}
      />
    </div>

    <div class="slot main" >
      <slot />
    </div>
  </div>
  {/if}
</li>

<style>
  :global(.item) {
    --gap: 1em;
    border: 1px solid rgb(0 0 0 / 33%);
    background-color: var(--theme-main-bg);
    list-style: none;
  }
  .item-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: .5em 1em;
  }
  .item:hover > .item-content {
    background-color:rgb(0 0 0 / 3%);
  }
  .item.large > .item-content {
    align-items: stretch;
    flex-direction: column;
  }
  .item.sortable {
    position: absolute;
    width: 100%;
  }
  .slot {
    display: flex;
    gap: var(--gap);
    align-items: center;
  }
  .item:hover > .item-content > :global(.item-actions),
  .item.large:hover > .item-content > .slot.header > :global(.item-actions) { opacity: 1; }

  :global(.item .action-btn) {
    padding: .125rem;
  }
</style>

<script lang="ts">
  import { menuState } from '$states';
  import type { MenuOption, ActionOption } from '$types';
  import ItemActions from './ItemActions.svelte';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { useSortable } from '@dnd-kit-svelte/svelte/sortable';

  interface Props {
    id: string | number;
    /**
     * The type of item. Will be used for preffixing the id.
    */
    type: string;
    sortable?: boolean;
    sortableAccepts: string[];
    sortableParentId: string;
    sortableIndex: number;
    sortableGroup: string;
    sortableDisabled: boolean;
    isPickedUp: boolean;
    /**
     * Extra classes to be added to the main element.
    */
    classList?: ClassValue[];
    /**
    *  An object containing custom css variables to be applied on the main element.
    * Currently, the changes are not diffed so any update reapplies all properties of the object.
    */
    cssVars?: Record<string, string | number>;
    options?: MenuOption[];
    actions?: ActionOption[];
    /**
     * Whether the contents are displayed horizontally or vertically.
     * The group layout allows nesting other items inside the element.
    */
    layout?: 'inline' | 'group';
    /**
     * Order for placing the options menu button.
    */
    optionsButtonOrder?: 'first' | 'last';
    children: Snippet;
    header?: Snippet;
    onClick?: (ev: MouseEvent) => void;
    onAuxClick?: (ev: MouseEvent) => void;
    onMenuTriggered?: () => void;
  }
  let {
    id = '',
    type,
    sortable = false,
    sortableAccepts = [],
    sortableParentId = '',
    sortableIndex = 0,
    sortableGroup,
    sortableDisabled = false,
    classList = [],
    cssVars = {},
    options = [],
    actions = [],
    layout = 'inline',
    optionsButtonOrder = 'first',
    isPickedUp = false,
    children,
    header,
    onClick = () => void 0,
    onAuxClick = () => void 0,
  }: Props = $props();


  let optionsOpen: boolean = $state(false);
  let itemActionsRef: ReturnType<typeof ItemActions> | undefined = $state();

  let classes = $derived(clsx(['item', ...classList]));
  let inline = $derived(layout === 'inline');

  const { ref, isDragging, } = useSortable({ 
    id: () => id,
    type: () => type, 
    index: () => sortableIndex,
    accept: () => sortableAccepts,
    group: () => sortableGroup,
    disabled: () => sortableDisabled,
  });

  // const style = $derived(
  //   styleObjectToString({
  //     transform: CSS.Translate.toString(transform.current),
  //     transition: isSorting.current ? transition.current : undefined,
  //     zIndex: isDragging.current ? 1 : undefined,
  //     ...parseCssVars(cssVars),
  //   })
  // );


  $effect(() => {
    if (ref && ref.contains(menuState?.owner as Node)) {
      optionsOpen = menuState.open;
    }
  });

  function parseCssVars(vars: Record<string, string | number>) {
    const result: typeof vars = {};
    for (const key in vars) {
      result[`--${key}`] = vars[key] as string;
    }
    return result;
  }

  function handleContextMenu(ev: MouseEvent) {
    console.log({itemActionsRef: itemActionsRef?.getRef(), currentTarget: ev.currentTarget, target: ev.target});
    if (!itemActionsRef) return;
    ev.preventDefault();
    ev.stopPropagation();
    itemActionsRef.triggerMenu();
  }


</script>

{#snippet itemContentInline()}
  <div 
    class="item-content" 
    class:invisible={isDragging.current}
  >
  <span class="id-label">{id}</span>
    <button 
      class="background-action pointer-target"
      type="button"
      aria-label="Select"
      onclick={onClick}
      onauxclick={onAuxClick}
    ></button>
    <div class="slot main">
      {@render children?.()}
    </div>
    <ItemActions
      {optionsButtonOrder}
      {options}
      {actions}
      bind:this={itemActionsRef}
    />
  </div>
{/snippet}

{#snippet itemContent()}
  <div 
    class="item-content"
    class:invisible={isDragging.current}
  >
    <div class="slot header">
      {@render header?.()}
      <ItemActions
        {optionsButtonOrder}
        {options}
        {actions}
        bind:this={itemActionsRef}
      />
    </div>

    <div class="slot main" >
      {@render children?.()}
    </div>
  </div>
{/snippet}

<li 
  class="item-wrapper"
  {@attach ref}
>
  <div
    class={classes}
    class:large={!inline}
    class:options-open={optionsOpen}
    class:busy={isSorting.current}
    class:picked-up={pickedUp}
    class:placeholder={isDragging.current}
    data-id={id}
    data-type={type}
    data-index={index}
    bind:this={node.current}
    {style}
    {...listeners.current}
    {...attributes.current}
    oncontextmenu={handleContextMenu}
  >
    {#if inline}
      {@render itemContentInline()}
    {:else}
      {@render itemContent()}
    {/if}

    {#if !isPickedUp && isDragging.current}
      <div class="item-placeholder"></div>
    {/if}
  </div>
</li>


<style>
  .item-wrapper {
    list-style: none;
    display: flex;
    position: relative;
  }
  :global(.item) {
    --gap: 1em;
    border: 1px solid hsl(0 0 0 / 15%);
    background-color: var(--theme-color-main-bg);
    user-select: none;
    transition: box-shadow 300ms ease;
    min-width: var(--layout-min-item-width);
    flex-grow: 1;
  }
  :global(.item.options-open) {
    border-color: hsl(0 0 0 / 40%);
    box-shadow: var(--shadow-mid);
    transition: box-shadow 0ms;
  }
  :global(.item.dropping) {
    opacity: 0;
  }
  /* .item:global(.picked-up) {
    margin: 0 !important;
  } */
  .background-action {
    background: unset;
    border: unset;
    position: absolute;
    inset: 0;
    padding: 0;
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
  .item:not(:where(.picked-up, .busy, .options-open)):hover {
    border-color: hsl(0 0 0 / 20%);

    & > .item-content {
      background-color:rgb(0 0 0 / 1%);
    }
  }
  .item.large > .item-content {
    align-items: stretch;
    flex-direction: column;
  }
  .slot {
    display: flex;
    gap: var(--gap);
    align-items: center;
    z-index: 1;
    pointer-events: auto;
  }
  .item:global(.options-open) > .item-content > :global(.item-actions),
  .item:hover:global(:not(:where(.picked-up, .busy))) > .item-content > :global(.item-actions),
  .item.large:hover:global(:not(:where(.picked-up, .busy))) > .item-content > .slot.header > :global(.item-actions) { 
    opacity: 1; 
  }

  :global(.item .action-btn) {
    padding: .125rem;
  }
  .invisible {
    visibility: hidden;
  }
  .item.placeholder {
    border-color: transparent;
    background-color: hsl(0 0% 95%) !important;
  }
  .item-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
  }
  :global(ul.picked-up-wrapper) {
    padding: unset;
    margin: unset;
    box-shadow: 0 .75rem 2rem -.75rem hsl(0 0% 0% / .25);
  }
</style>

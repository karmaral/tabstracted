<script lang="ts">
  import { menuState } from '$states';
  import type { MenuOption, ActionOption } from '$types';
  import ItemActions from './ItemActions.svelte';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { createSortable } from '@dnd-kit/svelte/sortable';

  interface Props {
    id: string | number;
    /**
     * The type of item. Will be used for preffixing the id.
    */
    type: string;
    sortableAccepts: string[];
    sortableIndex: number;
    sortableGroup: string;
    sortableDisabled: boolean;
    isPickedUp: boolean;
    isDropping: boolean;
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
    sortableAccepts = [],
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
    isDropping = false,
    children,
    header,
    onClick = () => void 0,
    onAuxClick = () => void 0,
  }: Props = $props();


  let optionsOpen: boolean = $state(false);
  let itemActionsRef: ReturnType<typeof ItemActions> | undefined = $state();

  let inline = $derived(layout === 'inline');
  let elemRef: HTMLLIElement | null  = $state(null);

  const sortable = createSortable({
    get id() { return id },
    get index() { return sortableIndex },
    get type() { return type; }, 
    get group() { return sortableGroup; },
    get accept() { return sortableAccepts; },
    // disabled: () => sortableDisabled,
  });

  const isPlaceholder = $derived(!isPickedUp && (sortable.isDragging || sortable.isDropping));

  // const style = $derived(
  //   styleObjectToString({
  //     transform: CSS.Translate.toString(transform.current),
  //     transition: isSorting.current ? transition.current : undefined,
  //     zIndex: isDragging.current ? 1 : undefined,
  //     ...parseCssVars(cssVars),
  //   })
  // );


  $effect(() => {
    /* #TODO: this is too lax - it fires when a child tab gets optionsOpen too.
    * menuState could be reworked to have a directly-supplied -true- owner (either parentOwner or rename owner to currentTrigger)
    * this way makes more sense MIAUAUUUUGUJGUJ *cat interrupts chain of thought*
    */
    if (elemRef && elemRef.contains(menuState?.owner as Node)) {
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

  function handleClick(ev: MouseEvent) {
    if (ev.button !== 0) return;
    onClick(ev);
  }

  function handleContextMenu(ev: MouseEvent) {
    console.log({itemActionsRef: itemActionsRef?.getRef(), currentTarget: ev.currentTarget, target: ev.target});
    if (!itemActionsRef) return;
    ev.preventDefault();
    ev.stopPropagation();
    itemActionsRef.triggerMenu();
  }

  function handleAuxClick(ev: MouseEvent) {
    if (ev.button !== 1) return;
    onAuxClick(ev);
  }


</script>

{#snippet itemContentInline()}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class={['item-content', 'pointer-target']}
    onauxclick={handleAuxClick}
    oncontextmenu={handleContextMenu}
    onclick={handleClick}
  >
  <span class="id-label">{id}</span>
    <!-- <button 
      class="background-action pointer-target"
      type="button"
      onclick={handleClick}
      aria-label="Select"
    ></button> -->
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
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class={['item-content']}
  >
    <div class="slot header pointer-target"
      onclick={handleClick}
    >
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li 
  class="item-wrapper"
  bind:this={elemRef}
  {@attach sortable.attach}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class={[
      'item',
      {
        large: !inline,
        'options-open': optionsOpen,
        'picked-up': isPickedUp,
        'dropping': isDropping,
        'invisible': isPlaceholder,
      },
      ...classList
    ]}
    data-id={id}
    data-type={type}
    data-index={sortableIndex}
    style={Object.entries(parseCssVars(cssVars)).map(e => `${e[0]}: ${e[1]};`).join(' ')}
  >
    {#if inline}
      {@render itemContentInline()}
    {:else}
      {@render itemContent()}
    {/if}
  </div>

  {#if isPlaceholder}
    <div class="item-placeholder"></div>
  {/if}
</li>


<style>
  .item-wrapper {
    display: block;
    list-style: none;
    position: relative;
  }
  :global(.item) {
    --gap: 1em;
    border: 1px solid hsl(0 0 0 / 15%);
    background-color: var(--theme-color-main-bg);
    user-select: none;
    min-width: var(--layout-min-item-width);
    flex-grow: 1;
    @starting-style {
      box-shadow: var(--shadow-none);
    }
  }
  :global(.item.options-open) {
    border-color: hsl(0 0 0 / 40%);
    box-shadow: var(--shadow-m);
    transition: box-shadow 0ms;
  }
  .item:global(.picked-up) {
    animation: shadow-in 300ms ease forwards;
    box-shadow: var(--shadow-l);
  }
  :global([data-dnd-dropping] .item.picked-up) {
    animation: shadow-in 300ms ease forwards reverse;
  }
  @keyframes shadow-in {
    from { box-shadow: var(--shadow-none); }
    to { box-shadow: var(--shadow-l); }
  }
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
  .item.invisible {
    visibility: hidden;
  }

  .item-placeholder {
    user-select: none;
    background-color: oklch(from var(--theme-color-accent) l calc(c * .5) h / .05);
    border: 2px dashed oklch(from var(--theme-color-accent) l calc(c * .5) h / .25);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

</style>

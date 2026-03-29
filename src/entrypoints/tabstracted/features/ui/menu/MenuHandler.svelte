<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';
  import type { MenuOption } from '$types';
  import { MenuItem } from './';
  import { menuState } from '$states';

  type ClickOutsideListener = ((e: Event) => void) | null;

  interface Props {
    show?: boolean;
    menuEntries?: MenuOption[];
    menuContainer?: HTMLDivElement;
  };
  let {
    show = false,
    menuEntries = [],
    menuContainer,
  }: Props = $props();

  let renderedEntries = $derived(menuEntries.filter((e, i) => {
    if (e.type === 'separator') {
      if (i === 0) {
        return false;
      }
      if (!menuEntries.at(i - 1) || !menuEntries.at(i + 1)) {
        return false;
      }
      return true;
    }
    return true;
  }));

  const [popperRef, popperContent] = createPopperActions({
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  let listener: ClickOutsideListener = $state(null);

  $effect(() => {
    if (menuState.open) {
      const { owner, entries } = menuState;
      menuEntries = entries;
      popperRef(owner);
    }
    show = menuState.open;
  });

  $effect(() => {
    if (show) {
      menuState.element = menuContainer || null;
    }
  });

  function closeHandler(ev: MouseEvent) {
    if (!menuContainer) return;
    const tgt = ev.target as Node;

    if (!menuContainer.contains(tgt)
      && !menuState.owner.contains(tgt)) {
      menuState.closeAction();
    }
  }

  document.addEventListener('click', closeHandler);
</script>

{#if show}
  <!-- <button 
    class="menu-backdrop" 
    aria-label="Close Menu"
    onclick={menuState.closeAction}
  ></button> -->
  <div class="menu-container"
    use:popperContent
    bind:this={menuContainer}
  >
    {#each renderedEntries as item}
      <MenuItem
        type={item.type}
        label={item?.label as string}
        callback={item?.callback}
        children={item?.children}
        disabled={item?.disabled}
      />
    {/each}
  </div>
{/if}


<style>
  :global(.menu-backdrop) {
    position: absolute;
    inset: 0;
    background-color: transparent;
    border: unset;
    padding: unset;
    z-index: 9;
  }
  :global(.menu-container) {
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--theme-color-main-bg);
    min-width: 10rem;
    box-shadow: 0 .5em 1em rgb(0 0 0 / 15%);
    z-index: 10;
  }
</style>

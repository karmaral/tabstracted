<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';
  import type { MenuOption } from '$types';
  import { MenuItem } from '$features/ui/menu';
  import { menuState } from '$lib/stores';

  const [popperRef, popperContent] = createPopperActions({
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  type ClickOutsideListener = (e: Event) => void | null;

  let show = false;
  let menuEntries: MenuOption[];
  let menuContainer: HTMLDivElement;

  let listener: ClickOutsideListener = null;

  $: console.log($menuState);

  $: if ($menuState) {
    if ($menuState.open) {
        const { owner, entries } = $menuState;
        menuEntries = entries;
        popperRef(owner);
      show = true;
    } else {
      show = false;
    }
  }

  document.addEventListener('click', (e: Event) => {
    console.log(menuContainer, e.target);
    if (!menuContainer) return;
    if (!menuContainer.contains(e.target as Node)
      && !$menuState.owner.contains(e.target as Node)) {
      $menuState?.closeAction();
    }
  });

</script>

{#if show}
  <div class="menu-container"
    use:popperContent
    bind:this={menuContainer}
  >
    {#each menuEntries as item}
      <MenuItem
        type={item.type}
        label={item?.label}
        callback={item?.callback}
        children={item?.children}
        disabled={item?.disabled}
      />
    {/each}
  </div>
{/if}


<style>
  :global(.menu-container) {
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--theme-main-bg);
    min-width: 10rem;
    box-shadow: 0 .5em 1em rgb(0 0 0 / 15%);
    z-index: 10;
  }
</style>

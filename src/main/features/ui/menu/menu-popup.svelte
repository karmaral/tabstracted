<script lang="ts">
  import type { MenuOption } from '$types';
  import type { IconSource } from '@steeze-ui/svelte-icon/types';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronRight } from '@steeze-ui/heroicons';

  export let entries: MenuOption[];
  export let icon: IconSource;
  export let iconSize = '1em'
  export let buttonClass = '';
  export let label = '';
  /** Action that runs on the `on:click` handler.
   * Useful for delegating the open/closed state handling to another element.
   */
  export let onClickAction: () => unknown;
  export let open = false;

  function handleClick() {
    if (!onClickAction) {
      open = !open;
      return;
    }
    onClickAction();
  }

</script>
<!-- perhaps tippy is better suited for auto-positioning the containers -->
<Menu>
  <MenuButton class="{buttonClass}"
    on:click={handleClick}
  >
    {#if icon}
      <Icon src={icon} size={iconSize} />
    {/if}
    {label}
  </MenuButton>
  {#if open}
    <MenuItems static>
      <div class="menu-container">
        {#each entries as item}
          <MenuItem let:active
            on:click={() => console.log(`a ${item.label} clicked`)}
          >
            <div class="menu-item ui-btn" class:active >
              {item.label}
              {#if item.children}
              <div class="has-children-icon">
                <Icon src={ChevronRight} size={'1em'} />
              </div>
              {/if}
            </div>
          </MenuItem>
        {/each}
      </div>
    </MenuItems>
  {/if}
</Menu>


<style>
  .menu-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--theme-main-bg);
    min-width: 10rem;
    box-shadow: 0 .5em 1em rgb(0 0 0 / 15%);
    z-index: 10;
  }
  .menu-item {
    display: flex;
    align-items: center;
    padding: .5rem;
  }
  .menu-item.active {
    background-color: rgb(0 0 0 / 5%);
  }
  .has-children-icon {
    margin-left: auto;
  }

</style>

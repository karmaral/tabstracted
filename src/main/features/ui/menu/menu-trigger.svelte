<script lang="ts">
  import type { MenuOption, MenuState } from '$types';
  import type { IconSource } from '@steeze-ui/svelte-icon/types';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { menuState } from '$lib/stores';
  import { tick } from 'svelte';

  export let entries: MenuOption[] = [];
  export let icon: IconSource;
  export let iconSize = '1em'
  export let buttonClass = '';
  export let label = '';
  /** Action that runs on the `on:click` handler.
   * Useful for delegating the open/closed state handling to another element.
   */
  export let onClickAction: () => unknown = null;
  /**
   * Ignore internal open/closed state.
   * This way the `open` prop is supplied externally and used in conjunction with `onClickAction`
   */
  export let manual = false;
  export let open = false;
  let menuButton : HTMLButtonElement;

  function handleClose() {
    open = false;
    menuState.update((prev) => ({ ...prev, open }));
  }

  async function handleClick() {
    if ($menuState?.owner !== menuButton) {
      $menuState?.closeAction();
      await tick();
    }

    if (!manual) {
      open = !open;
    } else {
      onClickAction();
    }

    menuState.update((prev) => {
      const newState: MenuState = {
        open,
        owner: menuButton,
        closeAction: handleClose,
        entries,
        lastOwner: (!prev?.lastOwner?.elem)
          ? { elem: menuButton, closeAction: handleClose }
          : { elem: prev.owner, closeAction: prev.closeAction },
        ref: prev?.ref,
      };
      return newState;
    });
  }

</script>

<button class="{buttonClass}"
  class:open
  on:click={handleClick}
  bind:this={menuButton}
>
  {#if icon}
    <Icon src={icon} size={iconSize} />
  {/if}
  {label}
</button>

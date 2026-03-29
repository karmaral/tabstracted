<script lang="ts">
  import type { MenuOption, MenuState } from '@/types';
  import type { IconSource } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { menuState } from '@/lib/frontend/states.svelte';
  import { tick } from 'svelte';


  interface Props {
    entries?: MenuOption[];
    icon?: IconSource;
    iconSize?: string;
    buttonClass?: string;
    label?: string;
    /** Action that runs on the `onclick` handler.
     * Useful for delegating the open/closed state handling to another element.
     */
    onClickAction?: () => unknown;
    /**
     * Ignore internal open/closed state.
     * This way the `open` prop is supplied externally and used in conjunction with `onClickAction`
     */
    manual?: boolean;
    open?: boolean;
    ref?: HTMLButtonElement;
  };
  let {
    entries = [],
    icon,
    iconSize = '1em',
    buttonClass = '',
    label = '',
    onClickAction = () => null,
    manual = false,
    open = false,
    ref = $bindable(document.createElement('button')),
  }: Props = $props();


  function handleClose() {
    open = false;
    menuState.open = open;
  }

  async function handleClick() {
    if (menuState?.owner !== ref) {
      menuState?.closeAction();
      await tick();
    }

    if (!manual) {
      open = !open;
    } else {
      onClickAction();
    }

    menuState.open = open;
    menuState.owner = ref;
    menuState.closeAction = handleClose;
    menuState.entries = entries;
    menuState.lastOwner = (!menuState.lastOwner?.elem)
    ? { elem: ref, closeAction: handleClose }
    : { elem: menuState.owner, closeAction: menuState.closeAction }
  }

</script>

<button class="{buttonClass}"
  class:open
  onclick={handleClick}
  bind:this={ref}
>
  {#if icon}
    <Icon src={icon} size={iconSize} />
  {/if}
  {label}
</button>

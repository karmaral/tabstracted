<script lang="ts">
  import type { MenuOption, ActionOption } from '$types';
  import { MenuTrigger } from '$features/ui/menu';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { EllipsisVertical } from '@steeze-ui/heroicons';
  import clsx from 'clsx';

  interface Props {
    options: MenuOption[];
    optionsButtonOrder?: 'first' | 'last';
    actions: ActionOption[];
    ref?: HTMLDivElement;
  };
  let {
    options,
    optionsButtonOrder = 'first',
    actions,
    ref = $bindable(),
  }: Props = $props();

  let order = $derived(optionsButtonOrder === 'first' ? 0 : -1);

  let menuRef: HTMLButtonElement = $state(document.createElement('button'));

  export function triggerMenu() {
    menuRef.click();
  }
  export function getRef() {
    return ref;
  }

</script>

<div class="item-actions" bind:this={ref}>
  <MenuTrigger
    buttonClass="menu-btn action-btn btn"
    icon={EllipsisVertical}
    iconSize="1rem"
    entries={options}
    bind:ref={menuRef}
  />
  <div class="actions-wrapper" style:order>
    {#each actions as action}
      <button
        class={clsx(["action-btn btn", action.class])}
        onclick={(ev) => action.callback?.(ev)}
    >
        {#if action.label && !action?.iconOnly}
          {action.label}
        {/if}
        {#if action.iconSource}
          <Icon src={action.iconSource} size="1rem" />
        {/if}
    </button>
    {/each}
  </div>
</div>

<style>
  .action-btn {
    display: flex;
    align-items: center;
    gap: .3em;
  }
  .action-btn :global(*) {
    pointer-events: none;
  }
  /* .item-actions > :global(.menu-btn.open) {
    box-shadow: 0 .5em 1em hsl(0 0% 0% / 15%);
  } */
  .item-actions {
    display: flex;
    gap: var(--gap);
    margin-left: auto;
    opacity: 0;
    z-index: 1;
  }
  :global(.options-open) > .item-actions,
  :global(.options-open.large .slot.header) > .item-actions {
    opacity: 1 !important;
  }
  .actions-wrapper {
    display: inherit;
    gap: inherit;
    order: 0;
  }
</style>

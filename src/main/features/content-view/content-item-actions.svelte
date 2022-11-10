<script lang="ts">
  import type { MenuOption, ActionOption } from '$types';
  import { MenuPopup as OptionsMenu } from '$features/ui';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { EllipsisVertical } from '@steeze-ui/heroicons';

  export let parentRef: Element;
  export let options: MenuOption[];
  export let actions: ActionOption[];
  export let optionsOpen: boolean;
  export let optionsButtonOrder: 'first' | 'last' = 'first';

  let order = optionsButtonOrder === 'first' ? 0 : -1;
  $: console.log({ order, optionsButtonOrder });

  function handleOptionsClick() {
    optionsOpen = !optionsOpen;
    if (optionsOpen) {
      const listener = (e: Event) => {
        if (!parentRef.contains(e.target as Node)) {
          optionsOpen = false;
          document.removeEventListener('click', listener);
        }
      };
      document.addEventListener('click', listener);
    }
  }

</script>

<div class="content-item-actions"
  class:options-open={optionsOpen}
>
  <OptionsMenu
    buttonClass="action-btn btn"
    icon={EllipsisVertical}
    iconSize={'1rem'}
    onClickAction={handleOptionsClick}
    entries={options}
    open={optionsOpen}
  />
  <div class="actions-wrapper" style:order>
    {#each actions as action}
      <button
        class="action-btn btn"
        on:click={action.callback}
    >
        <Icon src={action.iconSource} size={'1rem'} />
    </button>
    {/each}
  </div>
</div>

<style>
  .content-item-actions {
    display: flex;
    gap: var(--gap);
    margin-left: auto;
    opacity: 0;
  }
  .content-item-actions.options-open {
    opacity: 1 !important;
  }
  .actions-wrapper {
    display: inherit;
    gap: inherit;
    order: 0;
  }
</style>
